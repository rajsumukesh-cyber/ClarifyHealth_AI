import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from ..config import settings
from ..database import get_db
from ..models.user import User
from ..models.report import MedicalReport, ReportChatMessage
from ..schemas.report import (
    ReportResponse,
    ReportSummaryItem,
    ChatRequest,
    ChatMessageResponse,
    SampleReportPreset
)
from ..services.auth_service import get_current_user
from ..services.file_extractor import FileExtractor
from ..services.ai_service import AIService
from ..services.sample_data import SAMPLE_REPORTS_PRESETS

router = APIRouter(prefix="/reports", tags=["Medical Reports"])

@router.get("/presets/list", response_model=List[SampleReportPreset])
def list_sample_presets():
    """List available synthetic sample reports for quick 1-click demonstration."""
    return [
        SampleReportPreset(
            preset_id=p["preset_id"],
            title=p["title"],
            report_type=p["report_type"],
            description=p["description"],
            sample_text=p["sample_text"]
        )
        for p in SAMPLE_REPORTS_PRESETS
    ]

@router.post("/preset/load", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def load_preset_report(
    preset_id: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Loads a pre-configured synthetic clinical report and runs AI analysis instantly."""
    preset = next((p for p in SAMPLE_REPORTS_PRESETS if p["preset_id"] == preset_id), None)
    if not preset:
        raise HTTPException(status_code=404, detail="Preset report not found.")

    analysis = AIService.analyze_report(preset["sample_text"], original_filename=f"{preset['preset_id']}.txt")

    report = MedicalReport(
        user_id=current_user.id,
        title=preset["title"],
        report_type=preset["report_type"],
        report_date=analysis.report_date,
        original_filename=f"Synthetic_{preset_id.upper()}.txt",
        file_type="preset",
        file_path=None,
        file_size_bytes=len(preset["sample_text"].encode("utf-8")),
        page_count=1,
        extracted_text=preset["sample_text"],
        unclear_sections=analysis.unclear_sections,
        simple_summary=analysis.summary,
        simplified_mode_text=analysis.simplified_mode_text,
        terms_data=[t.model_dump() for t in analysis.terms],
        abbreviations_data=[a.model_dump() for a in analysis.abbreviations],
        doctor_questions=analysis.questions_for_doctor,
        status="completed"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.post("/upload", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def upload_medical_report(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Uploads a PDF, DOCX, or Image medical report, extracts text, and generates AI simplification."""
    filename = file.filename or "uploaded_report"
    ext = os.path.splitext(filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    user_upload_dir = os.path.join(settings.UPLOAD_DIR, f"user_{current_user.id}")
    os.makedirs(user_upload_dir, exist_ok=True)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(user_upload_dir, unique_filename)

    file_size = 0
    try:
        with open(file_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                file_size += len(chunk)
                if file_size > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"File exceeds the maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
                    )
                buffer.write(chunk)
    except HTTPException:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving uploaded document: {str(e)}"
        )

    extraction = FileExtractor.extract(file_path, filename)
    analysis = AIService.analyze_report(extraction.text, original_filename=filename)

    clean_title = title.strip() if title and title.strip() else f"Medical Report — {os.path.splitext(filename)[0]}"
    report = MedicalReport(
        user_id=current_user.id,
        title=clean_title,
        report_type=analysis.report_type or "Laboratory & Diagnostic Report",
        report_date=analysis.report_date,
        original_filename=filename,
        file_type=ext.replace(".", ""),
        file_path=file_path,
        file_size_bytes=file_size,
        page_count=extraction.page_count,
        extracted_text=extraction.text,
        unclear_sections=extraction.unclear_sections + analysis.unclear_sections,
        simple_summary=analysis.summary,
        simplified_mode_text=analysis.simplified_mode_text,
        terms_data=[t.model_dump() for t in analysis.terms],
        abbreviations_data=[a.model_dump() for a in analysis.abbreviations],
        doctor_questions=analysis.questions_for_doctor,
        status="completed"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("", response_model=List[ReportSummaryItem])
def list_reports(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Lists all simplified reports belonging to the authenticated user."""
    reports = (
        db.query(MedicalReport)
        .filter(MedicalReport.user_id == current_user.id)
        .order_by(MedicalReport.created_at.desc())
        .all()
    )
    results = []
    for r in reports:
        terms_list = r.terms_data or []
        abnormal_count = sum(1 for t in terms_list if t.get("status") in ["high", "low", "needs_attention"])
        results.append(
            ReportSummaryItem(
                id=r.id,
                title=r.title,
                report_type=r.report_type,
                report_date=r.report_date,
                original_filename=r.original_filename,
                file_type=r.file_type,
                page_count=r.page_count,
                terms_count=len(terms_list),
                abnormal_count=abnormal_count,
                status=r.status,
                created_at=r.created_at
            )
        )
    return results

@router.get("/{report_id}", response_model=ReportResponse)
def get_report_details(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = (
        db.query(MedicalReport)
        .filter(MedicalReport.id == report_id, MedicalReport.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Medical report not found.")
    return report

@router.delete("/{report_id}", status_code=status.HTTP_200_OK)
def delete_report(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = (
        db.query(MedicalReport)
        .filter(MedicalReport.id == report_id, MedicalReport.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Medical report not found.")

    if report.file_path and os.path.exists(report.file_path):
        try:
            os.remove(report.file_path)
        except Exception:
            pass

    db.delete(report)
    db.commit()
    return {"message": "Medical report deleted successfully.", "report_id": report_id}

@router.post("/{report_id}/simplify", response_model=ReportResponse)
def resimplify_report(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = (
        db.query(MedicalReport)
        .filter(MedicalReport.id == report_id, MedicalReport.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Medical report not found.")

    analysis = AIService.analyze_report(report.extracted_text or "", original_filename=report.original_filename)
    report.report_type = analysis.report_type
    report.report_date = analysis.report_date or report.report_date
    report.simple_summary = analysis.summary
    report.simplified_mode_text = analysis.simplified_mode_text
    report.terms_data = [t.model_dump() for t in analysis.terms]
    report.abbreviations_data = [a.model_dump() for a in analysis.abbreviations]
    report.doctor_questions = analysis.questions_for_doctor
    report.unclear_sections = analysis.unclear_sections
    report.status = "completed"

    db.commit()
    db.refresh(report)
    return report

@router.get("/{report_id}/terms")
def get_report_terms(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = (
        db.query(MedicalReport)
        .filter(MedicalReport.id == report_id, MedicalReport.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Medical report not found.")
    return {
        "report_id": report.id,
        "title": report.title,
        "terms": report.terms_data or [],
        "abbreviations": report.abbreviations_data or []
    }

@router.post("/{report_id}/chat", response_model=ChatMessageResponse)
def chat_about_report(
    report_id: int,
    chat_req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = (
        db.query(MedicalReport)
        .filter(MedicalReport.id == report_id, MedicalReport.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Medical report not found.")

    user_msg = ReportChatMessage(
        report_id=report.id,
        user_id=current_user.id,
        role="user",
        content=chat_req.message
    )
    db.add(user_msg)
    db.commit()

    past_messages = (
        db.query(ReportChatMessage)
        .filter(ReportChatMessage.report_id == report.id)
        .order_by(ReportChatMessage.created_at.asc())
        .limit(10)
        .all()
    )
    history = [{"role": m.role, "content": m.content} for m in past_messages]

    ai_ans = AIService.answer_report_question(
        question=chat_req.message,
        report_text=report.extracted_text or "",
        terms_data=report.terms_data or [],
        chat_history=history
    )

    ai_msg = ReportChatMessage(
        report_id=report.id,
        user_id=current_user.id,
        role="assistant",
        content=ai_ans.get("answer", "I could not analyze this question."),
        citations=ai_ans.get("citations", [])
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    return ai_msg

@router.get("/{report_id}/chat/history", response_model=List[ChatMessageResponse])
def get_chat_history(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = (
        db.query(MedicalReport)
        .filter(MedicalReport.id == report_id, MedicalReport.user_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Medical report not found.")

    messages = (
        db.query(ReportChatMessage)
        .filter(ReportChatMessage.report_id == report.id)
        .order_by(ReportChatMessage.created_at.asc())
        .all()
    )
    return messages

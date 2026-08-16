from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any, Dict
import datetime

class TermItem(BaseModel):
    term: str = Field(..., description="The name of the medical parameter, test, or term.")
    category: str = Field(default="Laboratory Parameter", description="Category e.g. Complete Blood Count, Metabolic, Vital Signs, Imaging finding, Medication")
    reported_value: Optional[str] = Field(None, description="The exact value found in the report.")
    reference_range: Optional[str] = Field(None, description="The reference range explicitly present in the report.")
    status: str = Field(
        default="within_range",
        description="One of: 'within_range', 'high', 'low', 'needs_attention', 'info_unavailable'"
    )
    simple_explanation: str = Field(..., description="Plain-language, patient-friendly explanation of what this test or term measures.")
    what_it_means: str = Field(..., description="Cautious educational context about this particular result.")
    why_it_matters: str = Field(..., description="Why healthcare providers measure this parameter.")

class AbbreviationItem(BaseModel):
    abbreviation: str
    full_term: str
    simple_meaning: str

class AIAnalysisResult(BaseModel):
    report_type: str = "Laboratory Report"
    report_date: Optional[str] = None
    summary: str = Field(..., description="Balanced, non-alarmist plain language executive summary of the entire report.")
    simplified_mode_text: str = Field(..., description="A simple, 5th-grade reading level version ('Explain like I'm new to medicine').")
    terms: List[TermItem] = Field(default_factory=list)
    abbreviations: List[AbbreviationItem] = Field(default_factory=list)
    unclear_sections: List[str] = Field(default_factory=list, description="Any unreadable or low confidence sections.")
    questions_for_doctor: List[str] = Field(default_factory=list, description="Curated questions the user can ask their doctor.")

class ReportCreate(BaseModel):
    title: Optional[str] = None

class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    title: str
    report_type: str
    report_date: Optional[str] = None
    original_filename: str
    file_type: str
    file_size_bytes: int
    page_count: int
    extracted_text: Optional[str] = None
    unclear_sections: List[str] = []
    simple_summary: Optional[str] = None
    simplified_mode_text: Optional[str] = None
    terms_data: List[Dict[str, Any]] = []
    abbreviations_data: List[Dict[str, Any]] = []
    doctor_questions: List[str] = []
    status: str
    processing_error: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

class ReportSummaryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    report_type: str
    report_date: Optional[str] = None
    original_filename: str
    file_type: str
    page_count: int
    terms_count: int = 0
    abnormal_count: int = 0
    status: str
    created_at: datetime.datetime

class ChatRequest(BaseModel):
    message: str

class ChatMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    report_id: int
    role: str
    content: str
    citations: List[str] = []
    created_at: datetime.datetime

class SampleReportPreset(BaseModel):
    preset_id: str
    title: str
    report_type: str
    description: str
    sample_text: str

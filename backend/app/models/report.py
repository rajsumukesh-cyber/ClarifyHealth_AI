import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..database import Base

class MedicalReport(Base):
    __tablename__ = "medical_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Metadata
    title = Column(String(255), nullable=False)
    report_type = Column(String(100), default="General Laboratory Report")
    report_date = Column(String(100), nullable=True)
    original_filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # pdf, docx, png, jpg, preset
    file_path = Column(String(500), nullable=True)
    file_size_bytes = Column(Integer, default=0)
    page_count = Column(Integer, default=1)
    
    # Text Extraction
    extracted_text = Column(Text, nullable=True)
    unclear_sections = Column(JSON, default=list)
    
    # AI Simplification Results
    simple_summary = Column(Text, nullable=True)
    simplified_mode_text = Column(Text, nullable=True)  # "Explain like I'm new" mode
    terms_data = Column(JSON, default=list)  # List of identified medical terms & lab values
    abbreviations_data = Column(JSON, default=list)  # List of abbreviations
    doctor_questions = Column(JSON, default=list)  # Recommended questions to ask doctor
    
    # Processing Status: 'pending', 'extracting', 'analyzing', 'completed', 'failed'
    status = Column(String(50), default="pending")
    processing_error = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="reports")
    chat_messages = relationship("ReportChatMessage", back_populates="report", cascade="all, delete-orphan")


class ReportChatMessage(Base):
    __tablename__ = "report_chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("medical_reports.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    citations = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    report = relationship("MedicalReport", back_populates="chat_messages")
    user = relationship("User", back_populates="chat_messages")

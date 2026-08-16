from fastapi import APIRouter
from ..config import settings

router = APIRouter(tags=["System Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "sqlite" if settings.DATABASE_URL.startswith("sqlite") else "postgresql",
        "ai_engine": {
            "gemini_configured": bool(settings.GEMINI_API_KEY),
            "openai_configured": bool(settings.OPENAI_API_KEY),
            "rule_fallback_active": True
        }
    }

from .auth import router as auth_router
from .reports import router as reports_router
from .health import router as health_router

__all__ = ["auth_router", "reports_router", "health_router"]

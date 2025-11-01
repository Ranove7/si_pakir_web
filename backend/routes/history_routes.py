from fastapi import APIRouter
from services.history_service import get_history

router = APIRouter()

@router.get("/")
def read_history(limit: int = 50):
    history = get_history(limit)
    return [
        {
            "kode_parkir": h.kode_parkir,
            "aktivitas": h.aktivitas,
            "timestamp": h.timestamp
        }
        for h in history
    ]
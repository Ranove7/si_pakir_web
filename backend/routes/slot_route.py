from fastapi import APIRouter
from services.slot_service import get_all_slots

router = APIRouter()

@router.get("/")
def read_slots():
    slots = get_all_slots()
    return [
        {
            "kode_parkir": s.kode_parkir,
            "status": s.status,
            "timestamp": s.timestamp
        }
        for s in slots
    ]

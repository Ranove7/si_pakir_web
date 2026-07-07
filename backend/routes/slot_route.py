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

@router.get("/reset")
def reset_slots():
    from services.slot_service import reset_all_slots_to_empty
    try:
        reset_all_slots_to_empty()
        return {"status": "success", "message": "Semua slot berhasil diubah menjadi kosong"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

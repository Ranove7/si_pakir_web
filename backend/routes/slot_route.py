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

@router.get("/set/{kode}/{status}")
def set_slot_status(kode: str, status: str):
    if status not in ['kosong', 'terisi']:
        return {"status": "error", "message": "Status harus 'kosong' atau 'terisi'"}
    from services.slot_service import update_slot_status
    try:
        update_slot_status(kode, status)
        return {"status": "success", "message": f"Slot {kode} berhasil diubah menjadi {status}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

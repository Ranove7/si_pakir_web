from fastapi import APIRouter
from services.slot_service import get_all_slots

router = APIRouter()

@router.get("/status")
def get_parking_status():
    """
    Endpoint khusus untuk ESP8266
    Return format sederhana untuk LED control
    """
    slots = get_all_slots()
    
    # Format: {"A1": 1, "A2": 0, ...} 
    # 1 = terisi (LED ON), 0 = kosong (LED OFF)
    status_dict = {}
    
    for slot in slots:
        status_dict[slot.kode_parkir] = 1 if slot.status == "terisi" else 0
    
    return {
        "success": True,
        "data": status_dict
    }
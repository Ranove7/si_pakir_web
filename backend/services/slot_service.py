from services.database_service import SessionLocal
from models.slot_model import SlotModel

def update_slot_status(kode_parkir, status):
    session = SessionLocal()
    slot = session.query(SlotModel).filter_by(kode_parkir=kode_parkir).first()
    if slot:
        slot.status = status
        session.commit()
    session.close()

def get_all_slots():
    session = SessionLocal()
    slots = session.query(SlotModel).all()
    session.close()
    return slots

def reset_all_slots_to_empty():
    session = SessionLocal()
    slots = session.query(SlotModel).all()
    for slot in slots:
        slot.status = 'kosong'
    session.commit()
    session.close()

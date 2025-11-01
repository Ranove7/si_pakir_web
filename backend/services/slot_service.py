from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import DB_HOST, DB_USER, DB_PASS, DB_NAME
from models.slot_model import SlotModel

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

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

from sqlalchemy import Column, Integer, String, Enum, DateTime
from services.database_service import Base  # pakai Base global
from datetime import datetime

class SlotModel(Base):
    __tablename__ = "parkir_slots"

    id = Column(Integer, primary_key=True, autoincrement=True)
    kode_parkir = Column(String(10), unique=True, nullable=False)
    status = Column(Enum('kosong','terisi', name='slot_status'), nullable=False, default='kosong')
    timestamp = Column(DateTime, default=datetime.now, onupdate=datetime.now)

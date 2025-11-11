from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from services.database_service import Base  # pakai Base global
from datetime import datetime

class HistoryModel(Base):
    __tablename__ = "history_parkir"

    id = Column(Integer, primary_key=True, autoincrement=True)
    kode_parkir = Column(String(10), ForeignKey("parkir_slots.kode_parkir"), nullable=False)
    aktivitas = Column(Enum('parkir_masuk','parkir_keluar', name='activity_type'), nullable=False)
    timestamp = Column(DateTime, default=datetime.now)

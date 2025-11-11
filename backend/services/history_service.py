from models.history_model import HistoryModel
from services.database_service import SessionLocal

def add_history(kode_parkir, aktivitas):
    session = SessionLocal()
    history = HistoryModel(kode_parkir=kode_parkir, aktivitas=aktivitas)
    session.add(history)
    session.commit()
    session.close()

def get_history(limit=50):
    session = SessionLocal()
    history = session.query(HistoryModel).order_by(HistoryModel.timestamp.desc()).limit(limit).all()
    session.close()
    return history

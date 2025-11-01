from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import DB_HOST, DB_USER, DB_PASS, DB_NAME
from models.history_model import HistoryModel

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

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
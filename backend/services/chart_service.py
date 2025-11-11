from sqlalchemy import create_engine, func
from models.history_model import HistoryModel
from datetime import datetime, timedelta
from services.database_service import SessionLocal

def get_daily_stats(days=1):
    session = SessionLocal()
    since = datetime.now() - timedelta(days=days)
    result = session.query(
        HistoryModel.aktivitas,
        func.date(HistoryModel.timestamp).label("date"),
        func.count().label("count")
    ).filter(HistoryModel.timestamp >= since).group_by(func.date(HistoryModel.timestamp), HistoryModel.aktivitas).all()
    session.close()
    return result

def get_weekly_stats(weeks=1):
    session = SessionLocal()
    since = datetime.now() - timedelta(weeks=weeks)
    result = session.query(
        HistoryModel.aktivitas,
        func.week(HistoryModel.timestamp).label("week"),
        func.count().label("count")
    ).filter(HistoryModel.timestamp >= since).group_by(func.week(HistoryModel.timestamp), HistoryModel.aktivitas).all()
    session.close()
    return result

def get_monthly_stats(months=1):
    session = SessionLocal()
    since = datetime.now() - timedelta(days=30*months)
    result = session.query(
        HistoryModel.aktivitas,
        func.month(HistoryModel.timestamp).label("month"),
        func.count().label("count")
    ).filter(HistoryModel.timestamp >= since).group_by(func.month(HistoryModel.timestamp), HistoryModel.aktivitas).all()
    session.close()
    return result

from sqlalchemy import func, case
from models.history_model import HistoryModel
from datetime import datetime, timedelta
from services.database_service import SessionLocal

def get_weekly_stats():
    """
    Mengambil statistik parkir per hari dalam 7 hari terakhir
    """
    session = SessionLocal()
    try:
        # Ambil tanggal data terbaru dari database
        latest_date_result = session.query(
            func.max(func.date(HistoryModel.timestamp))
        ).scalar()
        
        if latest_date_result is None:
            return []
        
        # Gunakan tanggal terbaru sebagai acuan
        end_date = latest_date_result
        start_date = end_date - timedelta(days=6)
        
        # Query tanpa dayname - kita hitung nama hari di Python
        result = session.query(
            func.date(HistoryModel.timestamp).label("date"),
            func.sum(case((HistoryModel.aktivitas == 'parkir_masuk', 1), else_=0)).label("masuk"),
            func.sum(case((HistoryModel.aktivitas == 'parkir_keluar', 1), else_=0)).label("keluar"),
            func.count().label("total")
        ).filter(
            func.date(HistoryModel.timestamp) >= start_date,
            func.date(HistoryModel.timestamp) <= end_date
        ).group_by(
            func.date(HistoryModel.timestamp)
        ).order_by(
            func.date(HistoryModel.timestamp)
        ).all()
        
        # Mapping hari dalam bahasa Indonesia
        day_names_indo = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
        
        # Buat dictionary untuk menyimpan data per tanggal
        data_by_date = {}
        for row in result:
            # row.date bisa berupa date object atau string
            if hasattr(row.date, 'strftime'):
                date_obj = row.date
                date_str = row.date.strftime("%Y-%m-%d")
            else:
                date_str = str(row.date)
                date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            
            weekday_idx = date_obj.weekday()  # 0=Monday, 6=Sunday
            
            data_by_date[date_str] = {
                "day": day_names_indo[weekday_idx],
                "date": date_str,
                "masuk": int(row.masuk or 0),
                "keluar": int(row.keluar or 0),
                "total": int(row.total or 0)
            }
        
        # Buat list untuk 7 hari (dari start_date sampai end_date)
        stats = []
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            date_str = current_date.strftime("%Y-%m-%d")
            weekday_idx = current_date.weekday()
            
            if date_str in data_by_date:
                stats.append(data_by_date[date_str])
            else:
                stats.append({
                    "day": day_names_indo[weekday_idx],
                    "date": date_str,
                    "masuk": 0,
                    "keluar": 0,
                    "total": 0
                })
        
        return stats
        
    except Exception as e:
        print(f"Error in get_weekly_stats: {e}")
        import traceback
        traceback.print_exc()
        return []
    finally:
        session.close()


def get_monthly_stats():
    """
    Mengambil statistik parkir per minggu dalam 4 minggu terakhir
    """
    session = SessionLocal()
    try:
        # Ambil tanggal data terbaru dari database
        latest_date_result = session.query(
            func.max(func.date(HistoryModel.timestamp))
        ).scalar()
        
        if latest_date_result is None:
            return []
        
        end_date = latest_date_result
        start_date = end_date - timedelta(days=27)
        
        # Gunakan YEARWEEK untuk grouping per minggu
        result = session.query(
            func.yearweek(HistoryModel.timestamp, 1).label("year_week"),
            func.sum(case((HistoryModel.aktivitas == 'parkir_masuk', 1), else_=0)).label("masuk"),
            func.sum(case((HistoryModel.aktivitas == 'parkir_keluar', 1), else_=0)).label("keluar"),
            func.count().label("total")
        ).filter(
            func.date(HistoryModel.timestamp) >= start_date,
            func.date(HistoryModel.timestamp) <= end_date
        ).group_by(
            func.yearweek(HistoryModel.timestamp, 1)
        ).order_by(
            func.yearweek(HistoryModel.timestamp, 1)
        ).all()
        
        stats = []
        for idx, row in enumerate(result, 1):
            stats.append({
                "day": f"Minggu {idx}",
                "masuk": int(row.masuk or 0),
                "keluar": int(row.keluar or 0),
                "total": int(row.total or 0)
            })
        
        # Pastikan minimal 4 data
        while len(stats) < 4:
            stats.append({
                "day": f"Minggu {len(stats) + 1}",
                "masuk": 0,
                "keluar": 0,
                "total": 0
            })
        
        return stats[:4]
        
    except Exception as e:
        print(f"Error in get_monthly_stats: {e}")
        import traceback
        traceback.print_exc()
        return []
    finally:
        session.close()


def get_daily_stats():
    """
    Mengambil statistik parkir untuk hari ini
    """
    session = SessionLocal()
    try:
        today = datetime.now().date()
        
        result = session.query(
            func.sum(case((HistoryModel.aktivitas == 'parkir_masuk', 1), else_=0)).label("masuk"),
            func.sum(case((HistoryModel.aktivitas == 'parkir_keluar', 1), else_=0)).label("keluar"),
            func.count().label("total")
        ).filter(
            func.date(HistoryModel.timestamp) == today
        ).first()
        
        return {
            "day": "Hari Ini",
            "masuk": int(result.masuk or 0) if result.masuk else 0,
            "keluar": int(result.keluar or 0) if result.keluar else 0,
            "total": int(result.total or 0) if result.total else 0
        }
        
    except Exception as e:
        print(f"Error in get_daily_stats: {e}")
        return {"day": "Hari Ini", "masuk": 0, "keluar": 0, "total": 0}
    finally:
        session.close()
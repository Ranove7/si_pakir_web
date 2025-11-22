from sqlalchemy import func, case
from models.history_model import HistoryModel
from datetime import datetime, timedelta
from services.database_service import SessionLocal

def get_weekly_stats():
    """
    Mengambil statistik parkir per hari dalam 7 hari terakhir
    Return format: [
        {"day": "Senin", "total": 40, "masuk": 25, "keluar": 15},
        ...
    ]
    """
    session = SessionLocal()
    try:
        # Hitung 7 hari terakhir
        today = datetime.now().date()
        start_date = today - timedelta(days=6)  # 7 hari termasuk hari ini
        
        # Query untuk menghitung parkir masuk dan keluar per hari
        result = session.query(
            func.dayofweek(HistoryModel.timestamp).label("day_num"),
            func.date(HistoryModel.timestamp).label("date"),
            func.sum(case((HistoryModel.aktivitas == 'parkir_masuk', 1), else_=0)).label("masuk"),
            func.sum(case((HistoryModel.aktivitas == 'parkir_keluar', 1), else_=0)).label("keluar"),
            func.count().label("total")
        ).filter(
            func.date(HistoryModel.timestamp) >= start_date
        ).group_by(
            func.date(HistoryModel.timestamp)
        ).order_by(
            func.date(HistoryModel.timestamp)
        ).all()
        
        # Mapping nomor hari ke nama hari (MySQL: 1=Sunday, 2=Monday, ...)
        day_names = {
            1: "Minggu",
            2: "Senin", 
            3: "Selasa",
            4: "Rabu",
            5: "Kamis",
            6: "Jumat",
            7: "Sabtu"
        }
        
        # Buat dictionary untuk menyimpan data per tanggal
        data_by_date = {}
        for row in result:
            date_str = row.date.strftime("%Y-%m-%d")
            data_by_date[date_str] = {
                "day": day_names.get(row.day_num, "Unknown"),
                "date": date_str,
                "masuk": int(row.masuk or 0),
                "keluar": int(row.keluar or 0),
                "total": int(row.total or 0)
            }
        
        # Buat list untuk 7 hari terakhir (pastikan semua hari ada)
        stats = []
        for i in range(7):
            current_date = start_date + timedelta(days=i)
            date_str = current_date.strftime("%Y-%m-%d")
            day_num = current_date.isoweekday()  # 1=Monday, 7=Sunday
            # Convert ke format MySQL (1=Sunday, 2=Monday, ...)
            mysql_day_num = 1 if day_num == 7 else day_num + 1
            
            if date_str in data_by_date:
                stats.append(data_by_date[date_str])
            else:
                # Jika tidak ada data, tambahkan dengan nilai 0
                stats.append({
                    "day": day_names.get(mysql_day_num, "Unknown"),
                    "date": date_str,
                    "masuk": 0,
                    "keluar": 0,
                    "total": 0
                })
        
        return stats
        
    except Exception as e:
        print(f"Error in get_weekly_stats: {e}")
        return []
    finally:
        session.close()


def get_monthly_stats():
    """
    Mengambil statistik parkir per minggu dalam 4 minggu terakhir
    Return format: [
        {"day": "Minggu 1", "total": 230, "masuk": 130, "keluar": 100},
        ...
    ]
    """
    session = SessionLocal()
    try:
        today = datetime.now().date()
        start_date = today - timedelta(days=27)  # 4 minggu = 28 hari
        
        result = session.query(
            func.week(HistoryModel.timestamp).label("week_num"),
            func.sum(case((HistoryModel.aktivitas == 'parkir_masuk', 1), else_=0)).label("masuk"),
            func.sum(case((HistoryModel.aktivitas == 'parkir_keluar', 1), else_=0)).label("keluar"),
            func.count().label("total")
        ).filter(
            func.date(HistoryModel.timestamp) >= start_date
        ).group_by(
            func.week(HistoryModel.timestamp)
        ).order_by(
            func.week(HistoryModel.timestamp)
        ).all()
        
        stats = []
        for idx, row in enumerate(result, 1):
            stats.append({
                "day": f"Minggu {idx}",
                "masuk": int(row.masuk or 0),
                "keluar": int(row.keluar or 0),
                "total": int(row.total or 0)
            })
        
        # Jika kurang dari 4 minggu, tambahkan data kosong
        while len(stats) < 4:
            stats.append({
                "day": f"Minggu {len(stats) + 1}",
                "masuk": 0,
                "keluar": 0,
                "total": 0
            })
        
        return stats[:4]  # Maksimal 4 minggu
        
    except Exception as e:
        print(f"Error in get_monthly_stats: {e}")
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
            "masuk": int(result.masuk or 0),
            "keluar": int(result.keluar or 0),
            "total": int(result.total or 0)
        }
        
    except Exception as e:
        print(f"Error in get_daily_stats: {e}")
        return {"day": "Hari Ini", "masuk": 0, "keluar": 0, "total": 0}
    finally:
        session.close()
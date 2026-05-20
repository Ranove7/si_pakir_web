from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pymysql
from datetime import datetime
import threading

# =========================
# IMPORT ROUTES
# =========================
from routes.slot_route import router as slot_router
from routes.history_route import router as history_router
from routes.esp_route import router as esp_router
from routes.chart_route import router as chart_router
from routes.camera_route import router as camera_router
from routes.auth_route import router as auth_router
from routes.settings_route import router as settings_router
from routes.user_route import router as user_router
from routes.rfid_route import router as rfid_router

# =========================
# IMPORT SERVICE
# =========================
from services.yolo_service import YoloService

# =========================
# INIT FASTAPI
# =========================
app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# KONEKSI DATABASE
# =========================
db = pymysql.connect(
    host="db",
    user="root",
    password="root123",
    database="si_parkir",
    port=3306
)

# =========================
# MODEL DATA RFID
# =========================
class RFIDData(BaseModel):
    kode_parkir: str
    user_id: int | None = None
    aktivitas: str

# =========================
# API SIMPAN HISTORY
# =========================
@app.post("/history")
def simpan_history(data: RFIDData):
    try:
        cursor = db.cursor()

        sql = """
        INSERT INTO history_parkir
        (kode_parkir, user_id, aktivitas, timestamp)
        VALUES (%s, %s, %s, %s)
        """

        values = (
            data.kode_parkir,
            data.user_id,
            data.aktivitas,
            datetime.now()
        )

        cursor.execute(sql, values)
        db.commit()

        return {
            "status": "success",
            "message": "History berhasil disimpan"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# =========================
# API CHECK RFID CARD
# =========================
@app.get("/check-card/{uid}")
def check_card(uid: str):
    try:
        cursor = db.cursor(pymysql.cursors.DictCursor)

        sql = "SELECT * FROM users WHERE id_card=%s"
        cursor.execute(sql, (uid,))

        user = cursor.fetchone()

        if user:
            return {
                "status": "VALID",
                "user_id": user["id"],
                "nama": user["nama"]
            }

        return {
            "status": "INVALID"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# =========================
# ROUTES
# =========================
app.include_router(slot_router, prefix="/slots")
app.include_router(history_router, prefix="/history")
app.include_router(esp_router, prefix="/esp")
app.include_router(chart_router, prefix="/chart")
app.include_router(camera_router, prefix="/camera")
app.include_router(auth_router, prefix="/auth")
app.include_router(settings_router, prefix="/settings")

app.include_router(
    user_router,
    prefix="/users",
    tags=["Users"]
)

app.include_router(
    rfid_router,
    prefix="/rfid",
    tags=["RFID"]
)

# =========================
# BACKGROUND YOLO SERVICE
# =========================
yolo_service = YoloService()
threading.Thread(
    target=yolo_service.run,
    daemon=True
).start()

# =========================
# ROOT ENDPOINT
# =========================
@app.get("/")
def root():
    return {
        "message": "API Smart Parking berjalan"
    }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from routes.slot_route import router as slot_router
from routes.history_route import router as history_router
from routes.esp_route import router as esp_router  # ✅ Import baru
import threading
from services.yolo_service import YoloService

app = FastAPI()

# Izinkan akses dari frontend localhost:5173 DAN ESP8266
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ Ubah ke * untuk izinkan ESP8266
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routes
app.include_router(slot_router, prefix="/slots")
app.include_router(history_router, prefix="/history")
app.include_router(esp_router, prefix="/esp")  # ✅ Route baru untuk ESP8266

# jalankan YOLO di background
yolo_service = YoloService()
threading.Thread(target=yolo_service.run, daemon=True).start()
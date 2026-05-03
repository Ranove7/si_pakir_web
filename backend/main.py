from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.slot_route import router as slot_router
from routes.history_route import router as history_router
from routes.esp_route import router as esp_router
from routes.chart_route import router as chart_router
from routes.camera_route import router as camera_router
from routes.auth_route import router as auth_router  
from routes.settings_route import router as settings_router 

import threading
from services.yolo_service import YoloService

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes
app.include_router(slot_router, prefix="/slots")
app.include_router(history_router, prefix="/history")
app.include_router(esp_router, prefix="/esp")
app.include_router(chart_router, prefix="/chart")
app.include_router(camera_router, prefix="/camera")
app.include_router(auth_router, prefix="/auth")
app.include_router(settings_router, prefix="/settings")   

# background yolo
yolo_service = YoloService()
threading.Thread(target=yolo_service.run, daemon=True).start()
import os
from dotenv import load_dotenv

load_dotenv()

# Database
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 3306))
DB_USER = os.getenv("DB_USER", "kelompok4")
DB_PASS = os.getenv("DB_PASSWORD", "kelompok4")
DB_NAME = os.getenv("DB_NAME", "si_parkir")

# JWT Auth
SECRET_KEY = os.getenv("SECRET_KEY", "secretkey123456789")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# YOLO & Camera
YOLO_MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "model_yolo/best_yolov5.pt")
DETECTION_INTERVAL = float(os.getenv("DETECTION_INTERVAL", 0.3))
CAMERA_INDEX = int(os.getenv("CAMERA_INDEX", 1))
CAMERA_BUFFER_SIZE = int(os.getenv("CAMERA_BUFFER_SIZE", 1))
SKIP_FRAMES = int(os.getenv("SKIP_FRAMES", 2))
MAX_FRAME_WIDTH = int(os.getenv("MAX_FRAME_WIDTH", 640))
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", 0.8))

SLOT_MAPPING = {
    "A1": (401, 140, 633, 307),
    "A2": (396, 271, 637, 425),
    "A3": (392, 424, 631, 587),
    "A4": (836, 163, 1044, 329),
    "A5": (845, 313, 1075, 460),
    "A6": (875, 466, 1079, 608),
}
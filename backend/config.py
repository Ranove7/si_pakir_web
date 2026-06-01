import os
from dotenv import load_dotenv

load_dotenv()

# Database
DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT"))
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# YOLO & Camera
YOLO_MODEL_PATH = os.getenv("YOLO_MODEL_PATH")
DETECTION_INTERVAL = float(os.getenv("DETECTION_INTERVAL"))
CAMERA_INDEX = int(os.getenv("CAMERA_INDEX"))
CAMERA_BUFFER_SIZE = int(os.getenv("CAMERA_BUFFER_SIZE"))
SKIP_FRAMES = int(os.getenv("SKIP_FRAMES"))
MAX_FRAME_WIDTH = int(os.getenv("MAX_FRAME_WIDTH"))
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD"))

SLOT_MAPPING = {
    "A1": (401, 140, 633, 307),
    "A2": (396, 271, 637, 425),
    "A3": (392, 424, 631, 587),
    "A4": (836, 163, 1044, 329),
    "A5": (845, 313, 1075, 460),
    "A6": (875, 466, 1079, 608),
}
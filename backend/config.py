DB_HOST = "localhost"
DB_USER = "root"
DB_PASS = ""
DB_NAME = "si_parkir"

YOLO_MODEL_PATH = "model_yolo/best_yolov5.pt"
DETECTION_INTERVAL = 0.3  # ✅ Kurangi delay (0.3-0.5 detik)

# Camera Settings
CAMERA_BUFFER_SIZE = 1  # ✅ Minimal buffer
SKIP_FRAMES = 2  # ✅ Skip beberapa frame
MAX_FRAME_WIDTH = 640
CONFIDENCE_THRESHOLD = 0.8

SLOT_MAPPING = {
    "A1": (401, 140, 633, 307),
    "A2": (396, 271, 637, 425),
    "A3": (392, 424, 631, 587),
    "A4": (836, 163, 1044, 329),
    "A5": (845, 313, 1075, 460),
    "A6": (875, 466, 1079, 608),
}


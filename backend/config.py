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
    "A1": (404, 65, 652, 259),
    "A2": (391, 221, 648, 428),
    "A3": (347, 391, 603, 604),
    "A4": (930, 138, 1244, 315),
    "A5": (917, 302, 1265, 475),
    "A6": (934, 493, 1272, 648),
}


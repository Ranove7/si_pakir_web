DB_HOST = "localhost"
DB_USER = "root"
DB_PASS = ""
DB_NAME = "si_parkir"

YOLO_MODEL_PATH = "model_yolo/best_car.pt"
DETECTION_INTERVAL = 0.3  # ✅ Kurangi delay (0.3-0.5 detik)

# Camera Settings
CAMERA_BUFFER_SIZE = 1  # ✅ Minimal buffer
SKIP_FRAMES = 2  # ✅ Skip beberapa frame
MAX_FRAME_WIDTH = 640
CONFIDENCE_THRESHOLD = 0.5

SLOT_MAPPING = {
    "A1": (549, 295, 752, 399),
    "A2": (539, 412, 747, 519),
    "A3": (524, 522, 735, 661),
    "A4": (1028, 270, 1214, 399),
    "A5": (1040, 388, 1239, 523),
    "A6": (1058, 509, 1274, 647),
}

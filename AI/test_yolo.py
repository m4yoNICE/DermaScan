from yolo_detector import YoloDetector
import numpy as np

# Create a fake image (just to test loading)
img = np.zeros((640, 640, 3), dtype=np.uint8)

try:
    detector = YoloDetector()
    boxes = detector.detect(img)

    print("YOLO detector loaded successfully")
    print("Detected boxes:", boxes)

except Exception as e:
    print("YOLO test failed:", str(e))
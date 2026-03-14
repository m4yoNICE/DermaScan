from ultralytics import YOLO
import numpy as np

class YoloDetector:
    def __init__(self, model_path="yolov8n.pt"):
        """
        Initialize YOLO detector.
        model_path should point to your trained YOLO model.
        """
        self.model = YOLO(model_path)

    def detect(self, image):
        """
        Detect lesions in an image.

        image: numpy array (H, W, 3)

        Returns list of bounding boxes:
        [(x1, y1, x2, y2), ...]
        """
        results = self.model(image)

        boxes = []

        for r in results:
            if r.boxes is None:
                continue

            coords = r.boxes.xyxy.cpu().numpy()

            for box in coords:
                x1, y1, x2, y2 = map(int, box)
                boxes.append((x1, y1, x2, y2))

        return boxes


def crop_regions(image, boxes):
    """
    Crop regions from the original image using bounding boxes.
    """
    crops = []

    for (x1, y1, x2, y2) in boxes:
        crop = image[y1:y2, x1:x2]

        if crop.size > 0:
            crops.append(crop)

    return crops
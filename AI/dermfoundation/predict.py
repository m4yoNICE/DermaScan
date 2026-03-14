import joblib
import numpy as np
from embedder import get_embedding
from preprocessing.preprocess_image import ImagePreprocessingError, MAX_IMAGE_BYTES
from yolo_detector import YoloDetector, crop_regions

import sys
import json
import os
import cv2

# Add preprocessing to path for error handling
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

try:
    # Step 1: Load classifier and label encoder
    MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "trained_data", "skin_classifier.pkl")
    clf, le = joblib.load(MODEL_PATH)

    # Step 2: Initialize YOLO detector
    detector = YoloDetector()

    # Step 3: Read image data from stdin
    image_data = sys.stdin.buffer.read(MAX_IMAGE_BYTES + 1)

    if not image_data:
        raise ValueError("No image data received")

    # Step 4: Convert bytes to OpenCV image
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Invalid image format")

    # Step 5: Run YOLO detection
    boxes = detector.detect(img)

    # Step 6: Crop detected regions
    crops = crop_regions(img, boxes)

    # If YOLO finds nothing, fall back to full image
    if len(crops) == 0:
        crops = [img]

    predictions = []
    probabilities = []

    # Step 7: Run classifier on each crop
    for crop in crops:
        emb = get_embedding(crop).reshape(1, -1)

        preds = clf.predict(emb)
        proba = clf.predict_proba(emb)[0]

        predictions.append(preds[0])
        probabilities.append(proba)

    # Step 8: Use the crop with highest confidence
    best_idx = np.argmax([max(p) for p in probabilities])
    best_proba = probabilities[best_idx]

    top_idx = np.argsort(best_proba)[-3:][::-1]

    top3 = [
        {"label": le.classes_[i], "score": float(best_proba[i])}
        for i in top_idx
    ]

    result = {
        "lesions_detected": len(crops),
        "primary_prediction": top3[0]["label"],
        "top3": top3
    }

    print(json.dumps(result))

except ImagePreprocessingError as e:
    print(json.dumps({"error": f"Image validation failed: {str(e)}"}), file=sys.stderr)
    sys.exit(1)

except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
    sys.exit(1)
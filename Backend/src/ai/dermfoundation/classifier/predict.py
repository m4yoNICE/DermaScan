import joblib
from PIL import Image, UnidentifiedImageError
import io
import numpy as np
from embedder import get_embedding
import sys
import json
import os

MAX_IMAGE_SIZE_MB = 10  # adjustable memory guard
MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

try:
    # Step 1: Load classifier and label encoder
    clf, le = joblib.load("skin_classifier.pkl")

    # Step 2: Read image data from stdin safely
    image_data = sys.stdin.buffer.read(MAX_IMAGE_BYTES + 1)
    if len(image_data) > MAX_IMAGE_BYTES:
        raise ValueError(f"Image exceeds {MAX_IMAGE_SIZE_MB}MB limit")

    # Step 3: Convert to PIL image
    try:
        image = Image.open(io.BytesIO(image_data))
    except UnidentifiedImageError:
        raise ValueError("Invalid image format")

    # Step 4: Preprocess
    image = image.resize((448, 448)).convert("RGB")
    image_array = np.asarray(image, dtype=np.float32) / 255.0

    # Step 5: Generate embedding
    emb = get_embedding(image_data).reshape(1, -1)

    # Step 6: Predict
    preds = clf.predict(emb)
    pred_label = le.inverse_transform(preds)[0]
    proba = clf.predict_proba(emb)[0]

    # Step 7: Output JSON result
    result = {
        "predicted_class": pred_label,
        "scores": {label: float(score) for label, score in zip(le.classes_, proba)},
    }
    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

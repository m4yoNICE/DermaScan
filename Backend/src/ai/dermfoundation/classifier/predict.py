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
    # Step 1: Load classaifier and label encoder
    clf, le = joblib.load("skin_classifier.pkl")

    # Step 2: Read image data from stdin safely
    image_data = sys.stdin.buffer.read(MAX_IMAGE_BYTES + 1)
    if len(image_data) > MAX_IMAGE_BYTES:
        raise ValueError(f"Image exceeds {MAX_IMAGE_SIZE_MB}MB limit")

    # Step 3: Read and validate image
    try:
        image = Image.open(io.BytesIO(image_data))
        image.verify()  # Check it's valid without fully loading
    except UnidentifiedImageError:
        raise ValueError("Invalid image format")

    # Step 4: Generate embedding (handles preprocessing internally)
    emb = get_embedding(image_data).reshape(1, -1)

    # Step 6: Predict
    preds = clf.predict(emb)
    pred_label = le.inverse_transform(preds)[0]
    proba = clf.predict_proba(emb)[0]

    # Step 7: Get top 3 classes
    top_idx = np.argsort(proba)[-3:][::-1]
    top3 = [
        {"label": le.classes_[i], "score": float(proba[i])}
        for i in top_idx
    ]
    result = {
        "primary_prediction": top3[0]["label"],
        "top3": top3,
    }
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

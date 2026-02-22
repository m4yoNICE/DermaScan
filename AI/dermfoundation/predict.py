import joblib
import io
import numpy as np
from embedder import get_embedding
from preprocessing.preprocess_image import ImagePreprocessingError, MAX_IMAGE_BYTES
import sys
import json
import os

# Add preprocessing to path for error handling
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))


try:
    # Step 1: Load classifier and label encoder
    clf, le = joblib.load("../trained_data/skin_classifier.pkl")
    
    # Step 2: Read image data from stdin
    image_data = sys.stdin.buffer.read(MAX_IMAGE_BYTES + 1)
    
    # Step 3: Generate embedding (preprocessing happens inside)
    emb = get_embedding(image_data).reshape(1, -1)
    
    # Step 4: Predict
    preds = clf.predict(emb)
    pred_label = le.inverse_transform(preds)[0]
    proba = clf.predict_proba(emb)[0]
    
    # Step 5: Get top 3 classes
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

except ImagePreprocessingError as e:
    print(json.dumps({"error": f"Image validation failed: {str(e)}"}), file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
    sys.exit(1)
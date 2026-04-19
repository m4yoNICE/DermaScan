import joblib
import numpy as np
import sys
import json
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from preprocessing.preprocess_image import ImagePreprocessingError, MAX_IMAGE_BYTES
from embedder import get_embedding

try:
    # Load classifier
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
    MODEL_PATH = os.path.join(PROJECT_ROOT, "trained_data", "skin_classifier_efficientnet.pkl")
    
    clf, le = joblib.load(MODEL_PATH)
    
    # Read image data from stdin
    image_data = sys.stdin.buffer.read(MAX_IMAGE_BYTES + 1)
    
    # Generate embedding
    emb = get_embedding(image_data).reshape(1, -1)
    
    # Predict
    preds = clf.predict(emb)
    pred_label = le.inverse_transform(preds)[0]
    proba = clf.predict_proba(emb)[0]
    
    # Get top 3 classes
    top_idx = np.argsort(proba)[-3:][::-1]
    top3 = [
        {"label": le.classes_[i], "score": float(proba[i])}
        for i in top_idx
    ]
    
    result = {
        "primary_prediction": top3[0]["label"],
        "top3": top3,
        "model": "efficientnet-b0"
    }
    
    print(json.dumps(result))

except ImagePreprocessingError as e:
    print(json.dumps({"error": f"Image validation failed: {str(e)}"}), file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
    sys.exit(1)
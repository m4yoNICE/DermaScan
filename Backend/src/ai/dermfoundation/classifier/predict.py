import joblib
from PIL import Image
import io
import numpy as np
from embedder import get_embedding
import sys
import os
import json
import numpy as np
clf, le = joblib.load("skin_classifier.pkl")
#recieve file
image_data = sys.stdin.buffer.read()
#input preprocessing
image = Image.open(io.BytesIO(image_data))
image = image.resize((448, 448))
image = image.convert("RGB")
image_array = np.array(image) / 255.0
emb = get_embedding(image_data).reshape(1, -1)
#predict here
pred_index = clf.predict(emb)[0]
pred_label = le.inverse_transform(clf.predict(emb))[0]
proba = clf.predict_proba(emb)[0]

# Build result as dict
result = {
    "predicted_class": pred_label,
    "scores": {label: float(score) for label, score in zip(le.classes_, proba)}
}
print(json.dumps(result))
sys.exit(0)
import os
import numpy as np
import joblib
from embedder import get_embedding
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

DATA_DIR = "../data"
MODEL_PATH = "skin_classifier.pkl"

X, y = [], []

# === 1. Collect embeddings from all images ===
for label in os.listdir(DATA_DIR):
    folder = os.path.join(DATA_DIR, label)
    if not os.path.isdir(folder):
        continue
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        if not os.path.isfile(path):
            continue
        emb = get_embedding(path)
        X.append(emb)
        y.append(label)
        print(f"Processed {label}/{file}")

X = np.array(X)
y = np.array(y)

# === 2. Prepare classifier and label encoder ===
le = LabelEncoder()
le.fit(y)
y_enc = le.transform(y)

clf = LogisticRegression(max_iter=1000)

# === 3. Train classifier ===
print(f"🚀 Training classifier on {len(X)} samples...")
clf.fit(X, y_enc)

# === 4. Save classifier + label encoder ===
joblib.dump((clf, le), MODEL_PATH)
print(f"✅ Model saved to {MODEL_PATH}")

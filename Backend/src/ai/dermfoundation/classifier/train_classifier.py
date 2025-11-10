import os
import numpy as np
import joblib
from embedder import get_embedding
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

DATA_DIR = "../data"
MODEL_PATH = "skin_classifier.pkl"

X, y = [], []

# === 1. Load new embeddings and labels ===
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

# === 2. Check if model exists ===
if os.path.exists(MODEL_PATH):
    print("🔄 Existing model found — loading...")
    clf, le = joblib.load(MODEL_PATH)

    # Check if there are new classes
    existing_classes = set(le.classes_)
    new_classes = set(y) - existing_classes

    if new_classes:
        print(f"⚠️ New classes detected: {', '.join(new_classes)}")
        all_classes = np.array(sorted(existing_classes.union(new_classes)))
        le.classes_ = all_classes
    else:
        print("✅ No new classes found.")

else:
    print("🆕 No existing model found — training from scratch.")
    clf = LogisticRegression(max_iter=1000)
    le = LabelEncoder()
    le.fit(y)

# === 3. Encode labels ===
y_enc = le.transform(y)

# === 4. Retrain classifier on full dataset ===
print("🚀 Training classifier...")
clf.fit(X, y_enc)

# === 5. Save model ===
joblib.dump((clf, le), MODEL_PATH)
print(f"✅ Model saved to {MODEL_PATH}")

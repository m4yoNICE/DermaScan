import os
import sys
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# Import embedder
from embedder import get_embedding

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, "training_data")
MODEL_PATH = os.path.join(PROJECT_ROOT, "trained_data", "skin_classifier_efficientnet.pkl")

# Create output directory
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

X, y = [], []

# === 1. Collect embeddings from all images ===
print(f"📂 Reading training data from: {DATA_DIR}")
for label in os.listdir(DATA_DIR):
    folder = os.path.join(DATA_DIR, label)
    if not os.path.isdir(folder):
        continue
    
    print(f"\n📁 Processing class: {label}")
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        if not os.path.isfile(path):
            continue
        
        try:
            emb = get_embedding(path)
            X.append(emb)
            y.append(label)
            print(f"  ✓ {file}")
        except Exception as e:
            print(f"  ✗ {file}: {e}")

X = np.array(X)
y = np.array(y)

print(f"\n{'='*60}")
print(f"📊 Total samples: {len(X)}")
print(f"📊 Embedding dimension: {X.shape[1]}")  # Should be 1280 for EfficientNet-B0
print(f"📊 Total classes: {len(set(y))}")
print(f"{'='*60}\n")

# === 2. Prepare classifier and label encoder ===
le = LabelEncoder()
y_enc = le.fit_transform(y)

# Split for validation
X_train, X_val, y_train, y_val = train_test_split(
    X, y_enc, test_size=0.2, random_state=42, stratify=y_enc
)

# === 3. Train classifier ===
print(f"🚀 Training LogisticRegression on {len(X_train)} samples...")
clf = LogisticRegression(max_iter=1000, random_state=42, verbose=1)
clf.fit(X_train, y_train)

# === 4. Evaluate ===
y_pred = clf.predict(X_val)
accuracy = accuracy_score(y_val, y_pred)

print(f"\n{'='*60}")
print(f"✅ Validation Accuracy: {accuracy:.2%}")
print(f"{'='*60}\n")

print("Classification Report:")
print(classification_report(y_val, y_pred, target_names=le.classes_))

# === 5. Save classifier + label encoder ===
joblib.dump((clf, le), MODEL_PATH, compress=3)
print(f"\n✅ Model saved to {MODEL_PATH}")
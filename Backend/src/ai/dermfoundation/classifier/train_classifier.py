import os
import numpy as np
import joblib
from embedder import get_embedding
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

DATA_DIR = "../data"
MODEL_PATH = "skin_classifier.pkl"
TRAINING_DATA_PATH = "training_data.pkl"

X, y = [], []
failed_files = []

# === 1. Load new embeddings and labels ===
for label in os.listdir(DATA_DIR):
    folder = os.path.join(DATA_DIR, label)
    if not os.path.isdir(folder):
        continue
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        if not os.path.isfile(path):
            continue
        
        try:
            emb = get_embedding(path)
            X.append(emb)
            y.append(label)
            print(f"Processed {label}/{file}")
        except Exception as e:
            failed_path = f"{label}/{file}"
            print(f"❌ FAILED: {failed_path} — {type(e).__name__}: {str(e)}")
            failed_files.append(failed_path)
            continue

if not X:
    print("❌ No valid samples processed. Exiting.")
    exit(1)

X_new = np.array(X)
y_new = np.array(y)

print(f"\n📊 Successfully processed {len(X_new)} samples")
if failed_files:
    print(f"⚠️ Failed to process {len(failed_files)} files:")
    for f in failed_files:
        print(f"   - {f}")

# === 2. Load existing model and training data ===
if os.path.exists(MODEL_PATH) and os.path.exists(TRAINING_DATA_PATH):
    print("\n🔄 Loading existing model and training data...")
    clf, le = joblib.load(MODEL_PATH)
    X_old, y_old = joblib.load(TRAINING_DATA_PATH)
    
    # Merge old and new data
    X = np.vstack([X_old, X_new])
    y = np.hstack([y_old, y_new])
    
    # Update label encoder if new classes exist
    existing_classes = set(le.classes_)
    all_classes_in_data = set(y)
    new_classes = all_classes_in_data - existing_classes
    
    if new_classes:
        print(f"⚠️ New classes detected: {', '.join(new_classes)}")
        le = LabelEncoder()
        le.fit(y)
    
    print(f"📊 Training on {len(X_old)} old + {len(X_new)} new samples = {len(X)} total")
else:
    print("\n🆕 No existing data found — training from scratch.")
    X = X_new
    y = y_new
    clf = LogisticRegression(max_iter=1000)
    le = LabelEncoder()
    le.fit(y)

# === 3. Encode and train ===
y_enc = le.transform(y)
print("\n🚀 Training classifier...")
clf.fit(X, y_enc)

# === 4. Save both model AND training data ===
joblib.dump((clf, le), MODEL_PATH)
joblib.dump((X, y), TRAINING_DATA_PATH)
print(f"\n✅ Model saved to {MODEL_PATH}")
print(f"✅ Training data saved to {TRAINING_DATA_PATH}")
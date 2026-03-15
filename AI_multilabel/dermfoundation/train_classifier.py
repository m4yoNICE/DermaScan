import os
import numpy as np
import joblib
from embedder import get_embedding  # FIXED
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

DATA_DIR = "../training_data"
MODEL_PATH = "../trained_data/skin_classifier.pkl"

X, y = [], []

# Collect embeddings
print("🔄 Extracting embeddings...")
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
            print(f"✅ {label}/{file}")
        except Exception as e:
            print(f"❌ {label}/{file}: {e}")

X = np.array(X)
y = np.array(y)

# Encode and split
le = LabelEncoder()
y_enc = le.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X, y_enc, test_size=0.2, random_state=42, stratify=y_enc
)

# Train ONCE
clf = LogisticRegression(max_iter=1000, random_state=42)
clf.fit(X_train, y_train)  # FIXED: was clf.fit(X, y_enc)

# Evaluate
train_acc = clf.score(X_train, y_train)
test_acc = clf.score(X_test, y_test)

print(f"\nTrain: {train_acc:.2%}")
print(f"Test:  {test_acc:.2%}")

# Save
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
joblib.dump((clf, le), MODEL_PATH)
print(f"✅ Saved to {MODEL_PATH}")
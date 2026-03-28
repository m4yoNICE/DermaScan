import os
import numpy as np
import joblib
import pickle
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.linear_model import LogisticRegression
from sklearn.multioutput import MultiOutputClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, hamming_loss

# ── Config ────────────────────────────────────────────────────────────────────
CACHE_DIR  = "../../AI/trained_data/cache"
EMB_PATH   = os.path.join(CACHE_DIR, "embeddings.npy")
LABEL_PATH = os.path.join(CACHE_DIR, "labels.npy")
LR_PATH    = "../trained_data/lr_classifier.pkl"
MLB_PATH   = "../trained_data/mlb.pkl"

# ── Step 1: Load embeddings ───────────────────────────────────────────────────
def load_from_class_caches():
    print("📦 Loading from per-class caches...")
    X, y = [], []

    cache_files = sorted([
        f for f in os.listdir(CACHE_DIR)
        if f.startswith("cls_") and f.endswith(".npy")
    ])

    if not cache_files:
        raise FileNotFoundError(f"No cls_*.npy files found in {CACHE_DIR}")

    for fname in cache_files:
        label = fname[4:-4]
        path = os.path.join(CACHE_DIR, fname)
        data = np.load(path, allow_pickle=True).item()

        class_X = data["X"]
        X.extend(class_X)

        # Build multi-labels from class name
        parts = label.rsplit("-", 1)
        if len(parts) == 2 and parts[1] in {"mild", "moderate", "severe"}:
            for _ in class_X:
                y.append([parts[0], label])  # condition + full label only
        else:
            for _ in class_X:
                y.append([label])

        print(f"[{label}] — {len(class_X)} embeddings")

    X = np.array(X)
    print(f"\n✅ Total: {X.shape}")
    return X, y


X, y_raw = load_from_class_caches()

# ── Step 2: Binarize labels ───────────────────────────────────────────────────
mlb = MultiLabelBinarizer()
y_bin = mlb.fit_transform(y_raw)

print(f"\n✅ Labels ({len(mlb.classes_)}): {list(mlb.classes_)}")
print(f"y_bin shape: {y_bin.shape}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y_bin, test_size=0.2, random_state=42
)

os.makedirs(os.path.dirname(LR_PATH), exist_ok=True)
joblib.dump(mlb, MLB_PATH)
print(f"✅ MLB saved: {MLB_PATH}")

# ── Step 3: Train MultiOutputClassifier ──────────────────────────────────────
print("\n" + "="*50)
print("Training MultiOutputClassifier (LR per label)...")
print("="*50)

lr_classifier = MultiOutputClassifier(
    LogisticRegression(max_iter=1000, random_state=42)
).fit(X_train, y_train)

# Reconstruct proba matrix
y_pred_list = lr_classifier.predict_proba(X_test)
cols = [y_pred_list[i][:, 1] for i in range(len(mlb.classes_))]
y_pred = np.column_stack(cols)

print(f"y_pred shape: {y_pred.shape}")

# ── Step 4: Evaluate ─────────────────────────────────────────────────────────
y_bool = (y_pred >= 0.5).astype(int)
hl = hamming_loss(y_test, y_bool)

print(f"\n### Hamming Loss: {hl:.4f} ###")
print("(Lower is better. 0.0 = perfect, 1.0 = worst)")
print("\nPer-label report:")
print(classification_report(y_test, y_bool, target_names=mlb.classes_))

# ── Step 5: Save ─────────────────────────────────────────────────────────────
joblib.dump((lr_classifier, mlb), LR_PATH)
print(f"✅ Model saved: {LR_PATH}")

print("\n" + "="*50)
print("SUMMARY")
print("="*50)
print(f"Hamming Loss: {hl:.4f}")
print(f"Labels: {len(mlb.classes_)}")
print(f"Train samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")
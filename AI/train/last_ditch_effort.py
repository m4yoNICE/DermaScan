import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../dermfoundation"))
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.utils.class_weight import compute_class_weight

# ── Config ────────────────────────────────────────────────────────────────────
DATA_DIR   = "../training_data_new"
CACHE_DIR  = "../trained_data/cache"
EMB_PATH   = os.path.join(CACHE_DIR, "embeddings.npy")
LABEL_PATH = os.path.join(CACHE_DIR, "labels.npy")
LR_PATH    = "../trained_data/results_new/lr_classifier.pkl"
LE_PATH    = "../trained_data/results_new/label_encoder.pkl"
RF_PATH    = "../trained_data/results_new/rf_classifier.pkl"

os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs("../trained_data/results_new", exist_ok=True)

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}


# ── Folder scanner: handles both flat and nested ──────────────────────────────
def scan_dataset(data_dir):
    """
    Returns a list of (label, image_path) tuples.
    Handles:
      - flat:   condition-severity/image.jpg   → label = "condition-severity"
      - nested: condition/severity/image.jpg   → label = "condition-severity"
      - no-sev: condition/image.jpg            → label = "condition"
    """
    samples = []

    for entry in sorted(os.listdir(data_dir)):
        entry_path = os.path.join(data_dir, entry)
        if not os.path.isdir(entry_path):
            continue

        subdirs = [s for s in os.listdir(entry_path) if os.path.isdir(os.path.join(entry_path, s))]

        if subdirs:
            # Nested: condition/severity/
            for severity in sorted(subdirs):
                sev_path = os.path.join(entry_path, severity)
                label = f"{entry}-{severity}"
                files = [
                    f for f in os.listdir(sev_path)
                    if os.path.splitext(f)[1].lower() in IMAGE_EXTS
                ]
                for f in files:
                    samples.append((label, os.path.join(sev_path, f)))
        else:
            # Flat: condition-severity/ or condition/ (no severity)
            label = entry
            files = [
                f for f in os.listdir(entry_path)
                if os.path.splitext(f)[1].lower() in IMAGE_EXTS
            ]
            for f in files:
                samples.append((label, os.path.join(entry_path, f)))

    return samples


# ── Step 1: Extract or load embeddings ───────────────────────────────────────
def extract_embeddings():
    from embedder import get_embedding

    samples = scan_dataset(DATA_DIR)

    # Group by label
    from collections import defaultdict
    label_to_files = defaultdict(list)
    for label, path in samples:
        label_to_files[label].append(path)

    X, y = [], []
    print("🔄 Extracting embeddings...")

    for label in sorted(label_to_files.keys()):
        class_cache = os.path.join(CACHE_DIR, f"cls_{label}.npy")

        if os.path.exists(class_cache):
            data = np.load(class_cache, allow_pickle=True).item()
            X.extend(data["X"])
            y.extend(data["y"])
            print(f"[{label}] — loaded from cache ({len(data['X'])} embeddings)")
            continue

        files = label_to_files[label]
        print(f"\n[{label}] — {len(files)} images")

        class_X, class_y = [], []
        for path in files:
            try:
                emb = get_embedding(path)
                class_X.append(emb)
                class_y.append(label)
                print(f"    ✅ {os.path.basename(path)}")
            except Exception as e:
                print(f"    ❌ {os.path.basename(path)}: {e}")

        np.save(class_cache, {"X": class_X, "y": class_y})
        print(f"    💾 Cached {label} ({len(class_X)} embeddings)")

        X.extend(class_X)
        y.extend(class_y)

    X = np.array(X)
    y = np.array(y)
    np.save(EMB_PATH, X)
    np.save(LABEL_PATH, y)
    print(f"\n✅ Embeddings cached: {X.shape}")
    return X, y


def load_embeddings():
    print("📦 Loading cached embeddings...")
    X = np.load(EMB_PATH)
    y = np.load(LABEL_PATH)
    print(f"✅ Loaded: {X.shape}")
    return X, y


if os.path.exists(EMB_PATH) and os.path.exists(LABEL_PATH):
    X, y_raw = load_embeddings()
else:
    X, y_raw = extract_embeddings()

# ── Step 2: Encode labels and split ──────────────────────────────────────────
le = LabelEncoder()
y_enc = le.fit_transform(y_raw)

print(f"\n✅ Classes ({len(le.classes_)}): {list(le.classes_)}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y_enc, test_size=0.2, random_state=42, stratify=y_enc
)

weights = compute_class_weight("balanced", classes=np.unique(y_train), y=y_train)
class_weight_dict = dict(enumerate(weights))

joblib.dump(le, LE_PATH)
print(f"✅ Label encoder saved: {LE_PATH}")

# ── Step 3: Train Logistic Regression ────────────────────────────────────────
print("\n" + "="*50)
print("Training Logistic Regression...")
print("="*50)

lr = LogisticRegression(max_iter=1000, random_state=42, class_weight="balanced")
lr.fit(X_train, y_train)

lr_train_acc = lr.score(X_train, y_train)
lr_test_acc  = lr.score(X_test, y_test)
print(f"\nLR Train: {lr_train_acc:.2%}")
print(f"LR Test:  {lr_test_acc:.2%}")
print("\nLR Per-class report:")
print(classification_report(y_test, lr.predict(X_test), target_names=le.classes_))

joblib.dump((lr, le), LR_PATH)
print(f"✅ LR saved: {LR_PATH}")

# ── Step 4: Train Random Forest ──────────────────────────────────────────────
from sklearn.ensemble import RandomForestClassifier

print("\n" + "="*50)
print("Training Random Forest...")
print("="*50)

rf = RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)

rf_train_acc = rf.score(X_train, y_train)
rf_test_acc  = rf.score(X_test, y_test)
print(f"\nRF Train: {rf_train_acc:.2%}")
print(f"RF Test:  {rf_test_acc:.2%}")
print("\nRF Per-class report:")
print(classification_report(y_test, rf.predict(X_test), target_names=le.classes_))

joblib.dump((rf, le), RF_PATH)
print(f"✅ RF saved: {RF_PATH}")

# ── Summary ───────────────────────────────────────────────────────────────────
print("\n" + "="*50)
print("SUMMARY")
print("="*50)
print(f"LR  Test Accuracy: {lr_test_acc:.2%}")
print(f"RF  Test Accuracy: {rf_test_acc:.2%}")
best_acc = max(lr_test_acc, rf_test_acc)
winner = "LR" if best_acc == lr_test_acc else "RF"
print(f"Winner: {winner}")
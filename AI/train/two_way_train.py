import os
import numpy as np
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

CACHE_DIR = "../trained_data/cache"
OUT_DIR = "../trained_data/two_stage"
os.makedirs(OUT_DIR, exist_ok=True)

SEVERITY = {"mild", "moderate", "severe"}
SKIP_LABELS = {"psoriasis"}

# ── Load all cached embeddings ─────────────────────────────────────────────
print("Loading cached embeddings...")
X_all, y_all = [], []

for f in sorted(os.listdir(CACHE_DIR)):
    if not f.startswith("cls_") or not f.endswith(".npy"):
        continue
    label = f[4:-4]
    if label in SKIP_LABELS:
        print(f"  Skipping {label}")
        continue
    path = os.path.join(CACHE_DIR, f)
    data = np.load(path, allow_pickle=True).item()
    X_all.extend(data["X"])
    y_all.extend(data["y"])
    print(f"  Loaded {label}: {len(data['X'])} embeddings")

X_all = np.array(X_all)
y_all = np.array(y_all)
print(f"\nTotal: {X_all.shape}")

# ── Helper ─────────────────────────────────────────────────────────────────
def get_condition(label):
    parts = label.split("-")
    return "-".join(p for p in parts if p not in SEVERITY)

# ── Stage 1: Condition classifier ──────────────────────────────────────────
print("\n" + "="*50)
print("Training Stage 1: Condition Classifier")
print("="*50)

y_condition = np.array([get_condition(l) for l in y_all])

le1 = LabelEncoder()
y1_enc = le1.fit_transform(y_condition)

print(f"Conditions ({len(le1.classes_)}): {list(le1.classes_)}")

X_tr, X_te, y_tr, y_te = train_test_split(
    X_all, y1_enc,
    test_size=0.2,
    random_state=42,
    stratify=y1_enc
)

lr1 = LogisticRegression(
    max_iter=1000,
    random_state=42,
    class_weight="balanced"
)
lr1.fit(X_tr, y_tr)

print(f"Stage 1 Train: {lr1.score(X_tr, y_tr):.2%}")
print(f"Stage 1 Test:  {lr1.score(X_te, y_te):.2%}")
print("\nPer-class report:")
print(classification_report(y_te, lr1.predict(X_te), target_names=le1.classes_))

joblib.dump((lr1, le1), os.path.join(OUT_DIR, "stage1_condition.pkl"))
print("Stage 1 saved.")

# ── Stage 2: Per-condition severity classifiers ────────────────────────────
print("\n" + "="*50)
print("Training Stage 2: Severity Classifiers")
print("="*50)

severity_model_index = {}

for condition in sorted(le1.classes_):
    # Find all embeddings for this condition that have severity labels
    mask = np.array([
        get_condition(l) == condition and l.split("-")[-1] in SEVERITY
        for l in y_all
    ])

    if mask.sum() == 0:
        print(f"\n[{condition}] No severity variants — skipping")
        continue

    X_c = X_all[mask]
    y_c = np.array([l.split("-")[-1] for l in y_all[mask]])
    unique = np.unique(y_c)

    if len(unique) < 2:
        print(f"\n[{condition}] Only one severity class ({unique}) — skipping")
        continue

    print(f"\n[{condition}] {len(X_c)} samples, classes: {list(unique)}")

    le_c = LabelEncoder()
    y_c_enc = le_c.fit_transform(y_c)

    X_tr_c, X_te_c, y_tr_c, y_te_c = train_test_split(
        X_c, y_c_enc,
        test_size=0.2,
        random_state=42,
        stratify=y_c_enc
    )

    lr_c = LogisticRegression(
        max_iter=1000,
        random_state=42,
        class_weight="balanced"
    )
    lr_c.fit(X_tr_c, y_tr_c)

    train_acc = lr_c.score(X_tr_c, y_tr_c)
    test_acc  = lr_c.score(X_te_c, y_te_c)
    print(f"  Train: {train_acc:.2%} | Test: {test_acc:.2%}")
    print(classification_report(y_te_c, lr_c.predict(X_te_c), target_names=le_c.classes_))

    model_path = os.path.join(OUT_DIR, f"stage2_{condition}.pkl")
    joblib.dump((lr_c, le_c), model_path)
    severity_model_index[condition] = model_path
    print(f"  Saved: {model_path}")

# Save index of all severity models
joblib.dump(severity_model_index, os.path.join(OUT_DIR, "severity_model_index.pkl"))

# ── Summary ────────────────────────────────────────────────────────────────
print("\n" + "="*50)
print("DONE")
print("="*50)
print(f"Stage 1 conditions: {len(le1.classes_)}")
print(f"Stage 2 severity models trained: {len(severity_model_index)}")
print(f"Conditions with no severity model: {set(le1.classes_) - set(severity_model_index.keys())}")
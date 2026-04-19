import os
import re
import numpy as np
import random

CACHE_DIR = "../trained_data/cache"
MERGE_DIR = "../trained_data/merge_cache"
os.makedirs(MERGE_DIR, exist_ok=True)

merged = {}

for fname in os.listdir(CACHE_DIR):
    if not fname.startswith("cls_") or not fname.endswith(".npy"):
        continue

    label = fname[4:-4]
    base = re.sub(r"-(mild|moderate|severe)$", "", label)

    data = np.load(os.path.join(CACHE_DIR, fname), allow_pickle=True).item()

    if base not in merged:
        merged[base] = {"X": [], "y": []}

    merged[base]["X"].extend(data["X"])
    merged[base]["y"].extend([base] * len(data["X"]))

# cap milia only
MAX = 900
CAPS = {base: MAX for base in merged}
for base, cap in CAPS.items():
    if base in merged and len(merged[base]["X"]) > cap:
        indices = random.sample(range(len(merged[base]["X"])), cap)
        merged[base]["X"] = [merged[base]["X"][i] for i in indices]
        merged[base]["y"] = [merged[base]["y"][i] for i in indices]
        print(f"Capped {base} to {cap} embeddings")

for base, data in merged.items():
    out_path = os.path.join(MERGE_DIR, f"cls_{base}.npy")
    np.save(out_path, {"X": data["X"], "y": data["y"]})
    print(f"Merged → {base} ({len(data['X'])} embeddings)")

all_X, all_y = [], []
for base, data in merged.items():
    all_X.extend(data["X"])
    all_y.extend(data["y"])

np.save(os.path.join(MERGE_DIR, "embeddings.npy"), np.array(all_X))
np.save(os.path.join(MERGE_DIR, "labels.npy"), np.array(all_y))
print(f"Done. Total samples: {len(all_y)}")
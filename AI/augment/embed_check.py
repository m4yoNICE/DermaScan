import os
import numpy as np

CACHE_DIR = "../trained_data/cache"

label_counts = {}

for f in sorted(os.listdir(CACHE_DIR)):
    if not f.startswith("cls_") or not f.endswith(".npy"):
        continue
    label = f[4:-4]
    path = os.path.join(CACHE_DIR, f)
    data = np.load(path, allow_pickle=True).item()
    label_counts[label] = len(data["X"])

total = sum(label_counts.values())

print(f"{'Label':<50} {'Count':>6}")
print("-" * 58)
for label, count in sorted(label_counts.items()):
    print(f"{label:<50} {count:>6}")
print("-" * 58)
print(f"{'TOTAL':<50} {total:>6}")
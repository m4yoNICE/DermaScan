import numpy as np
import os

LABEL_PATH = "../trained_data/merge_cache/labels.npy"

y = np.load(LABEL_PATH)
unique, counts = zip(*sorted(zip(*np.unique(y, return_counts=True)), key=lambda x: x[1], reverse=True))

print(f"Total samples: {len(y)}\n")
for u, c in zip(unique, counts):
    print(f"  {u}: {c}")
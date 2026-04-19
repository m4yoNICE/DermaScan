import numpy as np

conditions = ["milia-mild", "milia-moderate", "milia-severe"]
total = 0
for c in conditions:
    data = np.load(f"../trained_data/cache/cls_{c}.npy", allow_pickle=True).item()
    count = len(data["X"])
    print(f"{c}: {count}")
    total += count
print(f"Total milia: {total}")
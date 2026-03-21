import os
import csv

DATA_DIR = "../dataset_system"
OUTPUT   = "../trained_data_backup/data_set_manifest.csv"

with open(OUTPUT, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["filename", "class_label", "extension"])

    for label in sorted(os.listdir(DATA_DIR)):
        folder = os.path.join(DATA_DIR, label)
        if not os.path.isdir(folder):
            continue
        for file in sorted(os.listdir(folder)):
            ext = os.path.splitext(file)[1].lower()
            if ext in {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}:
                writer.writerow([file, label, ext])

print(f"Done: {OUTPUT}")
import os
import csv

DATA_DIR = "../dataset_system"
OUTPUT   = "../trained_data_backup/dataset_manifest_system.csv"

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"}

with open(OUTPUT, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["filename", "class_label", "extension"])

    for root, dirs, files in os.walk(DATA_DIR):
        label = os.path.relpath(root, DATA_DIR)
        for file in sorted(files):
            ext = os.path.splitext(file)[1].lower()
            if ext in IMAGE_EXTS:
                writer.writerow([file, label, ext])

print("Done")
import os

DATA_DIR = "../training_data"

for label in sorted(os.listdir(DATA_DIR)):
    folder = os.path.join(DATA_DIR, label)
    if os.path.isdir(folder):
        count = len([f for f in os.listdir(folder)])
        print(f"{label}: {count}")
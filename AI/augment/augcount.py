import os
import hashlib

DIR = "../training_data"
FOLDERS = ["milia-mild", "milia-moderate", "milia-severe"]

def md5(filepath):
    h = hashlib.md5()
    with open(filepath, "rb") as f:
        h.update(f.read())
    return h.hexdigest()

deleted = 0

for folder_name in FOLDERS:
    folder_path = os.path.join(DIR, folder_name)
    seen = {}
    folder_deleted = 0

    for f in sorted(os.scandir(folder_path), key=lambda x: x.name):
        if not f.is_file():
            continue
        h = md5(f.path)
        if h in seen:
            os.remove(f.path)
            folder_deleted += 1
            deleted += 1
        else:
            seen[h] = f.name

    print(f"{folder_name}: deleted {folder_deleted} duplicates, {len(seen)} unique remaining")

print(f"\nTotal deleted: {deleted}")
import os

DIR = "../training_data"

for folder in os.scandir(DIR):
    if folder.is_dir():
        file_count = sum(1 for f in os.scandir(folder.path) if f.is_file())
        print(f"{folder.name}: {file_count} files")
import os, psutil, joblib, sys
sys.path.insert(0, "dermfoundation")

process = psutil.Process(os.getpid())
before = process.memory_info().rss / 1024 / 1024

from embedder import get_embedding  # this triggers model load

after_model = psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024

clf, le = joblib.load("trained_data/skin_classifier.pkl")

after_all = psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024

print(f"Derm Foundation RAM: {after_model - before:.2f} MB")
print(f"Classifier RAM: {after_all - after_model:.2f} MB")
print(f"Total process RAM: {after_all:.2f} MB")
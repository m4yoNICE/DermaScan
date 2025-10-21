# embedded code for skin_classifier prediction using Derm Foundation model and own datasets
import joblib
from datetime import datetime
import numpy as np
import os

# Load the Derm Foundation model cache
# For demonstration, i created a dummy cache with random embeddings and labels
embeddings = [np.random.rand(128), np.random.rand(128)]  # each embedding has 128 features
labels = ["acne", "eczema"]

cache = {"embeddings": embeddings, "labels": labels}

# Auto-name with date and time (e.g. skin_cache_2025-10-21_20-59.pkl)
filename = f"skin_cache_{datetime.now().strftime('%Y-%m-%d_%H-%M')}.pkl"

# Save the cache using joblib
joblib.dump(cache, filename)

print(f"✅ Cache saved as {filename}")
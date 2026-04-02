import numpy as np
import matplotlib.pyplot as plt
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../dermfoundation'))
from embedder import get_embedding

def visualize_embedding(image_path):
    emb = get_embedding(image_path)
    
    sampled = emb[::6]
    colors = ['#378ADD' if v >= 0 else '#D85A30' for v in sampled]
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8))
    
    ax1.bar(range(len(sampled)), sampled, color=colors, width=1.0)
    ax1.axhline(0, color='gray', linewidth=0.5)
    ax1.set_title(f'Embedding vector — {len(emb)} dimensions (sampled every 6th)')
    ax1.set_xlabel('Dimension index')
    ax1.set_ylabel('Activation value')
    
    ax2.hist(emb, bins=60, color='#378ADD', edgecolor='none')
    ax2.set_title('Value distribution across all 6,144 dimensions')
    ax2.set_xlabel('Value')
    ax2.set_ylabel('Count')
    
    plt.tight_layout()
    plt.savefig('embedding_visualization.png', dpi=150)
    plt.show()
    
    print(f"Dimensions: {len(emb)}")
    print(f"Min: {emb.min():.4f} | Max: {emb.max():.4f} | Mean: {emb.mean():.4f}")

if __name__ == "__main__":
    image_path = os.path.join(os.path.dirname(__file__), '../../documents/testimage/milia_mild_0346.jpg')
    visualize_embedding(image_path)
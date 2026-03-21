import os

files = os.listdir(".")
image_files = [f for f in files if f.lower().endswith((".jpg", ".jpeg", ".png"))]

print(f"Total files in current directory: {len(files)}")
print(f"Image files (jpg/jpeg/png): {len(image_files)}")
print(f"Original images (no _aug): {len([f for f in image_files if '_aug' not in f])}")
print(f"Augmented images (_aug): {len([f for f in image_files if '_aug' in f])}")

print("\nAll image files:")
for f in sorted(image_files):
    print(f"  {f}")
import os
import random
from PIL import Image, ImageOps, ImageEnhance, ImageFilter

# --- CONFIG ---
ZOOM_RANGE = (0.85, 1.15)
ROTATION_RANGE = (-15, 15)
BRIGHTNESS_RANGE = (0.85, 1.15)
CONTRAST_RANGE = (0.9, 1.1)
SATURATION_RANGE = (0.9, 1.1)
SHARPNESS_RANGE = (0.8, 1.2)
BLUR_PROB = 0.15
NOISE_PROB = 0.1

current_images = [f for f in os.listdir(".") if f.lower().endswith((".jpg", ".jpeg", ".png")) and "_aug" not in f]
print(f"Images in current directory: {len(current_images)}")
# CHANGE THIS TO YOUR ROOT FOLDER WITH ALL IMAGES
ROOT_FOLDER = "."  # or "C:/path/to/your/images"
AUG_PER_IMAGE = int(input("Augmentations per image: ").strip())

# ---------------

def random_zoom(img):
    w, h = img.size
    zoom_factor = random.uniform(*ZOOM_RANGE)
    if zoom_factor > 1.0:
        new_w = int(w / zoom_factor)
        new_h = int(h / zoom_factor)
        left = random.randint(0, max(1, w - new_w))
        top = random.randint(0, max(1, h - new_h))
        img = img.crop((left, top, left + new_w, top + new_h))
        img = img.resize((w, h), Image.LANCZOS)
    else:
        new_w = int(w * zoom_factor)
        new_h = int(h * zoom_factor)
        img_small = img.resize((new_w, new_h), Image.LANCZOS)
        new_img = Image.new("RGB", (w, h), (0, 0, 0))
        left = (w - new_w) // 2
        top = (h - new_h) // 2
        new_img.paste(img_small, (left, top))
        img = new_img
    return img

def add_noise(img):
    pixels = img.load()
    w, h = img.size
    for _ in range(int(w * h * 0.01)):
        x = random.randint(0, w-1)
        y = random.randint(0, h-1)
        r, g, b = pixels[x, y]
        noise = random.randint(-20, 20)
        pixels[x, y] = (
            max(0, min(255, r + noise)),
            max(0, min(255, g + noise)),
            max(0, min(255, b + noise))
        )
    return img

def augment_image(filepath):
    img = Image.open(filepath).convert("RGB")
    directory = os.path.dirname(filepath)
    filename = os.path.basename(filepath)
    
    for i in range(AUG_PER_IMAGE):
        aug = img.copy()
        
        if random.random() < 0.5:
            aug = ImageOps.mirror(aug)
        
        if random.random() < 0.3:
            aug = ImageOps.flip(aug)
        
        angle = random.uniform(*ROTATION_RANGE)
        aug = aug.rotate(angle, expand=False, resample=Image.BICUBIC, fillcolor=(0,0,0))
        
        aug = random_zoom(aug)
        
        brightness = random.uniform(*BRIGHTNESS_RANGE)
        enhancer = ImageEnhance.Brightness(aug)
        aug = enhancer.enhance(brightness)
        
        contrast = random.uniform(*CONTRAST_RANGE)
        enhancer = ImageEnhance.Contrast(aug)
        aug = enhancer.enhance(contrast)
        
        saturation = random.uniform(*SATURATION_RANGE)
        enhancer = ImageEnhance.Color(aug)
        aug = enhancer.enhance(saturation)
        
        sharpness = random.uniform(*SHARPNESS_RANGE)
        enhancer = ImageEnhance.Sharpness(aug)
        aug = enhancer.enhance(sharpness)
        
        if random.random() < BLUR_PROB:
            aug = aug.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.5, 1.5)))
        
        if random.random() < NOISE_PROB:
            aug = add_noise(aug)
        
        name, ext = os.path.splitext(filename)
        save_path = os.path.join(directory, f"{name}_aug{i+1}{ext}")
        aug.save(save_path)

# --- RECURSIVELY FIND ALL IMAGES ---
original_images = []
for root, dirs, files in os.walk(ROOT_FOLDER):
    for file in files:
        if file.lower().endswith((".jpg", ".jpeg", ".png")) and "_aug" not in file:
            original_images.append(os.path.join(root, file))

print(f"Found {len(original_images)} original images across all folders")
print(f"Generating {AUG_PER_IMAGE} augmentations per image...")

for filepath in original_images:
    augment_image(filepath)
    print(f"Processed: {filepath}")

total = len(original_images) * (AUG_PER_IMAGE + 1)
print(f"\nDone! Total images: {total}")
print(f"Original: {len(original_images)}, Augmented: {len(original_images) * AUG_PER_IMAGE}")
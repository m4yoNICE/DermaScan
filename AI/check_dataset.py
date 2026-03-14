"""
Validate YOLO dataset: check that images and labels are correctly paired.

YOLO requires: for each image at train/images/.../img.jpg there must be
a label at train/labels/.../img.txt (same relative path, .txt extension).

Run: python check_dataset.py
"""
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
DATASET_ROOT = SCRIPT_DIR / "datasets" / "skin_diseases" / "skin-diseases-segmentation-classification"

IMG_EXT = {".jpg", ".jpeg", ".png", ".bmp"}
TRAIN_IMG = DATASET_ROOT / "train" / "images"
TRAIN_LBL = DATASET_ROOT / "train" / "labels"
TEST_IMG = DATASET_ROOT / "test" / "images"
TEST_LBL = DATASET_ROOT / "test" / "labels"


def find_images(folder):
    if not folder.exists():
        return []
    return [f for f in folder.rglob("*") if f.is_file() and f.suffix.lower() in IMG_EXT]


def find_labels_flat(folder):
    if not folder.exists():
        return []
    return [f for f in folder.glob("*.txt")]

def find_labels_mirror(folder):
    if not folder.exists():
        return []
    return [f for f in folder.rglob("*.txt")]


def get_label_path(img_path, labels_dir, images_dir):
    """YOLO expects labels to mirror image path: images/a/b/x.jpg -> labels/a/b/x.txt"""
    rel = img_path.relative_to(images_dir)
    return labels_dir / rel.with_suffix(".txt")


def main():
    print("Dataset:", DATASET_ROOT)
    print("-" * 50)

    for split, img_dir, lbl_dir in [
        ("Train", TRAIN_IMG, TRAIN_LBL),
        ("Test", TEST_IMG, TEST_LBL),
    ]:
        images = find_images(img_dir)
        labels_flat = find_labels_flat(lbl_dir)
        labels_mirror = find_labels_mirror(lbl_dir)

        print(f"\n{split}:")
        print(f"  Images: {len(images)}")
        print(f"  Labels (flat): {len(labels_flat)}")
        print(f"  Labels (mirror structure): {len(labels_mirror)}")

        matched = 0
        missing = []
        for img in images[:100]:  # sample
            lbl = get_label_path(img, lbl_dir, img_dir)
            if lbl.exists():
                matched += 1
            else:
                missing.append(img.name)
        if images:
            pct = 100 * matched / min(100, len(images))
            print(f"  Matched (sample 100): {matched} ({pct:.0f}%)")
            if missing and len(missing) <= 5:
                print(f"  Missing labels for: {missing[:5]}...")

    print("\n" + "-" * 50)
    print("YOLO requires: train/labels/<same-path-as-image>/<samename>.txt")
    print("If images are in train/images/acne scar/x.jpg")
    print("  labels must be in train/labels/acne scar/x.txt")
    print("Fix: Restructure labels to mirror image paths, or rename images to match labels.")


if __name__ == "__main__":
    main()

"""
Train YOLOv8 on skin lesion dataset (ISIC/HAM10000 style).

Uses the makhresearch/skin-lesion-segmentation-classification dataset from Hugging Face
(9,547 images, 7 lesion classes, YOLO format). Alternatively, provide your own dataset path.

Requirements: pip install ultralytics requests

Usage:
    # Train with auto-downloaded dataset (from Hugging Face):
    python train_skin_yolo.py

    # Train with local YOLO-format dataset:
    python train_skin_yolo.py --data /path/to/dataset/data.yaml

    # Train with custom epochs/batch/device:
    python train_skin_yolo.py --epochs 20 --batch 16 --device 0

Output: AI/runs/detect/skin_lesion/weights/best.pt
Copy to AI/skin_yolov8n_seg.pt to use as the skin lesion detector.
"""
import argparse
import os
import re
import sys
from pathlib import Path

try:
    from ultralytics import YOLO
except ImportError:
    print("Install ultralytics: pip install ultralytics", file=sys.stderr)
    sys.exit(1)

SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_OUTPUT = SCRIPT_DIR / "runs" / "detect" / "skin_lesion"
HF_DATASET_URL = "https://huggingface.co/datasets/makhresearch/skin-lesion-segmentation-classification/resolve/main/skin-lesion-segmentation-classification.zip"


def download_dataset(output_dir: Path) -> Path:
    """Download and extract dataset from Hugging Face."""
    import requests
    from zipfile import ZipFile
    from io import BytesIO

    zip_path = output_dir / "skin_dataset.zip"
    output_dir.mkdir(parents=True, exist_ok=True)

    # Check for train/images in output_dir or nested folder
    def has_train(d):
        return (d / "train" / "images").exists()

    if has_train(output_dir):
        print(f"Dataset already exists at {output_dir}")
        return output_dir
    for sub in output_dir.iterdir():
        if sub.is_dir() and has_train(sub):
            print(f"Dataset found at {sub}")
            return sub

    print("Downloading skin lesion dataset from Hugging Face...")
    print("  (makhresearch/skin-lesion-segmentation-classification, ~9.5k images)")
    try:
        r = requests.get(HF_DATASET_URL, stream=True)
        r.raise_for_status()
        total = int(r.headers.get("content-length", 0))
        with open(zip_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    except Exception as e:
        print(f"Download failed: {e}", file=sys.stderr)
        print("Download manually from:", HF_DATASET_URL, file=sys.stderr)
        sys.exit(1)

    print("Extracting...")
    with ZipFile(zip_path) as zf:
        zf.extractall(output_dir)

    zip_path.unlink(missing_ok=True)
    # Find extracted root (train/valid may be in a nested folder)
    for root, _, _ in os.walk(output_dir):
        r = Path(root)
        if (r / "train" / "images").exists():
            print("Done.")
            return r
    print("Done.")
    return output_dir


def find_dataset_root(base_path: Path) -> Path:
    """Find dataset root (folder containing train/images)."""
    if (base_path / "train" / "images").exists():
        return base_path
    for sub in base_path.iterdir():
        if sub.is_dir() and (sub / "train" / "images").exists():
            return sub
    return base_path


def find_or_create_data_yaml(dataset_dir: Path) -> Path:
    """
    Find or create data.yaml. Handles:
    - skin_diseases/data.yaml (points to nested folder)
    - skin_diseases/skin-diseases-segmentation-classification/
    - train/ + test/ or valid/ or val/
    """
    dataset_dir = dataset_dir.resolve()
    root = find_dataset_root(dataset_dir)

    yaml_path = dataset_dir / "data.yaml"
    if yaml_path.exists():
        # Validate/update existing yaml if path is wrong
        try:
            text = yaml_path.read_text()
            # Update path and val to match actual structure
            new_path = str(root.absolute().as_posix())
            val_candidates = ["test", "valid", "val"]
            val_split = None
            for v in val_candidates:
                if (root / v / "images").exists():
                    val_split = f"{v}/images"
                    break
            if val_split:
                # Replace path: line
                text = re.sub(r"^path:.*$", f"path: {new_path}", text, flags=re.MULTILINE)
                if "val:" not in text and "val " not in text:
                    text = text.replace("train: train/images", f"train: train/images\nval: {val_split}")
                elif val_split:
                    text = re.sub(r"^val:.*$", f"val: {val_split}", text, flags=re.MULTILINE)
                yaml_path.write_text(text)
        except Exception:
            pass
        return yaml_path

    # Create new data.yaml in dataset_dir, path points to root
    val_candidates = ["test", "valid", "val"]
    val_split = "train/images"  # fallback
    for v in val_candidates:
        if (root / v / "images").exists():
            val_split = f"{v}/images"
            break

    classes = ["BKL", "NV", "DF", "MEL", "VASC", "BCC", "AKIEC"]
    content = f"""# Skin Lesion Detection - YOLO dataset config
path: {root.absolute().as_posix()}
train: train/images
val: {val_split}
names:
"""
    for i, c in enumerate(classes):
        content += f"  {i}: {c}\n"

    yaml_path.write_text(content)
    return yaml_path


def main():
    ap = argparse.ArgumentParser(description="Train YOLOv8 for skin lesion detection")
    ap.add_argument("--data", type=str, default=None, help="Path to data.yaml or dataset folder")
    ap.add_argument("--epochs", type=int, default=10)
    ap.add_argument("--batch", type=int, default=16)
    ap.add_argument("--imgsz", type=int, default=640)
    ap.add_argument("--device", type=str, default="", help="Device: '0' for GPU, 'cpu' for CPU, '' for auto (GPU if available, else CPU)")
    ap.add_argument("--model", type=str, default="yolov8n.pt", help="Base model (n/s/m/l/x)")
    ap.add_argument("--project", type=str, default=str(DEFAULT_OUTPUT.parent))
    ap.add_argument("--name", type=str, default="skin_lesion")
    args = ap.parse_args()

    if args.data:
        data_path = Path(args.data)
        if data_path.is_file():
            data_yaml = data_path
        else:
            data_yaml = find_or_create_data_yaml(data_path)
    else:
        dataset_dir = SCRIPT_DIR / "datasets" / "skin_diseases"
        data_yaml = find_or_create_data_yaml(dataset_dir)

    if not data_yaml.exists():
        print(f"data.yaml not found: {data_yaml}", file=sys.stderr)
        sys.exit(1)

    # device: '' or '0' = GPU if available; 'cpu' = CPU only
    device = args.device or None
    print(f"Training YOLOv8 on {data_yaml} (epochs={args.epochs}, device={'auto (GPU if available)' if not device else device})")
    model = YOLO(args.model)
    model.train(
        data=str(data_yaml),
        epochs=args.epochs,
        batch=args.batch,
        imgsz=args.imgsz,
        device=device,
        project=args.project,
        name=args.name,
    )

    best_pt = Path(args.project) / args.name / "weights" / "best.pt"
    print(f"\nTraining complete. Best model: {best_pt}")
    print(f"To use: copy to AI/skin_yolov8n_seg.pt")
    print(f"  copy \"{best_pt}\" \"{SCRIPT_DIR / 'skin_yolov8n_seg.pt'}\"")


if __name__ == "__main__":
    main()

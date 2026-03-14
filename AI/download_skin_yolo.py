"""
Download pre-trained skin lesion YOLO model from Hugging Face.

Model: skin_yolov8n-seg_800.pt
Source: jags/yolov8_model_segmentation-set (trained on skin/lesion data)
Format: YOLOv8 nano segmentation (also outputs detection boxes - compatible with our pipeline)

Usage:
    python download_skin_yolo.py

Output: AI/skin_yolov8n_seg.pt
"""
import os
import urllib.request
import sys

HF_REPO = "jags/yolov8_model_segmentation-set"
HF_FILE = "skin_yolov8n-seg_800.pt"
OUTPUT_NAME = "skin_yolov8n_seg.pt"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(SCRIPT_DIR, OUTPUT_NAME)
URL = f"https://huggingface.co/{HF_REPO}/resolve/main/{HF_FILE}"


def main():
    if os.path.exists(OUTPUT_PATH):
        print(f"Skin YOLO model already exists: {OUTPUT_PATH}")
        print("Delete it and re-run to re-download.")
        return 0

    print(f"Downloading skin lesion YOLO model from Hugging Face...")
    print(f"  {HF_REPO}/{HF_FILE}")
    print(f"  -> {OUTPUT_PATH}")

    try:
        urllib.request.urlretrieve(URL, OUTPUT_PATH)
        size_mb = os.path.getsize(OUTPUT_PATH) / (1024 * 1024)
        print(f"Done. Model saved ({size_mb:.1f} MB)")
        print("\nThe server will use this model automatically (preferred over yolov8n.pt)")
        return 0
    except Exception as e:
        print(f"Download failed: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())

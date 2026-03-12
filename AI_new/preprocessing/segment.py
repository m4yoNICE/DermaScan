import cv2
import numpy as np
 
 
def segment_skin_color_array(img_bgr: np.ndarray):
    """
    Accepts a BGR numpy array (from OpenCV or converted from PIL).
    Returns (segmented_img, mask) as numpy arrays.
    Falls back to original image if segmentation yields empty result.
    """
    if img_bgr is None or img_bgr.size == 0:
        return None, None
 
    hsv   = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    ycrcb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2YCrCb)
 
    # HSV skin range
    mask_hsv = cv2.inRange(
        hsv,
        np.array([0,  20,  70], dtype=np.uint8),
        np.array([20, 255, 255], dtype=np.uint8)
    )
 
    # YCrCb skin range
    mask_ycrcb = cv2.inRange(
        ycrcb,
        np.array([0,   135, 85],  dtype=np.uint8),
        np.array([255, 180, 135], dtype=np.uint8)
    )
 
    skin_mask = cv2.bitwise_and(mask_hsv, mask_ycrcb)
 
    # Morphological cleanup
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
    skin_mask = cv2.erode(skin_mask,  kernel, iterations=2)
    skin_mask = cv2.dilate(skin_mask, kernel, iterations=2)
    skin_mask = cv2.GaussianBlur(skin_mask, (3, 3), 0)
 
    skin_only = cv2.bitwise_and(img_bgr, img_bgr, mask=skin_mask)
 
    # Crop to bounding box of skin region
    coords = cv2.findNonZero(skin_mask)
    if coords is not None:
        x, y, w, h = cv2.boundingRect(coords)
        skin_only = skin_only[y:y+h, x:x+w]
    else:
        # Segmentation found nothing — fall back to original
        # This prevents returning a black image to Derm Foundation
        print("[segment] WARNING: no skin region found, using original image")
        skin_only = img_bgr
 
    return skin_only, skin_mask
 
 
def segment_pil_image(pil_img):
    """
    Convenience wrapper: accepts a PIL RGB image, returns segmented PIL RGB image.
    """
    from PIL import Image
 
    img_bgr = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    segmented_bgr, _ = segment_skin_color_array(img_bgr)
 
    if segmented_bgr is None:
        return pil_img  # fallback
 
    return Image.fromarray(cv2.cvtColor(segmented_bgr, cv2.COLOR_BGR2RGB))
 
 
# ── Test ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    path = sys.argv[1] if len(sys.argv) > 1 else "test.jpg"
    img = cv2.imread(path)
    if img is None:
        print(f"Could not read: {path}")
        raise SystemExit(1)
 
    result, mask = segment_skin_color_array(img)
    cv2.imwrite("skin_segmented.jpg", result)
    print("Saved: skin_segmented.jpg")
    
    #show images para testing
    cv2.imshow("Original", img)
    cv2.imshow("Mask", mask)
    cv2.imshow("Segmented", result)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
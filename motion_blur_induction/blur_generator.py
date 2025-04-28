import cv2
import numpy as np

def create_asymmetric_motion_kernel(size=50, angle_deg=None, direction=None,
                                    forward_weight=1.0, backward_weight=0.3):
    """
    Creates a motion blur kernel for a given direction or angle.
    Allows asymmetric blur by adjusting forward and backward weights.
    """
    if direction and angle_deg is None:
        direction = direction.lower()
        direction_map = {
            'right': 180,
            'down': 270,
            'left': 0,
            'up': 90
        }
        if direction not in direction_map:
            raise ValueError(f"Unknown direction: {direction}")
        angle_deg = direction_map[direction]

    if angle_deg is None:
        raise ValueError("Must provide either angle_deg or direction")

    kernel = np.zeros((size, size), dtype=np.float32)
    center = size // 2

    angle_rad = np.deg2rad(angle_deg)
    dx = np.cos(angle_rad)
    dy = np.sin(angle_rad)

    for i in range(center):
        x = int(center + i * dx)
        y = int(center + i * dy)
        if 0 <= x < size and 0 <= y < size:
            kernel[y, x] = forward_weight

    for i in range(center):
        x = int(center - i * dx)
        y = int(center - i * dy)
        if 0 <= x < size and 0 <= y < size:
            kernel[y, x] += backward_weight

    kernel /= kernel.sum()
    return kernel

def apply_blur_to_roi(img, roi, kernel):
    x, y, w, h = roi
    if w == 0 or h == 0:
        print("ROI has zero width or height. Skipping blur.")
        return img

    roi_img = img[y:y+h, x:x+w]
    blurred_roi = cv2.filter2D(roi_img, -1, kernel)
    img[y:y+h, x:x+w] = blurred_roi
    return img


def resize_image_preserve_aspect(img, short_side=224):
    """
    Resize an image so that its shorter side is `short_side`, preserving aspect ratio.
    """
    h, w = img.shape[:2]
    if h < w:
        scale = short_side / h
    else:
        scale = short_side / w

    new_w = int(w * scale)
    new_h = int(h * scale)

    resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
    return resized


def select_roi_and_apply_blur(image_path, out_name, direction=None, angle_deg=None, kernel_size=50, save_output=True):
    """
    Lets user select ROI via GUI and applies asymmetric motion blur at a specified direction or angle.
    """
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError("Could not read image.")
    
    img = resize_image_preserve_aspect(img, short_side=224)

    print("Select the region to apply blur. Press ENTER or SPACE to confirm, ESC to cancel.")
    roi = cv2.selectROI("Select ROI", img, showCrosshair=True, fromCenter=False)
    cv2.destroyWindow("Select ROI")

    if sum(roi) == 0:
        print("No ROI selected. Exiting.")
        return

    kernel = create_asymmetric_motion_kernel(size=kernel_size, direction=direction, angle_deg=angle_deg)
    blurred_img = apply_blur_to_roi(img.copy(), roi, kernel)

    cv2.imshow("Blurred ROI", blurred_img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    if save_output:
        cv2.imwrite(f"blurred/{out_name}", blurred_img)
        print("Blurred image saved as 'blurred_output.png'.")

# --- Usage Examples ---

# Use a named direction:
select_roi_and_apply_blur("sporlab-1r9Y9hEUAgA-unsplash.jpg", out_name='21.png', direction='left', kernel_size=20)

# Use a custom angle (e.g. 33 degrees):
# select_roi_and_apply_blur("nba-sees-rise-in-acts.jpg", angle_deg=33, kernel_size=50)

import cv2
import numpy as np

def create_motion_blur_kernel(size, direction='horizontal'):
    kernel = np.zeros((size, size), dtype=np.float32)

    if direction == 'horizontal':
        kernel[int((size - 1) / 2), :] = np.ones(size)
    elif direction == 'vertical':
        kernel[:, int((size - 1) / 2)] = np.ones(size)
    elif direction == '45':
        np.fill_diagonal(kernel, 1)
    elif direction == '135':
        kernel = np.fliplr(kernel)
        np.fill_diagonal(kernel, 1)
    else:
        raise ValueError("Direction must be 'horizontal', 'vertical', '45', or '135'")

    kernel /= kernel.sum()
    return kernel

def apply_local_motion_blur(image_path, x1, y1, x2, y2, kernel_size=30, direction='horizontal'):
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Couldn't load image at: {image_path}")

    roi = img[y1:y2, x1:x2]
    kernel = create_motion_blur_kernel(kernel_size, direction)
    blurred_roi = cv2.filter2D(roi, -1, kernel)
    img[y1:y2, x1:x2] = blurred_roi

    return img

# --- Example Usage ---

# Define your ROI and parameters
x1, y1, x2, y2 = 30, 30, 750, 700
kernel_size = 50
direction = 'horizontal'  # Options: 'horizontal', 'vertical', '45', '135'

# Apply the blur
output = apply_local_motion_blur("nba-sees-rise-in-acts.jpg", x1, y1, x2, y2, kernel_size, direction)

# Display the result
cv2.imshow("Locally Blurred", output)
cv2.imwrite('out_imag.jpg', output)

cv2.waitKey(0)
cv2.destroyAllWindows()
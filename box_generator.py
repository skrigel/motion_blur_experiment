import cv2
import os

# Load the image
image_path = "src/assets/03_blur.png"
image = cv2.imread(image_path)
base = os.path.basename(image_path)
# Check if the image is loaded correctly
if image is None:
    print("Error loading image. Please check the file path and ensure the image exists.")
else:
    # Ensure the image dimensions are valid
    if image.shape[0] == 0 or image.shape[1] == 0:
        print("Error: Image has invalid dimensions (width and height must be greater than 0).")
    else:
        # Display the image and let the user select the ROI
        bbox = cv2.selectROI("Select Object", image, fromCenter=False, showCrosshair=True)
        
        # If a valid selection is made
        if bbox != (0, 0, 0, 0):
            print(f"Selected ROI: {bbox}")
            
            # Draw the rectangle on the image
            x, y, w, h = bbox
            image_with_bbox = image.copy()
            cv2.rectangle(image_with_bbox, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            # Save the image with the bounding box
            output_path = f"new_{base}"
            cv2.imwrite(output_path, image_with_bbox)
            print(f"Image saved as {output_path}")
            
            # Display the image with the selected bounding box
            cv2.imshow("Selected ROI", image_with_bbox)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
        else:
            print("No selection made.")

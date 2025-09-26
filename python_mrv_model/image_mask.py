import cv2
import numpy as np
import requests
import sys
import os 

def process_and_send(image_path, mission_id):
    original_image = cv2.imread(image_path)
    if original_image is None:
        print(f"❌ Error: Could not load image from {image_path}")
        return

    print(f"Processing image: {image_path} for mission: {mission_id}")
    hsv_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2HSV)

    lower_green = np.array([30, 30, 30])
    upper_green = np.array([85, 255, 255])
    mask = cv2.inRange(hsv_image, lower_green, upper_green)

    output_dir = 'outputs'
    os.makedirs(output_dir, exist_ok=True)

    base_filename = os.path.splitext(os.path.basename(image_path))[0]
    mask_filename = f"{base_filename}_mask.png"
    result_filename = f"{base_filename}_result.png"

    mask_filepath = os.path.join(output_dir, mask_filename)
    result_filepath = os.path.join(output_dir, result_filename)

    result_image = cv2.bitwise_and(original_image, original_image, mask=mask)

    cv2.imwrite(mask_filepath, mask)
    cv2.imwrite(result_filepath, result_image)
    print(f"✅ Mask image saved to: {mask_filepath}")
    print(f"✅ Result image saved to: {result_filepath}")


    total_pixels = original_image.shape[0] * original_image.shape[1]
    canopy_pixels = cv2.countNonZero(mask)
    canopy_coverage = (canopy_pixels / total_pixels) * 100
    print(f"Canopy Coverage Calculated: {canopy_coverage:.2f}%")

    # # --- Step 5: Send Data to Express Backend ---
    # print("\nAttempting to send data to the Express backend...")
    # backend_url = 'http://localhost:3000/api/mrv/report'

    # payload = {
    #     'missionId': mission_id,
    #     'canopyCoverage': round(canopy_coverage, 2),
    #     'sourceImage': image_path,
    #     'maskImage': mask_filepath, # Include path to the mask for reference
    #     'resultImage': result_filepath
    # }

    # try:
    #     response = requests.post(backend_url, json=payload)
    #     response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        
    #     print("✅ Data successfully sent to the backend.")
    #     print("Server response:", response.json())

    # except requests.exceptions.RequestException as e:
    #     print(f"❌ Error sending data to backend: {e}")
    #     print("Please ensure your Express server is running and accessible.")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        img_path_arg = sys.argv[1]
        mission_id_arg = sys.argv[2]
        process_and_send(img_path_arg, mission_id_arg)
    else:
        print("Usage: python process_image.py <image_path> <mission_id>")
        print("Running with default values...")
        process_and_send('images/111335_sat_00.jpg', 'MISSION-DEFAULT-001')


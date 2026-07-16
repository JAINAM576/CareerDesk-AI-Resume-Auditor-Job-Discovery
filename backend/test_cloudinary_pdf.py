import cloudinary
import cloudinary.uploader
import requests
import sys

# Configure Cloudinary credentials
cloudinary.config(
    cloud_name="xhxpekfr",
    api_key="358446936559248",
    api_secret="JZVYUc7meBZDgFOErnEbSB3zt3Q",
    secure=True
)

try:
    print("Uploading test PDF raw file...")
    res = cloudinary.uploader.upload(
        b"%PDF-1.5 test pdf content",
        resource_type="raw",
        public_id="test_pdf_file.pdf"
    )
    url = res.get("secure_url")
    print("Upload successful! URL:", url)
    
    print("\nFetching the uploaded PDF URL from Python...")
    response = requests.get(url)
    print("HTTP Status Code:", response.status_code)
    print("Response Headers:")
    for k, v in response.headers.items():
        print(f"  {k}: {v}")
except Exception as e:
    print("Error during test:", e)
    sys.exit(1)

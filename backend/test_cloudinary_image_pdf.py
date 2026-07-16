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
    print("Uploading test PDF as IMAGE resource type...")
    # Cloudinary can parse and convert PDFs as image resource type
    # We must provide a valid PDF header and dummy structure so Cloudinary doesn't fail parsing it
    # We will upload a tiny valid 1-page PDF
    valid_pdf = (
        b"%PDF-1.4\n"
        b"1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
        b"2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
        b"3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\n"
        b"xref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000103 00000 n\n"
        b"trailer<</Size 4/Root 1 0 R>>\nstartxref\n173\n%%EOF"
    )
    
    res = cloudinary.uploader.upload(
        valid_pdf,
        resource_type="image",
        public_id="test_pdf_image.pdf"
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

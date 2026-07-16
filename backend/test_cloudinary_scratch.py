import cloudinary
import cloudinary.uploader
import sys

# Configure Cloudinary credentials
cloudinary.config(
    cloud_name="xhxpekfr",
    api_key="358446936559248",
    api_secret="JZVYUc7meBZDgFOErnEbSB3zt3Q",
    secure=True
)

try:
    print("Starting test upload...")
    # Upload a tiny dummy text file content as raw
    res = cloudinary.uploader.upload(
        b"Hello world, testing upload delivery type.",
        resource_type="raw",
        public_id="test_raw_file"
    )
    print("\nUPLOAD SUCCESSFUL!")
    print("Secure URL:", res.get("secure_url"))
    print("\nFull response metadata:")
    for k, v in res.items():
        print(f"  {k}: {v}")
except Exception as e:
    print("\nUPLOAD FAILED:", e)
    sys.exit(1)

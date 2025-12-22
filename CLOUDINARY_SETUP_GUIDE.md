# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Get Your Credentials
1. Log in to your Cloudinary dashboard
2. Navigate to **Dashboard** → **Account Settings** → **API Keys**
3. Copy the following values:
   - **Cloud Name** (e.g., "doacgjnss")
   - **API Key** (e.g., "582461629287772")
   - **API Secret** (e.g., "jDFLUWERAVkROnEtARd-nxxKW_k")

## Step 3: Update Environment Variables
Replace the values in `/server/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key  
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## Step 4: Restart the Server
```bash
cd /home/ad/Documents/LMS/server
npm run dev
```

## Step 5: Test Upload
```bash
curl -X POST http://localhost:5000/media/upload -F "file=@test-image.png"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "public_id": "lms_uploads/filename_1234567890",
    "secure_url": "https://res.cloudinary.com/your_cloud/image/upload/v1234567890/lms_uploads/filename_1234567890.jpg",
    "url": "https://res.cloudinary.com/your_cloud/image/upload/v1234567890/lms_uploads/filename_1234567890.jpg",
    "resource_type": "image",
    "format": "png",
    "width": 800,
    "height": 600,
    "bytes": 12345
  },
  "message": "File uploaded successfully"
}
```

## Free Tier Limits
- **Storage**: 10GB
- **Bandwidth**: 25GB/month  
- **Transformations**: 25,000/month
- **Requests**: 25,000/month

This should be sufficient for development and small production deployments.
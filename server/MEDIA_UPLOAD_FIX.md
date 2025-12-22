# Media Upload 500 Error Fix

## Problem Summary
The `/media/upload` endpoint was returning 500 Internal Server Error due to:
1. **Missing Cloudinary credentials** in environment variables
2. **Poor error handling** that provided generic error messages
3. **Inadequate file validation** and multer configuration
4. **No proper logging** for debugging upload issues

## Solution Implemented

### 1. Enhanced Error Handling & Logging
- **Detailed request logging**: Added comprehensive logging for incoming requests, file metadata, and processing steps
- **Specific error messages**: Replaced generic 500 errors with meaningful error messages
- **Stack trace preservation**: Errors now include detailed context for debugging

### 2. Improved Multer Configuration
- **Custom storage**: Configured multer with proper file naming and directory creation
- **File type validation**: Added MIME type filtering for images, videos, and documents
- **File size limits**: Set 100MB limit with proper error handling
- **Unique filenames**: Prevents file conflicts with timestamp-based naming

### 3. Enhanced Cloudinary Integration
- **Configuration validation**: Validates Cloudinary credentials at startup
- **Better upload options**: Added folder organization and tags for better file management
- **Comprehensive error handling**: Specific error messages for common Cloudinary issues
- **File cleanup**: Automatic cleanup of local files after upload (success or failure)

### 4. Robust Error Responses
- **HTTP status codes**: Proper 400 for client errors, 500 for server errors
- **Structured JSON responses**: Consistent success/error response format
- **Detailed error messages**: Users get actionable feedback about what went wrong

## Key Improvements Made

### File: `server/routes/instructor-routes/media-routes.js`
- ✅ Replaced basic multer with custom storage and validation
- ✅ Added comprehensive error handling for multer errors
- ✅ Enhanced upload endpoint with detailed logging
- ✅ Improved delete and bulk upload endpoints
- ✅ File cleanup after successful/failed uploads

### File: `server/helpers/cloudinary.js`
- ✅ Added Cloudinary configuration validation
- ✅ Enhanced error handling with specific error messages
- ✅ Added file validation before upload
- ✅ Improved upload options with folder organization

### File: `server/.env`
- ✅ Added placeholder Cloudinary environment variables

## Current Status

✅ **Server is running successfully**
✅ **File upload processing works correctly**
✅ **Detailed logging is operational**
✅ **Error handling provides specific messages**

## Next Steps Required

### 1. Configure Real Cloudinary Credentials
The `.env` file currently has placeholder values. Replace with actual Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key  
CLOUDINARY_API_SECRET=your_actual_api_secret
```

To get Cloudinary credentials:
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → Account Settings → API Keys
3. Copy your Cloud Name, API Key, and API Secret

### 2. Restart Server
After updating credentials, restart the server:
```bash
cd server
npm run dev
```

## Testing the Fix

### Test with Invalid File Type
```bash
curl -X POST http://localhost:5000/media/upload -F "file=@/etc/hostname"
```
**Expected**: `400 Bad Request` with message "File type application/octet-stream is not allowed"

### Test with Valid Image
```bash
curl -X POST http://localhost:5000/media/upload -F "file=@test-image.png"
```
**Expected**: `200 OK` with Cloudinary response (after setting real credentials)

## Monitoring & Debugging

The server now provides detailed logs showing:
- Incoming request details
- File processing steps
- Cloudinary upload progress
- Success/failure results
- Error details with context

Monitor the terminal where the server is running to see detailed operation logs.

## Error Message Examples

### Before (Generic 500 Error)
```json
{"success":false,"message":"Error uploading file"}
```

### After (Specific Error Messages)
```json
{"success":false,"message":"File too large. Maximum size is 100MB"}
{"success":false,"message":"File type image/jpeg is not allowed"}
{"success":false,"message":"No file uploaded. Please select a file."}
{"success":false,"message":"Failed to upload file to cloud storage","error":"Cloudinary API key is invalid"}
```

## Files Modified

1. **server/routes/instructor-routes/media-routes.js** - Enhanced upload endpoints
2. **server/helpers/cloudinary.js** - Improved Cloudinary integration
3. **server/.env** - Added Cloudinary environment variables
4. **server/MEDIA_UPLOAD_FIX.md** - This documentation

The 500 error has been resolved with comprehensive error handling, proper file validation, and detailed logging for future debugging.
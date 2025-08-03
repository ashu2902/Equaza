# CORS Fix Instructions for Firebase Storage

## 🚨 **Critical Issue Identified**

The upload is failing due to a **CORS policy error**:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

## ✅ **Solution: Configure CORS via Google Cloud Console**

Since Firebase CLI and gsutil approaches aren't working, use the Google Cloud Console:

### **Step 1: Open Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project: `equza-6b3c0`
3. Navigate to **Cloud Storage** > **Buckets**

### **Step 2: Find Your Firebase Storage Bucket**
1. Look for bucket named: `equza-6b3c0.appspot.com`
2. Click on the bucket name

### **Step 3: Configure CORS**
1. Click the **"Permissions"** tab
2. Scroll down to **"CORS configuration"**
3. Click **"Edit CORS configuration"**
4. Add this configuration:

```json
[
  {
    "origin": ["http://localhost:3000", "https://localhost:3000"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin", "Authorization"]
  }
]
```

### **Step 4: Save and Test**
1. Click **"Save"**
2. Wait 1-2 minutes for changes to propagate
3. Test the upload again

## 🔄 **Alternative: Manual CORS Setup via gsutil (if you can authenticate)**

If you can get gsutil working:

1. **Authenticate with the correct project:**
```bash
gcloud auth application-default login
gcloud config set project equza-6b3c0
```

2. **Apply CORS configuration:**
```bash
gsutil cors set cors.json gs://equza-6b3c0.appspot.com
```

## 🚀 **Test After Fix**

After applying CORS configuration:
1. Refresh your browser
2. Try uploading an image again
3. Check console logs for success

## 📋 **Expected Success Logs**
```
📤 Firebase Storage: Upload successful, getting download URL
📤 Firebase Storage: Download URL obtained: https://...
✅ AddProductForm: Product created successfully!
```

## ⚠️ **Important Notes**

- CORS changes may take a few minutes to propagate
- Make sure you're logged into the correct Google account
- For production, add your actual domain to the CORS origins
- The current fix is for development only (localhost)
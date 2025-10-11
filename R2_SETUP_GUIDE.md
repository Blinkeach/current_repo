# Cloudflare R2 Setup Guide

## How to Get Your R2 Credentials

### Step 1: Find Your Cloudflare Account ID

1. Log in to your Cloudflare dashboard: https://dash.cloudflare.com
2. Navigate to **R2** from the left sidebar
3. Look at the URL in your browser - it will be: `https://dash.cloudflare.com/{ACCOUNT_ID}/r2`
4. The `{ACCOUNT_ID}` in the URL is your **Cloudflare Account ID**
   - Example: If URL is `https://dash.cloudflare.com/abc123def456/r2`
   - Then your Account ID is: `abc123def456`

### Step 2: Create R2 API Token

1. In the R2 dashboard, click on **"Manage R2 API Tokens"**
2. Click **"Create API Token"**
3. Give it a name (e.g., "Blinkeach App Token")
4. Set permissions:
   - **Object Read & Write** (or Admin Read & Write for full access)
5. Click **"Create API Token"**
6. You'll see:
   - **Access Key ID** (looks like: `abc123def456ghi789`)
   - **Secret Access Key** (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`)
   
   ⚠️ **IMPORTANT**: Copy both keys immediately - the Secret Access Key won't be shown again!

### Step 3: Get Your Bucket Information

1. In R2 dashboard, click on your bucket name (e.g., "blinkeach")
2. Look for the **Bucket Details** section
3. You'll see:
   - **Bucket Name**: `blinkeach`
   - **S3 API Endpoint**: This is what you need for R2_ACCOUNT_ID in the endpoint URL

### Step 4: Configure Public Access (Optional but Recommended)

1. In your bucket settings, go to **Settings** tab
2. Scroll to **Public Access**
3. Click **"Allow Access"** or **"Connect Domain"**
4. If using R2.dev subdomain:
   - Enable **"Allow Access"**
   - You'll get a URL like: `https://pub-xxxxx.r2.dev`
5. If using custom domain:
   - Click **"Connect Domain"**
   - Follow the steps to connect your domain
   - You'll get a URL like: `https://cdn.yourdomain.com`

### Step 5: Update Your .env File

Based on the information you gathered, update your `.env` file:

```env
# Cloudflare R2 Storage Configuration
R2_ACCOUNT_ID=your_actual_account_id_here          # From Step 1 (URL Account ID)
R2_ACCESS_KEY_ID=your_access_key_id_here           # From Step 2
R2_SECRET_ACCESS_KEY=your_secret_access_key_here   # From Step 2
R2_BUCKET_NAME=blinkeach                           # Your bucket name
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev             # From Step 4 (or your custom domain)
```

## Common Issues and Solutions

### Issue 1: "getaddrinfo ENOTFOUND" Error

**Cause**: The R2_ACCOUNT_ID is incorrect or the endpoint URL is malformed.

**Solution**: 
- Verify your Account ID from the Cloudflare dashboard URL
- The endpoint should be: `https://{ACCOUNT_ID}.r2.cloudflarestorage.com`
- Make sure you're using the Account ID from the dashboard URL, not from the public bucket URL

### Issue 2: "InvalidAccessKeyId" Error

**Cause**: The Access Key ID is incorrect.

**Solution**:
- Double-check the Access Key ID from your R2 API Token
- Make sure there are no extra spaces or characters
- Try creating a new API token if the issue persists

### Issue 3: "SignatureDoesNotMatch" Error

**Cause**: The Secret Access Key is incorrect.

**Solution**:
- Verify the Secret Access Key is copied correctly
- If you lost the original key, create a new API token
- Ensure there are no line breaks or spaces in the key

### Issue 4: "NoSuchBucket" Error

**Cause**: The bucket name is incorrect or doesn't exist.

**Solution**:
- Verify the bucket name in your R2 dashboard
- Bucket names are case-sensitive
- Make sure the bucket exists in the same account

### Issue 5: Files Upload but Can't Access Them

**Cause**: Public access is not enabled on the bucket.

**Solution**:
- Enable public access in bucket settings (Step 4 above)
- Or use presigned URLs for private access
- Update R2_PUBLIC_URL with the correct public domain

## Example Configuration

Here's an example of what your configuration might look like:

```env
# Example - Replace with your actual values
R2_ACCOUNT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
R2_ACCESS_KEY_ID=abc123def456ghi789jkl012mno345pqr678
R2_SECRET_ACCESS_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
R2_BUCKET_NAME=blinkeach
R2_PUBLIC_URL=https://pub-1234567890abcdef.r2.dev
```

## Testing Your Configuration

After updating your `.env` file, run the test script:

```bash
node test-r2-connection.js
```

You should see:
```
✅ R2 credentials found in .env
✅ Successfully connected to R2!
✅ Test file uploaded successfully!
🎉 All tests passed!
```

If you see errors, refer to the "Common Issues" section above.

## Directory Structure in Your R2 Bucket

After successful setup, your files will be organized as:

```
blinkeach/
├── invoices/
│   ├── {uuid}-invoice.pdf
│   └── {uuid}-invoice.pdf
├── carousel-images/
│   ├── {uuid}-banner1.jpg
│   └── {uuid}-banner2.png
├── products/
│   ├── {uuid}-product1.jpg
│   └── {uuid}-product2.webp
├── images/
│   └── {uuid}-image.jpg
└── models/
    └── {uuid}-model.glb
```

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Rotate API tokens** regularly (every 90 days recommended)
3. **Use separate tokens** for development and production
4. **Enable bucket versioning** for important files
5. **Set up CORS rules** if accessing from browser directly
6. **Monitor usage** in Cloudflare dashboard

## Need Help?

If you're still having issues:

1. Check the Cloudflare R2 documentation: https://developers.cloudflare.com/r2/
2. Verify all credentials are from the same Cloudflare account
3. Try creating a new API token with full permissions
4. Check if your Cloudflare account has R2 enabled
5. Contact Cloudflare support if issues persist

---

**Next Steps After Setup**:
1. Run `node test-r2-connection.js` to verify connection
2. Restart your application server
3. Test file uploads from admin panel
4. Monitor R2 usage in Cloudflare dashboard
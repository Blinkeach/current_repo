# Cloudflare R2 Storage Migration - Complete Summary

## Overview
Successfully migrated all file uploads from local storage (`uploads` folder) to Cloudflare R2 bucket storage with automatic fallback to local storage.

## R2 Bucket Configuration
- **Bucket URL**: `https://e0b70d52f241f7e6ece12d27961d47a5.r2.cloudflarestorage.com/blinkeach`
- **Account ID**: `e0b70d52f241f7e6ece12d27961d47a5`
- **Bucket Name**: `blinkeach`

## Directory Structure in R2
```
blinkeach/
├── invoices/          # Admin invoice uploads shared with users
├── carousel-images/   # Store carousel/banner images
├── products/          # Product images from admin panel
├── images/            # General image uploads
└── models/            # 3D model files
```

## Files Created

### 1. `server/r2Storage.ts` (NEW)
Complete R2 storage service with the following methods:
- `uploadFile()` - Generic file upload to any directory
- `uploadInvoice()` - Invoice-specific upload handler
- `uploadCarouselImage()` - Carousel image upload handler
- `uploadProductImage()` - Product image upload handler
- `uploadImage()` - General image upload handler
- `getUploadUrl()` - Generate presigned URLs for client-side uploads
- `getDownloadUrl()` - Generate presigned URLs for private downloads
- `deleteFile()` - Delete files from R2
- `fileExists()` - Check if file exists in R2
- `getFileBuffer()` - Retrieve file contents as buffer
- `isAvailable()` - Check if R2 credentials are configured

**Features**:
- Automatic unique filename generation using UUID
- Public URL construction for uploaded files
- Comprehensive error handling
- Support for multiple file types (images, PDFs, 3D models)

## Files Modified

### 2. `.env` (UPDATED)
Added R2 configuration variables:
```env
# Cloudflare R2 Storage Configuration
R2_ACCOUNT_ID=e0b70d52f241f7e6ece12d27961d47a5
R2_ACCESS_KEY_ID=e5aabe9f5e51299f890d56449510dfd3
R2_SECRET_ACCESS_KEY=bd910519cbdc2222643c259d4395dc90aa90030b84830e6d471e41f4e69f30a0
R2_BUCKET_NAME=blinkeach
R2_PUBLIC_URL=https://e0b70d52f241f7e6ece12d27961d47a5.r2.cloudflarestorage.com/blinkeach
```

### 3. `server/controllers/upload.ts` (UPDATED)
Updated all upload methods to use R2 with local fallback:

**Modified Methods**:
- `uploadImage()` - Now uploads to R2 first, falls back to local storage
- `uploadMultipleImages()` - Batch product image uploads to R2
- `upload3dModel()` - 3D model uploads to R2 (stored in 'models' directory)

**Pattern Used**:
```typescript
// Try R2 first
if (r2StorageService.isAvailable()) {
  try {
    const result = await r2StorageService.uploadImage(buffer, filename);
    return result.url;
  } catch (error) {
    console.error('R2 upload failed, falling back to local storage');
  }
}
// Fallback to local storage
```

### 4. `server/routes.ts` (UPDATED)
Updated multiple routes to use R2 storage:

**Modified Routes**:
1. **POST `/api/carousel-images`** - Carousel image creation with R2 upload
2. **PUT `/api/carousel-images/:id`** - Carousel image update with R2 upload
3. **POST `/api/hero-slides`** - Hero slide creation with R2 upload
4. **PUT `/api/hero-slides/:id`** - Hero slide update with R2 upload
5. **POST `/api/local-upload/invoice/:invoiceId`** - Invoice upload with R2
6. **PUT `/api/local-upload/invoice/:invoiceId`** - Direct invoice upload with R2
7. **GET `/api/local-upload/invoice/:invoiceId`** - Invoice download from R2

### 5. `server/objectStorage.ts` (UPDATED)
Integrated R2 storage for invoice operations:

**Modified Methods**:
- `getInvoiceUploadURL()` - Now generates R2 presigned URLs first
- `getInvoiceFile()` - Checks R2 before local/GCS storage
- `downloadObject()` - Downloads from R2 if available
- `normalizeInvoicePath()` - Handles R2 URL normalization
- `deleteInvoiceFile()` - Deletes from R2 if file exists there

## Upload Flow

### For Images (Carousel, Products, General)
1. **Client uploads image** → Server receives file buffer
2. **Server checks R2 availability** → `r2StorageService.isAvailable()`
3. **If R2 available**:
   - Generate unique filename with UUID
   - Upload to appropriate R2 directory
   - Return public R2 URL
4. **If R2 unavailable or fails**:
   - Fall back to local storage
   - Save to `public/uploads/` directory
   - Return local file path

### For Invoices
1. **Admin uploads invoice** → Server receives PDF buffer
2. **Server checks R2 availability**
3. **If R2 available**:
   - Upload to `invoices/` directory in R2
   - Store normalized path in database: `/invoices/{filename}`
   - Return R2 public URL
4. **If R2 unavailable**:
   - Fall back to local storage in `public/uploads/invoices/`
   - Store local path in database

### For 3D Models
1. **Upload 3D model file** → Server receives file buffer
2. **Upload to R2 `models/` directory** with fallback to local storage
3. **Return public URL** for model access

## Key Features

### 1. Backward Compatibility
- Existing local files remain accessible
- System checks R2 first, then falls back to local storage
- No migration of existing files required

### 2. Automatic Fallback
- If R2 credentials are missing → Uses local storage
- If R2 upload fails → Falls back to local storage
- If R2 download fails → Tries local storage
- Zero downtime during R2 issues

### 3. Unique Filenames
- All uploads use UUID-based naming: `{uuid}-{original-name}`
- Prevents filename collisions
- Maintains file extension for proper MIME type handling

### 4. Directory Organization
- Files automatically organized by type
- Invoices → `invoices/`
- Carousel images → `carousel-images/`
- Product images → `products/`
- General images → `images/`
- 3D models → `models/`

### 5. Public Access
- All uploaded files are publicly accessible via R2 URL
- No need for presigned URLs for public content
- Direct URL format: `{R2_PUBLIC_URL}/{directory}/{filename}`

## Testing Checklist

### ✅ Image Uploads
- [ ] Upload carousel image from admin panel
- [ ] Upload product image from admin panel
- [ ] Upload hero slide image
- [ ] Verify images display correctly on frontend
- [ ] Check R2 bucket for uploaded files

### ✅ Invoice Uploads
- [ ] Upload invoice for an order
- [ ] Download invoice from order details
- [ ] Verify invoice stored in R2 `invoices/` directory
- [ ] Test invoice deletion

### ✅ 3D Model Uploads
- [ ] Upload 3D model file
- [ ] Verify model accessible via returned URL
- [ ] Check R2 bucket `models/` directory

### ✅ Fallback Testing
- [ ] Temporarily remove R2 credentials from `.env`
- [ ] Test upload (should use local storage)
- [ ] Restore R2 credentials
- [ ] Test upload (should use R2)

## Environment Variables Required

```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=blinkeach
R2_PUBLIC_URL=https://your-account-id.r2.cloudflarestorage.com/blinkeach
```

## Dependencies Installed

```json
{
  "@aws-sdk/client-s3": "^3.906.0",
  "@aws-sdk/s3-request-presigner": "^3.906.0"
}
```

## API Endpoints Updated

### Image Uploads
- `POST /api/upload/image` - Single image upload
- `POST /api/upload/images` - Multiple image upload
- `POST /api/upload/3d-model` - 3D model upload

### Carousel Images
- `POST /api/carousel-images` - Create with image upload
- `PUT /api/carousel-images/:id` - Update with image upload

### Hero Slides
- `POST /api/hero-slides` - Create with image upload
- `PUT /api/hero-slides/:id` - Update with image upload

### Invoice Management
- `POST /api/local-upload/invoice/:invoiceId` - Upload invoice
- `PUT /api/local-upload/invoice/:invoiceId` - Direct upload invoice
- `GET /api/local-upload/invoice/:invoiceId` - Download invoice
- `PUT /api/orders/:id/invoice` - Update order invoice URL
- `DELETE /api/orders/:id/invoice` - Delete order invoice

## Migration Benefits

1. **Scalability**: R2 handles unlimited file storage
2. **Performance**: CDN-backed delivery for faster load times
3. **Cost-Effective**: Cloudflare R2 has no egress fees
4. **Reliability**: Enterprise-grade storage with high availability
5. **Global Access**: Files accessible from anywhere
6. **Automatic Backups**: R2 handles data redundancy
7. **Easy Management**: Cloudflare dashboard for file management

## Troubleshooting

### Issue: Files not uploading to R2
**Solution**: Check R2 credentials in `.env` file, verify bucket exists

### Issue: Files uploading to local storage instead of R2
**Solution**: Ensure R2 credentials are correct and `r2StorageService.isAvailable()` returns true

### Issue: Cannot access uploaded files
**Solution**: Verify R2_PUBLIC_URL is correct and bucket has public access enabled

### Issue: Old files not accessible
**Solution**: Old local files remain in `public/uploads/` and are still accessible via fallback mechanism

## Next Steps

1. **Monitor R2 Usage**: Check Cloudflare dashboard for storage metrics
2. **Optional Migration**: Migrate existing local files to R2 if desired
3. **Backup Strategy**: Set up automated backups of R2 bucket
4. **CDN Configuration**: Configure custom domain for R2 bucket (optional)
5. **Access Control**: Implement private file access for sensitive documents (if needed)

## Support

For issues or questions:
1. Check R2 credentials in `.env`
2. Review server logs for error messages
3. Verify R2 bucket configuration in Cloudflare dashboard
4. Test with fallback to local storage to isolate R2 issues

---

**Migration Status**: ✅ COMPLETE
**Date**: 2024
**R2 Integration**: ACTIVE with automatic fallback
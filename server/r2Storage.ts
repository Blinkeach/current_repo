import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'blinkeach';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://e0b70d52f241f7e6ece12d27961d47a5.r2.cloudflarestorage.com/blinkeach';

// Check if R2 is configured
const isR2Configured = R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY;

// Initialize S3 Client for Cloudflare R2
// Note: Bucket is in APAC region, but standard endpoint works globally
const r2Client = isR2Configured ? new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Use path-style addressing for R2
}) : null;

export class R2StorageService {
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.bucketName = R2_BUCKET_NAME;
    this.publicUrl = R2_PUBLIC_URL;
  }

  /**
   * Check if R2 is configured and available
   */
  isAvailable(): boolean {
    return isR2Configured && r2Client !== null;
  }

  /**
   * Upload a file to R2 storage
   * @param fileBuffer - The file buffer to upload
   * @param directory - The directory in R2 (e.g., 'invoices', 'carousel-images', 'products')
   * @param originalName - Original filename
   * @param contentType - MIME type of the file
   * @returns The public URL of the uploaded file
   */
  async uploadFile(
    fileBuffer: Buffer,
    directory: string,
    originalName: string,
    contentType: string
  ): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('R2 storage is not configured. Please set R2 credentials in .env file.');
    }

    // Generate unique filename
    const fileExtension = originalName.split('.').pop();
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    const key = `${directory}/${uniqueFilename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await r2Client!.send(command);

    // Return the public URL
    return `${this.publicUrl}/${key}`;
  }

  /**
   * Upload an invoice file with a specific filename (no UUID generation)
   */
  async uploadInvoice(fileBuffer: Buffer, fileName: string): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('R2 storage is not configured. Please set R2 credentials in .env file.');
    }

    // Use capital 'Invoices' to match your R2 bucket structure
    const key = `Invoices/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: 'application/pdf',
    });

    await r2Client!.send(command);

    // Return the public URL
    return `${this.publicUrl}/${key}`;
  }

  /**
   * Upload a carousel image
   */
  async uploadCarouselImage(fileBuffer: Buffer, originalName: string, contentType: string): Promise<string> {
    return this.uploadFile(fileBuffer, 'carousel-images', originalName, contentType);
  }

  /**
   * Upload a product image
   */
  async uploadProductImage(fileBuffer: Buffer, originalName: string, contentType: string): Promise<string> {
    return this.uploadFile(fileBuffer, 'products', originalName, contentType);
  }

  /**
   * Upload a general image
   */
  async uploadImage(fileBuffer: Buffer, originalName: string, contentType: string): Promise<string> {
    return this.uploadFile(fileBuffer, 'images', originalName, contentType);
  }

  /**
   * Get a signed URL for uploading (for client-side uploads)
   */
  async getUploadUrl(directory: string, filename: string, contentType: string): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('R2 storage is not configured.');
    }

    const key = `${directory}/${filename}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    // Generate a signed URL valid for 15 minutes
    return await getSignedUrl(r2Client!, command, { expiresIn: 900 });
  }

  /**
   * Get a signed URL for downloading a private file
   */
  async getDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('R2 storage is not configured.');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(r2Client!, command, { expiresIn });
  }

  /**
   * Delete a file from R2
   */
  async deleteFile(key: string): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('R2 storage is not configured.');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await r2Client!.send(command);
  }

  /**
   * Delete a file by its public URL
   */
  async deleteFileByUrl(url: string): Promise<void> {
    if (!url.startsWith(this.publicUrl)) {
      throw new Error('Invalid R2 URL');
    }

    // Extract the key from the URL
    const key = url.replace(`${this.publicUrl}/`, '');
    await this.deleteFile(key);
  }

  /**
   * Check if a file exists in R2
   */
  async fileExists(key: string): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await r2Client!.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file buffer from R2
   */
  async getFileBuffer(key: string): Promise<Buffer> {
    if (!this.isAvailable()) {
      throw new Error('R2 storage is not configured.');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await r2Client!.send(command);
    
    if (!response.Body) {
      throw new Error('File not found');
    }

    // Convert stream to buffer
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];
    
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  /**
   * Extract key from R2 URL
   */
  extractKeyFromUrl(url: string): string {
    if (url.startsWith(this.publicUrl)) {
      return url.replace(`${this.publicUrl}/`, '');
    }
    return url;
  }

  /**
   * Get the public URL for a key
   */
  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }

  /**
   * Get invoice upload URL (for backward compatibility)
   */
  async getInvoiceUploadURL(): Promise<string> {
    const invoiceId = randomUUID();
    const filename = `${invoiceId}.pdf`;
    return this.getUploadUrl('invoices', filename, 'application/pdf');
  }

  /**
   * Normalize invoice path
   */
  normalizeInvoicePath(rawPath: string): string {
    // If it's already an R2 URL, extract the key
    if (rawPath.startsWith(this.publicUrl)) {
      return rawPath;
    }
    
    // If it's a local path, return as is (for backward compatibility)
    if (rawPath.startsWith('/invoices/') || rawPath.startsWith('/uploads/')) {
      return rawPath;
    }
    
    return rawPath;
  }
}

export const r2StorageService = new R2StorageService();
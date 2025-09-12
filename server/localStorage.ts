import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const INVOICES_DIR = path.join(UPLOAD_DIR, 'invoices');

// Ensure upload directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(INVOICES_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directories:', error);
  }
}

// Initialize directories on module load
ensureDirectories();

export class LocalStorageService {
  /**
   * Get upload URL for invoices (for local development)
   * Returns a local endpoint that can accept file uploads
   */
  async getInvoiceUploadURL(): Promise<string> {
    const invoiceId = randomUUID();
    // Return a URL that points to our local upload endpoint
    return `/api/local-upload/invoice/${invoiceId}`;
  }

  /**
   * Save an uploaded file to local storage
   */
  async saveInvoiceFile(invoiceId: string, fileBuffer: Buffer, originalName: string): Promise<string> {
    const fileName = `${invoiceId}_${originalName}`;
    const filePath = path.join(INVOICES_DIR, fileName);
    
    await fs.writeFile(filePath, fileBuffer);
    
    // Return the relative path for database storage
    return `/invoices/${fileName}`;
  }

  /**
   * Get file path for an invoice
   */
  getInvoiceFilePath(invoicePath: string): string {
    // Remove leading slash and prefix
    const fileName = invoicePath.replace('/invoices/', '');
    return path.join(INVOICES_DIR, fileName);
  }

  /**
   * Check if invoice file exists
   */
  async invoiceFileExists(invoicePath: string): Promise<boolean> {
    try {
      const filePath = this.getInvoiceFilePath(invoicePath);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete an invoice file
   */
  async deleteInvoiceFile(invoicePath: string): Promise<void> {
    const filePath = this.getInvoiceFilePath(invoicePath);
    await fs.unlink(filePath);
  }

  /**
   * Get file buffer for download
   */
  async getInvoiceFileBuffer(invoicePath: string): Promise<Buffer> {
    const filePath = this.getInvoiceFilePath(invoicePath);
    return await fs.readFile(filePath);
  }

  /**
   * Normalize invoice path for local storage
   */
  normalizeInvoicePath(rawPath: string): string {
    // For local storage, just ensure it starts with /invoices/
    if (rawPath.startsWith('/invoices/')) {
      return rawPath;
    }
    
    // If it's a local upload URL, extract the invoice ID
    if (rawPath.includes('/api/local-upload/invoice/')) {
      const invoiceId = rawPath.split('/').pop();
      return `/invoices/${invoiceId}`;
    }
    
    return rawPath;
  }
}

export const localStorageService = new LocalStorageService();
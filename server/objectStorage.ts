import { Storage, File } from "@google-cloud/storage";
import { Response } from "express";
import { randomUUID } from "crypto";
import { localStorageService } from "./localStorage";
import path from "path";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

// Check if we're running in local development mode
const isLocalDevelopment = process.env.NODE_ENV === 'development' && !process.env.REPLIT;

// The object storage client is used to interact with the object storage service.
export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// The object storage service is used to interact with the object storage service.
export class ObjectStorageService {
  constructor() {}

  // Gets the private object directory.
  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }

  // Downloads an object to the response.
  async downloadObject(file: File | string, res: Response, cacheTtlSec: number = 3600) {
    try {
      // Handle local storage download
      if (isLocalDevelopment && typeof file === 'string') {
        const exists = await localStorageService.invoiceFileExists(file);
        if (!exists) {
          return res.status(404).json({ error: "File not found" });
        }
        
        const fileBuffer = await localStorageService.getInvoiceFileBuffer(file);
        const fileName = path.basename(file);
        
        res.set({
          "Content-Type": "application/octet-stream",
          "Content-Length": fileBuffer.length.toString(),
          "Cache-Control": `private, max-age=${cacheTtlSec}`,
          "Content-Disposition": `attachment; filename="${fileName}"`,
        });
        
        return res.send(fileBuffer);
      }
      
      // Handle cloud storage download (when file is a File object)
      if (typeof file !== 'string') {
        // Get file metadata
        const [metadata] = await file.getMetadata();
        
        // Set appropriate headers
        res.set({
          "Content-Type": metadata.contentType || "application/octet-stream",
          "Content-Length": metadata.size,
          "Cache-Control": `private, max-age=${cacheTtlSec}`,
          "Content-Disposition": `attachment; filename="${metadata.name}"`,
        });

        // Stream the file to the response
        const stream = file.createReadStream();

        stream.on("error", (err) => {
          console.error("Stream error:", err);
          if (!res.headersSent) {
            res.status(500).json({ error: "Error streaming file" });
          }
        });

        stream.pipe(res);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }

  // Gets the upload URL for an invoice file.
  async getInvoiceUploadURL(): Promise<string> {
    // Use local storage in development mode
    if (isLocalDevelopment) {
      return await localStorageService.getInvoiceUploadURL();
    }

    const privateObjectDir = this.getPrivateObjectDir();
    if (!privateObjectDir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      );
    }

    const invoiceId = randomUUID();
    const fullPath = `${privateObjectDir}/invoices/${invoiceId}`;

    const { bucketName, objectName } = parseObjectPath(fullPath);

    // Sign URL for PUT method with TTL
    return signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900,
    });
  }

  // Gets the invoice file from the object path.
  async getInvoiceFile(objectPath: string): Promise<File | string> {
    if (!objectPath.startsWith("/invoices/")) {
      throw new ObjectNotFoundError();
    }

    // Use local storage in development mode
    if (isLocalDevelopment) {
      const exists = await localStorageService.invoiceFileExists(objectPath);
      if (!exists) {
        throw new ObjectNotFoundError();
      }
      return objectPath; // Return path for local storage
    }

    const invoiceId = objectPath.slice(10); // Remove "/invoices/"
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith("/")) {
      entityDir = `${entityDir}/`;
    }
    const invoicePath = `${entityDir}invoices/${invoiceId}`;
    const { bucketName, objectName } = parseObjectPath(invoicePath);
    const bucket = objectStorageClient.bucket(bucketName);
    const invoiceFile = bucket.file(objectName);
    const [exists] = await invoiceFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return invoiceFile;
  }

  normalizeInvoicePath(rawPath: string): string {
    // Use local storage normalization in development mode
    if (isLocalDevelopment) {
      return localStorageService.normalizeInvoicePath(rawPath);
    }

    if (!rawPath.startsWith("https://storage.googleapis.com/")) {
      return rawPath;
    }
  
    // Extract the path from the URL by removing query parameters and domain
    const url = new URL(rawPath);
    const rawObjectPath = url.pathname;
  
    let invoiceDir = this.getPrivateObjectDir();
    if (!invoiceDir.endsWith("/")) {
      invoiceDir = `${invoiceDir}/`;
    }
  
    if (!rawObjectPath.startsWith(`${invoiceDir}invoices/`)) {
      return rawObjectPath;
    }
  
    // Extract the invoice ID from the path
    const invoiceId = rawObjectPath.slice(`${invoiceDir}invoices/`.length);
    return `/invoices/${invoiceId}`;
  }

  // Deletes an invoice file from object storage.
  async deleteInvoiceFile(objectPath: string): Promise<void> {
    if (!objectPath.startsWith("/invoices/")) {
      throw new ObjectNotFoundError();
    }

    // Use local storage in development mode
    if (isLocalDevelopment) {
      const exists = await localStorageService.invoiceFileExists(objectPath);
      if (!exists) {
        throw new ObjectNotFoundError();
      }
      await localStorageService.deleteInvoiceFile(objectPath);
      return;
    }

    const invoiceId = objectPath.slice(10); // Remove "/invoices/"
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith("/")) {
      entityDir = `${entityDir}/`;
    }
    const invoicePath = `${entityDir}invoices/${invoiceId}`;
    const { bucketName, objectName } = parseObjectPath(invoicePath);
    const bucket = objectStorageClient.bucket(bucketName);
    const invoiceFile = bucket.file(objectName);
    
    const [exists] = await invoiceFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    
    await invoiceFile.delete();
  }
}

function parseObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");

  return {
    bucketName,
    objectName,
  };
}

async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec,
}: {
  bucketName: string;
  objectName: string;
  method: "GET" | "PUT" | "DELETE" | "HEAD";
  ttlSec: number;
}): Promise<string> {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, ` +
        `make sure you're running on Replit`
    );
  }

  const { signed_url: signedURL } = await response.json();
  return signedURL;
}
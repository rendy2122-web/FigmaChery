import { NextRequest } from "next/server";

/**
 * Validate file upload - type and size
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// The saved file's extension is derived from this map (keyed off the
// validated MIME type), never from the client-supplied original filename —
// otherwise a file could claim an "image/png" MIME type while its name ends
// in something like .html and land on disk under public/ with that extension.
const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export function validateUpload(file: File): string | null {
  if (!(file.type in MIME_TO_EXTENSION)) {
    return "File type not allowed. Only JPEG, PNG, and WebP are supported.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large. Maximum size is 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`;
  }
  return null;
}

/** Only call after validateUpload() has confirmed the MIME type is allowed. */
export function extensionForMimeType(mimeType: string): string {
  return MIME_TO_EXTENSION[mimeType] ?? "";
}

// Upload destinations are a fixed set the dashboard UI offers via a <select>,
// not free text — this closes off path traversal via a folder value like
// "../../../etc" being joined straight into a filesystem path.
const ALLOWED_UPLOAD_FOLDERS = ["general", "cars", "articles", "promotions", "hero"];

export function sanitizeUploadFolder(folder: unknown): string {
  return typeof folder === "string" && ALLOWED_UPLOAD_FOLDERS.includes(folder) ? folder : "general";
}

/**
 * CSRF Protection - validate origin header
 *
 * Compares the *parsed* origin (scheme + host + port) against the app's
 * origin, not a string prefix — "https://chery.example.com".startsWith(...)
 * would have also matched an attacker-controlled
 * "https://chery.example.com.evil.com", defeating the check entirely.
 */
export function validateOrigin(req: NextRequest): boolean {
  if (req.method === "GET") return true;

  // During development, allow requests without origin
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  let expectedOrigin: string;
  try {
    expectedOrigin = new URL(appUrl).origin;
  } catch {
    return false;
  }

  const origin = req.headers.get("origin");
  if (origin && origin !== expectedOrigin) {
    return false;
  }

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      if (new URL(referer).origin !== expectedOrigin) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

/**
 * Environment validation
 */
export function validateEnv(): string[] {
  const warnings: string[] = [];
  
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET === "your-secret-key-here-change-in-production" || process.env.AUTH_SECRET.startsWith("dev-secret")) {
    warnings.push("AUTH_SECRET is not properly set. Run: openssl rand -base64 32");
  }
  
  if (!process.env.DATABASE_URL) {
    warnings.push("DATABASE_URL is not set");
  }
  
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    warnings.push("NEXT_PUBLIC_APP_URL is not set");
  }
  
  return warnings;
}
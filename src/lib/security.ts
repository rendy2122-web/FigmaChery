import { NextRequest, NextResponse } from "next/server";

/**
 * Validate file upload - type and size
 */
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateUpload(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "File type not allowed. Only JPEG, PNG, and WebP are supported.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large. Maximum size is 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`;
  }
  return null;
}

/**
 * CSRF Protection - validate origin header
 */
export function validateOrigin(req: NextRequest): boolean {
  if (req.method === "GET") return true;
  
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  // During development, allow requests without origin
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  
  const allowedOrigins = [appUrl];
  if (origin && !allowedOrigins.some((o) => origin.startsWith(o))) {
    return false;
  }
  if (referer && !allowedOrigins.some((o) => referer.startsWith(o))) {
    return false;
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
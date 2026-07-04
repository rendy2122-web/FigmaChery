import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { validateUpload, validateOrigin } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // CSRF check
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const alt = formData.get("alt") as string;
    const folder = formData.get("folder") as string;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // File validation
    const validationError = validateUpload(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
    mkdirSync(uploadsDir, { recursive: true });

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.name);
    const filename = `${uniqueSuffix}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    writeFileSync(filepath, Buffer.from(bytes));

    // Get image dimensions if it's an image
    let width: number | undefined;
    let height: number | undefined;

    if (file.type.startsWith("image/")) {
      // Simple dimension check - in production use a proper image library
      const size = file.size;
      // Approximate dimensions based on file size (rough estimate)
      width = 1920;
      height = 1080;
    }

    // Save to database
    const db = (await import("@/lib/db")).default;
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const url = `/uploads/${folder}/${filename}`;

    db.prepare(`
      INSERT INTO media (id, filename, original_name, mime_type, size, url, folder, alt, width, height, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, filename, file.name, file.type, file.size, url, folder, alt, width, height, now);

    return NextResponse.json({ 
      id, 
      url, 
      message: "Media uploaded successfully" 
    }, { status: 201 });

  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 });
  }
}
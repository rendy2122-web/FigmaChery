import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

// GET single media
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { default: db } = await import("@/lib/db");

    const media = db.prepare("SELECT * FROM media WHERE id = ?").get(id) as any;

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

// DELETE media
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { default: db } = await import("@/lib/db");
    const { unlinkSync } = await import("fs");
    const path = (await import("path")).default;
    
    // Get media info
    const media = db.prepare("SELECT * FROM media WHERE id = ?").get(id) as any;

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Delete file from filesystem
    try {
      const filepath = path.join(process.cwd(), "public", media.url);
      unlinkSync(filepath);
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    // Delete from database
    db.prepare("DELETE FROM media WHERE id = ?").run(id);

    return NextResponse.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { validateOrigin } from "@/lib/security";

// GET single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = db.prepare("SELECT * FROM articles WHERE id = ? AND deleted_at IS NULL").get(id) as any;

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

// PUT update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, featuredImage, categoryId, status, publishedAt, scheduledAt } = body;
    const now = new Date().toISOString();

    const result = db.prepare(`
      UPDATE articles 
      SET title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?, category_id = ?, 
          status = ?, published_at = ?, scheduled_at = ?, updated_at = ?
      WHERE id = ? AND deleted_at IS NULL
    `).run(title, slug, excerpt, content, featuredImage || null, categoryId || null, status, publishedAt || null, scheduledAt || null, now, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Article updated successfully" });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

// DELETE article - soft delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date().toISOString();
    const result = db.prepare("UPDATE articles SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL").run(now, now, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
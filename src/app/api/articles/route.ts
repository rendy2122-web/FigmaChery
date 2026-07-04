import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { randomUUID } from "crypto";

// GET all articles
export async function GET() {
  try {
    const articles = db.prepare(`
      SELECT a.*, c.name as category_name
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      ORDER BY a.created_at DESC
    `).all();

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

// POST create new article
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, featuredImage, categoryId, status, publishedAt, scheduledAt } = body;

    const id = randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO articles (id, title, slug, excerpt, content, featured_image, category_id, status, published_at, scheduled_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, slug, excerpt, content, featuredImage, categoryId, status || "draft", publishedAt, scheduledAt, now, now);

    return NextResponse.json({ id, message: "Article created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
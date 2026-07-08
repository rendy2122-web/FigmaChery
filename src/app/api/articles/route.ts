import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateOrigin } from "@/lib/security";
import { getPublishedArticles, createArticle } from "@/lib/data/articles";

// GET all articles - with caching
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = getPublishedArticles();

    return NextResponse.json(articles, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

// POST create new article
export async function POST(request: NextRequest) {
  try {
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, featuredImage, categoryId, status, publishedAt, scheduledAt, author } = body;

    // Basic validation
    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const id = createArticle({
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      categoryId,
      status,
      publishedAt,
      scheduledAt,
      author,
    });

    return NextResponse.json({ id, message: "Article created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}

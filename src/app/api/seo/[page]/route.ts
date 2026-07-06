import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateOrigin } from "@/lib/security";
import { upsertSeoMetadata } from "@/lib/data/seo";

// PUT create or update SEO metadata for a page key (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params;

    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, keywords, ogImage, canonical, noIndex } = body;

    upsertSeoMetadata(page, { title, description, keywords, ogImage, canonical, noIndex });

    return NextResponse.json({ message: "SEO metadata saved successfully" });
  } catch (error) {
    console.error("Error saving SEO metadata:", error);
    return NextResponse.json({ error: "Failed to save SEO metadata" }, { status: 500 });
  }
}

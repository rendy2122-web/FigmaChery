import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export const runtime = "nodejs";

// GET hero slides
export async function GET() {
  try {
    const hero = db.prepare("SELECT * FROM homepage_sections WHERE section = 'hero'").get() as any;
    
    let slides = [];
    if (hero?.metadata) {
      try {
        slides = JSON.parse(hero.metadata);
      } catch {}
    }

    return NextResponse.json(slides);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return NextResponse.json({ error: "Failed to fetch hero slides" }, { status: 500 });
  }
}

// PUT update hero slides (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slides = await request.json();
    const metadata = JSON.stringify(slides);
    const now = new Date().toISOString();

    // Upsert
    const existing = db.prepare("SELECT * FROM homepage_sections WHERE section = 'hero'").get();
    
    if (existing) {
      db.prepare("UPDATE homepage_sections SET metadata = ?, updated_at = ? WHERE section = 'hero'").run(metadata, now);
    } else {
      const id = Date.now().toString();
      db.prepare("INSERT INTO homepage_sections (id, section, metadata, is_active, created_at, updated_at) VALUES (?, 'hero', ?, 1, ?, ?)").run(id, metadata, now, now);
    }

    return NextResponse.json({ message: "Hero slides updated successfully" });
  } catch (error) {
    console.error("Error updating hero slides:", error);
    return NextResponse.json({ error: "Failed to update hero slides" }, { status: 500 });
  }
}
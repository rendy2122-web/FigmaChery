import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export const runtime = "nodejs";

interface ProductSectionInput {
  id?: string;
  section_type: string;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  image?: string | null;
  icon?: string | null;
  features?: unknown;
  sort_order?: number;
  is_active?: boolean;
}

// GET product sections
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sections = db.prepare(`
      SELECT * FROM product_sections 
      WHERE car_id = ? 
      ORDER BY sort_order ASC
    `).all(id);

    return NextResponse.json(sections);
  } catch (error) {
    console.error("Error fetching product sections:", error);
    return NextResponse.json({ error: "Failed to fetch product sections" }, { status: 500 });
  }
}

// PUT update product sections (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sections = (await request.json()) as ProductSectionInput[];
    const now = new Date().toISOString();

    // Delete existing sections
    db.prepare("DELETE FROM product_sections WHERE car_id = ?").run(id);

    // Insert new sections
    const stmt = db.prepare(`
      INSERT INTO product_sections (id, car_id, section_type, title, subtitle, content, image, icon, features, sort_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    sections.forEach((section, index) => {
      const sectionId = section.id || `ps-${Date.now()}-${index}`;
      stmt.run(
        sectionId,
        id,
        section.section_type,
        section.title || null,
        section.subtitle || null,
        section.content || null,
        section.image || null,
        section.icon || null,
        section.features ? JSON.stringify(section.features) : null,
        section.sort_order || index,
        section.is_active ? 1 : 0,
        now,
        now
      );
    });

    return NextResponse.json({ message: "Product sections updated successfully" });
  } catch (error) {
    console.error("Error updating product sections:", error);
    return NextResponse.json({ error: "Failed to update product sections" }, { status: 500 });
  }
}
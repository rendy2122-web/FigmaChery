import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { createDealerSchema, updateDealerSchema } from "@/lib/api-validation";
import { rateLimit } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/security";

// GET single dealer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dealer = db.prepare("SELECT * FROM dealers WHERE id = ? AND deleted_at IS NULL").get(id) as any;

    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json(dealer);
  } catch (error) {
    console.error("Error fetching dealer:", error);
    return NextResponse.json({ error: "Failed to fetch dealer" }, { status: 500 });
  }
}

// POST create new dealer
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
    
    const parsed = createDealerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: parsed.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { name, city, address, phone, email, whatsapp, mapsEmbed, status, sortOrder, image } = parsed.data;
    const now = new Date().toISOString();
    const id = `dealer-${Date.now()}`;

    db.prepare(`
      INSERT INTO dealers (id, name, city, address, phone, email, whatsapp, maps_embed, status, sort_order, image, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, city, address, phone, email || null, whatsapp, mapsEmbed || null, status || "active", sortOrder || 0, image || null, now, now);

    return NextResponse.json({ id, message: "Dealer created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating dealer:", error);
    return NextResponse.json({ error: "Failed to create dealer" }, { status: 500 });
  }
}

// PUT update dealer
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
    
    const parsed = updateDealerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: parsed.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { name, city, address, phone, email, whatsapp, mapsEmbed, status, sortOrder, image } = parsed.data;
    const now = new Date().toISOString();

    const result = db.prepare(`
      UPDATE dealers 
      SET name = ?, city = ?, address = ?, phone = ?, email = ?, whatsapp = ?, 
          maps_embed = ?, status = ?, sort_order = ?, image = ?, updated_at = ?
      WHERE id = ? AND deleted_at IS NULL
    `).run(name, city, address, phone, email || null, whatsapp, mapsEmbed || null, status || "active", sortOrder || 0, image || null, now, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Dealer updated successfully" });
  } catch (error) {
    console.error("Error updating dealer:", error);
    return NextResponse.json({ error: "Failed to update dealer" }, { status: 500 });
  }
}

// DELETE dealer - soft delete
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
    const result = db.prepare("UPDATE dealers SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL").run(now, now, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Dealer deleted successfully" });
  } catch (error) {
    console.error("Error deleting dealer:", error);
    return NextResponse.json({ error: "Failed to delete dealer" }, { status: 500 });
  }
}
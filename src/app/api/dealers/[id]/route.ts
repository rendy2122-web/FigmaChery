import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

// GET single dealer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealer = db.prepare("SELECT * FROM dealers WHERE id = ?").get(params.id) as any;

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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, city, address, phone, email, whatsapp, mapsEmbed, status, sortOrder, image } = body;
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, city, address, phone, email, whatsapp, mapsEmbed, status, sortOrder, image } = body;
    const now = new Date().toISOString();

    const result = db.prepare(`
      UPDATE dealers 
      SET name = ?, city = ?, address = ?, phone = ?, email = ?, whatsapp = ?, 
          maps_embed = ?, status = ?, sort_order = ?, image = ?, updated_at = ?
      WHERE id = ?
    `).run(name, city, address, phone, email || null, whatsapp, mapsEmbed || null, status || "active", sortOrder || 0, image || null, now, params.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Dealer updated successfully" });
  } catch (error) {
    console.error("Error updating dealer:", error);
    return NextResponse.json({ error: "Failed to update dealer" }, { status: 500 });
  }
}

// DELETE dealer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = db.prepare("DELETE FROM dealers WHERE id = ?").run(params.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Dealer deleted successfully" });
  } catch (error) {
    console.error("Error deleting dealer:", error);
    return NextResponse.json({ error: "Failed to delete dealer" }, { status: 500 });
  }
}
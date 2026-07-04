import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { validateOrigin } from "@/lib/security";

// GET single car
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const car = db.prepare("SELECT * FROM cars WHERE id = ? AND deleted_at IS NULL").get(id) as any;

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Get car images
    const images = db.prepare("SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order").all(id);

    // Get car specs
    const specs = db.prepare("SELECT * FROM car_specs WHERE car_id = ? ORDER BY sort_order").all(id);

    // Get car features
    const features = db.prepare("SELECT * FROM car_features WHERE car_id = ? ORDER BY sort_order").all(id);

    return NextResponse.json({
      ...car,
      images,
      specs,
      features,
    });
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}

// PUT update car
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // CSRF
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, subtitle, description, priceFrom, type, status, featured, sortOrder, thumbnail } = body;
    const now = new Date().toISOString();

    const result = db.prepare(`
      UPDATE cars 
      SET name = ?, slug = ?, subtitle = ?, description = ?, price_from = ?, type = ?,
          status = ?, featured = ?, sort_order = ?, thumbnail = ?, updated_at = ?
      WHERE id = ? AND deleted_at IS NULL
    `).run(name, slug, subtitle, description, priceFrom, type || "ICE", status || "draft", featured ? 1 : 0, sortOrder || 0, thumbnail || null, now, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Car updated successfully" });
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}

// DELETE car - soft delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // CSRF
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date().toISOString();
    const result = db.prepare("UPDATE cars SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL").run(now, now, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}

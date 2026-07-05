import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const car = db.prepare("SELECT * FROM cars WHERE slug = ? AND deleted_at IS NULL").get(slug) as any;

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const images = db.prepare("SELECT * FROM car_images WHERE car_id = ? AND color_name IS NULL ORDER BY sort_order").all(car.id) as any[];
    const specs = db.prepare("SELECT * FROM car_specs WHERE car_id = ? ORDER BY sort_order").all(car.id);
    const features = db.prepare("SELECT * FROM car_features WHERE car_id = ? ORDER BY sort_order").all(car.id);
    
    // Get color variant images
    const colorImages = db.prepare("SELECT color_name, color_hex, url as image_url FROM car_images WHERE car_id = ? AND color_name IS NOT NULL ORDER BY sort_order").all(car.id);

    const highlights = features.map((f: any) => ({
      title: f.title,
      description: f.description || "",
      iconName: f.icon || "CheckCircle"
    }));

    const interiorImage = images[0]?.url || null;

    return NextResponse.json({ ...car, images, color_images: colorImages, specs, features, highlights, interiorImage });
  } catch (error) {
    console.error("Error fetching car by slug:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}
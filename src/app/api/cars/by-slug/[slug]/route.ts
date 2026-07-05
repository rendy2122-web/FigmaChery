import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const getFolderName = (slug: string): string => {
  switch (slug) {
    case "chery-q": return "chery q";
    case "chery-e5": return "chery e5";
    case "chery-j6": return "J6";
    case "chery-c5-csh": return "chery c5 csh";
    case "chery-c5": return "chery c5";
    case "omoda-5-gt": return "Omoda 5 GT";
    case "tiggo-9-csh": return "tiggo 9 csh";
    case "tiggo-cross-csh": return "tiggo cross csh";
    case "tiggo-8-csh": return "tiggo 8 csh";
    case "tiggo-cross-sport": return "tiggo cross sport";
    case "tiggo-cross": return "tiggo cross";
    case "tiggo-8": return "tiggo 8";
    case "tiggo-8-pro-max": return "tiggo 8 pro max";
    default: return slug.replace(/-/g, " ");
  }
};

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

    const folderName = getFolderName(slug);
    const heroImage = `/figma/${folderName}/hero.png`;
    const interiorImage = `/figma/${folderName}/interior.png`;
    const techImage = `/figma/${folderName}/feature.png`;
    const videoUrl = `/figma/${folderName}/video.mp4`;

    const dbImages = db.prepare("SELECT * FROM car_images WHERE car_id = ? AND color_name IS NULL ORDER BY sort_order").all(car.id) as any[];
    const images = [{ id: "hero-override", url: heroImage, alt: car.name }, ...dbImages];

    const specs = db.prepare("SELECT * FROM car_specs WHERE car_id = ? ORDER BY sort_order").all(car.id);
    const features = db.prepare("SELECT * FROM car_features WHERE car_id = ? ORDER BY sort_order").all(car.id);
    
    // Get color variant images
    const colorImages = db.prepare("SELECT color_name, color_hex, url as image_url FROM car_images WHERE car_id = ? AND color_name IS NOT NULL ORDER BY sort_order").all(car.id);

    const highlights = features.map((f: any) => ({
      title: f.title,
      description: f.description || "",
      iconName: f.icon || "CheckCircle"
    }));

    return NextResponse.json({ 
      ...car, 
      images, 
      color_images: colorImages, 
      specs, 
      features, 
      highlights, 
      interiorImage, 
      techImage,
      videoUrl
    });
  } catch (error) {
    console.error("Error fetching car by slug:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}
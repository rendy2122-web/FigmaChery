import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateOrigin } from "@/lib/security";
import { getCarColorImages, addCarColorImage } from "@/lib/data/cars";

// GET color variant images for a car
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const colors = getCarColorImages(id);
    return NextResponse.json(colors);
  } catch (error) {
    console.error("Error fetching car color images:", error);
    return NextResponse.json({ error: "Failed to fetch car color images" }, { status: 500 });
  }
}

// POST add a new color variant image (admin only)
export async function POST(
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
    const { url, colorName, colorHex } = body;

    if (!url || !colorName || !colorHex) {
      return NextResponse.json(
        { error: "url, colorName, and colorHex are required" },
        { status: 400 }
      );
    }

    const imageId = addCarColorImage(id, { url, colorName, colorHex });

    return NextResponse.json({ id: imageId, message: "Color image added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding car color image:", error);
    return NextResponse.json({ error: "Failed to add car color image" }, { status: 500 });
  }
}

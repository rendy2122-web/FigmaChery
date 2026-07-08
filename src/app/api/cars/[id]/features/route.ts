import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateOrigin } from "@/lib/security";
import { getCarFeatures, replaceCarFeatures } from "@/lib/data/cars";

// GET features for a car
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const features = getCarFeatures(id);
    return NextResponse.json(features);
  } catch (error) {
    console.error("Error fetching car features:", error);
    return NextResponse.json({ error: "Failed to fetch car features" }, { status: 500 });
  }
}

// PUT replace all features for a car (admin only)
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

    const features = await request.json();

    if (!Array.isArray(features)) {
      return NextResponse.json({ error: "Body must be an array" }, { status: 400 });
    }

    for (const feature of features) {
      if (!feature.title) {
        return NextResponse.json({ error: "Each feature needs a title" }, { status: 400 });
      }
    }

    replaceCarFeatures(id, features);

    return NextResponse.json({ message: "Car features updated successfully" });
  } catch (error) {
    console.error("Error updating car features:", error);
    return NextResponse.json({ error: "Failed to update car features" }, { status: 500 });
  }
}

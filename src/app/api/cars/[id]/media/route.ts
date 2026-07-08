import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateOrigin } from "@/lib/security";
import { getCarMediaOverrides, updateCarMediaOverrides } from "@/lib/data/cars";

// GET current interior/exterior/car/feature image overrides for a car
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const overrides = getCarMediaOverrides(id);

    if (!overrides) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(overrides);
  } catch (error) {
    console.error("Error fetching car media overrides:", error);
    return NextResponse.json({ error: "Failed to fetch car media overrides" }, { status: 500 });
  }
}

// PUT update the overrides (admin only) — an empty string clears back to the default
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
    const { interiorImage, exteriorImage, carImage, featureImage } = body;

    const updated = updateCarMediaOverrides(id, {
      interiorImage: interiorImage || null,
      exteriorImage: exteriorImage || null,
      carImage: carImage || null,
      featureImage: featureImage || null,
    });

    if (!updated) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Car media updated successfully" });
  } catch (error) {
    console.error("Error updating car media overrides:", error);
    return NextResponse.json({ error: "Failed to update car media overrides" }, { status: 500 });
  }
}

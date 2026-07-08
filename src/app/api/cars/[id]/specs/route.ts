import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateOrigin } from "@/lib/security";
import { getCarSpecs, replaceCarSpecs } from "@/lib/data/cars";

// GET specs for a car
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const specs = getCarSpecs(id);
    return NextResponse.json(specs);
  } catch (error) {
    console.error("Error fetching car specs:", error);
    return NextResponse.json({ error: "Failed to fetch car specs" }, { status: 500 });
  }
}

// PUT replace all specs for a car (admin only)
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

    const specs = await request.json();

    if (!Array.isArray(specs)) {
      return NextResponse.json({ error: "Body must be an array" }, { status: 400 });
    }

    for (const spec of specs) {
      if (!spec.label || !spec.value) {
        return NextResponse.json({ error: "Each spec needs a label and value" }, { status: 400 });
      }
    }

    replaceCarSpecs(id, specs);

    return NextResponse.json({ message: "Car specs updated successfully" });
  } catch (error) {
    console.error("Error updating car specs:", error);
    return NextResponse.json({ error: "Failed to update car specs" }, { status: 500 });
  }
}

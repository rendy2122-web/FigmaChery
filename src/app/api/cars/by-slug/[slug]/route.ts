import { NextRequest, NextResponse } from "next/server";
import { getCarBySlugForPublic } from "@/lib/data/cars";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const car = getCarBySlugForPublic(slug);

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("Error fetching car by slug:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}

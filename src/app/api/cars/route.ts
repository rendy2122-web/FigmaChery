import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPublishedCars, createCar } from "@/lib/data/cars";

// GET all cars - with caching
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");
    const carsWithSpecs = getPublishedCars(type);

    return NextResponse.json(carsWithSpecs, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

// POST create new car
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, subtitle, description, priceFrom, type, status, featured, sortOrder } = body;

    // Basic validation
    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const id = createCar({
      name,
      slug,
      subtitle,
      description,
      priceFrom,
      type,
      status,
      featured,
      sortOrder,
    });

    return NextResponse.json({ id, message: "Car created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}

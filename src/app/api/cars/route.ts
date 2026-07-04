import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { randomUUID } from "crypto";

// GET all cars - with caching
export const revalidate = 3600; // ISR: 1 hour

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    let query = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM car_images WHERE car_id = c.id) as image_count,
             (SELECT url FROM car_images WHERE car_id = c.id ORDER BY sort_order LIMIT 1) as thumbnail
      FROM cars c
      WHERE c.status = 'published'
    `;

    const params: any[] = [];

    if (type && ['BEV', 'CSH', 'ICE'].includes(type)) {
      query += ` AND c.type = ?`;
      params.push(type);
    }

    query += ` ORDER BY c.sort_order ASC, c.created_at DESC`;

    const cars = db.prepare(query).all(...params);

    // Fetch specs for each car
    const carsWithSpecs = cars.map((car: any) => {
      const specs = db.prepare("SELECT label, value FROM car_specs WHERE car_id = ? ORDER BY sort_order").all(car.id);
      return {
        ...car,
        specs: specs || []
      };
    });

    return NextResponse.json(carsWithSpecs, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
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

    const id = randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO cars (id, name, slug, subtitle, description, price_from, type, status, featured, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, slug, subtitle, description, priceFrom, type || "ICE", status || "draft", featured ? 1 : 0, sortOrder || 0, now, now);

    return NextResponse.json({ id, message: "Car created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { randomUUID } from "crypto";

// GET all cars
export async function GET() {
  try {
    const cars = db.prepare(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM car_images WHERE car_id = c.id) as image_count,
             (SELECT url FROM car_images WHERE car_id = c.id ORDER BY sort_order LIMIT 1) as thumbnail
      FROM cars c
      ORDER BY c.sort_order ASC, c.created_at DESC
    `).all();

    return NextResponse.json(cars);
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
    const { name, slug, subtitle, description, priceFrom, status, featured, sortOrder } = body;

    const id = randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO cars (id, name, slug, subtitle, description, price_from, status, featured, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, slug, subtitle, description, priceFrom, status || "draft", featured ? 1 : 0, sortOrder || 0, now, now);

    return NextResponse.json({ id, message: "Car created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}
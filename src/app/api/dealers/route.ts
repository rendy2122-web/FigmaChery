import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// GET all dealers - with caching
export const revalidate = 3600; // ISR: 1 hour

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const { success } = rateLimit(`dealers:${ip}`, 30, 60000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const dealers = db.prepare("SELECT * FROM dealers WHERE status = 'active' ORDER BY sort_order ASC").all();
    
    return NextResponse.json(dealers, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error("Error fetching dealers:", error);
    return NextResponse.json({ error: "Failed to fetch dealers" }, { status: 500 });
  }
}

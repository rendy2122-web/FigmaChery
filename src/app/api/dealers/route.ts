import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getActiveDealers } from "@/lib/data/dealers";

export const runtime = "nodejs";

// GET all dealers - with caching
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const { success } = rateLimit(`dealers:${ip}`, 30, 60000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const dealers = getActiveDealers();

    return NextResponse.json(dealers, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error("Error fetching dealers:", error);
    return NextResponse.json({ error: "Failed to fetch dealers" }, { status: 500 });
  }
}

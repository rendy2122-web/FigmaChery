import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/security";
import { createDealerSchema } from "@/lib/api-validation";
import { getActiveDealers, createDealer } from "@/lib/data/dealers";

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

// POST create new dealer
export async function POST(request: NextRequest) {
  try {
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const parsed = createDealerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const id = createDealer(parsed.data);

    return NextResponse.json({ id, message: "Dealer created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating dealer:", error);
    return NextResponse.json({ error: "Failed to create dealer" }, { status: 500 });
  }
}

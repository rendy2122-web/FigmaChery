import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import { createLead, getAllLeads } from "@/lib/data/leads";

export const dynamic = "force-dynamic";

// GET all leads (admin only) — for the dashboard's Leads page.
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = getAllLeads();

    return NextResponse.json(leads, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

// POST create a lead — open to any visitor, captured by CHIVA's proactive
// contact flow, so it's rate-limited and validated instead of auth-gated.
export async function POST(request: NextRequest) {
  try {
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const { success } = rateLimit(`leads:create:${ip}`, 5, 60_000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const { name, phone, dealerId, carInterest } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    }
    if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
      return NextResponse.json({ error: "Nomor WhatsApp wajib diisi" }, { status: 400 });
    }

    const id = createLead({
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 30),
      dealerId: typeof dealerId === "string" ? dealerId : null,
      carInterest: typeof carInterest === "string" ? carInterest.trim().slice(0, 100) : null,
    });

    return NextResponse.json({ id, message: "Lead created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

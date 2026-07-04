import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export const runtime = "nodejs";

// GET all dealers
export async function GET() {
  try {
    const dealers = db.prepare("SELECT * FROM dealers WHERE status = 'active' ORDER BY sort_order ASC").all();
    return NextResponse.json(dealers);
  } catch (error) {
    console.error("Error fetching dealers:", error);
    return NextResponse.json({ error: "Failed to fetch dealers" }, { status: 500 });
  }
}
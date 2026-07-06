import { NextRequest, NextResponse } from "next/server";
import { validateOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import { incrementTestimonialLikes } from "@/lib/data/testimonials";

// POST increment a testimonial's "helpful" count — public, rate-limited.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const { success } = rateLimit(`testimonials:like:${ip}`, 30, 60_000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const updated = incrementTestimonialLikes(id);

    if (!updated) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Liked" });
  } catch (error) {
    console.error("Error liking testimonial:", error);
    return NextResponse.json({ error: "Failed to like testimonial" }, { status: 500 });
  }
}

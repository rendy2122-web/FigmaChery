import { NextRequest, NextResponse } from "next/server";
import { validateOrigin } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import { getAllPublishedTestimonials, createTestimonial } from "@/lib/data/testimonials";

export const dynamic = "force-dynamic";

// GET all published testimonials
export async function GET() {
  try {
    const testimonials = getAllPublishedTestimonials();

    return NextResponse.json(testimonials, {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

// POST create a new testimonial — open to any visitor (like the site's old
// review-writing UI), so it's rate-limited and validated instead of auth-gated.
export async function POST(request: NextRequest) {
  try {
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const { success } = rateLimit(`testimonials:create:${ip}`, 5, 60_000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const { carId, authorName, rating, comment } = body;

    if (!authorName || typeof authorName !== "string" || authorName.trim().length === 0) {
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    }
    if (!comment || typeof comment !== "string" || comment.trim().length === 0) {
      return NextResponse.json({ error: "Ulasan wajib diisi" }, { status: 400 });
    }
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: "Rating harus antara 1-5" }, { status: 400 });
    }

    const id = createTestimonial({
      carId: carId || null,
      authorName: authorName.trim().slice(0, 100),
      rating: ratingNum,
      comment: comment.trim().slice(0, 2000),
    });

    return NextResponse.json({ id, message: "Testimonial created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

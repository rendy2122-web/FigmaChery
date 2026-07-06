import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getHeroSlides, updateHeroSlides } from "@/lib/data/homepage";

export const runtime = "nodejs";

// GET hero slides - with caching
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slides = getHeroSlides();

    return NextResponse.json(slides, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return NextResponse.json({ error: "Failed to fetch hero slides" }, { status: 500 });
  }
}

// PUT update hero slides (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slides = await request.json();
    updateHeroSlides(slides);

    return NextResponse.json({ message: "Hero slides updated successfully" });
  } catch (error) {
    console.error("Error updating hero slides:", error);
    return NextResponse.json({ error: "Failed to update hero slides" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateOrigin } from "@/lib/security";
import { deleteCarImage } from "@/lib/data/cars";

// DELETE a color variant image (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { imageId } = await params;

    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = deleteCarImage(imageId);

    if (!deleted) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Color image deleted successfully" });
  } catch (error) {
    console.error("Error deleting car color image:", error);
    return NextResponse.json({ error: "Failed to delete car color image" }, { status: 500 });
  }
}

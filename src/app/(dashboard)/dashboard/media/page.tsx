import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { MediaTable } from "@/components/cms/media-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default async function MediaPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get all media
  const media = db.prepare(`
    SELECT * FROM media ORDER BY created_at DESC
  `).all() as any[];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola gambar dan video
          </p>
        </div>
        <Link href="/dashboard/media/upload">
          <Button>
            <PlusIcon className="size-4 mr-2" />
            Upload Media
          </Button>
        </Link>
      </div>

      {/* Media Grid */}
      <MediaTable media={media} />
    </div>
  );
}
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { CarsTable } from "@/components/cms/cars-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default async function CarsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get all cars
  const cars = db.prepare(`
    SELECT c.*, 
           (SELECT COUNT(*) FROM car_images WHERE car_id = c.id) as image_count,
           (SELECT url FROM car_images WHERE car_id = c.id ORDER BY sort_order LIMIT 1) as thumbnail
    FROM cars c
    ORDER BY c.sort_order ASC, c.created_at DESC
  `).all() as any[];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Mobil</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola model mobil dan spesifikasi
          </p>
        </div>
        <Link href="/dashboard/cars/new">
          <Button>
            <PlusIcon className="size-4 mr-2" />
            Tambah Mobil
          </Button>
        </Link>
      </div>

      {/* Cars Table */}
      <CarsTable cars={cars} />
    </div>
  );
}
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CarForm } from "@/components/cms/car-form";
import db from "@/lib/db";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  // Get car data
  const car = db.prepare("SELECT * FROM cars WHERE id = ?").get(id) as any;

  if (!car) {
    redirect("/dashboard/cars");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Mobil</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update informasi mobil: {car.name}
        </p>
      </div>

      {/* Car Form */}
      <CarForm car={car} />
    </div>
  );
}
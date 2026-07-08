import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCarById } from "@/lib/data/cars";
import { CarContentEditor } from "@/components/cms/car-content-editor";

export default async function CarContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const car = getCarById(id);

  if (!car) {
    redirect("/dashboard/cars");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Spesifikasi & Fitur</h1>
        <p className="mt-1 text-sm text-gray-600">
          Konten ini tampil langsung di halaman produk publik: {car.name}
        </p>
      </div>

      <CarContentEditor carId={car.id} />
    </div>
  );
}

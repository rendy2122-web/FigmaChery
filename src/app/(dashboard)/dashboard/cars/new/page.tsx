import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CarForm } from "@/components/cms/car-form";

export default async function NewCarPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tambah Mobil Baru</h1>
        <p className="mt-1 text-sm text-gray-600">
          Tambahkan model mobil baru ke dalam sistem
        </p>
      </div>

      {/* Car Form */}
      <CarForm />
    </div>
  );
}
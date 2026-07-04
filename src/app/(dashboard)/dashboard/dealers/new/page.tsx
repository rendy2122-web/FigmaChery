import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DealerForm } from "@/components/cms/dealer-form";

export default async function NewDealerPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tambah Dealer</h1>
        <p className="mt-1 text-sm text-gray-600">
          Tambahkan dealer baru Chery
        </p>
      </div>

      {/* Dealer Form */}
      <DealerForm />
    </div>
  );
}
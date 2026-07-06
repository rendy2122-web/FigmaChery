import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DealerForm } from "@/components/cms/dealer-form";
import { getDealerById } from "@/lib/data/dealers";

export default async function EditDealerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  // Get dealer data
  const dealer = getDealerById(id);

  if (!dealer) {
    redirect("/dashboard/dealers");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Dealer</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update informasi dealer: {dealer.name}
        </p>
      </div>

      {/* Dealer Form */}
      <DealerForm dealer={dealer} />
    </div>
  );
}
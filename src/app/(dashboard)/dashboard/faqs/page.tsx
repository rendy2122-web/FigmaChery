import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllFaqsForAdmin } from "@/lib/data/faqs";
import { FaqsTable } from "@/components/cms/faqs-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default async function FaqsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const faqs = getAllFaqsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen FAQ</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola pertanyaan yang sering diajukan
          </p>
        </div>
        <Link href="/dashboard/faqs/new">
          <Button>
            <PlusIcon className="size-4 mr-2" />
            Tambah FAQ
          </Button>
        </Link>
      </div>

      <FaqsTable faqs={faqs} />
    </div>
  );
}

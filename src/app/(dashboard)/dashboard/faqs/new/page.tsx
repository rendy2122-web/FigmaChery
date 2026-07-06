import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FaqForm } from "@/components/cms/faq-form";

export default async function NewFaqPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tambah FAQ</h1>
        <p className="mt-1 text-sm text-gray-600">
          Tambahkan pertanyaan dan jawaban baru
        </p>
      </div>

      <FaqForm />
    </div>
  );
}

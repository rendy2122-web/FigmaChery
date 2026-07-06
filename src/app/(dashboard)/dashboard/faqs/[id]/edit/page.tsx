import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FaqForm } from "@/components/cms/faq-form";
import { getFaqById } from "@/lib/data/faqs";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const faq = getFaqById(id);

  if (!faq) {
    redirect("/dashboard/faqs");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit FAQ</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update pertanyaan: {faq.question}
        </p>
      </div>

      <FaqForm faq={faq} />
    </div>
  );
}

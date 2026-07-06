import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllTestimonialsForAdmin } from "@/lib/data/testimonials";
import { TestimonialsTable } from "@/components/cms/testimonials-table";

export default async function TestimonialsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const testimonials = getAllTestimonialsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ulasan Pelanggan</h1>
        <p className="mt-1 text-sm text-gray-600">
          Moderasi ulasan yang dikirim pengunjung dari halaman produk
        </p>
      </div>

      <TestimonialsTable testimonials={testimonials} />
    </div>
  );
}

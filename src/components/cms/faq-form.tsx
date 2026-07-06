"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FaqFormData {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  status: string;
}

interface FaqFormProps {
  faq?: any;
  onSuccess?: () => void;
}

export function FaqForm({ faq, onSuccess }: FaqFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FaqFormData>({
    question: faq?.question || "",
    answer: faq?.answer || "",
    category: faq?.category || "",
    sortOrder: faq?.sort_order || 0,
    status: faq?.status || "published",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = faq ? `/api/faqs/${faq.id}` : "/api/faqs";
      const method = faq ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/faqs");
          router.refresh();
        }
      } else {
        const data = await response.json();
        setError(data.error || "Gagal menyimpan FAQ");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">Pertanyaan *</label>
          <input
            id="question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="Berapa lama masa garansi kendaraan Chery?"
            required
            className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Jawaban *</label>
          <textarea
            id="answer"
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            placeholder="Jawaban lengkap..."
            rows={5}
            required
            className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-deep focus:outline-none"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategori</label>
            <input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Garansi, Pembiayaan, Servis, ..."
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">Urutan</label>
            <input
              id="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : faq ? "Update" : "Tambah FAQ"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Batal
          </Button>
        </div>
      </form>
    </Card>
  );
}

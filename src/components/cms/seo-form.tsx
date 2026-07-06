"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SeoFormData {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonical: string;
  noIndex: boolean;
}

interface SeoFormProps {
  page: string;
  pageLabel: string;
  seo?: {
    title: string | null;
    description: string | null;
    keywords: string | null;
    og_image: string | null;
    canonical: string | null;
    no_index: number;
  };
}

export function SeoForm({ page, pageLabel, seo }: SeoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<SeoFormData>({
    title: seo?.title || "",
    description: seo?.description || "",
    keywords: seo?.keywords || "",
    ogImage: seo?.og_image || "",
    canonical: seo?.canonical || "",
    noIndex: Boolean(seo?.no_index),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(`/api/seo/${page}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Gagal menyimpan SEO");
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
        {success && (
          <div className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-800">
            SEO untuk halaman {pageLabel} berhasil disimpan.
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Meta Title</label>
          <input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Judul yang muncul di tab browser & hasil pencarian"
            className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Deskripsi singkat yang muncul di hasil pencarian Google (maks. ~160 karakter)"
            rows={3}
            className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-deep focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Keywords</label>
          <input
            id="keywords"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            placeholder="Pisahkan dengan koma: Chery Indonesia, dealer Chery, mobil listrik"
            className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700">OG Image URL</label>
            <input
              id="ogImage"
              value={formData.ogImage}
              onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
              placeholder="/og-image.jpg"
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="canonical" className="block text-sm font-medium text-gray-700">Canonical URL</label>
            <input
              id="canonical"
              value={formData.canonical}
              onChange={(e) => setFormData({ ...formData, canonical: e.target.value })}
              placeholder="https://chery.example.com/"
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={formData.noIndex}
            onChange={(e) => setFormData({ ...formData, noIndex: e.target.checked })}
            className="size-4 rounded border-gray-300"
          />
          Sembunyikan dari mesin pencari (noindex)
        </label>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan SEO"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/seo")}
          >
            Kembali
          </Button>
        </div>
      </form>
    </Card>
  );
}

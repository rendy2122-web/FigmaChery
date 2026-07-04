"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import db from "@/lib/db";

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: string;
  status: string;
  publishedAt: string;
  scheduledAt: string;
}

interface ArticleFormProps {
  article?: any;
  onSuccess?: () => void;
}

export function ArticleForm({ article, onSuccess }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(article?.featured_image || "");
  const [categories, setCategories] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ArticleFormData>({
    title: article?.title || "",
    slug: article?.slug || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    featuredImage: article?.featured_image || "",
    categoryId: article?.category_id || "",
    status: article?.status || "draft",
    publishedAt: article?.published_at || "",
    scheduledAt: article?.scheduled_at || "",
  });

  useEffect(() => {
    // Load categories
    const cats = db.prepare("SELECT * FROM categories ORDER BY name").all();
    setCategories(cats);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = article ? `/api/articles/${article.id}` : "/api/articles";
      const method = article ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/articles");
          router.refresh();
        }
      } else {
        const data = await response.json();
        setError(data.error || "Gagal menyimpan artikel");
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", "articles");
    uploadFormData.append("alt", formData.title || "Article featured image");

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, featuredImage: data.url });
        setPreview(data.url);
      } else {
        alert("Gagal upload gambar");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat upload");
    } finally {
      setUploading(false);
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

        {/* Featured Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Featured Image</label>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-brand-deep text-brand-deep hover:bg-brand-deep/5"
              >
                <Upload className="size-4" />
                {uploading ? "Mengupload..." : preview ? "Ganti Gambar" : "Upload Gambar"}
              </button>
            </div>
          </div>
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="Preview" className="h-48 object-cover rounded-lg border-2 border-gray-200" />
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Artikel *</label>
            <input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Judul artikel..."
              required
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug *</label>
            <input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="judul-artikel"
              required
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Ringkasan artikel..."
            rows={2}
            className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-deep focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Konten *</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Konten artikel..."
            rows={12}
            required
            className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-deep focus:outline-none font-mono"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              id="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">Tanggal Publikasi</label>
            <input
              id="publishedAt"
              type="datetime-local"
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : article ? "Update" : "Tambah Artikel"}
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
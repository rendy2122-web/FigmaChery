"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface CarFormData {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  priceFrom: string;
  status: string;
  featured: boolean;
  sortOrder: number;
  thumbnail: string;
}

interface CarFormProps {
  car?: any;
  onSuccess?: () => void;
}

export function CarForm({ car, onSuccess }: CarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(car?.thumbnail || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CarFormData>({
    name: car?.name || "",
    slug: car?.slug || "",
    subtitle: car?.subtitle || "",
    description: car?.description || "",
    priceFrom: car?.price_from || "",
    status: car?.status || "draft",
    featured: car?.featured || false,
    sortOrder: car?.sort_order || 0,
    thumbnail: car?.thumbnail || "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = car ? `/api/cars/${car.id}` : "/api/cars";
      const method = car ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/cars");
          router.refresh();
        }
      } else {
        const data = await response.json();
        setError(data.error || "Gagal menyimpan mobil");
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", "cars");
    uploadFormData.append("alt", formData.name || "Car image");

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, thumbnail: data.url });
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

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Gambar Mobil</label>
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
              <img src={preview} alt="Preview" className="h-32 object-contain rounded-lg border-2 border-gray-200" />
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Mobil *</label>
            <input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Chery Q"
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
              placeholder="chery-q"
              required
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
          <input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Compact SUV"
            className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Deskripsi mobil..."
            rows={4}
            className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-deep focus:outline-none"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="priceFrom" className="block text-sm font-medium text-gray-700">Harga Mulai</label>
            <input
              id="priceFrom"
              value={formData.priceFrom}
              onChange={(e) => setFormData({ ...formData, priceFrom: e.target.value })}
              placeholder="Rp 300.000.000"
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

        <div className="grid gap-6 md:grid-cols-2">
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
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="featured" className="block text-sm font-medium text-gray-700">Featured</label>
            <select
              id="featured"
              value={formData.featured ? "true" : "false"}
              onChange={(e) => setFormData({ ...formData, featured: e.target.value === "true" })}
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            >
              <option value="false">Tidak</option>
              <option value="true">Ya</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : car ? "Update" : "Tambah Mobil"}
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
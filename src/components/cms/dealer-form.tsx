"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import type { Dealer } from "@/lib/data/dealers";

interface DealerFormData {
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  mapsEmbed: string;
  status: string;
  sortOrder: number;
  image: string;
}

interface DealerFormProps {
  dealer?: Dealer;
  onSuccess?: () => void;
}

export function DealerForm({ dealer, onSuccess }: DealerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(dealer?.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<DealerFormData>({
    name: dealer?.name || "",
    city: dealer?.city || "",
    address: dealer?.address || "",
    phone: dealer?.phone || "",
    email: dealer?.email || "",
    whatsapp: dealer?.whatsapp || "",
    mapsEmbed: dealer?.maps_embed || "",
    status: dealer?.status || "active",
    sortOrder: dealer?.sort_order || 0,
    image: dealer?.image || "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = dealer ? `/api/dealers/${dealer.id}` : "/api/dealers";
      const method = dealer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/dealers");
          router.refresh();
        }
      } else {
        const data = await response.json();
        setError(data.error || "Gagal menyimpan dealer");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", "dealers");
    uploadFormData.append("alt", formData.name || "Dealer image");

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, image: data.url });
        setPreview(data.url);
      } else {
        alert("Gagal upload gambar");
      }
    } catch {
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
          <label className="block text-sm font-medium text-gray-700">Gambar Dealer</label>
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
            <div className="relative mt-2 h-48 w-full">
              <Image src={preview} alt="Preview" fill sizes="600px" className="object-cover rounded-lg border-2 border-gray-200" />
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Dealer *</label>
            <input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Chery Cibubur"
              required
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Kota *</label>
            <input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Jakarta"
              required
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat *</label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Alamat lengkap dealer..."
            rows={3}
            required
            className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-deep focus:outline-none"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telepon *</label>
            <input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+62 895 2707 2446"
              required
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="info@chery-cibubur.id"
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">WhatsApp *</label>
            <input
              id="whatsapp"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="6289527072446"
              required
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
          <label htmlFor="mapsEmbed" className="block text-sm font-medium text-gray-700">Google Maps Embed URL</label>
          <textarea
            id="mapsEmbed"
            value={formData.mapsEmbed}
            onChange={(e) => setFormData({ ...formData, mapsEmbed: e.target.value })}
            placeholder="<iframe src='...'></iframe>"
            rows={3}
            className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-deep focus:outline-none font-mono"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : dealer ? "Update" : "Tambah Dealer"}
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
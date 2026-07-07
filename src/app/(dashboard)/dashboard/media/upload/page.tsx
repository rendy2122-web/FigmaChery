"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UploadMediaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setError("Pilih file terlebih dahulu");
      setLoading(false);
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("alt", formData.get("alt") as string);
      uploadFormData.append("folder", formData.get("folder") as string);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        router.push("/dashboard/media");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Gagal upload media");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Media</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload gambar atau video baru
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* File Upload */}
          <div className="space-y-2">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">File *</label>
            <input
              id="file"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              required
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-deep file:text-white hover:file:bg-brand-deep/90"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Preview</label>
              <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                {/* preview is a base64 data: URL from FileReader (pre-upload, never hits the network),
                    so next/image's optimizer doesn't apply here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Alt Text */}
          <div className="space-y-2">
            <label htmlFor="alt" className="block text-sm font-medium text-gray-700">Alt Text</label>
            <input
              id="alt"
              name="alt"
              type="text"
              placeholder="Deskripsi gambar untuk SEO..."
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
          </div>

          {/* Folder */}
          <div className="space-y-2">
            <label htmlFor="folder" className="block text-sm font-medium text-gray-700">Folder</label>
            <select
              id="folder"
              name="folder"
              className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            >
              <option value="general">General</option>
              <option value="cars">Cars</option>
              <option value="articles">Articles</option>
              <option value="promotions">Promotions</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Mengupload..." : "Upload"}
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
    </div>
  );
}
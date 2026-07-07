"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, Upload } from "lucide-react";

type Section = {
  id?: string;
  section_type: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  icon: string;
  features: string[];
  sort_order: number;
  is_active: boolean;
};

const SECTION_TYPES = [
  { value: "hero_banner", label: "Hero Banner" },
  { value: "efficiency", label: "Efisiensi" },
  { value: "performance", label: "Performa" },
  { value: "comfort", label: "Kenyamanan" },
  { value: "colors", label: "Pilihan Warna" },
  { value: "safety", label: "Safety & Dynamics" },
  { value: "pricing", label: "Variant & Pricing" },
];

export default function ProductSectionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${id}/sections`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSections(data);
      }
    } catch (err) {
      console.error("Failed to fetch sections:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // fetchSections only sets state after its internal await resolves, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSections();
  }, [fetchSections]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        section_type: "hero_banner",
        title: "",
        subtitle: "",
        content: "",
        image: "",
        icon: "",
        features: [],
        sort_order: sections.length,
        is_active: true,
      },
    ]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof Section, value: Section[keyof Section]) => {
    setSections(sections.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", "products");
    uploadFormData.append("alt", sections[index].title || "Product section image");

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        updateSection(index, "image", data.url);
      } else {
        alert("Gagal upload gambar");
      }
    } catch {
      alert("Terjadi kesalahan saat upload");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${id}/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections),
      });

      if (res.ok) {
        router.refresh();
        alert("Product sections berhasil disimpan!");
      } else {
        setError("Gagal menyimpan");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Memuat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Sections</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola section-section untuk halaman produk
          </p>
        </div>
        <Button onClick={addSection}>
          <PlusIcon className="size-4 mr-2" />
          Tambah Section
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>
      )}

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Section {index + 1}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSection(index)}
              >
                <TrashIcon className="size-4 text-red-500" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Section Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tipe Section</label>
                <select
                  value={section.section_type}
                  onChange={(e) => updateSection(index, "section_type", e.target.value)}
                  className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                >
                  {SECTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  value={section.title}
                  onChange={(e) => updateSection(index, "title", e.target.value)}
                  placeholder="Judul section"
                  className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  value={section.subtitle}
                  onChange={(e) => updateSection(index, "subtitle", e.target.value)}
                  placeholder="Subtitle"
                  className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>

              {/* Content */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(index, "content", e.target.value)}
                  placeholder="Konten section..."
                  rows={4}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>

              {/* Image URL with upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <div className="flex gap-2">
                  <input
                    value={section.image}
                    onChange={(e) => updateSection(index, "image", e.target.value)}
                    placeholder="/images/section.jpg"
                    className="flex-1 h-[52px] rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 rounded-lg border-2 border-brand-deep text-brand-deep hover:bg-brand-deep/5 shrink-0">
                    <Upload className="size-4" />
                    <span className="text-sm">{uploadingIndex === index ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(index, file);
                      }}
                    />
                  </label>
                </div>
                {section.image && (
                  <div className="relative h-24 w-48 mt-1">
                    <Image src={section.image} alt="" fill sizes="192px" className="object-cover rounded" />
                  </div>
                )}
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Icon (optional)</label>
                <input
                  value={section.icon}
                  onChange={(e) => updateSection(index, "icon", e.target.value)}
                  placeholder="Icon name"
                  className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>

              {/* Features (JSON array) */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Features (JSON array)</label>
                <textarea
                  value={Array.isArray(section.features) ? section.features.join("\n") : ""}
                  onChange={(e) => updateSection(index, "features", e.target.value.split("\n").filter(Boolean))}
                  placeholder='["Feature 1", "Feature 2", "Feature 3"]'
                  rows={3}
                  className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-deep focus:outline-none font-mono"
                />
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                <input
                  type="number"
                  value={section.sort_order}
                  onChange={(e) => updateSection(index, "sort_order", parseInt(e.target.value) || 0)}
                  className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>

              {/* Active */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={section.is_active ? "true" : "false"}
                  onChange={(e) => updateSection(index, "is_active", e.target.value === "true")}
                  className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Semua Section"}
        </Button>
      </div>
    </div>
  );
}
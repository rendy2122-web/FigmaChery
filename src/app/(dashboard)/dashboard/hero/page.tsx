"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, PlusIcon, TrashIcon } from "lucide-react";

interface HeroSlide {
  id: string;
  model: string;
  modelLogo: string;
  banner: string;
  priceFrom: string;
  caption: string;
  ctaText: string;
  ctaLink: string;
}

export default function HeroSlidesPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/homepage/hero");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSlides(data);
      }
    } catch (err) {
      console.error("Failed to fetch slides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const addSlide = () => {
    setSlides([
      ...slides,
      {
        id: "slide-" + Date.now(),
        model: "",
        modelLogo: "",
        banner: "",
        priceFrom: "",
        caption: "Mulai Dari",
        ctaText: "Jadwalkan Test Drive",
        ctaLink: "/booking",
      },
    ]);
  };

  const removeSlide = (id: string) => {
    if (slides.length <= 1) return;
    setSlides(slides.filter((s) => s.id !== id));
  };

  const updateSlide = (id: string, field: keyof HeroSlide, value: string) => {
    setSlides(slides.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleFileUpload = async (id: string, field: "banner" | "modelLogo", file: File) => {
    // Upload file to server
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "hero");
    formData.append("alt", field === "banner" ? "Hero Banner" : "Model Logo");

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        updateSlide(id, field, data.url);
      } else {
        alert("Gagal upload file");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat upload");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/homepage/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slides),
      });

      if (res.ok) {
        router.refresh();
        alert("Hero slides berhasil disimpan!");
      } else {
        setError("Gagal menyimpan");
      }
    } catch (err) {
      setError("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Memuat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola slide banner hero di halaman utama
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={addSlide} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 h-10 px-4">
            <PlusIcon className="size-4 mr-2" />
            Tambah Slide
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving} 
            className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm h-10 px-4 transition-colors"
          >
            {saving ? "Menyimpan..." : "Simpan Semua Slide"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>
      )}

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <Card key={slide.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Slide {index + 1}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSlide(slide.id)}
                disabled={slides.length <= 1}
              >
                <TrashIcon className="size-4 text-red-500" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Banner Image - with upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Banner Image *</label>
                <div className="flex gap-2">
                  <input
                    value={slide.banner}
                    onChange={(e) => updateSlide(slide.id, "banner", e.target.value)}
                    placeholder="/uploads/hero/banner.jpg"
                    className="flex-1 h-[52px] rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 rounded-lg border-2 border-brand-deep text-brand-deep hover:bg-brand-deep/5 shrink-0">
                    <Upload className="size-4" />
                    <span className="text-sm">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(slide.id, "banner", file);
                      }}
                    />
                  </label>
                </div>
                {slide.banner && (
                  <img src={slide.banner} alt="" className="h-24 object-cover rounded mt-1 w-full" />
                )}
              </div>

              {/* Model Logo - with upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Logo Model</label>
                <div className="flex gap-2">
                  <input
                    value={slide.modelLogo}
                    onChange={(e) => updateSlide(slide.id, "modelLogo", e.target.value)}
                    placeholder="/uploads/hero/logo.png"
                    className="flex-1 h-[52px] rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 rounded-lg border-2 border-brand-deep text-brand-deep hover:bg-brand-deep/5 shrink-0">
                    <Upload className="size-4" />
                    <span className="text-sm">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(slide.id, "modelLogo", file);
                      }}
                    />
                  </label>
                </div>
                {slide.modelLogo && (
                  <img src={slide.modelLogo} alt="" className="h-12 object-contain rounded mt-1" />
                )}
              </div>

              {/* Model Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nama Model *</label>
                <input
                  value={slide.model}
                  onChange={(e) => updateSlide(slide.id, "model", e.target.value)}
                  placeholder="Tiggo Cross CSH"
                  className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Harga</label>
                <input
                  value={slide.priceFrom}
                  onChange={(e) => updateSlide(slide.id, "priceFrom", e.target.value)}
                  placeholder="329.800.000"
                  className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Caption</label>
                <input
                  value={slide.caption}
                  onChange={(e) => updateSlide(slide.id, "caption", e.target.value)}
                  placeholder="Mulai Dari"
                  className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>

              {/* CTA Button Text */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Teks Tombol</label>
                <input
                  value={slide.ctaText}
                  onChange={(e) => updateSlide(slide.id, "ctaText", e.target.value)}
                  placeholder="Jadwalkan Test Drive"
                  className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>

              {/* CTA Button Link */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Link Tombol</label>
                <input
                  value={slide.ctaLink}
                  onChange={(e) => updateSlide(slide.id, "ctaLink", e.target.value)}
                  placeholder="/booking"
                  className="h-[52px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 border-t border-gray-200 pt-5">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm h-10 px-5 transition-colors"
        >
          {saving ? "Menyimpan..." : "Simpan Semua Slide"}
        </Button>
      </div>
    </div>
  );
}
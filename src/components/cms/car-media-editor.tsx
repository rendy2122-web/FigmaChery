"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, TrashIcon, CheckCircleIcon, XIcon } from "lucide-react";

interface MediaOverrides {
  interiorImage: string | null;
  exteriorImage: string | null;
  carImage: string | null;
  featureImage: string | null;
}

interface ColorImage {
  id: string;
  url: string;
  color_name: string | null;
  color_hex: string | null;
}

const GALLERY_SLOTS: { key: keyof MediaOverrides; label: string; hint: string }[] = [
  { key: "interiorImage", label: "Interior", hint: "Slide 1 — jok, dashboard, ambient lighting" },
  { key: "exteriorImage", label: "Eksterior", hint: "Slide 2 — siluet dan lekuk bodi" },
  { key: "carImage", label: "Tampilan Depan", hint: "Slide 3 — front fascia, karakter kendaraan" },
  { key: "featureImage", label: "Fitur / Teknologi", hint: "Bagian Sasis & Keamanan" },
];

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "cars");
  formData.append("alt", file.name);

  const res = await fetch("/api/media/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url as string;
}

export function CarMediaEditor({ carId }: { carId: string }) {
  const [overrides, setOverrides] = useState<MediaOverrides>({
    interiorImage: null,
    exteriorImage: null,
    carImage: null,
    featureImage: null,
  });
  const [colors, setColors] = useState<ColorImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [savingMedia, setSavingMedia] = useState(false);
  const [mediaSaved, setMediaSaved] = useState(false);
  const [addingColor, setAddingColor] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#8A8D90");
  const [newColorFile, setNewColorFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const colorFileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const [mediaRes, colorsRes] = await Promise.all([
        fetch(`/api/cars/${carId}/media`),
        fetch(`/api/cars/${carId}/colors`),
      ]);
      const mediaData = await mediaRes.json();
      const colorsData = await colorsRes.json();

      if (mediaData && !mediaData.error) setOverrides(mediaData);
      if (Array.isArray(colorsData)) setColors(colorsData);
    } catch (err) {
      console.error("Failed to load car media:", err);
    } finally {
      setLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    // load() only sets state after its internal await resolves, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const handleSlotUpload = async (key: keyof MediaOverrides, file: File) => {
    setUploadingSlot(key);
    setError("");
    try {
      const url = await uploadFile(file);
      setOverrides((prev) => ({ ...prev, [key]: url }));
    } catch {
      setError("Gagal upload gambar");
    } finally {
      setUploadingSlot(null);
    }
  };

  const saveMedia = async () => {
    setError("");
    setSavingMedia(true);
    try {
      const res = await fetch(`/api/cars/${carId}/media`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(overrides),
      });
      if (res.ok) {
        setMediaSaved(true);
        setTimeout(() => setMediaSaved(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan galeri");
      }
    } catch {
      setError("Terjadi kesalahan saat menyimpan galeri");
    } finally {
      setSavingMedia(false);
    }
  };

  const handleAddColor = async () => {
    if (!newColorFile || !newColorName.trim()) {
      setError("Nama warna dan gambar wajib diisi");
      return;
    }

    setError("");
    setAddingColor(true);
    try {
      const url = await uploadFile(newColorFile);
      const res = await fetch(`/api/cars/${carId}/colors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, colorName: newColorName.trim(), colorHex: newColorHex }),
      });

      if (res.ok) {
        setNewColorName("");
        setNewColorHex("#8A8D90");
        setNewColorFile(null);
        if (colorFileInputRef.current) colorFileInputRef.current.value = "";
        await load();
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menambah varian warna");
      }
    } catch {
      setError("Terjadi kesalahan saat menambah varian warna");
    } finally {
      setAddingColor(false);
    }
  };

  const handleDeleteColor = async (imageId: string) => {
    if (!confirm("Hapus varian warna ini?")) return;

    try {
      const res = await fetch(`/api/cars/${carId}/colors/${imageId}`, { method: "DELETE" });
      if (res.ok) {
        setColors(colors.filter((c) => c.id !== imageId));
      } else {
        alert("Gagal menghapus varian warna");
      }
    } catch {
      alert("Terjadi kesalahan");
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Memuat...</div>;

  return (
    <div className="space-y-6">
      {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>}

      {/* Gallery overrides */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Galeri Foto</h2>
        <p className="text-sm text-gray-500">
          Kosongkan untuk memakai foto bawaan mobil ini. Slide ini muncul di bagian &quot;Kenyamanan
          Kabin Kelas VIP&quot; dan &quot;Sasis &amp; Keamanan&quot; pada halaman produk.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GALLERY_SLOTS.map((slot) => (
            <div key={slot.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{slot.label}</label>
              <p className="text-xs text-gray-400">{slot.hint}</p>
              <div className="relative h-32 w-full rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
                {overrides[slot.key] && (
                  <Image src={overrides[slot.key] as string} alt={slot.label} fill sizes="200px" className="object-cover" />
                )}
              </div>
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 h-9 rounded-lg border-2 border-brand-deep text-brand-deep hover:bg-brand-deep/5 text-xs font-medium">
                  <Upload className="size-3.5" />
                  {uploadingSlot === slot.key ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleSlotUpload(slot.key, file);
                    }}
                  />
                </label>
                {overrides[slot.key] && (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Kembali ke foto bawaan"
                    onClick={() => setOverrides((prev) => ({ ...prev, [slot.key]: null }))}
                  >
                    <XIcon className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={saveMedia} disabled={savingMedia}>
            {savingMedia ? "Menyimpan..." : "Simpan Galeri"}
          </Button>
          {mediaSaved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <CheckCircleIcon className="size-4" /> Tersimpan
            </span>
          )}
        </div>
      </Card>

      {/* Color variants */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Varian Warna</h2>
        <p className="text-sm text-gray-500">
          Menentukan pilihan warna di halaman produk. Kosongkan semua untuk menyembunyikan color picker.
        </p>

        {colors.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {colors.map((color) => (
              <div key={color.id} className="space-y-2">
                <div className="relative h-24 w-full rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                  <Image src={color.url} alt={color.color_name || ""} fill sizes="150px" className="object-cover" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="size-3.5 rounded-full border border-gray-300 shrink-0"
                      style={{ backgroundColor: color.color_hex || "#ccc" }}
                    />
                    <span className="text-xs font-medium text-gray-700 truncate">{color.color_name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 shrink-0"
                    onClick={() => handleDeleteColor(color.id)}
                  >
                    <TrashIcon className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <span className="text-sm font-medium text-gray-700">Tambah Varian Warna</span>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-3 items-center">
            <input
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Nama warna (contoh: Midnight Black)"
              className="h-[44px] rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
            />
            <div className="flex items-center gap-2 h-[44px] rounded-lg border-2 border-gray-200 bg-white px-3">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="size-7 shrink-0 cursor-pointer"
              />
              <span className="text-xs text-gray-500">{newColorHex}</span>
            </div>
            <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 h-[44px] px-4 rounded-lg border-2 border-brand-deep text-brand-deep hover:bg-brand-deep/5 text-sm font-medium whitespace-nowrap">
              <Upload className="size-4" />
              {newColorFile ? newColorFile.name.slice(0, 12) : "Pilih Foto"}
              <input
                ref={colorFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setNewColorFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          <Button onClick={handleAddColor} disabled={addingColor}>
            {addingColor ? "Menambah..." : "Tambah Warna"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, CheckCircleIcon } from "lucide-react";

interface SpecRow {
  label: string;
  value: string;
}

interface FeatureRow {
  title: string;
  description: string;
  icon: string;
}

const ICON_OPTIONS = [
  "Zap", "ShieldCheck", "Tv", "Compass", "Flame", "Layers", "Volume2", "Volume", "Sparkles", "CheckCircle",
];

export function CarContentEditor({ carId }: { carId: string }) {
  const [specs, setSpecs] = useState<SpecRow[]>([]);
  const [features, setFeatures] = useState<FeatureRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSpecs, setSavingSpecs] = useState(false);
  const [savingFeatures, setSavingFeatures] = useState(false);
  const [specsSaved, setSpecsSaved] = useState(false);
  const [featuresSaved, setFeaturesSaved] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [specsRes, featuresRes] = await Promise.all([
        fetch(`/api/cars/${carId}/specs`),
        fetch(`/api/cars/${carId}/features`),
      ]);
      const specsData = await specsRes.json();
      const featuresData = await featuresRes.json();

      setSpecs(
        Array.isArray(specsData)
          ? specsData.map((s) => ({ label: s.label, value: s.value }))
          : []
      );
      setFeatures(
        Array.isArray(featuresData)
          ? featuresData.map((f) => ({
              title: f.title,
              description: f.description || "",
              icon: f.icon || "CheckCircle",
            }))
          : []
      );
    } catch (err) {
      console.error("Failed to load car content:", err);
    } finally {
      setLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    // load() only sets state after its internal await resolves, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const saveSpecs = async () => {
    setError("");
    setSavingSpecs(true);
    try {
      const res = await fetch(`/api/cars/${carId}/specs`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(specs),
      });
      if (res.ok) {
        setSpecsSaved(true);
        setTimeout(() => setSpecsSaved(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan spesifikasi");
      }
    } catch {
      setError("Terjadi kesalahan saat menyimpan spesifikasi");
    } finally {
      setSavingSpecs(false);
    }
  };

  const saveFeatures = async () => {
    setError("");
    setSavingFeatures(true);
    try {
      const res = await fetch(`/api/cars/${carId}/features`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(features),
      });
      if (res.ok) {
        setFeaturesSaved(true);
        setTimeout(() => setFeaturesSaved(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan fitur");
      }
    } catch {
      setError("Terjadi kesalahan saat menyimpan fitur");
    } finally {
      setSavingFeatures(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Memuat...</div>;

  return (
    <div className="space-y-6">
      {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>}

      {/* Specs */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Spesifikasi Teknis</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setSpecs([...specs, { label: "", value: "" }])}
          >
            <PlusIcon className="size-4" /> Tambah Baris
          </Button>
        </div>

        <div className="space-y-3">
          {specs.map((spec, i) => (
            <div key={i} className="flex gap-3 items-start">
              <input
                value={spec.label}
                onChange={(e) =>
                  setSpecs(specs.map((s, idx) => (idx === i ? { ...s, label: e.target.value } : s)))
                }
                placeholder="Label (contoh: Motor power (kW))"
                className="flex-1 h-[44px] rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
              />
              <input
                value={spec.value}
                onChange={(e) =>
                  setSpecs(specs.map((s, idx) => (idx === i ? { ...s, value: e.target.value } : s)))
                }
                placeholder="Nilai (contoh: 70)"
                className="flex-1 h-[44px] rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50 shrink-0"
                onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          ))}
          {specs.length === 0 && (
            <p className="text-sm text-gray-500">Belum ada spesifikasi. Klik &quot;Tambah Baris&quot;.</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={saveSpecs} disabled={savingSpecs}>
            {savingSpecs ? "Menyimpan..." : "Simpan Spesifikasi"}
          </Button>
          {specsSaved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <CheckCircleIcon className="size-4" /> Tersimpan
            </span>
          )}
        </div>
      </Card>

      {/* Features */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Fitur Unggulan</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setFeatures([...features, { title: "", description: "", icon: "CheckCircle" }])}
          >
            <PlusIcon className="size-4" /> Tambah Fitur
          </Button>
        </div>

        <div className="space-y-4">
          {features.map((feature, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_140px_auto] items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <input
                value={feature.title}
                onChange={(e) =>
                  setFeatures(features.map((f, idx) => (idx === i ? { ...f, title: e.target.value } : f)))
                }
                placeholder="Judul fitur"
                className="h-[44px] rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
              />
              <input
                value={feature.description}
                onChange={(e) =>
                  setFeatures(features.map((f, idx) => (idx === i ? { ...f, description: e.target.value } : f)))
                }
                placeholder="Deskripsi singkat"
                className="h-[44px] rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
              />
              <select
                value={feature.icon}
                onChange={(e) =>
                  setFeatures(features.map((f, idx) => (idx === i ? { ...f, icon: e.target.value } : f)))
                }
                className="h-[44px] rounded-lg border-2 border-gray-200 bg-white px-3 text-sm focus:border-brand-deep focus:outline-none"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50"
                onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          ))}
          {features.length === 0 && (
            <p className="text-sm text-gray-500">Belum ada fitur. Klik &quot;Tambah Fitur&quot;.</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={saveFeatures} disabled={savingFeatures}>
            {savingFeatures ? "Menyimpan..." : "Simpan Fitur"}
          </Button>
          {featuresSaved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <CheckCircleIcon className="size-4" /> Tersimpan
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";
import type { AdminSettingRow } from "@/lib/data/settings";

interface SettingsFormProps {
  settings: AdminSettingRow[];
}

const LABELS: Record<string, string> = {
  site_name: "Nama Situs",
  site_description: "Deskripsi Situs",
  contact_email: "Email Sales",
  contact_phone: "Nomor Telepon Sales",
  operating_hours: "Jam Operasional",
  showroom_address: "Alamat Showroom",
  facebook_url: "URL Facebook",
  instagram_url: "URL Instagram",
  youtube_url: "URL YouTube",
};

const GROUP_LABELS: Record<string, string> = {
  general: "Umum",
  contact: "Kontak",
  social: "Media Sosial",
};

const LONG_FIELDS = new Set(["site_description", "showroom_address"]);

export function SettingsForm({ settings }: SettingsFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(settings.map((s) => [s.key, s.value]))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const groups = settings.reduce<Record<string, AdminSettingRow[]>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Gagal menyimpan pengaturan");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.entries(groups).map(([group, rows]) => (
        <Card key={group} className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">{GROUP_LABELS[group] || group}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rows.map((row) => (
              <div
                key={row.key}
                className={`space-y-1.5 ${LONG_FIELDS.has(row.key) ? "sm:col-span-2" : ""}`}
              >
                <label htmlFor={row.key} className="block text-sm font-medium text-gray-700">
                  {LABELS[row.key] || row.key}
                </label>
                {LONG_FIELDS.has(row.key) ? (
                  <textarea
                    id={row.key}
                    rows={2}
                    value={values[row.key] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [row.key]: e.target.value }))}
                    className="h-auto w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-brand-deep focus:outline-none"
                  />
                ) : (
                  <input
                    id={row.key}
                    type="text"
                    value={values[row.key] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [row.key]: e.target.value }))}
                    className="h-[44px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
        {success && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <CheckCircleIcon className="size-4" /> Tersimpan
          </span>
        )}
      </div>
    </form>
  );
}

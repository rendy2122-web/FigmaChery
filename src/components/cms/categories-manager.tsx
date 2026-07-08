"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, PlusIcon, XIcon } from "lucide-react";
import type { Category } from "@/lib/data/articles";

interface CategoriesManagerProps {
  categories: Category[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

interface FormState {
  name: string;
  slug: string;
  description: string;
}

const emptyForm: FormState = { name: "", slug: "", description: "" };

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setIsAdding(false);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "" });
    setError("");
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({ ...prev, name, slug: slugify(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        cancel();
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Gagal menyimpan kategori");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kategori ini?")) return;

    setDeletingId(id);

    try {
      const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Gagal menghapus kategori");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {!isAdding && !editingId && (
        <Button onClick={startAdd} className="gap-1.5">
          <PlusIcon className="size-4" /> Tambah Kategori
        </Button>
      )}

      {(isAdding || editingId) && (
        <Card className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-gray-900">
              {editingId ? "Edit Kategori" : "Kategori Baru"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="h-[44px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="h-[44px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="h-[44px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-sm focus:border-brand-deep focus:outline-none"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button type="button" variant="ghost" onClick={cancel} className="gap-1.5">
                <XIcon className="size-4" /> Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      {categories.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Belum ada kategori artikel.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <Card key={cat.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-sm text-gray-900">{cat.name}</span>
                <span className="text-xs text-gray-500">
                  /{cat.slug}
                  {cat.description ? ` — ${cat.description}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => startEdit(cat)}>
                  <PencilIcon className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

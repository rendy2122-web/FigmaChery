"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon, StarIcon, CheckCircleIcon } from "lucide-react";

interface TestimonialItem {
  id: string;
  car_name: string | null;
  author_name: string;
  rating: number;
  comment: string;
  verified: number;
  likes: number;
  status: string;
  created_at: string;
}

interface TestimonialsTableProps {
  testimonials: TestimonialItem[];
}

export function TestimonialsTable({ testimonials }: TestimonialsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Gagal menghapus ulasan");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  if (testimonials.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">Belum ada ulasan dari pelanggan.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {testimonials.map((item) => (
        <Card key={item.id} className="p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-900">{item.author_name}</span>
                {Boolean(item.verified) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    <CheckCircleIcon className="size-3" /> Verified
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {item.car_name || "Umum"} &middot; {new Date(item.created_at).toLocaleDateString("id-ID")}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`size-3.5 ${star <= item.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50"
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{item.comment}</p>

          <span className="text-xs text-gray-400">Membantu ({item.likes})</span>
        </Card>
      ))}
    </div>
  );
}

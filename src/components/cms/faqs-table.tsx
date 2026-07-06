"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  status: string;
}

interface FaqsTableProps {
  faqs: FaqItem[];
}

export function FaqsTable({ faqs }: FaqsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/faqs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Gagal menghapus FAQ");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  if (faqs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">Belum ada FAQ. Tambahkan FAQ pertama Anda!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <Card key={faq.id} className="p-5 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-900">{faq.question}</span>
              {faq.status !== "published" && (
                <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                  Draft
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{faq.answer}</p>
            {faq.category && (
              <span className="text-[10px] font-bold uppercase text-brand-deep">{faq.category}</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/dashboard/faqs/${faq.id}/edit`}>
              <Button variant="ghost" size="icon">
                <PencilIcon className="size-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:bg-red-50"
              onClick={() => handleDelete(faq.id)}
              disabled={deletingId === faq.id}
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

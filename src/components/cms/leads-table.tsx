"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon, PhoneIcon, StoreIcon, CarIcon } from "lucide-react";

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  dealer_name: string | null;
  car_interest: string | null;
  source: string;
  created_at: string;
}

interface LeadsTableProps {
  leads: LeadItem[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus lead ini? Tindakan ini tidak bisa dibatalkan.")) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Gagal menghapus lead");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  const whatsappHref = (phone: string) =>
    `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;

  if (leads.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">Belum ada lead yang tertangkap dari CHIVA.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <Card key={lead.id} className="p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-sm text-gray-900">{lead.name}</span>
              <span className="text-xs text-gray-500">
                {new Date(lead.created_at).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                render={<a href={whatsappHref(lead.phone)} target="_blank" rel="noopener noreferrer" />}
              >
                <PhoneIcon className="size-3.5" /> Hubungi
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50"
                onClick={() => handleDelete(lead.id)}
                disabled={deletingId === lead.id}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <PhoneIcon className="size-3.5 text-gray-400" /> {lead.phone}
            </span>
            {lead.dealer_name && (
              <span className="flex items-center gap-1.5">
                <StoreIcon className="size-3.5 text-gray-400" /> {lead.dealer_name}
              </span>
            )}
            {lead.car_interest && (
              <span className="flex items-center gap-1.5">
                <CarIcon className="size-3.5 text-gray-400" /> {lead.car_interest}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

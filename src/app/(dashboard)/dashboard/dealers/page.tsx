"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react";
import Link from "next/link";

interface Dealer {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  maps_embed: string;
  status: string;
  sort_order: number;
  image: string;
}

export default function DealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDealers = async () => {
    try {
      const res = await fetch("/api/dealers");
      const data = await res.json();
      if (Array.isArray(data)) {
        setDealers(data);
      }
    } catch (err) {
      console.error("Failed to fetch dealers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchDealers only sets state after its internal await resolves, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDealers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dealer ini?")) {
      return;
    }

    setDeletingId(id);

    try {
      const res = await fetch(`/api/dealers/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDealers(dealers.filter((d) => d.id !== id));
      } else {
        alert("Gagal menghapus dealer");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Memuat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Dealer</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola data dealer Chery
          </p>
        </div>
        <Link href="/dashboard/dealers/new">
          <Button>
            <PlusIcon className="size-4 mr-2" />
            Tambah Dealer
          </Button>
        </Link>
      </div>

      {dealers.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Belum ada dealer. Tambahkan dealer pertama Anda!</p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dealers.map((dealer) => (
            <Card key={dealer.id} className="overflow-hidden">
              {dealer.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={dealer.image}
                    alt={dealer.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{dealer.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{dealer.city}</p>
                <p className="text-sm text-gray-600 mt-2">{dealer.address}</p>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-gray-600">📞 {dealer.phone}</p>
                  {dealer.email && <p className="text-sm text-gray-600">✉️ {dealer.email}</p>}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/dealers/${dealer.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <PencilIcon className="size-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(dealer.id)}
                    disabled={deletingId === dealer.id}
                  >
                    <TrashIcon className="size-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, EyeIcon, SettingsIcon, ListIcon } from "lucide-react";

interface Car {
  id: string;
  name: string;
  slug: string;
  status: string;
  featured: number;
  image_count: number;
  thumbnail: string | null;
  created_at: string;
}

interface CarsTableProps {
  cars: Car[];
}

export function CarsTable({ cars }: CarsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus mobil ini?")) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Gagal menghapus mobil");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "published" ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Published
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Draft
      </span>
    );
  };

  if (cars.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">Belum ada mobil. Tambahkan mobil pertama Anda!</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gambar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {car.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {car.slug}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(car.status)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {car.image_count} foto
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(car.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/cars/${car.id}`}>
                      <Button variant="ghost" size="icon">
                        <EyeIcon className="size-4" />
                      </Button>
                    </Link>
                  <Link href={`/dashboard/cars/${car.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <PencilIcon className="size-4" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/cars/${car.id}/content`}>
                    <Button variant="ghost" size="icon" title="Kelola Spesifikasi & Fitur">
                      <ListIcon className="size-4 text-emerald-600" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/products/${car.id}/sections`}>
                    <Button variant="ghost" size="icon" title="Kelola Section Tambahan">
                      <SettingsIcon className="size-4 text-blue-600" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(car.id)}
                    disabled={deletingId === car.id}
                  >
                    <TrashIcon className="size-4 text-red-600" />
                  </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
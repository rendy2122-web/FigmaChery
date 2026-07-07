"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, EyeIcon } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  category_name?: string | null;
  views: number;
  created_at: string;
}

interface ArticlesTableProps {
  articles: Article[];
}

export function ArticlesTable({ articles }: ArticlesTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Gagal menghapus artikel");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      published: { label: "Published", className: "bg-green-100 text-green-800" },
      draft: { label: "Draft", className: "bg-yellow-100 text-yellow-800" },
      scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800" },
    };

    const statusInfo = statusMap[status] || statusMap.draft;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (articles.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">Belum ada artikel. Tambahkan artikel pertama Anda!</p>
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
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
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
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {article.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {article.slug}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.category_name || "-"}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(article.status)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.views}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(article.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/articles/${article.id}`}>
                      <Button variant="ghost" size="icon">
                        <EyeIcon className="size-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/articles/${article.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <PencilIcon className="size-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(article.id)}
                      disabled={deletingId === article.id}
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
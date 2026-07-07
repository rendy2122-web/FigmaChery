"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrashIcon, FileTextIcon, ImageIcon, VideoIcon } from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  folder: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  created_at: string;
}

export type { MediaItem };

interface MediaTableProps {
  media: MediaItem[];
}

export function MediaTable({ media }: MediaTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus media ini?")) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Gagal menghapus media");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return ImageIcon;
    if (mimeType.startsWith("video/")) return VideoIcon;
    return FileTextIcon;
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  if (media.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">Belum ada media. Upload media pertama Anda!</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => {
          const Icon = getFileIcon(item.mime_type);
          return (
            <div
              key={item.id}
              className="group relative aspect-square rounded-lg border-2 border-gray-200 overflow-hidden hover:border-brand-deep transition-colors"
            >
              {isImage(item.mime_type) ? (
                <Image
                  src={item.url}
                  alt={item.alt || item.original_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <Icon className="size-12 text-gray-400" />
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  <TrashIcon className="size-5" />
                </Button>
              </div>

              {/* File info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-xs text-white truncate">{item.original_name}</p>
                <p className="text-xs text-white/70">{formatFileSize(item.size)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
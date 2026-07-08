import Link from "next/link";
import "./globals.css";
import { fontVariables } from "./fonts";

// Handles URLs that don't match any route at all. With multiple root
// layouts (marketing/dashboard/auth each define their own <html>), Next.js
// needs a top-level not-found that can render standalone rather than
// assuming a single shared root layout exists.
export default function NotFound() {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 bg-white text-[#1A1A1A]">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold">Halaman Tidak Ditemukan</h1>
          <p className="max-w-md text-slate-500">
            Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-md bg-[#1A1A1A] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1A1A1A]/90"
        >
          Kembali ke Beranda
        </Link>
      </body>
    </html>
  );
}

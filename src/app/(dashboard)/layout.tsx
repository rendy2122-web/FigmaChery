import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontVariables } from "../fonts";

// Its own root layout (separate from the marketing site's) so dashboard
// pages don't pay for mounting the public Navbar/Footer/chat widget/booking
// popup — and the DB queries those fetch — on every single admin page load.
// The actual admin chrome (sidebar, admin navbar) lives one level down in
// (dashboard)/dashboard/layout.tsx.
export const metadata: Metadata = {
  title: "Dashboard | Chery CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

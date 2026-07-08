import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontVariables } from "../fonts";

// Its own root layout for the same reason as (dashboard) — the login page
// has no use for the marketing site's Navbar/Footer/chat widget/booking
// popup (and the DB queries they trigger).
export const metadata: Metadata = {
  title: "Login | Chery CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AuthRootLayout({
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

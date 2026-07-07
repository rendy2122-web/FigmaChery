import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkipToContent } from "@/components/layout/skip-to-content";
import CheryAssistant from "@/components/product/chery-assistant";
import { BookingModalProvider } from "@/components/product/booking-modal-provider";
import { getPublishedCars } from "@/lib/data/cars";
import { getActiveDealers } from "@/lib/data/dealers";
import { siteConfig } from "@/lib/site-config";

// Applies as the revalidate ceiling for every static page that doesn't set
// its own (dashboard pages are already dynamic via auth). Without this, a
// fully static page — including the Footer's DB-backed car list rendered
// here — gets frozen at Docker build time, before the database is seeded.
export const revalidate = 60;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Chery", "automotive", "SUV", "sedan", "car dealership"],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/chery-logo.png",
    shortcut: "/chery-logo.png",
    apple: "/chery-logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetched once here so every "Book Test Drive" trigger site-wide (navbar,
  // hero, dealer pages, credit calculator, etc.) can open the same booking
  // popup via useBookingModal() instead of navigating to a separate page.
  const bookingCars = getPublishedCars().map((c) => ({
    id: c.id,
    name: c.name,
    basePrice: c.price_from ?? undefined,
  }));
  const bookingDealers = getActiveDealers().map((d) => ({
    id: d.id,
    name: d.name,
    city: d.city,
  }));

  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BookingModalProvider cars={bookingCars} dealers={bookingDealers}>
          <SkipToContent />
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CheryAssistant />
        </BookingModalProvider>
      </body>
    </html>
  );
}

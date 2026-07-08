import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";

// Shared across every root layout (marketing, dashboard, auth) so the same
// CSS variables/classes are available everywhere — next/font dedupes the
// actual font loading regardless of how many layouts import this.
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const fontVariables = `${inter.variable} ${geistMono.variable} ${jakarta.variable}`;

import db from "@/lib/db";

interface RawSection {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  metadata: string | null;
}

function getRawSection(section: string): RawSection | undefined {
  return db.prepare("SELECT * FROM homepage_sections WHERE section = ?").get(section) as
    | RawSection
    | undefined;
}

function parseMetadata<T>(raw: RawSection | undefined, fallback: T): T {
  if (!raw?.metadata) return fallback;
  try {
    return JSON.parse(raw.metadata) as T;
  } catch {
    return fallback;
  }
}

export interface SectionHeader {
  eyebrow: string;
  heading: string;
  subtext: string;
}

function getHeader(raw: RawSection | undefined): SectionHeader {
  return {
    eyebrow: raw?.title ?? "",
    heading: raw?.subtitle ?? "",
    subtext: raw?.description ?? "",
  };
}

export interface BenefitCard {
  icon: string;
  title: string;
  description: string;
}

export function getWhyCherySection(): { header: SectionHeader; benefits: BenefitCard[] } {
  const raw = getRawSection("why-chery");
  return { header: getHeader(raw), benefits: parseMetadata<BenefitCard[]>(raw, []) };
}

export interface ServiceCard {
  icon: string;
  title: string;
  description: string;
}

export function getServicesSection(): { header: SectionHeader; services: ServiceCard[] } {
  const raw = getRawSection("services");
  return { header: getHeader(raw), services: parseMetadata<ServiceCard[]>(raw, []) };
}

export interface OfferCard {
  id: string;
  image: string;
  badge?: { label: string; variant: "dark" | "light" };
  title: string;
  tag: string;
  description: string;
  validUntil: string;
}

export function getSpecialOffersSection(): { header: SectionHeader; offers: OfferCard[] } {
  const raw = getRawSection("special-offers");
  return { header: getHeader(raw), offers: parseMetadata<OfferCard[]>(raw, []) };
}

export function getCtaSection(): { header: SectionHeader } {
  const raw = getRawSection("cta");
  return { header: getHeader(raw) };
}

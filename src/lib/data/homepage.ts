import db from "@/lib/db";
import type { heroSlidesSchema } from "@/lib/api-validation";
import type { z } from "zod";

export type HeroSlide = z.infer<typeof heroSlidesSchema>[number];

interface HomepageSectionRow {
  id: string;
  section: string;
  metadata: string | null;
}

/** Hero slides are stored as a JSON array inside homepage_sections.metadata (section='hero'). */
export function getHeroSlides(): HeroSlide[] {
  const hero = db
    .prepare("SELECT * FROM homepage_sections WHERE section = 'hero'")
    .get() as HomepageSectionRow | undefined;

  if (!hero?.metadata) return [];

  try {
    return JSON.parse(hero.metadata);
  } catch {
    return [];
  }
}

export function updateHeroSlides(slides: HeroSlide[]) {
  const metadata = JSON.stringify(slides);
  const now = new Date().toISOString();

  const existing = db
    .prepare("SELECT * FROM homepage_sections WHERE section = 'hero'")
    .get() as HomepageSectionRow | undefined;

  if (existing) {
    db.prepare(
      "UPDATE homepage_sections SET metadata = ?, updated_at = ? WHERE section = 'hero'"
    ).run(metadata, now);
  } else {
    const id = Date.now().toString();
    db.prepare(
      "INSERT INTO homepage_sections (id, section, metadata, is_active, created_at, updated_at) VALUES (?, 'hero', ?, 1, ?, ?)"
    ).run(id, metadata, now, now);
  }
}

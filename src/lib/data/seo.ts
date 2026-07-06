import { randomUUID } from "crypto";
import db from "@/lib/db";

export interface SeoMetadataRow {
  id: string;
  page: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_image: string | null;
  canonical: string | null;
  no_index: number;
  created_at: string;
  updated_at: string;
}

export interface SeoMetadataInput {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
  canonical?: string | null;
  noIndex?: boolean;
}

export function getSeoMetadata(page: string): SeoMetadataRow | undefined {
  return db.prepare("SELECT * FROM seo_metadata WHERE page = ?").get(page) as
    | SeoMetadataRow
    | undefined;
}

export function getAllSeoMetadataForAdmin(): SeoMetadataRow[] {
  return db.prepare("SELECT * FROM seo_metadata ORDER BY page ASC").all() as SeoMetadataRow[];
}

export function upsertSeoMetadata(page: string, input: SeoMetadataInput) {
  const now = new Date().toISOString();
  const existing = getSeoMetadata(page);

  if (existing) {
    db.prepare(
      `UPDATE seo_metadata
       SET title = ?, description = ?, keywords = ?, og_image = ?, canonical = ?, no_index = ?, updated_at = ?
       WHERE page = ?`
    ).run(
      input.title ?? null,
      input.description ?? null,
      input.keywords ?? null,
      input.ogImage ?? null,
      input.canonical ?? null,
      input.noIndex ? 1 : 0,
      now,
      page
    );
  } else {
    db.prepare(
      `INSERT INTO seo_metadata (id, page, title, description, keywords, og_image, canonical, no_index, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      randomUUID(),
      page,
      input.title ?? null,
      input.description ?? null,
      input.keywords ?? null,
      input.ogImage ?? null,
      input.canonical ?? null,
      input.noIndex ? 1 : 0,
      now,
      now
    );
  }
}

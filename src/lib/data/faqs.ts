import { randomUUID } from "crypto";
import db from "@/lib/db";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface FaqWriteInput {
  question: string;
  answer: string;
  category?: string | null;
  sortOrder?: number;
  status?: string;
}

/** Public FAQ list — published & not deleted, ordered for display. */
export function getPublishedFaqs(): Faq[] {
  return db
    .prepare(
      "SELECT * FROM faqs WHERE status = 'published' AND deleted_at IS NULL ORDER BY sort_order ASC, created_at ASC"
    )
    .all() as Faq[];
}

export function getFaqById(id: string): Faq | undefined {
  return db.prepare("SELECT * FROM faqs WHERE id = ? AND deleted_at IS NULL").get(id) as
    | Faq
    | undefined;
}

/** Admin list — every non-deleted FAQ regardless of status. */
export function getAllFaqsForAdmin(): Faq[] {
  return db
    .prepare("SELECT * FROM faqs WHERE deleted_at IS NULL ORDER BY sort_order ASC, created_at ASC")
    .all() as Faq[];
}

export function createFaq(input: FaqWriteInput): string {
  const id = randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO faqs (id, question, answer, category, sort_order, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.question,
    input.answer,
    input.category ?? null,
    input.sortOrder || 0,
    input.status || "published",
    now,
    now
  );

  return id;
}

export function updateFaq(id: string, input: FaqWriteInput): boolean {
  const now = new Date().toISOString();

  const result = db
    .prepare(
      `UPDATE faqs
       SET question = ?, answer = ?, category = ?, sort_order = ?, status = ?, updated_at = ?
       WHERE id = ? AND deleted_at IS NULL`
    )
    .run(
      input.question,
      input.answer,
      input.category ?? null,
      input.sortOrder || 0,
      input.status || "published",
      now,
      id
    );

  return result.changes > 0;
}

export function softDeleteFaq(id: string): boolean {
  const now = new Date().toISOString();
  const result = db
    .prepare("UPDATE faqs SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL")
    .run(now, now, id);
  return result.changes > 0;
}

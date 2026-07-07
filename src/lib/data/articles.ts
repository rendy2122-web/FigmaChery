import { randomUUID } from "crypto";
import db from "@/lib/db";

/**
 * Plain interface, not zod-derived — the articles API route never actually
 * ran payloads through the createArticleSchema/updateArticleSchema in
 * api-validation.ts (only a manual `!title || !slug` check), so mirroring
 * that here keeps Phase 0 a pure refactor rather than introducing new validation.
 */
export interface ArticleWriteInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: string | null;
  categoryId?: string | null;
  status?: string;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  author?: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  status: string;
  published_at: string | null;
  scheduled_at: string | null;
  views: number;
  category_id: string | null;
  author: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PublicArticleRow extends Article {
  category_name: string | null;
  category_slug: string | null;
}

export interface AdminArticleRow extends Article {
  category_name: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

/** Public article list — published & not deleted, joined with category name/slug. */
export function getPublishedArticles(): PublicArticleRow[] {
  return db
    .prepare(
      `SELECT a.*, c.name as category_name, c.slug as category_slug
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.status = 'published' AND a.deleted_at IS NULL
       ORDER BY a.published_at DESC, a.created_at DESC`
    )
    .all() as PublicArticleRow[];
}

/** Single published article by slug, joined with category — public detail page. */
export function getArticleBySlugForPublic(slug: string): PublicArticleRow | undefined {
  return db
    .prepare(
      `SELECT a.*, c.name as category_name, c.slug as category_slug
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.slug = ? AND a.status = 'published' AND a.deleted_at IS NULL`
    )
    .get(slug) as PublicArticleRow | undefined;
}

/** Single article by id, respecting soft-delete — used by the public API + admin edit form. */
export function getArticleById(id: string): Article | undefined {
  return db.prepare("SELECT * FROM articles WHERE id = ? AND deleted_at IS NULL").get(id) as
    | Article
    | undefined;
}

/** Admin list — every non-deleted article regardless of status. */
export function getAllArticlesForAdmin(): AdminArticleRow[] {
  return db
    .prepare(
      `SELECT a.*, c.name as category_name
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.deleted_at IS NULL
       ORDER BY a.created_at DESC`
    )
    .all() as AdminArticleRow[];
}

export function getCategories(): Category[] {
  return db.prepare("SELECT * FROM categories ORDER BY name").all() as Category[];
}

export function createArticle(input: ArticleWriteInput) {
  const id = randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO articles (id, title, slug, excerpt, content, featured_image, category_id, status, published_at, scheduled_at, author, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.title,
    input.slug,
    input.excerpt ?? null,
    input.content ?? null,
    input.featuredImage ?? null,
    input.categoryId ?? null,
    input.status || "draft",
    input.publishedAt ?? null,
    input.scheduledAt ?? null,
    input.author ?? null,
    now,
    now
  );

  return id;
}

export function updateArticle(id: string, input: ArticleWriteInput) {
  const now = new Date().toISOString();

  const result = db
    .prepare(
      `UPDATE articles
       SET title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?, category_id = ?,
           status = ?, published_at = ?, scheduled_at = ?, author = ?, updated_at = ?
       WHERE id = ? AND deleted_at IS NULL`
    )
    .run(
      input.title,
      input.slug,
      input.excerpt ?? null,
      input.content ?? null,
      input.featuredImage || null,
      input.categoryId || null,
      input.status,
      input.publishedAt || null,
      input.scheduledAt || null,
      input.author ?? null,
      now,
      id
    );

  return result.changes > 0;
}

export function softDeleteArticle(id: string) {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      "UPDATE articles SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL"
    )
    .run(now, now, id);
  return result.changes > 0;
}

import { randomUUID } from "crypto";
import db from "@/lib/db";

export interface Testimonial {
  id: string;
  car_id: string | null;
  author_name: string;
  rating: number;
  comment: string;
  verified: number;
  likes: number;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TestimonialWithCar extends Testimonial {
  car_name: string | null;
}

export interface CreateTestimonialInput {
  carId?: string | null;
  authorName: string;
  rating: number;
  comment: string;
}

/** All published, non-deleted testimonials, newest first, joined with the car name. */
export function getAllPublishedTestimonials(): TestimonialWithCar[] {
  return db
    .prepare(
      `SELECT t.*, c.name as car_name
       FROM testimonials t
       LEFT JOIN cars c ON t.car_id = c.id
       WHERE t.status = 'published' AND t.deleted_at IS NULL
       ORDER BY t.created_at DESC`
    )
    .all() as TestimonialWithCar[];
}

export function createTestimonial(input: CreateTestimonialInput): string {
  const id = randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO testimonials (id, car_id, author_name, rating, comment, verified, likes, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 0, 0, 'published', ?, ?)`
  ).run(id, input.carId ?? null, input.authorName, input.rating, input.comment, now, now);

  return id;
}

export function incrementTestimonialLikes(id: string): boolean {
  const result = db
    .prepare(
      "UPDATE testimonials SET likes = likes + 1 WHERE id = ? AND deleted_at IS NULL"
    )
    .run(id);
  return result.changes > 0;
}

/** Admin list — every non-deleted testimonial regardless of status. */
export function getAllTestimonialsForAdmin(): TestimonialWithCar[] {
  return db
    .prepare(
      `SELECT t.*, c.name as car_name
       FROM testimonials t
       LEFT JOIN cars c ON t.car_id = c.id
       WHERE t.deleted_at IS NULL
       ORDER BY t.created_at DESC`
    )
    .all() as TestimonialWithCar[];
}

export function softDeleteTestimonial(id: string): boolean {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      "UPDATE testimonials SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL"
    )
    .run(now, now, id);
  return result.changes > 0;
}

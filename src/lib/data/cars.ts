import { randomUUID } from "crypto";
import db from "@/lib/db";
import { getCarImagePaths } from "@/lib/car-asset-paths";

/**
 * Input shape accepted by createCar/updateCar. Deliberately a plain interface,
 * not derived from the zod schemas in api-validation.ts — the cars API route
 * never actually ran car payloads through zod (only dealers did), so mirroring
 * that here keeps Phase 0 a pure refactor rather than introducing new validation.
 */
export interface CarWriteInput {
  name: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  priceFrom?: string | null;
  type?: string;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
  thumbnail?: string | null;
}

export interface Car {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  price_from: string | null;
  status: string;
  featured: number;
  sort_order: number;
  thumbnail: string | null;
  type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AdminCarRow extends Car {
  image_count: number;
}

export interface CarSpec {
  id: string;
  car_id: string;
  label: string;
  value: string;
  sort_order: number;
}

export interface CarImage {
  id: string;
  car_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  color_name: string | null;
  color_hex: string | null;
  created_at: string;
}

export interface CarFeature {
  id: string;
  car_id: string;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

/**
 * Public car list — published & not deleted. Matches the shape the homepage
 * car-showcase section and the navbar model mega menu expect.
 */
export function getPublishedCars(type?: string | null) {
  let query = `
    SELECT c.*,
           (SELECT COUNT(*) FROM car_images WHERE car_id = c.id) as image_count,
           (SELECT url FROM car_images WHERE car_id = c.id ORDER BY sort_order LIMIT 1) as thumbnail
    FROM cars c
    WHERE c.status = 'published' AND c.deleted_at IS NULL
  `;
  const params: unknown[] = [];

  if (type && ["BEV", "CSH", "ICE"].includes(type)) {
    query += ` AND c.type = ?`;
    params.push(type);
  }

  query += ` ORDER BY c.sort_order ASC, c.created_at DESC`;

  const cars = db.prepare(query).all(...(params as [])) as (Car & {
    image_count: number;
    thumbnail: string | null;
  })[];

  return cars.map((car) => ({
    ...car,
    specs: db
      .prepare("SELECT label, value FROM car_specs WHERE car_id = ? ORDER BY sort_order")
      .all(car.id) as Pick<CarSpec, "label" | "value">[],
  }));
}

/** Single car by id, respecting soft-delete — used for public API + admin edit form. */
export function getCarById(id: string): Car | undefined {
  return db.prepare("SELECT * FROM cars WHERE id = ? AND deleted_at IS NULL").get(id) as
    | Car
    | undefined;
}

/** Single car by id with full relations (images/specs/features) — public detail API. */
export function getCarWithDetailsById(id: string) {
  const car = getCarById(id);
  if (!car) return null;

  const images = db
    .prepare("SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order")
    .all(id) as CarImage[];
  const specs = db
    .prepare("SELECT * FROM car_specs WHERE car_id = ? ORDER BY sort_order")
    .all(id) as CarSpec[];
  const features = db
    .prepare("SELECT * FROM car_features WHERE car_id = ? ORDER BY sort_order")
    .all(id) as CarFeature[];

  return { ...car, images, specs, features };
}

/** Rich car detail for the public product page, keyed by slug. */
export function getCarBySlugForPublic(slug: string) {
  const car = db.prepare("SELECT * FROM cars WHERE slug = ? AND deleted_at IS NULL").get(slug) as
    | Car
    | undefined;
  if (!car) return null;

  const paths = getCarImagePaths(slug);
  const heroImage = car.thumbnail || paths.hero;
  const interiorImage = paths.interior;
  const techImage = paths.feature;
  const videoUrl = paths.video;

  const dbImages = db
    .prepare(
      "SELECT * FROM car_images WHERE car_id = ? AND color_name IS NULL ORDER BY sort_order"
    )
    .all(car.id) as CarImage[];
  const images = [{ id: "hero-override", url: heroImage, alt: car.name }, ...dbImages];

  const specs = db
    .prepare("SELECT * FROM car_specs WHERE car_id = ? ORDER BY sort_order")
    .all(car.id) as CarSpec[];
  const features = db
    .prepare("SELECT * FROM car_features WHERE car_id = ? ORDER BY sort_order")
    .all(car.id) as CarFeature[];

  const colorImages = db
    .prepare(
      "SELECT color_name, color_hex, url as image_url FROM car_images WHERE car_id = ? AND color_name IS NOT NULL ORDER BY sort_order"
    )
    .all(car.id) as { color_name: string; color_hex: string; image_url: string }[];

  const highlights = features.map((f) => ({
    title: f.title,
    description: f.description || "",
    iconName: f.icon || "CheckCircle",
  }));

  return {
    ...car,
    images,
    color_images: colorImages,
    specs,
    features,
    highlights,
    interiorImage,
    techImage,
    videoUrl,
  };
}

/** Admin list — every non-deleted car regardless of status (draft/published). */
export function getAllCarsForAdmin(): AdminCarRow[] {
  return db
    .prepare(
      `SELECT c.*,
              (SELECT COUNT(*) FROM car_images WHERE car_id = c.id) as image_count,
              (SELECT url FROM car_images WHERE car_id = c.id ORDER BY sort_order LIMIT 1) as thumbnail
       FROM cars c
       WHERE c.deleted_at IS NULL
       ORDER BY c.sort_order ASC, c.created_at DESC`
    )
    .all() as AdminCarRow[];
}

export function createCar(input: CarWriteInput) {
  const id = randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO cars (id, name, slug, subtitle, description, price_from, type, status, featured, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.name,
    input.slug,
    input.subtitle ?? null,
    input.description ?? null,
    input.priceFrom ?? null,
    input.type || "ICE",
    input.status || "draft",
    input.featured ? 1 : 0,
    input.sortOrder || 0,
    now,
    now
  );

  return id;
}

export function updateCar(id: string, input: CarWriteInput) {
  const now = new Date().toISOString();

  const result = db
    .prepare(
      `UPDATE cars
       SET name = ?, slug = ?, subtitle = ?, description = ?, price_from = ?, type = ?,
           status = ?, featured = ?, sort_order = ?, thumbnail = ?, updated_at = ?
       WHERE id = ? AND deleted_at IS NULL`
    )
    .run(
      input.name,
      input.slug,
      input.subtitle ?? null,
      input.description ?? null,
      input.priceFrom ?? null,
      input.type || "ICE",
      input.status || "draft",
      input.featured ? 1 : 0,
      input.sortOrder || 0,
      input.thumbnail || null,
      now,
      id
    );

  return result.changes > 0;
}

export function softDeleteCar(id: string) {
  const now = new Date().toISOString();
  const result = db
    .prepare("UPDATE cars SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL")
    .run(now, now, id);
  return result.changes > 0;
}

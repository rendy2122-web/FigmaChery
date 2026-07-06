import db from "@/lib/db";
import type { createDealerSchema, updateDealerSchema } from "@/lib/api-validation";
import type { z } from "zod";

export interface Dealer {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string | null;
  whatsapp: string;
  maps_embed: string | null;
  status: string;
  sort_order: number;
  image: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CreateDealerInput = z.infer<typeof createDealerSchema>;
export type UpdateDealerInput = z.infer<typeof updateDealerSchema>;

/** Public dealer list — active & not deleted. Used by the homepage section, the public dealer detail page, and the mega menu. */
export function getActiveDealers(): Dealer[] {
  return db
    .prepare(
      "SELECT * FROM dealers WHERE status = 'active' AND deleted_at IS NULL ORDER BY sort_order ASC"
    )
    .all() as Dealer[];
}

/** Single dealer by id, respecting soft-delete — used by the public API + admin edit form. */
export function getDealerById(id: string): Dealer | undefined {
  return db.prepare("SELECT * FROM dealers WHERE id = ? AND deleted_at IS NULL").get(id) as
    | Dealer
    | undefined;
}

export function createDealer(input: CreateDealerInput) {
  const id = `dealer-${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO dealers (id, name, city, address, phone, email, whatsapp, maps_embed, status, sort_order, image, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.name,
    input.city,
    input.address,
    input.phone,
    input.email || null,
    input.whatsapp,
    input.mapsEmbed || null,
    input.status || "active",
    input.sortOrder || 0,
    input.image || null,
    now,
    now
  );

  return id;
}

export function updateDealer(id: string, input: UpdateDealerInput) {
  const now = new Date().toISOString();

  const result = db
    .prepare(
      `UPDATE dealers
       SET name = ?, city = ?, address = ?, phone = ?, email = ?, whatsapp = ?,
           maps_embed = ?, status = ?, sort_order = ?, image = ?, updated_at = ?
       WHERE id = ? AND deleted_at IS NULL`
    )
    .run(
      input.name,
      input.city,
      input.address,
      input.phone,
      input.email || null,
      input.whatsapp,
      input.mapsEmbed || null,
      input.status || "active",
      input.sortOrder || 0,
      input.image || null,
      now,
      id
    );

  return result.changes > 0;
}

export function softDeleteDealer(id: string) {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      "UPDATE dealers SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL"
    )
    .run(now, now, id);
  return result.changes > 0;
}

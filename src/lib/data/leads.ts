import { randomUUID } from "crypto";
import db from "@/lib/db";

export interface CreateLeadInput {
  name: string;
  phone: string;
  dealerId?: string | null;
  carInterest?: string | null;
}

/** Persists a lead captured by CHIVA's proactive contact-capture flow. */
export function createLead(input: CreateLeadInput): string {
  const id = randomUUID();

  db.prepare(
    `INSERT INTO leads (id, name, phone, dealer_id, car_interest, source)
     VALUES (?, ?, ?, ?, ?, 'chiva')`
  ).run(id, input.name, input.phone, input.dealerId ?? null, input.carInterest ?? null);

  return id;
}

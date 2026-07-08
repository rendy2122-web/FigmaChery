import { randomUUID } from "crypto";
import db from "@/lib/db";

export interface CreateLeadInput {
  name: string;
  phone: string;
  dealerId?: string | null;
  carInterest?: string | null;
}

export interface LeadRow {
  id: string;
  name: string;
  phone: string;
  dealer_id: string | null;
  dealer_name: string | null;
  car_interest: string | null;
  source: string;
  created_at: string;
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

/** Admin list — newest first, with the dealer name joined in for display. */
export function getAllLeads(): LeadRow[] {
  return db
    .prepare(
      `SELECT leads.id, leads.name, leads.phone, leads.dealer_id, dealers.name as dealer_name,
              leads.car_interest, leads.source, leads.created_at
       FROM leads
       LEFT JOIN dealers ON dealers.id = leads.dealer_id
       ORDER BY leads.created_at DESC`
    )
    .all() as LeadRow[];
}

export function deleteLead(id: string): boolean {
  const result = db.prepare("DELETE FROM leads WHERE id = ?").run(id);
  return result.changes > 0;
}

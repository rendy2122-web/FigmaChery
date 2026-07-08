import db from "@/lib/db";

interface SettingRow {
  key: string;
  value: string;
}

export interface AdminSettingRow {
  key: string;
  value: string;
  type: string;
  group: string;
}

/** Returns all settings as a flat key->value map (empty string for missing keys). */
export function getSettingsMap(): Record<string, string> {
  const rows = db.prepare("SELECT key, value FROM settings").all() as SettingRow[];
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

export function getSetting(key: string, fallback = ""): string {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key) as
    | SettingRow
    | undefined;
  return row?.value ?? fallback;
}

/** Full rows (with type/group) for the dashboard settings form. */
export function getAllSettingsForAdmin(): AdminSettingRow[] {
  return db
    .prepare(`SELECT key, value, type, "group" FROM settings ORDER BY "group", key`)
    .all() as AdminSettingRow[];
}

/** Bulk-updates settings by key. Unknown keys are ignored (no INSERT) since
 *  every valid key is already seeded with its type/group at setup time. */
export function updateSettings(entries: Record<string, string>): void {
  const now = new Date().toISOString();
  const stmt = db.prepare(
    "UPDATE settings SET value = ?, updated_at = ? WHERE key = ?"
  );
  const updateAll = db.transaction((rows: [string, string][]) => {
    for (const [key, value] of rows) {
      stmt.run(value, now, key);
    }
  });
  updateAll(Object.entries(entries));
}

import db from "@/lib/db";

interface SettingRow {
  key: string;
  value: string;
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

export function dealerSlug(name: string): string {
  return name
    .replace(/^chery\s+/i, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

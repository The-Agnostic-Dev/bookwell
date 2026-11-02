export type SortDirection = "asc" | "desc";

/** Returns a sorted copy of the list, ordered by the given field. */
export function sortBy<T>(list: readonly T[], key: keyof T, direction: SortDirection = "asc"): T[] {
  const factor = direction === "asc" ? 1 : -1;
  return [...list].sort((a, b) => factor * String(a[key]).localeCompare(String(b[key])));
}

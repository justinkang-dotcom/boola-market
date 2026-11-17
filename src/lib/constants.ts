export const COLLEGES = [
  "Berkeley",
  "Branford",
  "Davenport",
  "Ezra Stiles",
  "Jonathan Edwards",
  "Benjamin Franklin",
  "Grace Hopper",
  "Morse",
  "Pauli Murray",
  "Pierson",
  "Saybrook",
  "Silliman",
  "Timothy Dwight",
  "Trumbull",
] as const;

export const CLASS_YEARS = [2027, 2028, 2029, 2030] as const;

export const CATEGORIES = [
  "Tickets",
  "Furniture",
  "Textbooks",
  "Electronics",
  "Clothing",
  "Other",
] as const;

export const TICKET_TYPES = ["YSO", "Harvard-Yale", "Other"] as const;

export const CONDITIONS = ["New", "Like New", "Good", "Fair"] as const;

export const DEMO_EMAIL = "jordan.park@yale.edu";
export const DEMO_PASSWORD = "yaleblue";

export type Category = (typeof CATEGORIES)[number];
export type Condition = (typeof CONDITIONS)[number];

export function isYaleEmail(email: string) {
  return /^[a-z0-9._%+-]+@yale\.edu$/i.test(email.trim());
}

export function categoryLabel(category: string, subcategory: string) {
  if (subcategory === "Harvard-Yale") return "Harvard–Yale";
  if (subcategory && subcategory !== "Other") return subcategory;
  return category;
}

export function classLabel(year: number) {
  return `’${String(year).slice(2)}`;
}

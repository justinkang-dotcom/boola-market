export const COLLEGE_COLORS: Record<string, string> = {
  Berkeley: "#00356B",
  Branford: "#286DC0",
  Davenport: "#8C4A32",
  "Ezra Stiles": "#1F6B4A",
  "Jonathan Edwards": "#8C2F39",
  "Benjamin Franklin": "#A6842A",
  "Grace Hopper": "#3D4F8C",
  Morse: "#5C4A32",
  "Pauli Murray": "#7A3E6D",
  Pierson: "#1A5276",
  Saybrook: "#2F5D50",
  Silliman: "#8A5A2B",
  "Timothy Dwight": "#4A3F73",
  Trumbull: "#6E2E2E",
};

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

import Link from "next/link";
import { COLLEGES, CONDITIONS } from "@/lib/constants";
import { withParams } from "@/lib/format";

const CHIPS = [
  { label: "All", category: "", subcategory: "" },
  { label: "Tickets", category: "Tickets", subcategory: "" },
  { label: "YSO", category: "Tickets", subcategory: "YSO" },
  { label: "Harvard–Yale", category: "Tickets", subcategory: "Harvard-Yale" },
  { label: "Furniture", category: "Furniture", subcategory: "" },
  { label: "Textbooks", category: "Textbooks", subcategory: "" },
  { label: "Electronics", category: "Electronics", subcategory: "" },
  { label: "Clothing", category: "Clothing", subcategory: "" },
  { label: "Other", category: "Other", subcategory: "" },
];

export function Filters({
  sp,
}: {
  sp: Record<string, string | undefined>;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CHIPS.map((chip) => {
          const active = (sp.category || "") === chip.category && (sp.subcategory || "") === chip.subcategory;
          return (
            <Link
              key={chip.label}
              href={withParams(sp, { category: chip.category, subcategory: chip.subcategory })}
              className={active ? "chip chip-active" : "chip"}
            >
              {chip.label}
            </Link>
          );
        })}
      </div>
      <form action="/" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_8rem_auto]">
        {sp.category && <input type="hidden" name="category" value={sp.category} />}
        {sp.subcategory && <input type="hidden" name="subcategory" value={sp.subcategory} />}
        {sp.q && <input type="hidden" name="q" value={sp.q} />}
        <select name="college" defaultValue={sp.college || ""} aria-label="Residential college">
          <option value="">Any college</option>
          {COLLEGES.map((college) => (
            <option key={college}>{college}</option>
          ))}
        </select>
        <select name="condition" defaultValue={sp.condition || ""} aria-label="Condition">
          <option value="">Any condition</option>
          {CONDITIONS.map((condition) => (
            <option key={condition}>{condition}</option>
          ))}
        </select>
        <select name="sort" defaultValue={sp.sort || "new"} aria-label="Sort">
          <option value="new">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <input name="max" defaultValue={sp.max || ""} inputMode="decimal" placeholder="Max $" aria-label="Maximum price" />
        <button className="btn-secondary" type="submit">
          Apply
        </button>
      </form>
    </div>
  );
}

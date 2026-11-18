import Link from "next/link";
import { COLLEGES, CONDITIONS } from "@/lib/constants";
import { withParams } from "@/lib/format";

const CHIPS: { label: string; patch: Record<string, string> }[] = [
  { label: "All", patch: { category: "", subcategory: "", sale: "", senior: "" } },
  { label: "Auctions", patch: { sale: "auction" } },
  { label: "Tickets", patch: { category: "Tickets", subcategory: "" } },
  { label: "YSO", patch: { category: "Tickets", subcategory: "YSO" } },
  { label: "The Game", patch: { category: "Tickets", subcategory: "Harvard-Yale" } },
  { label: "Furniture", patch: { category: "Furniture", subcategory: "" } },
  { label: "Textbooks", patch: { category: "Textbooks", subcategory: "" } },
  { label: "Electronics", patch: { category: "Electronics", subcategory: "" } },
  { label: "Clothing", patch: { category: "Clothing", subcategory: "" } },
  { label: "Other", patch: { category: "Other", subcategory: "" } },
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
          const active =
            chip.label === "All"
              ? !sp.category && !sp.subcategory && sp.sale !== "auction" && sp.senior !== "1"
              : chip.label === "Auctions"
                ? sp.sale === "auction"
                : (sp.category || "") === (chip.patch.category || "") &&
                  (sp.subcategory || "") === (chip.patch.subcategory || "");
          return (
            <Link
              key={chip.label}
              href={withParams(sp, chip.patch)}
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
        {sp.sale && <input type="hidden" name="sale" value={sp.sale} />}
        {sp.senior && <input type="hidden" name="senior" value={sp.senior} />}
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

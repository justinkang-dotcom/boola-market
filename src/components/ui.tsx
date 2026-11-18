import { COLLEGE_COLORS } from "@/lib/constants";
import { avatarColor, initials, ratingSummary } from "@/lib/format";

export function Bulldog({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 9.2c0-2.6 2.2-5 6-5s6 2.4 6 5v1.2h1.2c.7 0 1.3.6 1.3 1.3v2.2c0 1.6-1.2 2.8-2.7 2.8h-.4c-.5 1.8-2.2 3.3-5.4 3.3s-4.9-1.5-5.4-3.3h-.4C4.7 16.7 3.5 15.5 3.5 13.9v-2.2c0-.7.6-1.3 1.3-1.3H6V9.2Z"
      />
      <circle cx="9.2" cy="11" r="1" fill="#FBF8F2" />
      <circle cx="14.8" cy="11" r="1" fill="#FBF8F2" />
      <path d="M9.2 15.2c.8.7 1.7 1 2.8 1s2-.3 2.8-1" stroke="#FBF8F2" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function YaleBadge({ long = false }: { long?: boolean }) {
  return (
    <span
      title="Handsome Dan approved"
      className="inline-flex items-center gap-1 rounded-full bg-yale-mist px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-yale"
    >
      <Bulldog />
      {long ? "Handsome Dan approved" : "Yale"}
    </span>
  );
}

export function CollegeChip({ college }: { college: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: COLLEGE_COLORS[college] || "#00356B" }} />
      {college}
    </span>
  );
}

export function Stars({ reviews, compact = false }: { reviews: { rating: number }[]; compact?: boolean }) {
  const { average, count } = ratingSummary(reviews);
  if (average == null) {
    return <span className="text-xs text-mute">No ratings yet</span>;
  }
  const rounded = Math.round(average);
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <svg
            key={index}
            viewBox="0 0 20 20"
            className={`h-3.5 w-3.5 ${index < rounded ? "text-gold" : "text-[#E3DAC8]"}`}
            fill="currentColor"
          >
            <path d="M10 1.7 12.5 7l5.8.5-4.4 3.8 1.4 5.6L10 14.2 4.7 16.9 6.1 11.3 1.7 7.5 7.5 7 10 1.7Z" />
          </svg>
        ))}
      </span>
      <span className="text-sm font-medium text-ink">{average.toFixed(1)}</span>
      {!compact && <span className="text-xs text-mute">({count})</span>}
      <span className="sr-only">
        {average.toFixed(1)} out of 5 from {count} reviews
      </span>
    </span>
  );
}

export function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "h-16 w-16 text-xl" : "h-8 w-8 text-xs";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${dim}`}
      style={{ backgroundColor: avatarColor(name) }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

export function Leaf({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        fill="#00356B"
        d="M16 3c6 4 11 9.2 11 16.2 0 5.2-3.6 9.3-8.6 9.8-.4-4.6-1.2-8.2-3.2-11.2 2.6 2.2 4 5.2 4.4 9.2-3.4.2-6.4-1.6-8-4.6C9.2 26.8 7 28.6 6.2 29 5 24.6 6.4 18.6 10 14.2 7.6 16.8 6.4 20.4 6.2 24 3.8 21.2 3 17.6 4.2 13.6 8.2 12.2 12.4 7.2 16 3Z"
      />
    </svg>
  );
}

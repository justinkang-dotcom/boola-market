import Link from "next/link";
import { categoryLabel, classLabel } from "@/lib/constants";
import { money } from "@/lib/format";
import type { ListingWithSeller } from "@/lib/listings";
import { Avatar, Stars, YaleBadge } from "./ui";

export function ListingCard({ listing }: { listing: ListingWithSeller }) {
  const label = categoryLabel(listing.category, listing.subcategory);
  return (
    <Link href={`/listings/${listing.id}`} className="card group flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-yale-mist">
        <img
          src={listing.imageUrl}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-ink shadow-sm">
          {label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-serif text-[1.7rem] leading-none text-yale">{money(listing.priceCents)}</p>
          <p className="text-xs text-mute">{listing.condition}</p>
        </div>
        <h2 className="mt-2 line-clamp-2 font-medium leading-snug">{listing.title}</h2>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <Avatar name={listing.seller.name} />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-sm font-medium">
              {listing.seller.name}
              <YaleBadge />
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-mute">
              <span>
                {listing.seller.college} {classLabel(listing.seller.classYear)}
              </span>
              <Stars reviews={listing.seller.reviewsReceived} compact />
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

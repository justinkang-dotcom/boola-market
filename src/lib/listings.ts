import { Prisma } from "@prisma/client";
import { displayCents } from "./auction";
import { prisma } from "./db";

export const listingInclude = {
  seller: { include: { reviewsReceived: { select: { rating: true } } } },
  bids: { select: { amountCents: true } },
} satisfies Prisma.ListingInclude;

export type ListingWithSeller = Prisma.ListingGetPayload<{ include: typeof listingInclude }>;

export async function getActiveListings() {
  return prisma.listing.findMany({
    where: { status: "active" },
    include: listingInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function filterListings(
  listings: ListingWithSeller[],
  filters: {
    q?: string;
    category?: string;
    subcategory?: string;
    college?: string;
    condition?: string;
    max?: string;
    sort?: string;
    sale?: string;
    senior?: string;
  },
) {
  const query = filters.q?.trim().toLowerCase();
  const maxDollars = filters.max ? Number(filters.max) : NaN;

  let result = listings.filter((listing) => {
    if (filters.category && listing.category !== filters.category) return false;
    if (filters.subcategory && listing.subcategory !== filters.subcategory) return false;
    if (filters.sale === "auction" && listing.saleType !== "auction") return false;
    if (filters.senior === "1" && listing.seller.classYear !== 2027) return false;
    if (filters.college && listing.seller.college !== filters.college) return false;
    if (filters.condition && listing.condition !== filters.condition) return false;
    if (Number.isFinite(maxDollars) && displayCents(listing) > maxDollars * 100) return false;
    if (!query) return true;
    const haystack = [
      listing.title,
      listing.description,
      listing.category,
      listing.subcategory,
      listing.seller.name,
      listing.seller.college,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  if (filters.sort === "price-asc") {
    result = [...result].sort((a, b) => displayCents(a) - displayCents(b));
  } else if (filters.sort === "price-desc") {
    result = [...result].sort((a, b) => displayCents(b) - displayCents(a));
  }

  return result;
}

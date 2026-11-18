export function isAuction(listing: { saleType: string }) {
  return listing.saleType === "auction";
}

export function highBidCents(listing: { bids: { amountCents: number }[] }) {
  if (!listing.bids.length) return null;
  return Math.max(...listing.bids.map((bid) => bid.amountCents));
}

export function displayCents(listing: { saleType: string; priceCents: number; bids: { amountCents: number }[] }) {
  if (!isAuction(listing)) return listing.priceCents;
  return highBidCents(listing) ?? listing.priceCents;
}

export function minimumBidCents(listing: { priceCents: number; bids: { amountCents: number }[] }) {
  const high = highBidCents(listing);
  return high == null ? listing.priceCents : high + 100;
}

export function auctionOpen(listing: { endsAt: Date | null }) {
  return Boolean(listing.endsAt && listing.endsAt.getTime() > Date.now());
}

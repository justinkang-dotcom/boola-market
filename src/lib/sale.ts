import { prisma } from "./db";

export async function settleListing(listingId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { bids: { orderBy: [{ amountCents: "desc" }, { createdAt: "asc" }] } },
  });
  if (!listing || listing.status !== "active" || listing.saleType !== "auction") {
    return prisma.sale.findUnique({ where: { listingId } });
  }

  const winner = listing.bids[0];
  if (!winner) {
    await prisma.listing.update({
      where: { id: listingId },
      data: { status: "ended", endsAt: new Date() },
    });
    return null;
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: { status: "sold", endsAt: new Date() },
  });

  return prisma.sale.create({
    data: {
      listingId,
      sellerId: listing.sellerId,
      buyerId: winner.bidderId,
      amountCents: winner.amountCents,
      status: "won",
      handoff: listing.category === "Tickets" ? "digital" : "pickup",
    },
  });
}

export async function closeDueAuctions() {
  const due = await prisma.listing.findMany({
    where: { status: "active", saleType: "auction", endsAt: { lte: new Date() } },
    select: { id: true },
  });
  for (const listing of due) {
    await settleListing(listing.id);
  }
}

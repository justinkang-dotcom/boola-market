import Link from "next/link";
import { notFound } from "next/navigation";
import { Countdown } from "@/components/countdown";
import { BidForm, MessageForm } from "@/components/forms";
import { ListingCard } from "@/components/listing-card";
import { Avatar, Stars, YaleBadge } from "@/components/ui";
import { auctionOpen, highBidCents, isAuction, minimumBidCents } from "@/lib/auction";
import { getCurrentUser } from "@/lib/auth";
import { categoryLabel, classLabel } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { money, postedAgo } from "@/lib/format";
import { listingInclude } from "@/lib/listings";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id }, include: listingInclude });
  if (!listing || listing.status !== "active") notFound();

  const user = await getCurrentUser();
  const mine = user?.id === listing.sellerId;
  const thread =
    user && !mine
      ? await prisma.thread.findUnique({
          where: { listingId_buyerId: { listingId: listing.id, buyerId: user.id } },
        })
      : null;
  const more = await prisma.listing.findMany({
    where: { sellerId: listing.sellerId, status: "active", id: { not: listing.id } },
    include: listingInclude,
    take: 3,
    orderBy: { createdAt: "desc" },
  });
  const label = categoryLabel(listing.category, listing.subcategory);
  const auction = isAuction(listing);
  const open = auction && auctionOpen(listing);
  const high = highBidCents(listing);
  const history = auction
    ? await prisma.bid.findMany({
        where: { listingId: listing.id },
        include: { bidder: true },
        orderBy: { createdAt: "desc" },
      })
    : [];
  const minimum = auction ? minimumBidCents(listing) / 100 : 0;

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-hidden rounded-2xl border border-line bg-yale-mist">
          <img src={listing.imageUrl} alt={listing.title} className="aspect-[4/3] w-full object-cover" />
        </div>
        <aside className="card h-fit space-y-5 p-5 lg:sticky lg:top-24">
          <div>
            <p className="font-serif text-4xl text-yale">{money(auction ? (high ?? listing.priceCents) : listing.priceCents)}</p>
            <p className="mt-1 text-sm text-mute">
              {auction
                ? high == null
                  ? `Starting bid · pickup in ${listing.seller.college}`
                  : `Current high · ${history.length} bid${history.length === 1 ? "" : "s"}`
                : `Offers welcome · pickup in ${listing.seller.college}`}
            </p>
            {auction && listing.endsAt && (
              <p className="mt-2 text-sm font-medium">
                <Countdown endsAt={listing.endsAt.toISOString()} />
              </p>
            )}
          </div>
          <Link href={`/sellers/${listing.seller.id}`} className="flex items-center gap-3 rounded-xl border border-line p-3 hover:border-yale/30">
            <Avatar name={listing.seller.name} />
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 font-medium">
                {listing.seller.name}
                <YaleBadge />
              </span>
              <span className="mt-0.5 block text-xs text-mute">
                {listing.seller.college} {classLabel(listing.seller.classYear)}
              </span>
              <span className="mt-1 block">
                <Stars reviews={listing.seller.reviewsReceived} />
              </span>
            </span>
          </Link>
          {auction && history.length > 0 && (
            <ol className="space-y-2 border-t border-line pt-3">
              {history.slice(0, 4).map((bid, index) => (
                <li key={bid.id} className="flex items-baseline justify-between gap-3 text-sm">
                  <span>
                    <Link href={`/sellers/${bid.bidder.id}`} className="font-medium hover:text-yale">
                      {bid.bidder.name.split(" ")[0]}
                    </Link>
                    <span className="text-mute"> · {bid.bidder.college}</span>
                    {index === 0 && <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-yale-mid">High</span>}
                  </span>
                  <span className="font-medium">{money(bid.amountCents)}</span>
                </li>
              ))}
            </ol>
          )}
          {mine ? (
            <p className="text-sm text-mute">This is your listing. {auction ? "Bids will show up here." : "Buyers will message you here."}</p>
          ) : !user ? (
            <div className="rounded-xl bg-yale-mist p-4">
              <p className="text-sm">
                Sign in with your Yale email to {auction ? "bid or message" : "message"} {listing.seller.name.split(" ")[0]}.
              </p>
              <div className="mt-3 flex gap-2">
                <Link href={`/login?next=/listings/${listing.id}`} className="btn-primary">
                  Log in
                </Link>
                <Link href={`/signup?next=/listings/${listing.id}`} className="btn-secondary">
                  Sign up
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {auction && open && <BidForm listingId={listing.id} minimum={minimum} />}
              {auction && !open && <p className="text-sm text-mute">This auction has ended.</p>}
              {thread && (
                <Link href={`/messages/${thread.id}`} className="btn-secondary w-full">
                  Open your conversation
                </Link>
              )}
              {!auction && (
                <MessageForm
                  listingId={listing.id}
                  placeholder={`Ask ${listing.seller.name.split(" ")[0]} about pickup, or make an offer.`}
                />
              )}
              {auction && (
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-yale">Message {listing.seller.name.split(" ")[0]}</summary>
                  <div className="mt-3">
                    <MessageForm listingId={listing.id} placeholder="Ask about the seats or pickup." />
                  </div>
                </details>
              )}
            </div>
          )}
        </aside>
        <article className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="chip">{label}</span>
            <span className="chip">{listing.condition}</span>
            <span className="text-mute">{postedAgo(listing.createdAt)}</span>
          </div>
          <h1 className="font-serif text-4xl leading-tight text-ink">{listing.title}</h1>
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink/90">{listing.description}</p>
          {auction && (
            <div>
              <h2 className="font-serif text-2xl">Bid history</h2>
              {history.length === 0 ? (
                <p className="mt-2 text-sm text-mute">No bids yet. Opening bid is {money(listing.priceCents)}.</p>
              ) : (
                <ol className="mt-3 divide-y divide-line rounded-2xl border border-line bg-white">
                  {history.map((bid, index) => (
                    <li key={bid.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span>
                        <Link href={`/sellers/${bid.bidder.id}`} className="font-medium">
                          {bid.bidder.name}
                        </Link>
                        <span className="text-mute">
                          {" "}
                          · {bid.bidder.college} · {postedAgo(bid.createdAt)}
                        </span>
                        {index === 0 && open && <span className="ml-2 text-xs font-semibold uppercase text-yale-mid">High bid</span>}
                      </span>
                      <span className="font-serif text-xl text-yale">{money(bid.amountCents)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </article>
      </div>
      {more.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl text-ink">More from {listing.seller.name.split(" ")[0]}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

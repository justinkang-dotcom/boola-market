import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/listing-card";
import { ReviewForm } from "@/components/forms";
import { Avatar, Stars, YaleBadge } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { classLabel } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { postedAgo } from "@/lib/format";
import { listingInclude } from "@/lib/listings";

export default async function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seller = await prisma.user.findUnique({
    where: { id },
    include: {
      reviewsReceived: { include: { buyer: true }, orderBy: { createdAt: "desc" } },
      listings: {
        where: { status: "active" },
        include: listingInclude,
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!seller) notFound();

  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      <section className="card overflow-hidden">
        <div className="h-2 bg-yale" />
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
          <Avatar name={seller.name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-4xl text-ink">{seller.name}</h1>
              <YaleBadge long />
            </div>
            <p className="mt-1 text-mute">
              {seller.college} College · Class of {seller.classYear}
            </p>
            <p className="mt-1 text-sm font-medium text-yale">{seller.email}</p>
            <div className="mt-3">
              <Stars reviews={seller.reviewsReceived} />
            </div>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink/80">{seller.bio}</p>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl">Active listings</h2>
        {seller.listings.length === 0 ? (
          <p className="mt-3 text-sm text-mute">Nothing listed right now.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {seller.listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <h2 className="font-serif text-2xl">Reviews from buyers</h2>
          <div className="mt-4 space-y-3">
            {seller.reviewsReceived.length === 0 && (
              <p className="text-sm text-mute">No reviews yet. Be the first person to buy from {seller.name.split(" ")[0]}.</p>
            )}
            {seller.reviewsReceived.map((review) => (
              <article key={review.id} className="card p-4">
                <div className="flex items-center justify-between gap-3">
                  <Link href={`/sellers/${review.buyer.id}`} className="flex items-center gap-2 font-medium">
                    <Avatar name={review.buyer.name} />
                    {review.buyer.name}
                  </Link>
                  <span className="text-sm text-gold">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed">{review.body}</p>
                <p className="mt-2 text-xs text-mute">
                  {review.buyer.college} {classLabel(review.buyer.classYear)} · {postedAgo(review.createdAt)}
                </p>
              </article>
            ))}
          </div>
        </div>
        <div>
          {user && user.id !== seller.id ? (
            <ReviewForm sellerId={seller.id} />
          ) : !user ? (
            <div className="card p-4 text-sm">
              <p>Log in to review {seller.name.split(" ")[0]} after a sale.</p>
              <Link href={`/login?next=/sellers/${seller.id}`} className="btn-primary mt-3">
                Log in
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

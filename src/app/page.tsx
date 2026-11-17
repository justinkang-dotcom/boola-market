import Link from "next/link";
import { Filters } from "@/components/filters";
import { ListingCard } from "@/components/listing-card";
import { filterListings, getActiveListings } from "@/lib/listings";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const all = await getActiveListings();
  const listings = filterListings(all, sp);
  const filtering = Boolean(sp.q || sp.category || sp.subcategory || sp.college || sp.condition || sp.max);

  return (
    <div className="space-y-6">
      <section className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-yale">Verified @yale.edu only</p>
        <h1 className="mt-2 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          Buy and sell with people you can actually name.
        </h1>
        <p className="mt-3 text-base text-mute sm:text-lg">
          Tickets for The Game and YSO, textbooks, and the dorm furniture that will not fit in a car home. Every seller has a Yale email, a college, and a rating.
        </p>
      </section>
      <Filters sp={sp} />
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-mute">
          {listings.length} listing{listings.length === 1 ? "" : "s"}
          {filtering ? ` of ${all.length}` : " from verified students"}
        </p>
        {filtering && (
          <Link href="/" className="text-sm font-medium text-yale">
            Clear filters
          </Link>
        )}
      </div>
      {listings.length === 0 ? (
        <div className="card px-6 py-12 text-center">
          <h2 className="font-serif text-2xl text-yale">Nothing matches that search</h2>
          <p className="mt-2 text-mute">Try a college, a category, or a shorter query. Or post the thing you’re trying to find.</p>
          <Link href="/listings/new" className="btn-primary mt-4">
            Post a listing
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

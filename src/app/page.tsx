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
  const filtering = Boolean(sp.q || sp.category || sp.subcategory || sp.college || sp.condition || sp.max || sp.sale || sp.senior);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-yale text-white">
        <img src="/photos/campus.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-yale via-yale/88 to-yale/25" />
        <div className="relative max-w-2xl px-6 py-10 sm:px-10 sm:py-12">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/80">Boola Boola deals</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">Buy and sell with people you can actually name.</h1>
          <p className="mt-3 max-w-xl text-base text-white/85 sm:text-lg">
            The Game tickets, YSO seats, and the fridge that will not fit in a cab off campus. Every seller has a verified @yale.edu email, a residential college, and a rating.
          </p>
        </div>
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

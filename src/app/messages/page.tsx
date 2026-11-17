import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/messages");

  const threads = await prisma.thread.findMany({
    where: { OR: [{ buyerId: user.id }, { sellerId: user.id }] },
    include: {
      listing: true,
      buyer: true,
      seller: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  threads.sort((a, b) => {
    const aTime = a.messages[0]?.createdAt.getTime() ?? a.createdAt.getTime();
    const bTime = b.messages[0]?.createdAt.getTime() ?? b.createdAt.getTime();
    return bTime - aTime;
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-4xl text-ink">Inbox</h1>
      <p className="mt-2 text-sm text-mute">Offers and replies stay on the listing, with both names attached.</p>
      <div className="mt-6 space-y-3">
        {threads.length === 0 && (
          <div className="card px-6 py-10 text-center">
            <p className="font-medium">No conversations yet.</p>
            <p className="mt-1 text-sm text-mute">Open a listing and send the seller an offer.</p>
            <Link href="/" className="btn-primary mt-4">
              Browse listings
            </Link>
          </div>
        )}
        {threads.map((thread) => {
          const other = thread.buyerId === user.id ? thread.seller : thread.buyer;
          const last = thread.messages[0];
          return (
            <Link key={thread.id} href={`/messages/${thread.id}`} className="card flex gap-3 p-3 hover:border-yale/30">
              <img src={thread.listing.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
              <span className="min-w-0">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-medium">{thread.listing.title}</span>
                  <span className="shrink-0 text-sm text-yale">{money(thread.listing.priceCents)}</span>
                </span>
                <span className="mt-0.5 block text-sm text-mute">with {other.name}</span>
                {last && (
                  <span className="mt-1 block truncate text-sm text-ink/80">
                    {last.offerCents ? `Offer ${money(last.offerCents)} · ` : ""}
                    {last.body}
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

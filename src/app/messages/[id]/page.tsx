import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MessageForm } from "@/components/forms";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

function stamp(date: Date) {
  return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/messages/${id}`);

  const thread = await prisma.thread.findUnique({
    where: { id },
    include: {
      listing: true,
      buyer: true,
      seller: true,
      messages: { include: { sender: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!thread || (thread.buyerId !== user.id && thread.sellerId !== user.id)) notFound();

  const other = thread.buyerId === user.id ? thread.seller : thread.buyer;

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/messages" className="text-sm font-medium text-yale">
        ← Inbox
      </Link>
      <div className="card mt-3 flex gap-3 p-3">
        <img src={thread.listing.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
        <div>
          <Link href={`/listings/${thread.listing.id}`} className="font-medium hover:text-yale">
            {thread.listing.title}
          </Link>
          <p className="text-sm text-mute">
            {money(thread.listing.priceCents)} asking · with{" "}
            <Link href={`/sellers/${other.id}`} className="text-yale">
              {other.name}
            </Link>
          </p>
        </div>
      </div>
      <ol className="mt-4 space-y-3">
        {thread.messages.map((message) => {
          const mine = message.senderId === user.id;
          return (
            <li key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${mine ? "bg-yale text-white" : "border border-line bg-white"}`}>
                <p className={`text-xs ${mine ? "text-white/70" : "text-mute"}`}>
                  {message.sender.name.split(" ")[0]} · {stamp(message.createdAt)}
                </p>
                {message.offerCents != null && (
                  <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${mine ? "bg-white/15" : "bg-gold-soft text-[#6E5416]"}`}>
                    Offer {money(message.offerCents)}
                  </p>
                )}
                <p className="mt-1 text-sm leading-relaxed">{message.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="card mt-4 p-4">
        <MessageForm threadId={thread.id} placeholder={`Reply to ${other.name.split(" ")[0]}, or counter their offer.`} />
      </div>
    </div>
  );
}

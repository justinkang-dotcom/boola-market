import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { postSaleMessage, reviewSale, updateSale } from "@/actions";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { money } from "@/lib/format";

const DIGITAL_STEPS = [
  { id: "won", label: "Won" },
  { id: "paid", label: "Payment sent" },
  { id: "transferred", label: "Ticket transferred" },
  { id: "completed", label: "Completed" },
];

const PICKUP_STEPS = [
  { id: "won", label: "Won" },
  { id: "meetup", label: "Meetup arranged" },
  { id: "paid", label: "Paid" },
  { id: "completed", label: "Completed" },
];

export default async function SalePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/sales/${id}`);

  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      listing: true,
      buyer: true,
      seller: true,
      messages: { include: { sender: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!sale || (sale.buyerId !== user.id && sale.sellerId !== user.id)) notFound();

  const other = user.id === sale.buyerId ? sale.seller : sale.buyer;
  const digital = sale.handoff === "digital";
  const steps = digital ? DIGITAL_STEPS : PICKUP_STEPS;
  const stepIndex = Math.max(0, steps.findIndex((step) => step.id === sale.status));
  const alreadyReviewed = await prisma.review.findFirst({
    where: { listingId: sale.listingId, buyerId: user.id, sellerId: other.id },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="card flex gap-3 p-3">
        <img src={sale.listing.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
        <div>
          <p className="text-sm font-medium text-yale-mid">
            Sold to {sale.buyer.name.split(" ")[0]} at {money(sale.amountCents)}
          </p>
          <Link href={`/listings/${sale.listingId}`} className="font-serif text-2xl leading-tight">
            {sale.listing.title}
          </Link>
          <p className="text-sm text-mute">
            with {other.name} · {digital ? "Digital transfer" : "In-person pickup"}
          </p>
        </div>
      </div>

      <ol className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`rounded-xl px-2 py-2 text-center text-xs font-medium ${index <= stepIndex ? "bg-yale text-white" : "bg-white text-mute"}`}
          >
            {step.label}
          </li>
        ))}
      </ol>

      <div className="card space-y-3 p-4">
        <h2 className="font-medium">{digital ? "Transfer the ticket" : "Arrange the handoff"}</h2>
        <ol className="space-y-2">
          {sale.messages.map((message) => (
            <li key={message.id} className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}>
              <p className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${message.senderId === user.id ? "bg-yale text-white" : "bg-yale-mist"}`}>
                <span className="block text-xs opacity-70">{message.sender.name.split(" ")[0]}</span>
                {message.body}
              </p>
            </li>
          ))}
          {sale.messages.length === 0 && (
            <li className="text-sm text-mute">
              {digital ? "Send the PDF or box-office transfer to their Yale email." : "Say where you’ll meet. Berkeley gate, Bass, or a resco courtyard."}
            </li>
          )}
        </ol>
        <form action={postSaleMessage} className="flex gap-2">
          <input type="hidden" name="saleId" value={sale.id} />
          <input id="sale-message" name="body" placeholder={digital ? "Sending the transfer to your email" : "Pickup at Berkeley, 8pm?"} className="flex-1" />
          <button className="btn-primary" type="submit">
            Send
          </button>
        </form>
      </div>

      <div className="card space-y-3 p-4">
        {!digital && (
          <form action={updateSale}>
            <input type="hidden" name="saleId" value={sale.id} />
            <input type="hidden" name="intent" value="delivery" />
            <button id="delivery-toggle" className="btn-secondary" type="submit">
              {sale.delivery ? "Resco-to-resco delivery requested" : "Request resco-to-resco delivery"}
            </button>
          </form>
        )}
        {!digital && sale.status === "won" && (
          <form action={updateSale}>
            <input type="hidden" name="saleId" value={sale.id} />
            <input type="hidden" name="intent" value="meetup" />
            <button id="mark-meetup" className="btn-primary" type="submit">
              Meetup arranged
            </button>
          </form>
        )}
        {(digital ? sale.status === "won" : sale.status === "won" || sale.status === "meetup") && (
          <form action={updateSale} className="flex flex-wrap gap-2">
            <input type="hidden" name="saleId" value={sale.id} />
            <input type="hidden" name="intent" value="paid" />
            <button id="mark-venmo" className="btn-primary" name="method" value="venmo" type="submit">
              {digital ? "Payment sent via Venmo" : "Mark paid via Venmo"}
            </button>
            {!digital && (
              <button id="mark-cash" className="btn-secondary" name="method" value="cash" type="submit">
                Mark paid in cash
              </button>
            )}
          </form>
        )}
        {digital && sale.status === "paid" && (
          <form action={updateSale}>
            <input type="hidden" name="saleId" value={sale.id} />
            <input type="hidden" name="intent" value="transferred" />
            <button id="mark-transferred" className="btn-primary" type="submit">
              Ticket transferred
            </button>
          </form>
        )}
        {sale.status !== "completed" && (sale.status === "transferred" || (!digital && sale.status === "paid")) && (
          <form action={updateSale}>
            <input type="hidden" name="saleId" value={sale.id} />
            <input type="hidden" name="intent" value="confirm" />
            <button id="confirm-complete" className="btn-primary" type="submit">
              {user.id === sale.sellerId
                ? sale.sellerDone
                  ? "You confirmed"
                  : "Confirm complete"
                : sale.buyerDone
                  ? "You confirmed"
                  : "Confirm complete"}
            </button>
            <p className="mt-2 text-xs text-mute">
              {sale.sellerDone ? "Seller confirmed." : "Seller still needs to confirm."}{" "}
              {sale.buyerDone ? "Buyer confirmed." : "Buyer still needs to confirm."}
            </p>
          </form>
        )}
        {sale.paidMethod && <p className="text-sm text-mute">Paid by {sale.paidMethod}.</p>}
      </div>

      {sale.status === "completed" && !alreadyReviewed && (
        <form action={reviewSale} className="card space-y-3 p-4">
          <input type="hidden" name="saleId" value={sale.id} />
          <h2 className="font-medium">Review {other.name.split(" ")[0]}</h2>
          <select id="rating" name="rating" defaultValue="5">
            <option value="5">5 — would do it again</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
          <textarea id="review-body" name="body" required placeholder="How did the handoff go?" />
          <button id="publish-review" className="btn-primary" type="submit">
            Publish review
          </button>
        </form>
      )}
    </div>
  );
}

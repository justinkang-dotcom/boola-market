import { redirect } from "next/navigation";
import { ListingForm } from "@/components/forms";
import { getCurrentUser } from "@/lib/auth";

export default async function NewListingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/listings/new");

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-yale">New listing</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Sell something on campus.</h1>
      <p className="mt-2 text-mute">
        Posting as {user.name}, {user.college}. Buyers will see your verified Yale badge and rating.
      </p>
      <div className="card mt-6 p-5 sm:p-6">
        <ListingForm />
      </div>
    </div>
  );
}

import Link from "next/link";
import { SignupForm } from "@/components/forms";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-lg py-4">
      <section className="card p-6 sm:p-8">
        <h1 className="font-serif text-4xl text-yale">Create your Boola Market account</h1>
        <p className="mt-2 text-sm text-mute">
          @yale.edu only. Your college shows up on every listing so buyers know where to meet you.
        </p>
        <div className="mt-6">
          <SignupForm next={next} />
        </div>
        <p className="mt-4 text-sm text-mute">
          Already verified?{" "}
          <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="font-medium text-yale">
            Log in
          </Link>
        </p>
      </section>
    </div>
  );
}

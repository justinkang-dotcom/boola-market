import Link from "next/link";
import { LoginForm } from "@/components/forms";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/constants";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto grid max-w-4xl gap-6 py-4 md:grid-cols-2">
      <section className="card p-6 sm:p-8">
        <h1 className="font-serif text-4xl text-yale">Log in</h1>
        <p className="mt-2 text-sm text-mute">Same email you use for Yale. Nothing else gets an account.</p>
        <div className="mt-6">
          <LoginForm next={next} />
        </div>
        <p className="mt-4 text-sm text-mute">
          New here?{" "}
          <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"} className="font-medium text-yale">
            Create an account
          </Link>
        </p>
      </section>
      <aside className="rounded-2xl bg-yale px-6 py-8 text-white sm:px-8">
        <p className="text-sm uppercase tracking-[0.16em] text-gold-soft">Demo for judges</p>
        <h2 className="mt-3 font-serif text-3xl">Walk in as Jordan.</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/80">
          Grace Hopper ’28. Jordan already has a haggle going with Maya Chen about a desk lamp, plus reviews on a few sellers.
        </p>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between gap-4 border-b border-white/15 py-2">
            <dt className="text-white/70">Email</dt>
            <dd className="font-medium">{DEMO_EMAIL}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/15 py-2">
            <dt className="text-white/70">Password</dt>
            <dd className="font-medium">{DEMO_PASSWORD}</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-white/70">Other seeded sellers use the same password.</p>
      </aside>
    </div>
  );
}

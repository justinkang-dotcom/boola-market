import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-serif text-4xl text-yale">That page isn’t on Boola Market.</h1>
      <p className="mt-2 text-mute">The listing may have been removed, or the link is off.</p>
      <Link href="/" className="btn-primary mt-6">
        Back to listings
      </Link>
    </div>
  );
}

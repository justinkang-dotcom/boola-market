"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-serif text-4xl text-yale">Something went sideways.</h1>
      <p className="mt-2 text-mute">Try that again. If it keeps happening, refresh the page.</p>
      <button className="btn-primary mt-5" onClick={reset} type="button">
        Retry
      </button>
    </div>
  );
}

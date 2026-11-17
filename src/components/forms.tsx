"use client";

import { useActionState, useState } from "react";
import { createListing, login, saveReview, sendMessage, signup, type ActionState } from "@/actions";
import { CATEGORIES, CLASS_YEARS, COLLEGES, CONDITIONS, DEMO_EMAIL, DEMO_PASSWORD, TICKET_TYPES } from "@/lib/constants";

const initial: ActionState = { error: "" };

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form action={action} className="space-y-3">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <label className="label" htmlFor="email">
          Yale email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="you@yale.edu"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button className="btn-primary w-full" disabled={pending} type="submit">
        {pending ? "Signing in…" : "Log in"}
      </button>
      <button
        className="btn-secondary w-full"
        type="button"
        onClick={() => {
          setEmail(DEMO_EMAIL);
          setPassword(DEMO_PASSWORD);
        }}
      >
        Use the demo buyer
      </button>
    </form>
  );
}

export function SignupForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signup, initial);

  return (
    <form action={action} className="space-y-3">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <label className="label" htmlFor="name">
          Name
        </label>
        <input id="name" name="name" required placeholder="Jordan Park" />
      </div>
      <div>
        <label className="label" htmlFor="signup-email">
          Yale email
        </label>
        <input id="signup-email" name="email" type="email" required placeholder="jordan.park@yale.edu" />
      </div>
      <div>
        <label className="label" htmlFor="signup-password">
          Password
        </label>
        <input id="signup-password" name="password" type="password" required minLength={6} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="college">
            Residential college
          </label>
          <select id="college" name="college" required defaultValue="">
            <option value="" disabled>
              Choose
            </option>
            {COLLEGES.map((college) => (
              <option key={college}>{college}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="classYear">
            Class year
          </label>
          <select id="classYear" name="classYear" required defaultValue="">
            <option value="" disabled>
              Choose
            </option>
            {CLASS_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button className="btn-primary w-full" disabled={pending} type="submit">
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

export function ListingForm() {
  const [state, action, pending] = useActionState(createListing, initial);
  const [category, setCategory] = useState("Furniture");

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="title">
          Title
        </label>
        <input id="title" name="title" required placeholder="Two Harvard–Yale tickets, Yale Bowl" />
      </div>
      <div>
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          placeholder="Condition, what’s included, and where you’ll meet."
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="price">
            Price (USD)
          </label>
          <input id="price" name="price" inputMode="decimal" required placeholder="40" />
        </div>
        <div>
          <label className="label" htmlFor="condition">
            Condition
          </label>
          <select id="condition" name="condition" defaultValue="Good">
            {CONDITIONS.map((condition) => (
              <option key={condition}>{condition}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        {category === "Tickets" && (
          <div>
            <label className="label" htmlFor="subcategory">
              Ticket type
            </label>
            <select id="subcategory" name="subcategory" defaultValue="YSO">
              {TICKET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === "Harvard-Yale" ? "Harvard–Yale" : type === "Other" ? "Other event" : type}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div>
        <label className="label" htmlFor="imageUrl">
          Photo URL
        </label>
        <input id="imageUrl" name="imageUrl" placeholder="https://…" />
      </div>
      <div>
        <label className="label" htmlFor="photo">
          Or upload a photo
        </label>
        <input id="photo" name="photo" type="file" accept="image/*" className="bg-transparent px-0" />
      </div>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button className="btn-primary" disabled={pending} type="submit">
        {pending ? "Posting…" : "Post listing"}
      </button>
    </form>
  );
}

export function MessageForm({
  listingId,
  threadId,
  placeholder,
}: {
  listingId?: string;
  threadId?: string;
  placeholder: string;
}) {
  const [state, action, pending] = useActionState(sendMessage, initial);

  return (
    <form action={action} className="space-y-3">
      {listingId && <input type="hidden" name="listingId" value={listingId} />}
      {threadId && <input type="hidden" name="threadId" value={threadId} />}
      <textarea name="body" required placeholder={placeholder} />
      <div>
        <label className="label" htmlFor={threadId || listingId}>
          Offer, optional
        </label>
        <input id={threadId || listingId} name="offer" inputMode="decimal" placeholder="40" />
      </div>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button className="btn-primary" disabled={pending} type="submit">
        {pending ? "Sending…" : threadId ? "Send reply" : "Message seller"}
      </button>
    </form>
  );
}

export function ReviewForm({ sellerId }: { sellerId: string }) {
  const [state, action, pending] = useActionState(saveReview, initial);

  return (
    <form action={action} className="card space-y-3 p-4">
      <input type="hidden" name="sellerId" value={sellerId} />
      <h2 className="font-medium">Leave a review</h2>
      <div>
        <label className="label" htmlFor="rating">
          Rating
        </label>
        <select id="rating" name="rating" defaultValue="5">
          <option value="5">5 — would buy again</option>
          <option value="4">4 — smooth</option>
          <option value="3">3 — fine</option>
          <option value="2">2 — messy</option>
          <option value="1">1 — don’t</option>
        </select>
      </div>
      <textarea name="body" required placeholder="Did they show up? Was the listing accurate?" />
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button className="btn-primary" disabled={pending} type="submit">
        {pending ? "Saving…" : "Publish review"}
      </button>
    </form>
  );
}

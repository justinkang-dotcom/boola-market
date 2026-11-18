"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import {
  CATEGORIES,
  CLASS_YEARS,
  COLLEGES,
  CONDITIONS,
  TICKET_TYPES,
  isYaleEmail,
} from "./lib/constants";
import { clearSession, createSession, getCurrentUser, safeNext } from "./lib/auth";
import { prisma } from "./lib/db";

export type ActionState = { error: string };

function str(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function signup(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");
  const college = str(formData, "college");
  const classYear = Number(str(formData, "classYear"));

  if (name.length < 2) return { error: "Add your name so buyers know who they’re dealing with." };
  if (!isYaleEmail(email)) return { error: "Elm is only for @yale.edu addresses." };
  if (password.length < 6) return { error: "Use a password of at least 6 characters." };
  if (!COLLEGES.includes(college as (typeof COLLEGES)[number])) {
    return { error: "Pick your residential college." };
  }
  if (!CLASS_YEARS.includes(classYear as (typeof CLASS_YEARS)[number])) {
    return { error: "Pick your class year." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "That Yale email already has an Elm account. Log in instead." };

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 8),
      college,
      classYear,
    },
  });

  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");

  if (!isYaleEmail(email)) return { error: "Elm is only for @yale.edu addresses." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "No Elm account for that email. Create one with your @yale.edu address." };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Wrong password." };

  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await clearSession();
  redirect("/");
}

export async function createListing(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Log in with your Yale email before posting." };

  const title = str(formData, "title");
  const description = str(formData, "description");
  const category = str(formData, "category");
  const condition = str(formData, "condition");
  const subcategoryInput = str(formData, "subcategory");
  const saleType = str(formData, "saleType") === "auction" ? "auction" : "fixed";
  const price = Number(str(formData, "price").replace(/[$,]/g, ""));

  if (title.length < 4) return { error: "Give the listing a clearer title." };
  if (description.length < 12) return { error: "Add a short description — condition, pickup, what’s included." };
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) return { error: "Pick a category." };
  if (!CONDITIONS.includes(condition as (typeof CONDITIONS)[number])) return { error: "Pick a condition." };
  if (!Number.isFinite(price) || price <= 0) {
    return { error: saleType === "auction" ? "Add a starting bid in dollars." : "Add a price in dollars." };
  }

  let endsAt: Date | null = null;
  if (saleType === "auction") {
    endsAt = new Date(str(formData, "endsAt"));
    if (Number.isNaN(endsAt.getTime()) || endsAt.getTime() <= Date.now()) {
      return { error: "Pick an auction end time in the future." };
    }
  }

  const subcategory =
    category === "Tickets"
      ? TICKET_TYPES.includes(subcategoryInput as (typeof TICKET_TYPES)[number])
        ? subcategoryInput
        : "Other"
      : "";

  let imageUrl = str(formData, "imageUrl");
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { error: "Upload an image file." };
    if (file.size > 4_500_000) return { error: "That photo is over 4MB. Try a smaller one or paste a URL." };
    const ext = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "") || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
    imageUrl = `/uploads/${filename}`;
  }

  if (!imageUrl) return { error: "Add a photo URL or upload an image." };
  if (!imageUrl.startsWith("/") && !/^https?:\/\//i.test(imageUrl)) {
    return { error: "Photo URL should start with https:// or be an uploaded image." };
  }

  const listing = await prisma.listing.create({
    data: {
      sellerId: user.id,
      title,
      description,
      category,
      subcategory,
      condition,
      priceCents: Math.round(price * 100),
      imageUrl,
      saleType,
      endsAt,
    },
  });

  redirect(`/listings/${listing.id}`);
}

function parseOffer(raw: string): { offerCents: number | null; error?: string } {
  if (!raw) return { offerCents: null };
  const amount = Number(raw.replace(/[$,]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return { offerCents: null, error: "Offer should be a dollar amount." };
  return { offerCents: Math.round(amount * 100) };
}

export async function sendMessage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Log in with your Yale email to message a seller." };

  const body = str(formData, "body");
  const offer = parseOffer(str(formData, "offer"));
  if (offer.error) return { error: offer.error };
  if (body.length < 1) return { error: "Write a message first." };

  const threadId = str(formData, "threadId");
  const listingId = str(formData, "listingId");

  if (threadId) {
    const thread = await prisma.thread.findUnique({ where: { id: threadId } });
    if (!thread || (thread.buyerId !== user.id && thread.sellerId !== user.id)) {
      return { error: "That conversation isn’t yours." };
    }
    await prisma.message.create({
      data: { threadId, senderId: user.id, body, offerCents: offer.offerCents },
    });
    redirect(`/messages/${threadId}`);
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.status !== "active") return { error: "That listing is no longer available." };
  if (listing.sellerId === user.id) return { error: "You can’t message yourself about your own listing." };

  const thread = await prisma.thread.upsert({
    where: { listingId_buyerId: { listingId: listing.id, buyerId: user.id } },
    update: {},
    create: { listingId: listing.id, buyerId: user.id, sellerId: listing.sellerId },
  });

  await prisma.message.create({
    data: { threadId: thread.id, senderId: user.id, body, offerCents: offer.offerCents },
  });

  redirect(`/messages/${thread.id}`);
}

export async function placeBid(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Log in with your Yale email to bid." };

  const listingId = str(formData, "listingId");
  const amount = Number(str(formData, "amount").replace(/[$,]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return { error: "Enter a bid in dollars." };
  const amountCents = Math.round(amount * 100);

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { bids: { select: { amountCents: true } } },
  });
  if (!listing || listing.status !== "active" || listing.saleType !== "auction") {
    return { error: "That auction isn’t open." };
  }
  if (!listing.endsAt || listing.endsAt.getTime() <= Date.now()) return { error: "This auction has ended." };
  if (listing.sellerId === user.id) return { error: "You can’t bid on your own listing." };

  const high = listing.bids.reduce((max, bid) => Math.max(max, bid.amountCents), 0);
  const minimum = listing.bids.length ? high + 100 : listing.priceCents;
  if (amountCents < minimum) {
    const dollars = minimum / 100;
    return { error: listing.bids.length ? `Bid more than the current high. Next bid is $${dollars}.` : `The opening bid is $${dollars}.` };
  }

  await prisma.bid.create({
    data: { listingId: listing.id, bidderId: user.id, amountCents },
  });

  redirect(`/listings/${listing.id}`);
}

export async function saveReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Log in to leave a review." };

  const sellerId = str(formData, "sellerId");
  const body = str(formData, "body");
  const rating = Number(str(formData, "rating"));

  if (sellerId === user.id) return { error: "You can’t review yourself." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Pick a rating from 1 to 5." };
  if (body.length < 8) return { error: "Write a sentence about how the sale went." };

  const seller = await prisma.user.findUnique({ where: { id: sellerId } });
  if (!seller) return { error: "That seller isn’t on Elm." };

  await prisma.review.upsert({
    where: { sellerId_buyerId: { sellerId, buyerId: user.id } },
    update: { rating, body },
    create: { sellerId, buyerId: user.id, rating, body },
  });

  redirect(`/sellers/${sellerId}`);
}

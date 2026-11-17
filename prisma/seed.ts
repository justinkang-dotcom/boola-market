import { PrismaClient, type User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function ago(days: number, hours = 0) {
  return new Date(Date.now() - (days * 24 + hours) * 3_600_000);
}

async function main() {
  const reset = process.env.SEED_RESET === "1";
  const existing = await prisma.user.count();
  if (!reset && existing > 0) {
    console.log(`Database ready (${existing} users). Demo login: jordan.park@yale.edu / yaleblue`);
    return;
  }

  await prisma.message.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.review.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("yaleblue", 8);

  const people: Record<string, User> = {};
  for (const person of [
    ["maya", "maya.chen@yale.edu", "Maya Chen", "Pierson", 2027, "Pierson ’27. Selling the room before senior spring. I show up when I say I will."],
    ["jordan", "jordan.park@yale.edu", "Jordan Park", "Grace Hopper", 2028, "Hopper ’28. Mostly buying. I answer fast and I don’t haggle in bad faith."],
    ["alex", "alex.rivera@yale.edu", "Alex Rivera", "Timothy Dwight", 2027, "TD ’27. Textbooks only, and I say if there’s highlighting."],
    ["sam", "sam.okonkwo@yale.edu", "Sam Okonkwo", "Silliman", 2028, "Silliman ’28. Electronics, wiped and charged before I meet you."],
    ["priya", "priya.shah@yale.edu", "Priya Shah", "Branford", 2027, "Branford ’27. Winter clothes that still have a New Haven winter left in them."],
    ["chris", "chris.nguyen@yale.edu", "Chris Nguyen", "Ezra Stiles", 2029, "Stiles ’29. Tickets and the bike I never rode to Science Hill."],
    ["taylor", "taylor.brooks@yale.edu", "Taylor Brooks", "Berkeley", 2028, "Berkeley ’28. Selling real Yale Bowl seats, not a screenshot of a screenshot."],
    ["riley", "riley.adams@yale.edu", "Riley Adams", "Saybrook", 2027, "Saybrook ’27. Graduating and the fridge is not coming with me."],
  ] as const) {
    const [key, email, name, college, classYear, bio] = person;
    people[key] = await prisma.user.create({
      data: { email, name, college, classYear, bio, passwordHash },
    });
  }

  const specs = [
    ["game-pair", "taylor", "Two Harvard–Yale tickets, Yale Bowl, Nov 21", "Two together, section 12, row G, Saturday Nov 21. My parents can’t make The Game and I’d rather these stay with someone at Yale than a random reseller. Face was $65 each. Asking $90 for the pair. Meet on Cross Campus or at Berkeley.", 90, "Tickets", "Harvard-Yale", "Good", "/photos/game.jpg", 2],
    ["game-one", "taylor", "Single Harvard–Yale ticket, same section", "One seat, section 12, a few rows back from the pair I’m also selling. PDF transfer the morning of The Game. $55, or make an offer if you’re coming from a resco near Berkeley.", 55, "Tickets", "Harvard-Yale", "Like New", "/photos/game.jpg", 1],
    ["yso", "chris", "YSO at Woolsey — Mahler 1, Friday", "One seat, center orchestra, Woolsey Hall, Friday Nov 20. I have a prelim I can’t move. $12, and I’ll send the box office transfer as soon as you pay.", 12, "Tickets", "YSO", "New", "/photos/yso.jpg", 1],
    ["chamber", "maya", "YSO chamber at Sudler, two seats", "Sunday Nov 22, 4pm, Sudler Hall. Friends bailed. $8 for the pair. I’ll forward the confirmation email.", 8, "Tickets", "YSO", "New", "/photos/tickets.jpg", 4],
    ["fridge", "riley", "Compact fridge, one year old — Saybrook", "Haier mini fridge, cold and quiet. I’m graduating and it will not fit in a walk-up. $60, you haul. I can help walk it to JE, Branford, or Pierson.", 60, "Furniture", "", "Good", "/photos/fridge.jpg", 3],
    ["lamp", "maya", "Black desk lamp, bulb included", "Black metal desk lamp, warm bulb, no flicker. Lived on a Pierson desk for a year. Asking $18. Offers are fine if you can pick up tonight.", 18, "Furniture", "", "Like New", "/photos/lamp.jpg", 1],
    ["desk", "maya", "White desk, 55 inches, one scuff", "LAGKAPTEN top plus legs. One scuff on the right leg, which you can see if you look. It fit in a Pierson single. $40, you carry.", 40, "Furniture", "", "Good", "/photos/desk.jpg", 6],
    ["mankiw", "alex", "Mankiw Macroeconomics, 11th edition", "ECON 116 book. A few pencil notes in the margins, nothing in the problem sets. Meet at Bass or Timothy Dwight. $28.", 28, "Textbooks", "", "Good", "/photos/books.jpg", 5],
    ["orgo", "alex", "Klein Organic Chemistry, no highlighting", "4th edition, the one the orgo sequence actually uses. Clean. Bookstore wants about $90. I’ll do $45 at TD.", 45, "Textbooks", "", "Like New", "/photos/orgo.jpg", 2],
    ["macbook", "sam", "MacBook Air M1, 8GB, charger included", "2020 Air, 256GB, battery health 87%. No stickers. Charger in the box. Silliman pickup. $620, and I’m not in a rush.", 620, "Electronics", "", "Good", "/photos/laptop.jpg", 4],
    ["headphones", "sam", "Sony WH-1000XM4 headphones", "Noise canceling still works. The case has a scuff, the earcups don’t. $70, Silliman gate.", 70, "Electronics", "", "Like New", "/photos/headphones.jpg", 1],
    ["coat", "priya", "Navy wool peacoat, women’s medium", "Wore it for one New Haven winter. Clean, no tears, pockets intact. Branford gate, $48.", 48, "Clothing", "", "Good", "/photos/coat.jpg", 3],
    ["hoodie", "priya", "Yale crewneck, navy, size M", "Real bookstore crewneck. Small faded spot on the left cuff. Soft, and it has another winter in it. $22.", 22, "Clothing", "", "Like New", "/photos/hoodie.jpg", 2],
    ["bike", "chris", "City bike with a lock, Ezra Stiles", "Upright bars, one speed that is enough for Science Hill if you commit. Lock included. $140. I’ll walk it to a nearby college.", 140, "Other", "", "Good", "/photos/bike.jpg", 7],
    ["rug", "riley", "5×7 dorm rug, faded on one side", "Cotton rug that covered a Saybrook floor for two years. Faded where the window hit it. Otherwise fine. $30.", 30, "Furniture", "", "Fair", "/photos/rug.jpg", 8],
    ["monitor", "sam", "Dell 24-inch monitor, HDMI cable included", "1080p, no dead pixels, cable in the box. Easy to carry out of Silliman. $75.", 75, "Electronics", "", "Good", "/photos/monitor.jpg", 5],
  ] as const;

  const listings: Record<string, { id: string }> = {};
  for (const [key, seller, title, description, dollars, category, subcategory, condition, imageUrl, days] of specs) {
    listings[key] = await prisma.listing.create({
      data: {
        sellerId: people[seller].id,
        title,
        description,
        priceCents: dollars * 100,
        category,
        subcategory,
        condition,
        imageUrl,
        createdAt: ago(days),
      },
    });
  }

  const reviews = [
    ["maya", "jordan", "lamp", 5, 1, "Maya left the lamp outside Pierson’s gate exactly when she said she would. It works, and the bulb was in the bag."],
    ["maya", "chris", "desk", 5, 5, "Desk matched the listing, including the scratch she already mentioned. Met in the Pierson courtyard."],
    ["maya", "sam", "chamber", 5, 3, "Chamber seats were real. Maya sent the confirmation an hour after I paid."],
    ["alex", "jordan", "orgo", 5, 1, "No highlighting in the problem sets, which is the whole point of buying orgo used. Met at Bass."],
    ["alex", "priya", "mankiw", 5, 4, "Book was clean. Alex knocked two dollars off because the spine is soft. Easy TD pickup."],
    ["sam", "chris", "headphones", 4, 1, "Headphones sound right. Sam was ten minutes late at Silliman, but he texted."],
    ["sam", "riley", "monitor", 5, 4, "Cable was in the box, no dead pixels. Walked it from Silliman to Saybrook together."],
    ["sam", "taylor", "macbook", 4, 3, "Battery health was 87%, like the listing said. Met outside Payne Whitney."],
    ["priya", "alex", "coat", 5, 2, "Peacoat fits and doesn’t smell like a basement. Branford gate, two minutes."],
    ["priya", "maya", "hoodie", 4, 2, "Crewneck is real Yale merch. The cuff spot is exactly what she photographed."],
    ["chris", "sam", "bike", 5, 6, "Shifts cleanly, lock included. Chris walked it over to Silliman."],
    ["chris", "jordan", "yso", 5, 1, "Ticket was in my email before I got back to Hopper. Would buy from Chris again."],
    ["taylor", "alex", "game-pair", 5, 1, "Real Yale Bowl tickets. Taylor met me on Cross Campus with the PDF and his Yale ID."],
    ["taylor", "jordan", "game-one", 5, 0, "Section was the one in the listing. Venmo, no weirdness, done before dinner."],
    ["riley", "priya", "fridge", 4, 2, "Fridge cools. Heavier than I expected, and Riley still helped carry it to Branford."],
    ["riley", "maya", "rug", 5, 7, "Faded exactly where the listing said. Saybrook courtyard, done in five minutes."],
  ] as const;

  for (const [seller, buyer, listing, rating, days, body] of reviews) {
    await prisma.review.create({
      data: {
        sellerId: people[seller].id,
        buyerId: people[buyer].id,
        listingId: listings[listing].id,
        rating,
        body,
        createdAt: ago(days),
      },
    });
  }

  const lampThread = await prisma.thread.create({
    data: {
      listingId: listings.lamp.id,
      buyerId: people.jordan.id,
      sellerId: people.maya.id,
      createdAt: ago(0, 20),
    },
  });
  await prisma.message.createMany({
    data: [
      {
        threadId: lampThread.id,
        senderId: people.jordan.id,
        body: "Is the desk lamp still available? I can pick it up at Pierson tonight if you’ll do $14.",
        offerCents: 1400,
        createdAt: ago(0, 20),
      },
      {
        threadId: lampThread.id,
        senderId: people.maya.id,
        body: "I can meet you at $16. It was $28 new and the bulb is basically new.",
        offerCents: 1600,
        createdAt: ago(0, 18),
      },
      {
        threadId: lampThread.id,
        senderId: people.jordan.id,
        body: "Deal at $16. I’ll be at the Pierson gate around 8.",
        createdAt: ago(0, 17),
      },
    ],
  });

  const ticketThread = await prisma.thread.create({
    data: {
      listingId: listings["game-one"].id,
      buyerId: people.jordan.id,
      sellerId: people.taylor.id,
      createdAt: ago(0, 6),
    },
  });
  await prisma.message.createMany({
    data: [
      {
        threadId: ticketThread.id,
        senderId: people.jordan.id,
        body: "Still have the single for Saturday? I can do $48 if you’re around Berkeley after dinner.",
        offerCents: 4800,
        createdAt: ago(0, 6),
      },
      {
        threadId: ticketThread.id,
        senderId: people.taylor.id,
        body: "I can do $52. It’s the same section as the pair, just one seat.",
        offerCents: 5200,
        createdAt: ago(0, 5),
      },
    ],
  });

  console.log("Seeded Elm. Demo login: jordan.park@yale.edu / yaleblue");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

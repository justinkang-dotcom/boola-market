# Boola Market

Where Yale's supply meets demand. Verified sellers, honest reviews, no lemons.

A Yale-only student marketplace. Every account is an `@yale.edu` email, and every listing shows the seller’s residential college, a verified Yale badge, and ratings from people who actually bought from them.

## Why Boola Market

Anonymous campus apps like Fizz have the lemons problem. Buyers cannot tell a real ticket from a screenshot, a working fridge from a dead one, or a seller who will show up from one who will not. When quality is hidden, people assume the worst and good sellers leave. That is Akerlof's market for lemons: information asymmetry empties the market.

Boola Market clears supply and demand by making the missing information public. An `@yale.edu` address ties every account to a person and a residential college. Written reviews and an average rating travel with the seller. Auctions show the full bid history, so the price is not a private haggle in someone's DMs. Ticket handoffs are a digital transfer, not a fake meetup. Physical goods still set an in-person pickup. After the sale, both sides review each other, so the next buyer is not guessing.

## Run it

```bash
npm install && npm run dev
```

Open [http://localhost:3847](http://localhost:3847).

The first `npm run dev` creates the SQLite database and loads the demo listings. Later runs leave your accounts and new listings in place.

Reset the demo data:

```bash
npm run db:reset
```

## Demo login

| | |
| --- | --- |
| Email | `jordan.park@yale.edu` |
| Password | `yaleblue` |

Jordan (Grace Hopper ’28) already has offer threads with Maya Chen and Taylor Brooks. Every seeded account uses the password `yaleblue`. Other useful logins: `taylor.brooks@yale.edu` and `alex.rivera@yale.edu`.

Sign-up rejects anything that isn’t an `@yale.edu` address.

## Features

- Accounts are limited to `@yale.edu`. Each profile has a name, class year, and one of Yale’s 14 residential colleges.
- Browse, search, and filter listings by category (Tickets, including YSO and The Game, plus Furniture, Textbooks, Electronics, Clothing, and Other), college, condition, price, and auctions.
- Post a fixed price or an auction with a starting bid and an end time. Buyers place bids that have to beat the current high.
- The seller can end an auction early. It also closes when the clock runs out. The high bidder wins, and the listing shows who bought it and for how much.
- Tickets use a digital transfer: Won, payment sent on Venmo, ticket transferred, then both people confirm. Furniture and other goods use an in-person pickup, with an optional resco-to-resco delivery request. The category sets which handoff you get.
- After the handoff, each side can leave a star rating and a written review. Those reviews show on the profile and change the average.
- Message a seller about a fixed-price listing and attach an offer.

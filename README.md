# Elm

A Yale-only student marketplace. Every account is an `@yale.edu` email, and every listing shows the seller’s residential college, a verified Yale badge, and ratings from people who actually bought from them.

Students use it for YSO and Harvard–Yale tickets, textbooks, and the dorm things Facebook Marketplace and anonymous apps are bad at.

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

Jordan (Grace Hopper ’28) already has offer threads with Maya Chen and Taylor Brooks. Every seeded account uses the password `yaleblue`.

Sign-up rejects anything that isn’t an `@yale.edu` address. Try `jordan@gmail.com` if you want to see that.

## What you can do

- Browse, search, and filter listings by category (Tickets, including YSO and The Game, plus Furniture, Textbooks, Electronics, Clothing, and Other), college, condition, price, and auctions.
- Post a fixed price or an auction with a starting bid and end time. Buyers place bids that have to beat the current high.
- Open a listing, then message the seller and attach an offer or counteroffer.
- Open a seller profile for the verified badge, average rating, and written reviews.
- Create an account and post a listing with a photo URL or an upload.

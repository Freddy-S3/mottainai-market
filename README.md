# Mottainai Market

An e-commerce storefront for secondhand and vintage Japanese goods resold in Canada.

*Mottainai* (勿体無い) is the sense that something still useful should not be thrown away.
It is the idea behind boro textiles — mended until the mending became the object — and it
is the straightforward argument for buying secondhand.

The business plan lives in `business-plan/` (gitignored, local only).

## Stack

SvelteKit + TypeScript, Stripe Checkout, no database (flat-file catalog).

**Why this stack.** The sibling projects in this workspace use Next.js and plain static
HTML, so this one goes a third direction for range. The specific reason SvelteKit fits
*this* problem is `src/lib/server/` — SvelteKit refuses to bundle anything under that
directory into client code, and fails the build if you try. That turns the central
security property of a storefront into something the compiler enforces rather than
something a reviewer has to catch (see below).

No database at launch is a deliberate call, not a shortcut: the catalog is small, changes
only when a physical item is bought or sold, and a flat file keeps the whole thing on
free-tier hosting with no persistence layer to operate. The business plan notes the
trigger for moving to one.

## The two things this codebase actually gets right

### 1. Prices are resolved server-side, structurally

The checkout endpoint accepts **only a list of slugs**. No price, no quantity, no product
name. Everything billable is looked up in `src/lib/server/catalog.ts` at request time.

A client-supplied price would let anyone buy anything for any amount by editing the
request payload. Plenty of storefronts get this wrong. Here the canonical catalog
physically cannot be imported into client code, so there is no path by which a
browser-side value reaches a Stripe line item.

### 2. One-of-a-kind inventory is modelled as such

Secondhand goods are not restockable SKUs. There is no `stock` count and no quantity
field anywhere in the data model — quantity is always exactly 1, by definition of the
domain.

The consequence that matters: two shoppers can hold the same item in their carts, and
only one can buy it. So availability is re-checked **server-side at checkout time**, not
just at add-to-cart, and a sold item returns a 409 with an explanation rather than
silently failing.

## Verification performed

Built and run for real, not just written:

- `npm install` and `npm run build` both pass.
- `npm run preview` served the production build, and the flow was driven in a real
  browser: homepage → item page → add to cart → cart (correct server-resolved total) →
  checkout → the expected "Stripe not configured" error surfaced in the UI.
- The checkout endpoint was tested against 10 adversarial payloads:

  | Payload | Result |
  |---|---|
  | Client-supplied price fields injected | Extra fields discarded — response identical to the clean request |
  | Sold item | 409, explains one-of-a-kind |
  | Unknown slug | 400 |
  | Duplicate slug | 400 |
  | Empty cart / missing field / non-string slug | 400 |
  | Malformed JSON | 400 |
  | Valid single and multi-item | Reaches the Stripe call, stopped only by the placeholder key |

  The tampered-price case returning *exactly* the same response as the valid one is the
  evidence that the injected fields had no effect on the charge.

## Manual steps before this is a real store

None of these were done, and no credentials were fabricated anywhere in this repo.

- **`STRIPE_SECRET_KEY`** — the only payment config point. Copy `.env.example` to `.env`
  and set a real key. Until then `/api/checkout` returns a clear 501 rather than
  pretending to take money. `.env` is gitignored.
- **Catalog data is placeholder.** Every listing in `src/lib/server/catalog.ts` is
  invented for development. Replace with real sourcing records, photography, and pricing.
- **Domain** — `static/robots.txt` references a placeholder
  `mottainai-market.example.com`.
- **Regulatory clearance** — see the business plan. Electronics safety certification for
  vintage Japanese mains-powered goods is an unresolved question that could remove an
  entire product category, and duty classification for used goods is unverified. Do not
  sell before a customs broker and an accountant have weighed in.
- **Shipping rates and tax collection** are not implemented — both depend on answers from
  the above.

## Local development

```bash
npm install
npm run dev
```

Build and preview the production output:

```bash
npm run build
npm run preview
```

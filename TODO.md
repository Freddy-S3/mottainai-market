# TODO

Open work on mottainai-market. Cross-referenced with the idea queue at
`~/.claude-harness/queue/` - this repo's items live in `QUEUE-PC.md`. Close an item in both
places or neither.

## 1. `node_modules/` is missing - nothing here can be built right now

**Resolved 2026-08-14.** `npm ci` installed 114 packages and `npm run build` succeeded on
this machine.

The reason this mattered more here than in a typical repo: the security story of this
codebase is that server-only code lives in `src/lib/server/` and **SvelteKit fails the build
if client code imports it** - a compiler guarantee instead of a review catch. That guarantee
is now exercised rather than assumed. Adding `import { getItem } from '$lib/server/catalog'`
to `src/lib/cart.ts` (a browser module) fails the build with
`vite-plugin-sveltekit-guard: Cannot import $lib/server/catalog.ts into code that runs in
the browser`. The probe import was reverted; it exists only in this note.

Tracked in `QUEUE-PC.md` as "Install mottainai-market's dependencies".

## 2. Re-verify against the system Node

**Resolved 2026-08-14.** Re-verified on the system Node v22.11.0 resolved via PATH from
`D:\Program Files\NodeJS`, not the retired portable 22.14.0. Install, build, and preview all
pass on it.

The supported range is now pinned in `package.json` `engines` and `.nvmrc` so the next
machine does not have to rediscover it. Still do not hardcode `C:\Program Files\nodejs` in
any script; resolve node via PATH.

## 3. Re-run the checkout hardening checks

**Resolved 2026-08-14.** Fifteen payloads were put against `/api/checkout` on the production
build (`npm run preview`), and the identical-response bar held: every tampering attempt -
injected `price`, injected `unit_amount`, injected `quantity`, a negative price, and a
prototype-pollution payload - returned a response byte-identical to the clean request. The
endpoint reads only `slugs` and resolves everything billable from the catalog, so injected
fields have nowhere to land.

Rejections behave: unknown slug and duplicate slug 400, malformed JSON 400, non-array
`slugs` 400, an object in place of a slug string 400.

The 409 path is confirmed on this one-of-a-kind inventory. A cart containing the sold
`indigo-boro-textile` returns 409 both alone and when mixed with an available piece, so
availability is genuinely re-checked server-side at checkout rather than only at
add-to-cart.

Worth re-running after any change to `src/routes/api/checkout/+server.ts` or
`src/lib/server/catalog.ts`.

## 4. Manual steps that need Faruk

Recorded so they are not rediscovered later:

- `STRIPE_SECRET_KEY` - placeholder only, no real credential anywhere in the repo.
- Real catalog data. The current catalog is seed content.
- A domain.
- The customs-broker consult before anything is actually sold. The business plan gates the
  whole audio/camera category on the unresolved electronics safety certification question,
  and that question is still unresolved - it is not a footnote, it can remove a category.

## 5. Business plan

`business-plan/` is gitignored and confirmed untracked at HEAD with `git ls-files`. Re-check
that way after any `.gitignore` edit; running `git check-ignore` before a repo's first
commit exists proves nothing, which is how a sibling repo ended up committing its plan.

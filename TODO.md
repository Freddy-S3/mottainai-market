# TODO

Open work on mottainai-market. Cross-referenced with the idea queue at
`~/.claude-harness/queue/` - this repo's items live in `QUEUE-PC.md`. Close an item in both
places or neither.

## 1. `node_modules/` is missing - nothing here can be built right now

This checkout has no `node_modules/`, so the repo cannot be built, previewed, or tested as
it stands. `package-lock.json` is present, so:

```
npm ci
npm run build
```

This matters more here than it would in a typical repo. The security story of this codebase
is that server-only code lives in `src/lib/server/` and **SvelteKit fails the build if
client code imports it** - that is the point of the stack choice, a compiler guarantee
instead of a review catch. A guarantee enforced by a build is worth nothing until the build
actually runs on this machine.

Tracked in `QUEUE-PC.md` as "Install mottainai-market's dependencies".

## 2. Re-verify against the system Node

Everything in this repo was verified on the portable Node 22.14.0 that has since been
superseded. The system install is **v22.11.0 at `D:\Program Files\NodeJS`** - an *older*
patch than the one the original verification ran on, so re-running the build here is a real
re-verification rather than a formality.

Do not hardcode `C:\Program Files\nodejs` in any script; the install is on D:. Resolve node
via PATH.

## 3. Re-run the checkout hardening checks

The original run put 10 adversarial payloads against `/api/checkout`, and the evidence that
price tampering had no effect was that the injected-price request returned a response
*identical* to the clean one. Re-run that after item 1, and keep that identical-response
bar - a response that merely looks right is not evidence.

Also re-confirm the 409 path: this is one-of-a-kind inventory with no stock count and no
quantity field, so two shoppers can hold the same piece in a cart, and availability is
re-checked server-side at checkout.

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

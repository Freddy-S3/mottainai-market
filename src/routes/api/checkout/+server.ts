import { json, type RequestHandler } from '@sveltejs/kit';
import { getItem } from '$lib/server/catalog';
import { stripe, STRIPE_IS_CONFIGURED } from '$lib/server/stripe';

// The client sends only { slugs: string[] }. No price, no quantity, no name.
// Everything billable is resolved here against the canonical catalog. A
// client-supplied price would let anyone buy anything for any amount by
// editing the request payload.
//
// Quantity is not accepted either, and not because it is unused: this is a
// one-of-a-kind catalog, so quantity is always exactly 1 by definition. There
// is no legitimate request that needs to say otherwise.
function parseSlugs(body: unknown): string[] | null {
	if (typeof body !== 'object' || body === null) return null;
	const { slugs } = body as { slugs?: unknown };
	if (!Array.isArray(slugs) || slugs.length === 0) return null;

	const seen = new Set<string>();
	for (const slug of slugs) {
		if (typeof slug !== 'string' || slug.length === 0) return null;
		// A repeated slug in a one-of-a-kind catalog is a tampered or buggy
		// payload - there is only ever one of the object.
		if (seen.has(slug)) return null;
		seen.add(slug);
	}
	return [...seen];
}

export const POST: RequestHandler = async ({ request, url }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Malformed request body' }, { status: 400 });
	}

	const slugs = parseSlugs(body);
	if (!slugs) {
		return json({ error: 'Cart is empty or invalid' }, { status: 400 });
	}

	const lineItems = [];
	for (const slug of slugs) {
		const item = getItem(slug);
		if (!item) {
			return json({ error: `Unknown item: ${slug}` }, { status: 400 });
		}
		// Re-check availability at checkout time, not just at add-to-cart time.
		// With single-copy inventory this is the whole ballgame: two people can
		// hold the same item in their cart, and only one can buy it.
		if (item.sold) {
			return json(
				{ error: `${item.name} has already sold. Secondhand pieces are one of a kind.` },
				{ status: 409 }
			);
		}
		lineItems.push({
			price_data: {
				currency: 'cad',
				product_data: { name: item.name },
				// Server-side price, in cents. Never from the request.
				unit_amount: Math.round(item.price * 100)
			},
			quantity: 1
		});
	}

	if (!STRIPE_IS_CONFIGURED) {
		return json(
			{
				error:
					'Stripe is not configured with a real key yet (placeholder mode). ' +
					'Set STRIPE_SECRET_KEY - see src/lib/server/stripe.ts and .env.example.'
			},
			{ status: 501 }
		);
	}

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: lineItems,
		success_url: `${url.origin}/checkout?success=1`,
		cancel_url: `${url.origin}/cart`
	});

	return json({ url: session.url });
};

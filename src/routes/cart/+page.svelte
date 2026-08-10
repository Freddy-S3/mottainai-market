<script lang="ts">
	import { cart } from '$lib/cart';
	import type { PageData } from './$types';

	export let data: PageData;

	let error = '';
	let busy = false;

	$: lines = $cart
		.map((slug) => data.items.find((i) => i.slug === slug))
		.filter((i): i is (typeof data.items)[number] => Boolean(i));
	$: total = lines.reduce((sum, i) => sum + i.price, 0);
	$: hasSold = lines.some((i) => i.sold);

	async function checkout() {
		busy = true;
		error = '';
		try {
			// Only slugs go over the wire. The server resolves price and
			// availability itself.
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ slugs: $cart })
			});
			const body = await res.json();
			if (!res.ok) {
				error = body.error ?? 'Checkout failed.';
				return;
			}
			window.location.href = body.url;
		} catch {
			error = 'Could not reach checkout. Try again.';
		} finally {
			busy = false;
		}
	}
</script>

<svelte:head>
	<title>Cart — Mottainai Market</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<h1>Cart</h1>

{#if lines.length === 0}
	<p class="lede">Nothing in the cart yet. <a href="/">Browse the pieces</a>.</p>
{:else}
	{#each lines as item (item.slug)}
		<div class="row">
			<div>
				<a href="/item/{item.slug}">{item.name}</a>
				<p class="meta">
					{item.era} · {item.sourcedFrom}
					{#if item.sold}<strong> — sold since you added it</strong>{/if}
				</p>
			</div>
			<div>
				<span class="price">${item.price}</span>
				<button class="btn" on:click={() => cart.remove(item.slug)}>Remove</button>
			</div>
		</div>
	{/each}

	<div class="row">
		<strong>Total</strong>
		<strong class="price">${total} CAD</strong>
	</div>

	{#if hasSold}
		<p class="error">
			One or more pieces in your cart have sold. Remove them to continue — single-copy inventory
			means we cannot get another.
		</p>
	{/if}

	{#if error}
		<p class="error">{error}</p>
	{/if}

	<p>
		<button class="btn" on:click={checkout} disabled={busy || hasSold}>
			{busy ? 'Starting checkout…' : 'Checkout'}
		</button>
	</p>

	<p class="note">
		Payment runs through Stripe Checkout. This build ships with a placeholder key, so checkout
		returns a clear "not configured" error rather than pretending to take money.
	</p>
{/if}

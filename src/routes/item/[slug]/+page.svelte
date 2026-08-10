<script lang="ts">
	import { cart } from '$lib/cart';
	import type { PageData } from './$types';

	export let data: PageData;

	$: inCart = $cart.includes(data.item.slug);
</script>

<svelte:head>
	<title>{data.item.name} — Mottainai Market</title>
	<meta name="description" content={data.item.description} />
</svelte:head>

<p><a href="/">&larr; All pieces</a></p>

<div class="detail">
	<div>
		<span class="tag" class:sold={data.item.sold}
			>{data.item.sold ? 'Sold' : data.item.category}</span
		>
		<h1>{data.item.name}</h1>
		<p class="meta">{data.item.jpName} · {data.item.era}</p>
		<p>{data.item.description}</p>

		<dl class="spec">
			<dt>Condition</dt>
			<dd>{data.conditionLabel}</dd>
			<dt>Condition notes</dt>
			<dd>{data.item.conditionNotes}</dd>
			<dt>Sourced from</dt>
			<dd>{data.item.sourcedFrom}</dd>
			<dt>Dimensions</dt>
			<dd>{data.item.dimensions}</dd>
		</dl>
	</div>

	<aside>
		<p class="price">${data.item.price} CAD</p>
		{#if data.item.sold}
			<p class="meta">This piece has sold. There is not another one.</p>
			<button class="btn" disabled>Sold</button>
		{:else if inCart}
			<button class="btn" on:click={() => cart.remove(data.item.slug)}>Remove from cart</button>
		{:else}
			<button class="btn" on:click={() => cart.add(data.item.slug)}>Add to cart</button>
		{/if}
		<p class="note">
			One of a kind. Holding it in your cart does not reserve it — availability is confirmed again at
			checkout.
		</p>
	</aside>
</div>

<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Mottainai Market — Secondhand & Vintage Japanese Goods in Canada</title>
	<meta
		name="description"
		content="Secondhand and vintage goods sourced piece by piece from Japan's resale culture and shipped to Canada. Every item is one of a kind."
	/>
</svelte:head>

<h1>Sourced one piece at a time, from Japan</h1>
<p class="lede">
	Japan keeps its things well, and then it lets them go. We buy from the resale chains, the temple
	flea markets, and the estate clearances, and we bring the good pieces to Canada. Nothing here is
	restockable — each listing is a single object we physically have.
</p>

<div class="grid">
	{#each data.items as item (item.slug)}
		<a class="card" href="/item/{item.slug}">
			<span class="tag" class:sold={item.sold}>{item.sold ? 'Sold' : item.category}</span>
			<h3>{item.name}</h3>
			<p class="meta">{item.jpName} · {item.era}</p>
			<p class="meta">{item.sourcedFrom}</p>
			<p class="price">${item.price} CAD</p>
		</a>
	{/each}
</div>

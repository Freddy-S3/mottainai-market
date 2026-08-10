<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { cart } from '$lib/cart';

	$: success = $page.url.searchParams.get('success') === '1';

	onMount(() => {
		if (success) cart.clear();
	});
</script>

<svelte:head>
	<title>Order — Mottainai Market</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if success}
	<h1>Thank you</h1>
	<p class="lede">
		Your order is in. You will get a confirmation by email, and a shipping note once the piece is
		packed — secondhand items are packed individually rather than pulled from stock.
	</p>
{:else}
	<h1>Nothing to confirm</h1>
	<p class="lede">This page is shown after a completed payment. <a href="/">Back to the shop</a>.</p>
{/if}

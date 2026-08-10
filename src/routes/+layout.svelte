<script lang="ts">
	import { cart } from '$lib/cart';
	import '../app.css';
</script>

<header>
	<div class="wrap header-inner">
		<a class="logo" href="/">
			<span class="jp">勿体無い</span>
			<span>Mottainai Market</span>
		</a>
		<nav>
			<a href="/">Shop</a>
			<a href="/about">Sourcing</a>
			<a href="/cart">Cart ({$cart.length})</a>
		</nav>
	</div>
</header>

<main class="wrap">
	<slot />
</main>

<footer>
	<div class="wrap">
		<p>
			Mottainai Market &mdash; secondhand and vintage Japanese goods, sourced piece by piece and
			resold in Canada.
		</p>
		<p class="fine">
			Every item is a single physical object. When it sells, it is gone. Listings and pricing shown
			here are development placeholders.
		</p>
	</div>
</footer>

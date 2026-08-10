import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// The cart holds slugs only. It deliberately does not hold prices - the client
// has no authority over what anything costs, so there is nothing here for a
// tampered localStorage entry to influence beyond which items get looked up.
const KEY = 'mottainai-cart';

function load(): string[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(KEY);
		const parsed: unknown = raw ? JSON.parse(raw) : [];
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((s): s is string => typeof s === 'string');
	} catch {
		return [];
	}
}

function createCart() {
	const { subscribe, update, set } = writable<string[]>(load());

	function persist(slugs: string[]) {
		if (browser) localStorage.setItem(KEY, JSON.stringify(slugs));
		return slugs;
	}

	return {
		subscribe,
		add: (slug: string) => update((s) => persist(s.includes(slug) ? s : [...s, slug])),
		remove: (slug: string) => update((s) => persist(s.filter((x) => x !== slug))),
		clear: () => set(persist([]))
	};
}

export const cart = createCart();

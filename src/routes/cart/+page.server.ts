import { listItems } from '$lib/server/catalog';
import type { PageServerLoad } from './$types';

// The cart page resolves slugs against the catalog server-side too, so the
// totals a shopper sees come from the same source the charge will.
export const load: PageServerLoad = () => ({ items: listItems() });

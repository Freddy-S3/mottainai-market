import { listItems } from '$lib/server/catalog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ items: listItems() });

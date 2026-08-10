import { error } from '@sveltejs/kit';
import { getItem, CONDITION_LABELS } from '$lib/server/catalog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const item = getItem(params.slug);
	if (!item) throw error(404, 'That piece is not in the catalog.');
	return { item, conditionLabel: CONDITION_LABELS[item.condition] };
};

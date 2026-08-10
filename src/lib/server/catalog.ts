// Canonical catalog. This module lives under `src/lib/server/`, which SvelteKit
// refuses to bundle into client code - importing it from a component is a build
// error, not a code-review catch. That is deliberate: it is what makes
// "prices are always resolved server-side" a structural guarantee here.
//
// EXAMPLE / PLACEHOLDER DATA. Every listing below is invented for development.
// Replace with real sourcing records, photography, and pricing before launch.

// Secondhand inventory is one-of-a-kind: each row is a single physical object,
// not a restockable SKU with a quantity. There is no `stock` count anywhere in
// this model on purpose - an item is either available or it has been sold, and
// two buyers can never both get it. Quantity is therefore always exactly 1.
export type Condition = 'mint' | 'excellent' | 'good' | 'fair';

export type Item = {
	slug: string;
	name: string;
	jpName: string;
	price: number; // CAD
	category: string;
	era: string;
	condition: Condition;
	conditionNotes: string;
	// Where this specific piece came from. Provenance is a selling point for
	// secondhand goods, not decoration - keep it truthful per item.
	sourcedFrom: string;
	description: string;
	dimensions: string;
	sold: boolean;
};

export const CONDITION_LABELS: Record<Condition, string> = {
	mint: 'Mint - as new, no visible wear',
	excellent: 'Excellent - minimal signs of use',
	good: 'Good - light honest wear, fully functional',
	fair: 'Fair - visible wear, priced accordingly'
};

const items: Item[] = [
	{
		slug: 'showa-kutani-tea-set',
		name: 'Showa-era Kutani Tea Set',
		jpName: '九谷焼 煎茶器',
		price: 180,
		category: 'Ceramics',
		era: 'Showa (c. 1960s)',
		condition: 'excellent',
		conditionNotes:
			'No chips or hairline cracks. Slight gilding wear on two cup rims, consistent with careful use.',
		sourcedFrom: 'Estate clearance, Kanazawa',
		description:
			'A five-cup Kutani sencha set in the overglaze polychrome style the region is known for. Sourced from a household clearance in Kanazawa, the city Kutani ware comes from.',
		dimensions: 'Pot 14cm x 9cm; cups 6cm dia.',
		sold: false
	},
	{
		slug: 'sony-walkman-wm-2',
		name: 'Sony Walkman WM-2',
		jpName: 'ソニー ウォークマン WM-2',
		price: 260,
		category: 'Audio',
		era: '1981',
		condition: 'good',
		conditionNotes:
			'Belt replaced, transport tested and playing at correct speed. Case has scuffs and the battery door is slightly loose. Original headphones not included.',
		sourcedFrom: 'Hard Off, Niigata',
		description:
			'The second-generation Walkman, and the one that set the shape everything after it copied. Serviced rather than sold as-is - the drive belt is the part that always perishes, and this one has a new one.',
		dimensions: '113mm x 82mm x 30mm',
		sold: false
	},
	{
		slug: 'kiri-tansu-small',
		name: 'Small Kiri Tansu Chest',
		jpName: '桐箪笥 小',
		price: 420,
		category: 'Furniture',
		era: 'Showa (c. 1950s)',
		condition: 'good',
		conditionNotes:
			'Paulownia has darkened evenly with age. One drawer runs slightly tight in humidity. Original iron hardware intact.',
		sourcedFrom: 'Estate clearance, Toyama',
		description:
			'Four-drawer paulownia chest. Kiri is light, resists humidity, and was traditionally used to store kimono for exactly that reason.',
		dimensions: '60cm W x 40cm D x 55cm H',
		sold: false
	},
	{
		slug: 'noritake-coffee-service',
		name: 'Noritake Coffee Service for Six',
		jpName: 'ノリタケ コーヒーセット',
		price: 145,
		category: 'Ceramics',
		era: 'c. 1970s',
		condition: 'mint',
		conditionNotes: 'Unused, retained in original box. No crazing, no wear to the gilt.',
		sourcedFrom: 'Book Off Bazaar, Saitama',
		description:
			'A boxed gift service that was received and never used - a genuinely common find in Japanese estate sales, where formal tableware was kept for guests who never came.',
		dimensions: 'Cups 8cm dia.; saucers 14cm dia.',
		sold: false
	},
	{
		slug: 'nikon-fe-body',
		name: 'Nikon FE Camera Body',
		jpName: 'ニコン FE ボディ',
		price: 210,
		category: 'Cameras',
		era: '1978',
		condition: 'excellent',
		conditionNotes:
			'Meter accurate against a known reference, all shutter speeds sound correct by ear. Light seals replaced. Minor brassing on the base plate. Body only, no lens.',
		sourcedFrom: 'Camera fair, Osaka',
		description:
			'A mechanical/electronic hybrid SLR from the period when Nikon was building bodies to outlive their owners. Tested before listing rather than sold untested.',
		dimensions: '142mm x 89mm x 57mm',
		sold: false
	},
	{
		slug: 'indigo-boro-textile',
		name: 'Indigo Boro Textile Panel',
		jpName: '襤褸 藍染',
		price: 320,
		category: 'Textiles',
		era: 'Early Showa',
		condition: 'fair',
		conditionNotes:
			'Heavily mended by design - boro is defined by its repairs. Structurally sound but fragile at two edges. Sold as a decorative textile, not for wear.',
		sourcedFrom: 'Flea market, Kyoto (Toji temple market)',
		description:
			'Layered, sashiko-stitched indigo cotton, patched repeatedly over decades of use. Boro is the physical record of mottainai - the refusal to waste something still useful.',
		dimensions: '90cm x 130cm',
		sold: true
	}
];

export function listItems(): Item[] {
	return items;
}

export function getItem(slug: string): Item | undefined {
	return items.find((i) => i.slug === slug);
}

// The safe subset sent to the browser. Notably this still includes price -
// for display - but the checkout path never reads the client's copy of it.
export type PublicItem = Omit<Item, never>;

export function toPublic(item: Item): PublicItem {
	return item;
}

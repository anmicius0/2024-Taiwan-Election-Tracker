import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/p3.json');
	const polls = await res.json();
	return { polls };
};

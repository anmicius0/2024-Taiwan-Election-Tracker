// Shared utilities and constants

export type SourceItem = {
	code: string;
	name: string;
	value: boolean;
};

export const defaultSources: SourceItem[] = [
	{ code: 'taiwan_public_opinion_foundation', name: '台灣民意基金會', value: true },
	{ code: 'udn', name: '聯合報', value: true },
	{ code: 'quickseek', name: '影響力數據顧問（QuickseeK）', value: true },
	{ code: 'cmmedia', name: '匯流新聞網（精確）', value: true },
	{ code: 'media_storm', name: '鋒燦傳媒', value: true },
	{ code: 'apec', name: '中華亞太菁英交流協會', value: true },
	{ code: 'mirror_media', name: '菱傳媒', value: true },
	{ code: 'tvbs', name: 'TVBS', value: true },
	{ code: 'zhen_media', name: '震傳媒', value: true }
];

export type ChartPollData = {
	institution: string;
	date: string;
	dpp?: number;
	kmt?: number;
	tpp?: number;
	sample?: string | number;
	undecided?: number;
};

export function getFilter(sources: SourceItem[]): string[] {
	return sources.filter((i) => i.value).map((i) => i.name);
}

export function getData(
	raw: ChartPollData[],
	filter: string[]
): {
	xAxis: string[];
	series: { name: string; type: string; smooth: boolean; data: (number | null)[] }[];
} {
	if (!raw?.length) return { xAxis: [], series: [] };
	const data = raw
		.filter((item) => filter.includes(item.institution))
		.sort((a, b) => (a.date > b.date ? 1 : -1));
	const dates = [...new Set(data.map((i) => i.date))];
	const parties = ['dpp', 'kmt', 'tpp'] as const;
	type Party = (typeof parties)[number];
	const series = parties.map((party) => ({
		name: party.toUpperCase(),
		type: 'line',
		smooth: true,
		data: dates.map((date) => {
			const entry = data.find((i) => i.date === date);
			const value =
				entry && typeof entry[party as Party] === 'number' ? entry[party as Party] : null;
			return value === undefined ? null : value;
		})
	}));
	return { xAxis: dates, series };
}

// Re-export types from taiwanPollingAlgorithm for compatibility
export type { PollData } from './utils/taiwanPollingAlgorithm';

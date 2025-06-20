import * as echarts from 'echarts';
import type { PollData, WeightedPoll } from './utils/taiwanPollingAlgorithm';
import { TaiwanPollingAlgorithm } from './utils/taiwanPollingAlgorithm';

// --- Chart Logic ---

interface ChartSeries {
	name: string;
	type: string;
	smooth: boolean;
	data: (number | null)[];
	lineStyle?: { width?: number; type?: string };
}

interface ChartData {
	xAxis: string[];
	series: ChartSeries[];
}

export function useChart() {
	const initChart = (el: HTMLDivElement) => echarts.init(el);

	const drawChart = (chart: echarts.EChartsType, data: ChartData) => {
		if (!data?.xAxis || !data?.series) return;

		// Neo-brutalism: solid party colors only
		const colors = [
			'#1b9431', // DPP
			'#0000c8', // KMT
			'#00b4b4', // TPP
			'rgba(27, 148, 49, 0.5)', // DPP avg
			'rgba(0, 0, 200, 0.5)', // KMT avg
			'rgba(0, 180, 180, 0.5)' // TPP avg
		];

		chart.setOption(
			{
				backgroundColor: '#ffffff',
				title: {
					text: '2024 Election Trends',
					left: 'center',
					textStyle: {
						color: '#0a0a0a',
						fontSize: 20,
						fontWeight: '900',
						fontFamily: 'Space Grotesk, Inter, system-ui'
					}
				},
				tooltip: {
					trigger: 'axis',
					backgroundColor: '#ffe44d',
					borderColor: '#000000',
					borderWidth: 2,
					textStyle: { color: '#0a0a0a', fontWeight: 'bold' },
					extraCssText: 'box-shadow: 4px 4px 0 #000;'
				},
				legend: {
					top: 40,
					textStyle: { color: '#0a0a0a', fontWeight: '700' },
					type: 'scroll',
					pageIconColor: '#0a0a0a',
					pageTextStyle: { color: '#0a0a0a' }
				},
				color: colors,
				xAxis: {
					type: 'category',
					data: data.xAxis,
					axisLabel: { color: '#0a0a0a', fontSize: 11, fontWeight: 'bold' },
					axisLine: { lineStyle: { color: '#000000', width: 2 } },
					axisTick: { lineStyle: { color: '#000000' } }
				},
				yAxis: {
					type: 'value',
					axisLabel: { color: '#0a0a0a', fontSize: 11, fontWeight: 'bold', formatter: '{value}%' },
					splitLine: { lineStyle: { color: '#e5e5e5', type: 'dashed' } },
					axisLine: { show: true, lineStyle: { color: '#000000', width: 2 } }
				},
				series: data.series.map((s) => ({
					...s,
					lineStyle: {
						...s.lineStyle,
						width: s.lineStyle?.type !== 'dashed' ? 3 : 2
					},
					symbol: 'circle',
					symbolSize: 7,
					itemStyle: { borderColor: '#000', borderWidth: 2 },
					connectNulls: false,
					areaStyle: undefined
				})),
				grid: {
					containLabel: true,
					left: '3%',
					right: '4%',
					bottom: '3%',
					top: '90px'
				},
				dataZoom: [
					{ type: 'inside', start: 0, end: 100 },
					{
						start: 0,
						end: 100,
						handleStyle: { color: '#ffe44d', borderColor: '#000', borderWidth: 2 },
						textStyle: { color: '#0a0a0a', fontWeight: 'bold' },
						borderColor: '#000',
						borderWidth: 2,
						dataBackground: {
							lineStyle: { color: '#000', width: 1 },
							areaStyle: { color: 'rgba(0,0,0,0.05)' }
						},
						selectedDataBackground: {
							lineStyle: { color: '#0000c8' },
							areaStyle: { color: 'rgba(0,0,200,0.1)' }
						}
					}
				]
			},
			true
		);
	};

	return { initChart, drawChart };
}

// --- Prediction Logic ---

export function usePollingPrediction() {
	const algorithm = new TaiwanPollingAlgorithm();

	const sanitizePolls = (data: Partial<PollData>[] = []): PollData[] => {
		const clamp = (v: number) => Math.max(0, Math.min(100, v));
		return (data || [])
			.filter(
				(p): p is PollData =>
					!!p &&
					typeof p.date === 'string' &&
					p.date.trim().length > 0 &&
					typeof p.institution === 'string' &&
					Number.isFinite(p.dpp) &&
					Number.isFinite(p.kmt) &&
					Number.isFinite(p.tpp) &&
					!Number.isNaN(new Date(p.date).getTime())
			)
			.map((p) => ({
				...p,
				method: p.method || '市話',
				sample: (p.sample || 0) > 0 ? p.sample! : 1000,
				dpp: clamp(p.dpp),
				kmt: clamp(p.kmt),
				tpp: clamp(p.tpp)
			}));
	};

	const generatePredictions = (data: PollData[]) => {
		const cleaned = sanitizePolls(data);
		if (!cleaned.length) return null;
		try {
			return algorithm.predictElection(cleaned, '2024-01-13');
		} catch (error) {
			console.error('Error generating predictions:', error);
			return null;
		}
	};

	const getPredictionSummary = (data: PollData[]) => {
		const predictions = generatePredictions(data);
		if (!predictions) return null;

		// Actual results for accuracy comparison
		const actual = { dpp: 40.05, kmt: 33.49, tpp: 26.46 };

		return {
			predictions: predictions.predictions,
			accuracy: algorithm.evaluatePrediction(predictions, actual),
			methodology: predictions.methodology,
			topPolls: predictions.poll_details.slice(0, 3)
		};
	};

	const normalizeInst = (s: string) =>
		s
			.replace(/（[^）]*）/g, '')
			.replace(/\([^)]*\)/g, '')
			.replace(/\s+/g, '')
			.trim();

	const filterByInstitutions = (data: PollData[], selectedInstitutions: string[]): PollData[] => {
		const cleaned = sanitizePolls(data);
		if (!selectedInstitutions?.length) return cleaned;

		const normalizedSelected = new Set(selectedInstitutions.map(normalizeInst));
		return cleaned.filter((poll) => {
			const inst = normalizeInst(poll.institution);
			if (normalizedSelected.has(inst)) return true;
			for (const s of normalizedSelected) {
				if (inst.startsWith(s)) return true;
			}
			return false;
		});
	};

	const getEnhancedChartData = (data: PollData[], selectedInstitutions: string[]) => {
		const filteredData = filterByInstitutions(data, selectedInstitutions);
		if (!filteredData.length) return { xAxis: [], series: [] };

		const predictionResult = generatePredictions(filteredData);
		if (!predictionResult) return { xAxis: [], series: [] };

		const weightedPolls = predictionResult.poll_details;
		const groups: Record<string, WeightedPoll[]> = {};

		weightedPolls.forEach((p) => {
			const d = p.date;
			const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
			if (!groups[dateStr]) groups[dateStr] = [];
			groups[dateStr].push(p);
		});

		const dates = Object.keys(groups).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
		const parties = ['dpp', 'kmt', 'tpp'] as const;

		const seriesData = {
			dpp: [] as (number | null)[],
			kmt: [] as (number | null)[],
			tpp: [] as (number | null)[]
		};

		// 1. Per-date averages
		dates.forEach((date) => {
			const polls = groups[date];
			parties.forEach((party) => {
				let total = 0,
					weight = 0;
				polls.forEach((p) => {
					total += p.corrected[party] * p.weight;
					weight += p.weight;
				});
				seriesData[party].push(weight > 0 ? parseFloat((total / weight).toFixed(2)) : null);
			});
		});

		// 2. Election Day Sync
		const electionDay = '2024-01-13';
		if (dates[dates.length - 1] !== electionDay) {
			dates.push(electionDay);
			parties.forEach((party) => seriesData[party].push(predictionResult.predictions[party]));
		} else {
			parties.forEach((party) => {
				seriesData[party][seriesData[party].length - 1] = predictionResult.predictions[party];
			});
		}

		const series = parties.map((party) => ({
			name: `${party.toUpperCase()} (Enhanced)`,
			type: 'line',
			smooth: true,
			data: seriesData[party],
			lineStyle: { width: 3, type: 'solid' }
		}));

		// Raw Averages (Dashed lines)
		const rawSeriesData = {
			dpp: [] as (number | null)[],
			kmt: [] as (number | null)[],
			tpp: [] as (number | null)[]
		};
		const pollDatesOnly = dates.includes(electionDay) ? dates.slice(0, -1) : dates;

		pollDatesOnly.forEach((date) => {
			const polls = groups[date];
			parties.forEach((party) => {
				if (!polls) {
					rawSeriesData[party].push(null);
					return;
				}
				const total = polls.reduce((sum, p) => sum + p.original[party], 0);
				rawSeriesData[party].push(parseFloat((total / polls.length).toFixed(2)));
			});
		});
		// Pad end
		parties.forEach((p) => rawSeriesData[p].push(null));

		const rawSeries = parties.map((party) => ({
			name: `${party.toUpperCase()} (Average)`,
			type: 'line',
			smooth: true,
			data: rawSeriesData[party],
			lineStyle: { width: 2, type: 'dashed' }
		}));

		return { xAxis: dates, series: [...series, ...rawSeries] };
	};

	return {
		getPredictionSummary,
		filterByInstitutions,
		getEnhancedChartData
	};
}

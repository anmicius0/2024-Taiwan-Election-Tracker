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

		// Colors correspond to CSS vars: DPP, KMT, TPP, then transparent versions
		const colors = ['#32D74B', '#0A84FF', '#64D2FF', '#32D74B40', '#0A84FF40', '#64D2FF60'];

		chart.setOption(
			{
				backgroundColor: 'transparent',
				title: {
					text: '2024 Election Trends',
					left: 'center',
					textStyle: {
						color: '#FFFFFF',
						fontSize: 24,
						fontWeight: '600',
						fontFamily: 'SF Pro Display'
					}
				},
				tooltip: {
					trigger: 'axis',
					backgroundColor: 'rgba(30, 30, 30, 0.8)',
					borderColor: 'rgba(255, 255, 255, 0.2)',
					borderWidth: 1,
					textStyle: { color: '#FFFFFF' },
					backdropFilter: 'blur(10px)'
				},
				legend: {
					top: 50,
					textStyle: { color: 'rgba(255, 255, 255, 0.8)' },
					type: 'scroll',
					pageIconColor: '#fff',
					pageTextStyle: { color: '#fff' }
				},
				color: colors,
				xAxis: {
					type: 'category',
					data: data.xAxis,
					axisLabel: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 12 },
					axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
				},
				yAxis: {
					type: 'value',
					axisLabel: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 12, formatter: '{value}%' },
					splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } }
				},
				series: data.series.map((s) => ({
					...s,
					lineStyle: {
						width: 3,
						shadowColor: '#00ff62', // Match the line color
						shadowBlur: 15 // Create the neon tube effect
					},
					symbol: 'circle',
					symbolSize: 8,
					itemStyle: { borderColor: '#fff', borderWidth: 2 },
					connectNulls: false
				})),
				grid: {
					containLabel: true,
					left: '3%',
					right: '4%',
					bottom: '3%',
					top: '100px'
				},
				dataZoom: [
					{ type: 'inside', start: 0, end: 100 },
					{
						start: 0,
						end: 100,
						handleStyle: { color: '#FFFFFF' },
						textStyle: { color: '#FFFFFF' },
						borderColor: 'transparent',
						dataBackground: {
							lineStyle: { color: 'rgba(255,255,255,0.5)' },
							areaStyle: { color: 'rgba(255,255,255,0.1)' }
						},
						selectedDataBackground: {
							lineStyle: { color: '#fff' },
							areaStyle: { color: 'rgba(255,255,255,0.2)' }
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
					Number.isFinite(p.tpp)
			)
			.map((p) => ({
				...p,
				method: p.method || '市話',
				sample: (p.sample || 0) > 0 ? p.sample! : 1000,
				dpp: clamp(p.dpp),
				kmt: clamp(p.kmt),
				tpp: clamp(p.tpp)
			}))
			.filter((p) => !Number.isNaN(new Date(p.date).getTime()));
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
			const dateStr = p.date.toISOString().split('T')[0];
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

<script lang="ts">
	import * as echarts from 'echarts';
	import { onDestroy, onMount } from 'svelte';
	import { useChart as chartUtil, usePollingPrediction } from '../composables';
	import { defaultSources, getFilter, type PollData } from '../utils';

	let state = $state(defaultSources);
	let { data = [] } = $props();
	let chart: echarts.EChartsType | null = null;
	let chartRef: HTMLDivElement;

	const { initChart, drawChart } = chartUtil();
	const { getEnhancedChartData } = usePollingPrediction();

	let filter = $derived(getFilter(state));
	let enhancedChartData = $derived(getEnhancedChartData(data as PollData[], filter));

	onMount(async () => {
		chart = initChart(chartRef);
		if (chart && enhancedChartData) drawChart(chart, enhancedChartData);
	});

	$effect(() => {
		if (chart && enhancedChartData) {
			drawChart(chart, enhancedChartData);
		}
	});

	onDestroy(() => {
		if (chart) chart.dispose();
	});
</script>

<div class="space-y-8">
	<div class="glass-panel p-8">
		<h2 class="mb-8 text-center text-3xl font-bold text-white drop-shadow-md">Polling Sources</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each state as item (item.code)}
				<div class="group">
					<label
						for={item.code}
						class="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
					>
						<span class="text-sm font-semibold text-white/90">{item.name}</span>
						<input
							type="checkbox"
							id={item.code}
							bind:checked={item.value}
							class="checkbox"
							aria-label={item.name}
						/>
					</label>
				</div>
			{/each}
		</div>
	</div>

	<div class="glass-panel p-8">
		<div bind:this={chartRef} id="myChart" class="h-96 w-full min-w-[300px]"></div>
	</div>
</div>

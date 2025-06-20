<script lang="ts">
	import { useChart as chartUtil, usePollingPrediction } from '../composables';
	import { defaultSources, getFilter, type PollData } from '../utils';

	let state = $state(defaultSources);
	let { data = [] } = $props();

	let selectedCount = $derived(state.filter((s) => s.value).length);

	function selectAll() {
		state.forEach((s) => (s.value = true));
	}
	function deselectAll() {
		state.forEach((s) => (s.value = false));
	}

	const { initChart, drawChart } = chartUtil();
	const { getEnhancedChartData } = usePollingPrediction();

	let filter = $derived(getFilter(state));
	let enhancedChartData = $derived(getEnhancedChartData(data as PollData[], filter));

	// Svelte Action for ECharts
	function chartAction(node: HTMLDivElement, chartData: any) {
		const chart = initChart(node);
		if (chartData) drawChart(chart, chartData);

		// Make chart responsive
		const resizeObserver = new ResizeObserver(() => chart.resize());
		resizeObserver.observe(node);

		return {
			update(newData: any) {
				if (newData) drawChart(chart, newData);
			},
			destroy() {
				resizeObserver.disconnect();
				chart.dispose();
			}
		};
	}
</script>

<div class="space-y-6">
	<div class="brutal-card p-6">
		<div class="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h2 class="text-2xl font-black text-black">Polling Sources</h2>
				<p class="text-xs font-bold text-black">{selectedCount}/{state.length} selected</p>
			</div>
			<div class="flex items-center gap-2">
				<button
					onclick={selectAll}
					class="border-2 border-black bg-[var(--color-accent)] px-4 py-1.5 text-xs font-black tracking-widest uppercase shadow-[4px_4px_0_#000] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
				>
					All
				</button>
				<button
					onclick={deselectAll}
					class="border-2 border-black bg-white px-4 py-1.5 text-xs font-black tracking-widest uppercase shadow-[4px_4px_0_#000] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
				>
					None
				</button>
			</div>
		</div>
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each state as item (item.code)}
				<label
					for={item.code}
					class="flex cursor-pointer items-center justify-between border-2 border-black bg-white p-3 shadow-[4px_4px_0_#000] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
				>
					<span class="text-sm font-bold text-black">{item.name}</span>
					<input
						type="checkbox"
						id={item.code}
						bind:checked={item.value}
						class="checkbox"
						aria-label={item.name}
					/>
				</label>
			{/each}
		</div>
	</div>

	<div class="brutal-card p-6">
		<div use:chartAction={enhancedChartData} class="h-96 w-full min-w-[300px]"></div>
	</div>
</div>

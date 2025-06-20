<script lang="ts">
	import { usePollingPrediction } from '../composables';
	import { defaultSources, getFilter } from '../utils';

	let { data = [], selectedInstitutions = getFilter(defaultSources) } = $props();

	const { getPredictionSummary, filterByInstitutions } = usePollingPrediction();

	const ACTUAL = { dpp: 40.05, kmt: 33.49, tpp: 26.46 } as const;

	// Error badge color: white < 1.5pp, yellow < 3pp, red >= 3pp
	function errorClass(error: number) {
		if (error < 1.5) return 'text-black bg-white';
		if (error < 3) return 'text-black bg-[var(--color-accent)]';
		return 'text-black bg-[var(--color-accent2)]';
	}

	let filteredData = $derived(filterByInstitutions(data, selectedInstitutions));
	let predictionSummary = $derived(data.length ? getPredictionSummary(filteredData) : null);
</script>

<div class="space-y-6">
	{#if !predictionSummary}
		<div class="brutal-card p-8">
			<div class="animate-pulse space-y-4">
				<div class="h-6 w-1/3 bg-black"></div>
				<div class="h-4 w-2/3 bg-black"></div>
				<div class="grid grid-cols-3 gap-4">
					<div class="h-24 border-2 border-black bg-[var(--color-bg)]"></div>
					<div class="h-24 border-2 border-black bg-[var(--color-bg)]"></div>
					<div class="h-24 border-2 border-black bg-[var(--color-bg)]"></div>
				</div>
			</div>
		</div>
	{:else}
		<div class="brutal-card p-6 md:p-10">
			<div class="mb-8 border-b-4 border-black pb-6">
				<h2 class="text-4xl font-black tracking-tight text-black md:text-5xl">Forecast</h2>
				<p class="mt-1 font-bold text-black">Weighted analysis of current trends</p>
			</div>

			<!-- Party cards -->
			<div class="grid grid-cols-1 gap-5 md:grid-cols-3">
				{#each Object.entries(predictionSummary.predictions) as [party, percentage] (party)}
					{@const actualVal = ACTUAL[party as keyof typeof ACTUAL]}
					{@const errorKey = `${party}_error` as keyof typeof predictionSummary.accuracy}
					{@const error = predictionSummary.accuracy
						? predictionSummary.accuracy[errorKey]
						: undefined}
					<div class="brutal-card flex flex-col p-6">
						<!-- Party label + color bar -->
						<div class="mb-4 flex items-center justify-between">
							<span class="text-xs font-black tracking-[0.2em] text-black uppercase">
								{party}
							</span>
							<div
								class="h-3 w-10 border-2 border-black"
								style="background-color: var(--color-{party})"
							></div>
						</div>

						<!-- Forecast number -->
						<div class="mb-4">
							<h3 class="text-5xl font-black tracking-tighter text-black">
								{percentage}<span class="align-top text-2xl text-black">%</span>
							</h3>
							<p class="mt-0.5 text-[10px] font-black tracking-widest text-black uppercase">
								Forecast
							</p>
						</div>

						<!-- Actual result row -->
						<div
							class="mb-4 flex items-center justify-between border-2 border-black bg-[var(--color-bg)] px-3 py-2"
						>
							<span class="text-xs font-bold text-black">Actual (2024)</span>
							<span class="text-sm font-black text-black">{actualVal}%</span>
						</div>

						<!-- Margin badge -->
						{#if error !== undefined}
							<div class="mb-4">
								<span
									class="inline-flex items-center border-2 border-black px-2.5 py-0.5 text-xs font-black shadow-[4px_4px_0_#000] {errorClass(
										error
									)}"
								>
									±{error.toFixed(1)}pp
								</span>
								<span class="ml-2 text-xs font-bold text-black">margin of error</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Summary accuracy strip -->
			{#if predictionSummary.accuracy}
				{@const total = predictionSummary.accuracy.total_error}
				<div
					class="brutal-card mt-8 flex flex-wrap items-center justify-center gap-3 bg-[var(--color-bg)] px-6 py-4 text-center"
				>
					<span class="text-xs font-black tracking-widest text-black uppercase"
						>Total Absolute Error</span
					>
					<span
						class="border-2 border-black px-3 py-1 text-sm font-black shadow-[4px_4px_0_#000] {errorClass(
							total / 3
						)}"
					>
						{total.toFixed(2)}pp across 3 parties
					</span>
					<span class="text-xs font-bold text-black"
						>vs actual — DPP {ACTUAL.dpp}% · KMT {ACTUAL.kmt}% · TPP {ACTUAL.tpp}%</span
					>
				</div>
			{/if}
		</div>
	{/if}
</div>

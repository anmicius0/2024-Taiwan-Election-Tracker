<script lang="ts">
	import { usePollingPrediction } from '../composables';
	import { defaultSources, getFilter } from '../utils';

	let { data = [], selectedInstitutions = getFilter(defaultSources) } = $props();

	const { getPredictionSummary, filterByInstitutions } = usePollingPrediction();

	let filteredData = $derived(filterByInstitutions(data, selectedInstitutions));
	let predictionSummary = $derived(data.length ? getPredictionSummary(filteredData) : null);

	// return the typed accuracy value for a known party key to avoid indexing with a computed string
	function accuracyFor(p: string): number | undefined {
		if (!predictionSummary?.accuracy) return undefined;
		switch (p) {
			case 'dpp':
				return predictionSummary.accuracy.dpp_error;
			case 'kmt':
				return predictionSummary.accuracy.kmt_error;
			case 'tpp':
				return predictionSummary.accuracy.tpp_error;
			case 'total':
				return predictionSummary.accuracy.total_error;
			default:
				return undefined;
		}
	}
</script>

<div class="space-y-6">
	{#if !predictionSummary}
		<div class="glass-panel p-8">
			<div class="animate-pulse space-y-4">
				<div class="h-6 w-1/3 rounded bg-white/10"></div>
				<div class="h-4 w-2/3 rounded bg-white/10"></div>
				<div class="grid grid-cols-3 gap-4">
					<div class="h-24 rounded-2xl bg-white/5"></div>
					<div class="h-24 rounded-2xl bg-white/5"></div>
					<div class="h-24 rounded-2xl bg-white/5"></div>
				</div>
			</div>
		</div>
	{:else}
		<div class="glass-panel p-8 md:p-12">
			<div class="mb-12 text-center">
				<h2
					class="text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] md:text-5xl"
				>
					AI Forecast
				</h2>
				<p class="mt-2 font-medium text-white/60">Weighted analysis of current trends</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				{#each Object.entries(predictionSummary.predictions) as [party, percentage] (party)}
					<div
						class="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-colors duration-500 hover:bg-white/10"
					>
						<!-- Ambient Glow (Static) -->
						<div
							class="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full opacity-40 blur-[60px] bg-{party}"
						></div>

						<div class="relative z-10 flex h-full flex-col justify-between">
							<div class="mb-8 flex items-center justify-between">
								<span class="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
									{party}
								</span>
								<div
									class="h-2 w-2 rounded-full bg-{party} shadow-[0_0_10px_var(--color-{party})]"
								></div>
							</div>

							<div class="mb-8">
								<h3 class="text-6xl font-bold tracking-tighter text-white">
									{percentage}<span class="align-top text-3xl text-white/40">%</span>
								</h3>
								{#if predictionSummary.accuracy}
									<p class="mt-2 text-sm font-medium text-white/50">
										±{accuracyFor(party)?.toFixed(1)}pp margin
									</p>
								{/if}
							</div>

							<div class="h-2 w-full overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
								<div
									class="h-full bg-{party} transition-all duration-1000 shadow-[0_0_10px_var(--color-{party})]"
									style="width: {percentage}%"
								></div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

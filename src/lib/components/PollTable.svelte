<script lang="ts">
	import type { PollData } from '../utils/taiwanPollingAlgorithm';

	let { data = [] } = $props();

	let isExpanded = $state(false);
	const INITIAL_COUNT = 10;

	// 1. Filter valid data
	let validData = $derived(data.filter((row) => row.institution && row.date));

	// 2. Determine what to show based on state
	let visibleRows = $derived(isExpanded ? validData : validData.slice(0, INITIAL_COUNT));

	let hasMore = $derived(validData.length > INITIAL_COUNT);

	const columns = [
		{ name: 'institution', label: 'Institution' },
		{ name: 'date', label: 'Date' },
		{ name: 'sample', label: 'Sample' },
		{ name: 'dpp', label: 'DPP' },
		{ name: 'tpp', label: 'TPP' },
		{ name: 'kmt', label: 'KMT' },
		{ name: 'undecided', label: 'Undecided' }
	] as const;
</script>

<div class="glass-panel relative space-y-8 p-8 transition-all duration-500">
	<div class="text-center">
		<h2 class="mb-2 text-3xl font-bold text-white drop-shadow-md">Data Archive</h2>
		<p class="font-medium text-white/60">
			Showing {visibleRows.length} of {validData.length} polling records
		</p>
	</div>

	<!-- Table Container -->
	<div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
		<div class="overflow-x-auto">
			<table class="table w-full min-w-[600px]">
				<thead>
					<tr>
						{#each columns as col (col.name)}
							<th
								class="px-6 py-4 text-left text-xs font-bold tracking-widest whitespace-nowrap text-white/60 uppercase"
							>
								{col.label}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-white/5">
					{#each visibleRows as row (`${row.institution}-${row.date}-${row.method}`)}
						<tr class="transition-colors hover:bg-white/10">
							{#each columns as col (col.name)}
								<td class="px-6 py-4 text-sm whitespace-nowrap">
									{#if col.name === 'dpp'}
										<span
											class="font-bold text-[var(--color-dpp)] drop-shadow-[0_0_8px_rgba(52,199,89,0.6)]"
										>
											{row.dpp}%
										</span>
									{:else if col.name === 'kmt'}
										<span
											class="font-bold text-[var(--color-kmt)] drop-shadow-[0_0_8px_rgba(0,122,255,0.6)]"
										>
											{row.kmt}%
										</span>
									{:else if col.name === 'tpp'}
										<span
											class="font-bold text-[var(--color-tpp)] drop-shadow-[0_0_8px_rgba(90,200,250,0.6)]"
										>
											{row.tpp}%
										</span>
									{:else if col.name === 'undecided'}
										<span class="text-white/30">{row.undecided}%</span>
									{:else}
										<span class="font-medium text-white/90">
											{row[col.name as keyof PollData] ?? '-'}
										</span>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Optical Gradient Mask (Only visible when collapsed) -->
	{#if hasMore && !isExpanded}
		<div
			class="pointer-events-none absolute bottom-24 left-0 h-40 w-full bg-gradient-to-t from-black via-black/60 to-transparent"
		></div>
	{/if}

	<!-- Expand/Collapse Button -->
	{#if hasMore}
		<div class="relative z-10 flex justify-center pt-4">
			<button
				onclick={() => (isExpanded = !isExpanded)}
				class="group relative flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-bold tracking-widest text-white uppercase backdrop-blur-md transition-colors duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
			>
				<span>{isExpanded ? 'Collapse Archive' : 'View Full Archive'}</span>

				<!-- Arrow Icon -->
				<svg
					class="h-4 w-4 transition-transform duration-300 {isExpanded ? 'rotate-180' : 'rotate-0'}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>
		</div>
	{/if}
</div>

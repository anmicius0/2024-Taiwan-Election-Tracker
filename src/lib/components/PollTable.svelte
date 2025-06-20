<script lang="ts">
	let { data = [] } = $props();

	let isExpanded = $state(false);
	let searchQuery = $state('');
	let sortColumn = $state<string>('date');
	let sortDirection = $state<'asc' | 'desc'>('desc');
	const INITIAL_COUNT = 10;

	// Reference to scroll back to top when collapsing
	let tableRef: HTMLDivElement;

	type ColName = 'date' | 'institution' | 'sample' | 'dpp' | 'tpp' | 'kmt' | 'undecided';

	const columns: { name: ColName; label: string; align: 'left' | 'right'; sortable: boolean }[] = [
		{ name: 'date', label: 'Date', align: 'left', sortable: true },
		{ name: 'institution', label: 'Institution', align: 'left', sortable: true },
		{ name: 'sample', label: 'Sample', align: 'right', sortable: true },
		{ name: 'dpp', label: 'DPP', align: 'right', sortable: true },
		{ name: 'tpp', label: 'TPP', align: 'right', sortable: true },
		{ name: 'kmt', label: 'KMT', align: 'right', sortable: true },
		{ name: 'undecided', label: 'Undecided', align: 'right', sortable: true }
	];

	let validData = $derived(data.filter((row) => row.institution && row.date));

	let filteredData = $derived(
		searchQuery.trim()
			? validData.filter((row) =>
					row.institution.toLowerCase().includes(searchQuery.trim().toLowerCase())
				)
			: validData
	);

	let sortedData = $derived(
		[...filteredData].sort((a, b) => {
			let diff: number;
			if (sortColumn === 'date') {
				diff = new Date(a.date).getTime() - new Date(b.date).getTime();
			} else if (sortColumn === 'institution') {
				diff = a.institution.localeCompare(b.institution, 'zh-TW');
			} else {
				const aVal = (a as Record<string, unknown>)[sortColumn] as number | undefined;
				const bVal = (b as Record<string, unknown>)[sortColumn] as number | undefined;
				diff = (aVal ?? 0) - (bVal ?? 0);
			}
			return sortDirection === 'asc' ? diff : -diff;
		})
	);

	let visibleRows = $derived(isExpanded ? sortedData : sortedData.slice(0, INITIAL_COUNT));
	let hasMore = $derived(sortedData.length > INITIAL_COUNT);

	function handleSort(col: ColName) {
		if (sortColumn === col) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = col;
			sortDirection = 'desc';
		}
		// Reset to collapsed view on re-sort so user sees top results
		isExpanded = false;
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-CA'); // YYYY-MM-DD
	}

	function toggleExpand() {
		isExpanded = !isExpanded;
		// Smoothly scroll back to the table top if we are collapsing
		if (!isExpanded && tableRef) {
			const y = tableRef.getBoundingClientRect().top + window.scrollY - 100;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}
</script>

<div bind:this={tableRef} class="brutal-card relative space-y-6 p-6">
	<!-- Header -->
	<div
		class="flex flex-col items-start gap-4 border-b-4 border-black pb-6 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<h2 class="text-3xl font-black text-black">Data Archive</h2>
			<p class="text-sm font-bold text-black">
				{#if searchQuery.trim()}
					{sortedData.length} result{sortedData.length !== 1 ? 's' : ''} for "<span
						class="text-black">{searchQuery.trim()}</span
					>"
				{:else}
					{validData.length} polling records
				{/if}
			</p>
		</div>
		<!-- Search Input -->
		<div class="relative w-full max-w-xs">
			<svg
				class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2.5"
					d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
				/>
			</svg>
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="Filter by institution…"
				class="w-full border-2 border-black bg-white py-2 pr-4 pl-9 text-sm font-semibold text-black placeholder-black shadow-[4px_4px_0_#000] transition focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none focus:outline-none"
			/>
		</div>
	</div>

	<!-- Table Container -->
	<div class="overflow-hidden border-2 border-black">
		<div class="overflow-x-auto">
			<table class="table w-full min-w-[700px]">
				<thead>
					<tr>
						{#each columns as col (col.name)}
							<th
								class="px-5 py-3 text-xs font-black tracking-widest whitespace-nowrap uppercase
									{col.align === 'right' ? 'text-right' : 'text-left'}
									{col.sortable ? 'cursor-pointer select-none hover:bg-[var(--color-accent)]' : ''}
									{sortColumn === col.name ? 'bg-[var(--color-accent)]' : ''}"
								onclick={() => col.sortable && handleSort(col.name)}
							>
								<span class="inline-flex items-center gap-1">
									{col.label}
									{#if col.sortable}
										<span class="inline-flex flex-col leading-none">
											<svg
												class="h-2 w-2 {sortColumn === col.name && sortDirection === 'asc'
													? 'text-[var(--color-accent2)]'
													: 'text-black'}"
												viewBox="0 0 8 5"
												fill="currentColor"
											>
												<path d="M4 0L8 5H0z" />
											</svg>
											<svg
												class="h-2 w-2 {sortColumn === col.name && sortDirection === 'desc'
													? 'text-[var(--color-accent2)]'
													: 'text-black'}"
												viewBox="0 0 8 5"
												fill="currentColor"
											>
												<path d="M4 5L0 0h8z" />
											</svg>
										</span>
									{/if}
								</span>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#if visibleRows.length === 0}
						<tr>
							<td
								colspan={columns.length}
								class="px-6 py-12 text-center text-sm font-bold text-black"
							>
								No records match "<span class="font-black text-black">{searchQuery}</span>"
							</td>
						</tr>
					{/if}
					{#each visibleRows as row, i (`${row.institution}-${row.date}-${row.method}-${i}`)}
						<tr class="transition-colors hover:bg-[var(--color-bg)]">
							{#each columns as col (col.name)}
								<td
									class="px-5 py-4 text-sm whitespace-nowrap {col.align === 'right'
										? 'text-right font-bold'
										: 'text-left'}"
								>
									{#if col.name === 'date'}
										<span class="font-mono font-bold text-black">{formatDate(row.date)}</span>
									{:else if col.name === 'dpp'}
										<span class="font-black text-[var(--color-dpp)]">{row.dpp}%</span>
									{:else if col.name === 'kmt'}
										<span class="font-black text-[var(--color-kmt)]">{row.kmt}%</span>
									{:else if col.name === 'tpp'}
										<span class="font-black text-[var(--color-tpp)]">{row.tpp}%</span>
									{:else if col.name === 'undecided'}
										<span class="font-bold text-black"
											>{row.undecided != null ? `${row.undecided}%` : '—'}</span
										>
									{:else if col.name === 'sample'}
										<span class="font-bold text-black"
											>{row.sample ? row.sample.toLocaleString() : '—'}</span
										>
									{:else}
										<span class="font-semibold text-black">
											{(row as Record<string, unknown>)[col.name] ?? '—'}
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

	<!-- Expand/Collapse Button -->
	{#if hasMore}
		<div class="relative z-10 flex justify-center pt-2">
			<button
				onclick={toggleExpand}
				class="flex items-center gap-3 border-2 border-black bg-[var(--color-accent)] px-8 py-3 text-sm font-black tracking-widest uppercase shadow-[4px_4px_0_#000] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
			>
				<span>{isExpanded ? 'Collapse Archive' : `View All ${sortedData.length} Records`}</span>
				<svg
					class="h-4 w-4 transition-transform duration-300 {isExpanded ? 'rotate-180' : 'rotate-0'}"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</div>
	{/if}
</div>

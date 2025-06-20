<script lang="ts">
	import AlgorithmExplain from '$lib/components/AlgorithmExplain.svelte';
	import Chart from '$lib/components/Chart.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import PollTable from '$lib/components/PollTable.svelte';
	import PredictionDisplay from '$lib/components/PredictionDisplay.svelte';

	let { data } = $props();
</script>

<div class="min-h-screen text-[#0a0a0a]">
	<Header />

	<main class="pb-16">
		<div class="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
			<Chart data={data.polls} />
			<PredictionDisplay data={data.polls} />
			<AlgorithmExplain />
			<PollTable data={data.polls} />
		</div>
	</main>

	<Footer />
</div>

<script lang="ts">
	import AlgorithmExplain from '$lib/components/AlgorithmExplain.svelte';
	import Chart from '$lib/components/Chart.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import PollTable from '$lib/components/PollTable.svelte';
	import PredictionDisplay from '$lib/components/PredictionDisplay.svelte';

	let { data } = $props();
</script>

<div class="selection:bg-kmt min-h-screen text-white/90 selection:text-white">
	<Header />

	<main class="relative pb-20">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<section class="mb-20">
				<Chart data={data.polls} />
			</section>

			<section class="mb-20">
				<PredictionDisplay data={data.polls} />
			</section>

			<section class="mb-20">
				<AlgorithmExplain />
			</section>

			<section class="mb-20">
				<PollTable data={data.polls} />
			</section>
		</div>
	</main>

	<Footer />
</div>

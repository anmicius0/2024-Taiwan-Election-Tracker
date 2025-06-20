<script lang="ts">
	const layers = [
		{
			label: 'Layer 1: Methodology Weighting',
			title: 'Methodology Variance Correction',
			desc: 'Addresses the "Landline Bias" in traditional polling. Pure landline results are penalized (0.75x) due to historically low youth reach, while SMS (1.45x) and Mobile (1.3x) are boosted to reflect actual demographic participation.',
			color: 'from-blue-500/20'
		},
		{
			label: 'Layer 2: Structural Regression',
			title: 'Historical Floor Normalization',
			desc: 'Using the 2022 Taipei Mayoral election as a structural proxy, the model calculates a "Structural Delta." If a party polls significantly below its historical floor, a regression coefficient (up to 0.52 for TPP) is applied to mitigate the "Spiral of Silence" effect.',
			color: 'from-purple-500/20'
		},
		{
			label: 'Layer 3: Undecided Allocation',
			title: 'Probabilistic Distribution',
			desc: 'Undecided voters are not split evenly. The model assigns a "Momentum Bonus" to the incumbent (DPP) based on organic share (39.3%), while opposition gains are tied to their consolidation delta against historical floors.',
			color: 'from-green-500/20'
		}
	];

	const mathSteps = [
		{ formula: 'W = M * e^(-d * ln2 / 14)', label: 'Time Decay & Method Weight' },
		{ formula: 'Δ = History - RawAvg', label: 'Structural Delta' },
		{ formula: 'Gain = (U * Organic) + (Δ * Coeff)', label: 'Undecided Distribution' }
	];
</script>

<div class="glass-panel overflow-hidden p-8 md:p-12">
	<div class="mb-16 text-center">
		<h2 class="text-4xl font-bold tracking-tight text-white md:text-5xl">Algorithm Transparency</h2>
		<p class="mx-auto mt-4 max-w-2xl text-lg font-medium text-white/60">
			The Demographic Structural Model (DSM) processes raw data through three distinct layers of
			mathematical correction to produce a predictive forecast.
		</p>
	</div>

	<!-- Process Layers -->
	<div class="space-y-6">
		{#each layers as layer (layer.label)}
			<div
				class="group relative flex flex-col items-start gap-6 rounded-3xl border border-white/10 bg-gradient-to-br {layer.color} to-transparent p-8 transition-all duration-500 hover:border-white/30 hover:bg-white/5 md:flex-row md:items-center"
			>
				<div class="flex-1">
					<span class="text-xs font-bold tracking-widest text-white/40 uppercase"
						>{layer.label}</span
					>
					<h3 class="mt-2 text-2xl font-bold text-white">{layer.title}</h3>
					<p class="mt-4 leading-relaxed text-white/70">{layer.desc}</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Math Breakdown -->
	<div class="mt-16 grid grid-cols-1 gap-8 rounded-[2.5rem] bg-white/5 p-8 md:grid-cols-3">
		{#each mathSteps as step (step.label)}
			<div class="text-center">
				<div
					class="text-primary font-mono text-xl font-bold drop-shadow-[0_0_10px_rgba(255,159,10,0.5)]"
				>
					{step.formula}
				</div>
				<div class="mt-2 text-xs font-bold tracking-tighter text-white/30 uppercase">
					{step.label}
				</div>
			</div>
		{/each}
	</div>

	<!-- Technical Constants Glossary -->
	<div class="mt-16 border-t border-white/10 pt-12">
		<div class="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
			<div>
				<h4 class="text-xs font-bold tracking-widest text-white/40 uppercase">Recency</h4>
				<p class="mt-1 text-lg font-bold text-white">14-Day Halflife</p>
			</div>
			<div>
				<h4 class="text-xs font-bold tracking-widest text-white/40 uppercase">Methodology</h4>
				<p class="mt-1 text-lg font-bold text-white">SMS 1.45x / LL 0.75x</p>
			</div>
			<div>
				<h4 class="text-xs font-bold tracking-widest text-white/40 uppercase">Correction</h4>
				<p class="mt-1 text-lg font-bold text-white">DSM v2.4 Regression</p>
			</div>
			<div>
				<h4 class="text-xs font-bold tracking-widest text-white/40 uppercase">History Proxy</h4>
				<p class="mt-1 text-lg font-bold text-white">2022-TPE Baseline</p>
			</div>
		</div>
	</div>

	<!-- Footnote -->
	<div class="mt-12 text-center text-xs text-white/20 italic">
		* This model utilizes logarithmic sample scaling and exponential time-decay to prioritize
		high-quality, recent data.
	</div>
</div>

<style>
	/* Custom neon text effect */
	.text-primary {
		color: #ff9f0a;
	}
</style>

<script lang="ts">
	const layers = [
		{
			label: 'Layer 1: Methodology Weighting',
			title: 'Methodology Variance Correction',
			desc: 'Addresses the "Landline Bias" in traditional polling. Pure landline results are penalized (0.75x) due to historically low youth reach, while SMS (1.45x) and Mobile (1.3x) are boosted to reflect actual demographic participation.'
		},
		{
			label: 'Layer 2: Structural Regression',
			title: 'Historical Floor Normalization',
			desc: 'Using the 2022 Taipei Mayoral election as a structural proxy, the model calculates a "Structural Delta." If a party polls significantly below its historical floor, a regression coefficient (up to 0.52 for TPP) is applied to mitigate the "Spiral of Silence" effect.'
		},
		{
			label: 'Layer 3: Undecided Allocation',
			title: 'Probabilistic Distribution',
			desc: 'Undecided voters are not split evenly. The model assigns a "Momentum Bonus" to the incumbent (DPP) based on organic share (39.3%), while opposition gains are tied to their consolidation delta against historical floors.'
		}
	];

	const mathSteps = [
		{ formula: 'W = M * (0.5)^(d / 14)', label: 'Time Decay & Method Weight' },
		{ formula: 'Δ = History - RawAvg', label: 'Structural Delta' },
		{ formula: 'Gain = (U * Organic) + (Δ * Coeff)', label: 'Undecided Distribution' }
	];
</script>

<div class="brutal-card overflow-hidden p-6 md:p-10">
	<div class="mb-10 border-b-4 border-black pb-8">
		<h2 class="text-4xl font-black tracking-tight text-black md:text-5xl">
			Algorithm Transparency
		</h2>
		<p class="mt-3 max-w-2xl text-base font-semibold text-black">
			The Demographic Structural Model (DSM) processes raw data through three distinct layers of
			mathematical correction to produce a predictive forecast.
		</p>
	</div>

	<!-- Process Layers -->
	<div class="space-y-4">
		{#each layers as layer (layer.label)}
			<div class="brutal-card flex flex-col items-start gap-4 p-6 md:flex-row md:items-start">
				<div class="flex-1">
					<span
						class="inline-block border-2 border-black bg-[var(--color-accent)] px-2 py-1 text-[10px] font-black tracking-widest text-black uppercase shadow-[4px_4px_0_#000]"
					>
						{layer.label}
					</span>
					<h3 class="mt-4 text-xl font-black text-black">{layer.title}</h3>
					<p class="mt-2 text-sm leading-relaxed font-semibold text-black">{layer.desc}</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Math Breakdown -->
	<div class="mt-10 grid grid-cols-1 gap-4 border-2 border-black bg-black p-6 md:grid-cols-3">
		{#each mathSteps as step (step.label)}
			<div class="border-2 border-white p-4 text-center">
				<div class="font-mono text-lg font-black text-[var(--color-accent)]">
					{step.formula}
				</div>
				<div class="mt-2 text-[10px] font-black tracking-widest text-white uppercase">
					{step.label}
				</div>
			</div>
		{/each}
	</div>

	<!-- Technical Constants -->
	<div class="mt-10 border-t-4 border-black pt-8">
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			<div class="brutal-card p-4">
				<h4 class="text-[10px] font-black tracking-widest text-black uppercase">Recency</h4>
				<p class="mt-1 text-base font-black text-black">14-Day Halflife</p>
			</div>
			<div class="brutal-card p-4">
				<h4 class="text-[10px] font-black tracking-widest text-black uppercase">Methodology</h4>
				<p class="mt-1 text-base font-black text-black">SMS 1.45x / LL 0.75x</p>
			</div>
			<div class="brutal-card p-4">
				<h4 class="text-[10px] font-black tracking-widest text-black uppercase">Correction</h4>
				<p class="mt-1 text-base font-black text-black">DSM v2.4 Regression</p>
			</div>
			<div class="brutal-card p-4">
				<h4 class="text-[10px] font-black tracking-widest text-black uppercase">History Proxy</h4>
				<p class="mt-1 text-base font-black text-black">2022-TPE Baseline</p>
			</div>
		</div>
	</div>

	<!-- Footnote -->
	<div class="mt-8 border-l-4 border-black pl-4 text-xs font-semibold text-black">
		* This model utilizes logarithmic sample scaling and exponential time-decay to prioritize
		high-quality, recent data.
	</div>
</div>

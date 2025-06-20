<script lang="ts">
	// No script needed for this presentational component
</script>

<header class="relative flex justify-center py-12">
	<!-- Floating Glass Island -->
	<div
		class="glass-panel relative mx-4 flex max-w-2xl flex-col items-center justify-center overflow-hidden px-12 py-8 text-center md:px-20"
	>
		<!-- Internal ambient glow -->
		<div
			class="absolute -top-24 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/10 blur-[50px]"
		></div>

		<!-- Status Badge -->
		<div
			class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md"
		>
			<!-- Changed: Static gray dot implies "Offline/Stored" state -->
			<span class="h-1.5 w-1.5 rounded-full bg-zinc-500"></span>
			<span class="text-[10px] font-bold tracking-widest text-white/60 uppercase"
				>Data Archived</span
			>
		</div>

		<!-- Main Title with Party Gradient -->
		<h1
			class="relative z-10 mb-4 bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-4xl font-black tracking-tighter text-transparent drop-shadow-sm md:text-6xl"
		>
			2024 Taiwan
			<span
				class="block bg-gradient-to-r from-[var(--color-dpp)] via-[var(--color-kmt)] to-[var(--color-tpp)] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
			>
				Election Tracker
			</span>
		</h1>

		<!-- Subtitle -->
		<p class="relative z-10 max-w-md text-lg leading-relaxed font-medium text-white/60">
			Advanced demographic forecasting & <br class="hidden md:block" />
			historical polling analytics.
		</p>
	</div>
</header>

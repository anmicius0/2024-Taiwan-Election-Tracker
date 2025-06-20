<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<!-- The Liquid Background Layer -->
<div class="liquid-bg">
	<div class="liquid-blob blob-1"></div>
	<div class="liquid-blob blob-2"></div>
	<div class="liquid-blob blob-3"></div>
</div>

<!-- Content Layer -->
<div class="relative z-10">
	{@render children()}
</div>

<script lang="ts">
	// Props
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let color: string = 'teal';
	export let text: string | undefined = undefined;
	export let inline: boolean = false;

	// Size configurations
	const sizeConfig = {
		small: {
			spinner: 'w-4 h-4',
			text: 'text-xs',
			gap: 'gap-2'
		},
		medium: {
			spinner: 'w-6 h-6',
			text: 'text-sm',
			gap: 'gap-3'
		},
		large: {
			spinner: 'w-8 h-8',
			text: 'text-base',
			gap: 'gap-4'
		}
	};

	// Color configurations
	const colorConfig = {
		teal: 'border-teal-600',
		blue: 'border-blue-600',
		green: 'border-green-600',
		red: 'border-red-600',
		yellow: 'border-yellow-600',
		purple: 'border-purple-600',
		gray: 'border-gray-600'
	};

	$: config = sizeConfig[size];
	$: spinnerColor = colorConfig[color] || colorConfig.teal;
</script>

<div class="flex items-center justify-center {inline ? 'inline-flex' : ''} {config.gap}">
	<!-- Spinner -->
	<div 
		class="animate-spin rounded-full border-2 border-gray-200 {config.spinner} {spinnerColor}"
		style="border-top-color: transparent;"
		role="status"
		aria-label="Loading"
	></div>
	
	<!-- Loading Text -->
	{#if text}
		<span class="text-gray-600 {config.text}">{text}</span>
	{/if}
</div>

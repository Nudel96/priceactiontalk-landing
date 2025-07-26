<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { HelpCircle, X, ExternalLink, BookOpen } from '@lucide/svelte';
	import type { EducationalTooltip } from '$lib/types/economic';

	// Props
	export let tooltip: EducationalTooltip;
	export let language: 'en' | 'de' = 'en';
	export let position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
	export let trigger: 'hover' | 'click' = 'hover';
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let showIcon: boolean = true;
	export let iconOnly: boolean = false;

	// Internal state
	let isVisible = false;
	let tooltipElement: HTMLDivElement;
	let triggerElement: HTMLElement;

	const dispatch = createEventDispatcher<{
		learnMore: { url: string };
		close: void;
	}>();

	// Position classes
	const positionClasses = {
		top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
	};

	// Size configurations
	const sizeConfig = {
		small: { width: 'w-64', padding: 'p-3', text: 'text-xs' },
		medium: { width: 'w-80', padding: 'p-4', text: 'text-sm' },
		large: { width: 'w-96', padding: 'p-5', text: 'text-base' }
	};

	$: config = sizeConfig[size];
	$: title = language === 'de' ? (tooltip.title_de || tooltip.title) : tooltip.title;
	$: content = language === 'de' ? (tooltip.content_de || tooltip.content) : tooltip.content;

	function showTooltip() {
		if (trigger === 'hover') {
			isVisible = true;
		}
	}

	function hideTooltip() {
		if (trigger === 'hover') {
			isVisible = false;
		}
	}

	function toggleTooltip() {
		if (trigger === 'click') {
			isVisible = !isVisible;
		}
	}

	function handleLearnMore() {
		if (tooltip.learn_more_url) {
			dispatch('learnMore', { url: tooltip.learn_more_url });
		}
	}

	function handleClose() {
		isVisible = false;
		dispatch('close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}

	// Close tooltip when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (isVisible && tooltipElement && !tooltipElement.contains(event.target as Node) && 
			triggerElement && !triggerElement.contains(event.target as Node)) {
			handleClose();
		}
	}
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<div class="relative inline-block">
	<!-- Trigger Element -->
	<button
		bind:this={triggerElement}
		on:mouseenter={showTooltip}
		on:mouseleave={hideTooltip}
		on:click={toggleTooltip}
		class="inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded"
		title={iconOnly ? title : 'Learn more'}
	>
		{#if showIcon}
			<HelpCircle class="w-4 h-4" />
		{/if}
		{#if !iconOnly}
			<span class="text-sm">Learn more</span>
		{/if}
	</button>

	<!-- Tooltip Content -->
	{#if isVisible}
		<div
			bind:this={tooltipElement}
			class="absolute z-50 {config.width} {config.padding} bg-white border border-gray-200 rounded-lg shadow-lg {positionClasses[position]}"
			role="tooltip"
		>
			<!-- Arrow -->
			<div class="absolute w-2 h-2 bg-white border-gray-200 transform rotate-45
				{position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b' : ''}
				{position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l border-t' : ''}
				{position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r' : ''}
				{position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l' : ''}">
			</div>

			<!-- Header -->
			<div class="flex items-start justify-between gap-3 mb-3">
				<div class="flex items-center gap-2">
					<BookOpen class="w-4 h-4 text-teal-600 flex-shrink-0" />
					<h4 class="font-semibold text-gray-900 {config.text}">{title}</h4>
				</div>
				
				{#if trigger === 'click'}
					<button
						on:click={handleClose}
						class="text-gray-400 hover:text-gray-600 transition-colors"
						title="Close"
					>
						<X class="w-4 h-4" />
					</button>
				{/if}
			</div>

			<!-- Content -->
			<div class="text-gray-700 {config.text} mb-4 leading-relaxed">
				{content}
			</div>

			<!-- Related Indicators -->
			{#if tooltip.related_indicators && tooltip.related_indicators.length > 0}
				<div class="mb-4">
					<div class="text-xs font-medium text-gray-600 mb-2">Related Indicators:</div>
					<div class="flex flex-wrap gap-1">
						{#each tooltip.related_indicators as indicator}
							<span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
								{indicator}
							</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Learn More Button -->
			{#if tooltip.learn_more_url}
				<div class="pt-3 border-t border-gray-100">
					<button
						on:click={handleLearnMore}
						class="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 transition-colors {config.text} font-medium"
					>
						<span>Learn more</span>
						<ExternalLink class="w-3 h-3" />
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Ensure tooltip appears above other elements */
	:global(.tooltip-container) {
		z-index: 1000;
	}
</style>

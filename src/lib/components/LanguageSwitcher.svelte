<script lang="ts">
	import { language, t, type Language } from '$lib/stores/language';
	import { Languages } from '@lucide/svelte';

	export let compact: boolean = false;

	$: currentLang = $language;

	function switchLanguage() {
		const newLang: Language = currentLang === 'en' ? 'de' : 'en';
		language.set(newLang);
	}

	function getLanguageLabel(lang: Language): string {
		return lang === 'en' ? 'EN' : 'DE';
	}

	function getLanguageFlag(lang: Language): string {
		return lang === 'en' ? '🇺🇸' : '🇩🇪';
	}

	function getTooltip(lang: Language): string {
		return lang === 'en' 
			? t('language.switch-to-german', lang)
			: t('language.switch-to-english', lang);
	}
</script>

{#if compact}
	<!-- Compact version for sidebar -->
	<button
		on:click={switchLanguage}
		class="nav-link w-full text-left hover:bg-white/10"
		title={getTooltip(currentLang)}
		aria-label={getTooltip(currentLang)}
	>
		<Languages size={20} />
		<span class="flex items-center gap-2">
			<span class="text-lg">{getLanguageFlag(currentLang)}</span>
			<span>{getLanguageLabel(currentLang)}</span>
		</span>
	</button>
{:else}
	<!-- Full version for header or other locations -->
	<div class="relative">
		<button
			on:click={switchLanguage}
			class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
			title={getTooltip(currentLang)}
			aria-label={getTooltip(currentLang)}
		>
			<Languages size={16} />
			<span class="text-lg">{getLanguageFlag(currentLang)}</span>
			<span>{getLanguageLabel(currentLang)}</span>
		</button>
	</div>
{/if}

<style>
	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
		transition:
			background-color 0.2s,
			color 0.2s;
	}
	.nav-link:hover {
		background-color: rgba(255, 255, 255, 0.1);
		color: white;
	}
</style>

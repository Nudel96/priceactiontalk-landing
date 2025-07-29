<script lang="ts">
	// --- SvelteKit Imports ---
	import { page } from '$app/stores';
	import type { LayoutServerData } from './$types';

	// --- Icon and Component Imports ---
	import {
		Home,
		User as UserIcon,
		MessageSquare,
		ChartLine,
		Menu,
		X,
		LogOut,
		GraduationCap,
		TrendingUp,
		Calendar,
		Trophy,
		FileText,
		Globe
	} from '@lucide/svelte';

	import ProfileBadge from '$lib/components/ProfileBadge.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { language, t } from '$lib/stores/language';

	// --- Data from `load` function ---
	// The `data` prop is automatically passed from your `+layout.ts` file.
	// `LayoutData` is an auto-generated type from SvelteKit that matches the return of your load function.
	export let data: LayoutServerData;

	// --- State Management ---
	let isSidebarOpen = false;

	// --- Reactive Logic ---
	// Close the sidebar whenever the route changes
	$: if ($page.url.pathname) {
		isSidebarOpen = false;
	}

	// Determine the current page title with translations
	let currentPageTitle = '';
	$: {
		const path = $page.url.pathname;
		if (path === '/' || path === '') currentPageTitle = t('nav.dashboard', $language);
		else if (path.startsWith('/school')) currentPageTitle = t('nav.school', $language);
		else if (path.startsWith('/level')) currentPageTitle = t('nav.level', $language);
		else if (path.startsWith('/forum')) currentPageTitle = t('nav.forum', $language);
		else if (path.startsWith('/market')) currentPageTitle = t('nav.market', $language);
		else if (path.startsWith('/event')) currentPageTitle = t('nav.event', $language);
		else if (path.startsWith('/traderhub')) currentPageTitle = t('nav.traderhub', $language);
		else if (path.startsWith('/tradinglog')) currentPageTitle = t('nav.tradinglog', $language);
		else if (path.startsWith('/economic-overview')) currentPageTitle = t('nav.economic-overview', $language);
		else if (path.startsWith('/fundamental')) currentPageTitle = t('nav.fundamental', $language);
		else if (path.startsWith('/profile')) currentPageTitle = t('nav.profile', $language);
		else currentPageTitle = 'Page';
	}

	// Navigation items for the member area
	const navItems = [
		{ href: '/', icon: Home, labelKey: 'nav.dashboard' },
		{ href: '/school', icon: GraduationCap, labelKey: 'nav.school' },
		{ href: '/level', icon: TrendingUp, labelKey: 'nav.level' },
		{ href: '/forum', icon: MessageSquare, labelKey: 'nav.forum' },
		{ href: '/market', icon: ChartLine, labelKey: 'nav.market' },
		{ href: '/event', icon: Calendar, labelKey: 'nav.event' },
		{ href: '/traderhub', icon: Trophy, labelKey: 'nav.traderhub' },
		{ href: '/tradinglog', icon: FileText, labelKey: 'nav.tradinglog' },
		{ href: '/economic-overview', icon: Globe, labelKey: 'nav.economic-overview' },
		{ href: '/fundamental', icon: Globe, labelKey: 'nav.fundamental' },
		{ href: '/profile', icon: UserIcon, labelKey: 'nav.profile' }
	];
</script>

<div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
	<!-- Mobile sidebar toggle -->
	<div class="fixed top-4 left-4 z-30 lg:hidden">
		<button
			on:click={() => (isSidebarOpen = !isSidebarOpen)}
			class="bg-teal-600 dark:bg-navy rounded-full p-2 text-white shadow-lg"
			aria-label="Toggle sidebar">
			{#if isSidebarOpen}
				<X size={24} />
			{:else}
				<Menu size={24} />
			{/if}
		</button>
	</div>

	<!-- Overlay for mobile -->
	{#if isSidebarOpen}
		<div
			class="fixed inset-0 z-20 bg-black/60 lg:hidden"
			on:click={() => (isSidebarOpen = false)}
			role="presentation">
		</div>
	{/if}

	<!-- Sidebar -->
	<aside
		class="bg-white dark:bg-gray-800 fixed inset-y-0 left-0 z-20 w-75 overflow-y-auto text-gray-900 dark:text-gray-100
           transition-all duration-300 ease-in-out lg:relative lg:translate-x-0"
		class:translate-x-0={isSidebarOpen}
		class:shadow-xl={isSidebarOpen}
		class:-translate-x-full={!isSidebarOpen}>
		<div class="flex h-full flex-col p-4">


			<!-- Use the user object from the `data` prop -->
			{#if data.user}
				<div class="mb-6 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 p-3 transition-colors duration-200">
					<ProfileBadge user={data.user} showXp={true} />
				</div>
			{/if}

			<nav class="flex-grow space-y-1.5">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class="nav-link {(item.href === '/' && ($page.url.pathname === '/' || $page.url.pathname === '')) ||
							(item.href !== '/' && $page.url.pathname.startsWith(item.href))
							? 'bg-teal-100 dark:bg-white/10 text-teal-700 dark:text-white font-semibold'
							: ''}">
						<svelte:component this={item.icon} size={20} />
						<span>{t(item.labelKey, $language)}</span>
					</a>
				{/each}
			</nav>

			<!-- Logo -->
			<div class="mt-auto mb-6 flex justify-center">
				<div class="w-20 h-20 text-white">
					<svg id="Ebene_2" data-name="Ebene 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1981.19 1675.57" class="w-full h-full">
						<defs>
							<style>
								.cls-1 {
									fill: currentColor;
									stroke: currentColor;
									stroke-miterlimit: 10;
									stroke-width: 2px;
								}
							</style>
						</defs>
						<g id="Ebene_1-2" data-name="Ebene 1">
							<path class="cls-1" d="M1325.85,1375.09c-148.53-251.36-336.98-570.27-336.98-570.27l-513.3,868.66h250.07s135.15-250.04,135.17-250.07h256.12l135.17,250.07h250.07s-79.72-134.91-176.32-298.39ZM942.66,1271.99l46.21-95.61s45.72,94.7,45.72,94.71l-91.93.9Z"/>
							<path id="hook_top_blue" data-name="hook top blue" class="cls-1" d="M100.59,1506.12c41.46-70.21,93.6-158.49,151.72-256.91C544.75,754,988.87,1.97,988.87,1.97c0,0,342.02,578.55,342.02,578.55-56.42,32.88-134.1,78.16-186.72,108.83,0,0-155.29-266.21-155.29-266.21L249.32,1673.48H1.75s37.89-64.17,98.83-167.36Z"/>
							<path id="ARROW_GREEN" data-name="ARROW GREEN" class="cls-1" d="M1245.52,1239.15s212.23-386.2,212.23-386.2c30.22,52.39,67.54,117.08,67.54,117.04,0,0-1.5-366.29-1.51-366.49-16.31,9.51-305.53,178.08-315.45,183.86,2.35,0,74.37.04,133.79.07-.02.02-185.79,300.72-185.79,300.72l89.18,151Z"/>
							<polygon class="cls-1" points="1565.14 1121.61 1564.54 975.29 1979.44 1674.57 1718.63 1674.57 1391.17 1112.84 1472.97 962.06 1565.14 1121.61"/>
						</g>
					</svg>
				</div>
			</div>

			<!-- Language switcher and logout button -->
			<div class="border-t border-gray-700/50 pt-4 space-y-1">
				<!-- Language Switcher -->
				<LanguageSwitcher compact={true} />

				<!-- Logout Button -->
				<a href="/logout" class="nav-link w-full text-left hover:bg-red-500/20 hover:text-red-500">
					<LogOut size={20} />
					<span>{t('nav.logout', $language)}</span>
				</a>
			</div>
		</div>
	</aside>

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<div class="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200 border-b border-gray-200 dark:border-gray-700">
			<div class="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 items-center justify-between">
					<h1 class="text-gray-900 dark:text-gray-100 text-xl font-semibold transition-colors duration-200">
						{currentPageTitle}
					</h1>
					<div class="flex items-center gap-4">
						<div class="lg:hidden">
							<button
								on:click={() => (isSidebarOpen = true)}
								class="rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
								aria-label="Open sidebar">
								<Menu size={24} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="p-4 md:p-6 lg:p-8 min-h-full">
			<slot />
		</div>
	</main>
</div>



<style>
	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		font-weight: 500;
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	/* Light mode styles */
	.nav-link {
		color: rgba(55, 65, 81, 0.8); /* gray-700 with opacity */
	}
	.nav-link:hover {
		background-color: rgba(55, 65, 81, 0.1);
		color: rgb(55, 65, 81);
	}

	/* Dark mode styles */
	:global(.dark) .nav-link {
		color: rgba(248, 250, 252, 0.8);
	}

	:global(.dark) .nav-link:hover {
		background-color: rgba(248, 250, 252, 0.15);
		color: rgb(248, 250, 252);
	}
</style>

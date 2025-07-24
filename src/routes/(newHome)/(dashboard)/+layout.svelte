<script lang="ts">
	// --- SvelteKit Imports ---
	import { page } from '$app/state';
	import type { LayoutServerData } from './$types';

	// --- Icon and Component Imports ---
	import {
		Home,
		User as UserIcon,
		MessageSquare,
		ChartLine,
		BookOpen,
		Menu,
		X,
		LogOut
	} from '@lucide/svelte';

	import ProfileBadge from '$lib/components/ProfileBadge.svelte';
	import Logo from '$lib/components/Logo.svelte';

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

	// Determine the current page title.
	let currentPageTitle = '';
	$: {
		const path = $page.url.pathname;
		if (path === '/dashboard') currentPageTitle = 'Dashboard';
		else if (path.startsWith('/market')) currentPageTitle = 'Market';
		else if (path.startsWith('/forum')) currentPageTitle = 'Forum';
		else if (path.startsWith('/fundamental')) currentPageTitle = 'Fundamental';
		else if (path.startsWith('/profile')) currentPageTitle = 'Profile';
		else currentPageTitle = 'Page';
	}

	// Navigation items for the member area
	const navItems = [
		{ href: '/dashboard', icon: Home, label: 'Dashboard' },
		{ href: '/market', icon: ChartLine, label: 'Market' },
		{ href: '/forum', icon: MessageSquare, label: 'Forum' },
		{ href: '/fundamental', icon: BookOpen, label: 'Fundamental' },
		{ href: '/profile', icon: UserIcon, label: 'Profile' }
	];
</script>

<div class="flex h-screen overflow-hidden bg-gray-50">
	<!-- Mobile sidebar toggle -->
	<div class="fixed top-4 left-4 z-30 lg:hidden">
		<button
			on:click={() => (isSidebarOpen = !isSidebarOpen)}
			class="bg-navy rounded-full p-2 text-white shadow-lg"
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
		class="bg-navy fixed inset-y-0 left-0 z-20 w-75 overflow-y-auto text-white
           transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0"
		class:translate-x-0={isSidebarOpen}
		class:shadow-xl={isSidebarOpen}
		class:-translate-x-full={!isSidebarOpen}>
		<div class="flex h-full flex-col p-4">
			<div class="mt-2 mb-8">
				<Logo />
			</div>

			<!-- Use the user object from the `data` prop -->
			{#if data.user}
				<div class="mb-6 rounded-lg border border-gray-600/50 bg-gray-700/30 p-3">
					<ProfileBadge user={data.user} showXp={true} />
				</div>
			{/if}

			<nav class="flex-grow space-y-1.5">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class="nav-link {page.url.pathname.startsWith(item.href)
							? 'bg-white/10 font-semibold'
							: ''}">
						<svelte:component this={item.icon} size={20} />
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>

			<!-- The logout button is now a standard link to a /logout endpoint -->
			<div class="mt-auto border-t border-gray-700/50 pt-4">
				<a href="/logout" class="nav-link w-full text-left hover:bg-red-500/20 hover:text-red-500">
					<LogOut size={20} />
					<span>Logout</span>
				</a>
			</div>
		</div>
	</aside>

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<div class="sticky top-0 z-10 bg-white shadow-sm">
			<div class="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 items-center justify-between">
					<h1 class="text-navy text-xl font-semibold">
						{currentPageTitle}
					</h1>
					<div class="flex items-center gap-4">
						<!-- Use the user object from the `data` prop here as well -->
						{#if data.user}
							<div class="hidden md:block">
								<ProfileBadge user={data.user} compact={true} />
							</div>
						{/if}
						<div class="lg:hidden">
							<button
								on:click={() => (isSidebarOpen = true)}
								class="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
								aria-label="Open sidebar">
								<Menu size={24} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="p-4 md:p-6 lg:p-8">
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

<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
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
		Globe,
		BarChart3,
		Users
	} from '@lucide/svelte';

	import ProfileBadge from '$lib/components/ProfileBadge.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { language, t } from '$lib/stores/language';

	// State Management
	let isSidebarOpen = false;

	// Close sidebar when route changes
	$: if ($page.url.pathname) {
		isSidebarOpen = false;
	}

	// Navigation items
	const navItems = [
		{ href: '/dashboard', icon: Home, label: 'nav.dashboard' },
		{ href: '/dashboard/market', icon: ChartLine, label: 'nav.market' },
		{ href: '/dashboard/forum', icon: MessageSquare, label: 'nav.forum' },
		{ href: '/dashboard/school', icon: GraduationCap, label: 'nav.school' },
		{ href: '/dashboard/tradinglog', icon: FileText, label: 'nav.tradinglog' },
		{ href: '/dashboard/traderhub', icon: Users, label: 'nav.traderhub' },
		{ href: '/dashboard/event', icon: Calendar, label: 'nav.event' },
		{ href: '/dashboard/profile', icon: UserIcon, label: 'nav.profile' }
	];

	// Get current page title
	let currentPageTitle = '';
	$: {
		const path = $page.url.pathname;
		if (path === '/dashboard') currentPageTitle = t('nav.dashboard', $language);
		else if (path.includes('/market')) currentPageTitle = t('nav.market', $language);
		else if (path.includes('/forum')) currentPageTitle = t('nav.forum', $language);
		else if (path.includes('/school')) currentPageTitle = t('nav.school', $language);
		else if (path.includes('/tradinglog')) currentPageTitle = t('nav.tradinglog', $language);
		else if (path.includes('/traderhub')) currentPageTitle = t('nav.traderhub', $language);
		else if (path.includes('/event')) currentPageTitle = t('nav.event', $language);
		else if (path.includes('/profile')) currentPageTitle = t('nav.profile', $language);
		else currentPageTitle = t('nav.dashboard', $language);
	}

	// Check if current route is active
	const isActiveRoute = (href: string) => {
		if (href === '/dashboard') {
			return $page.url.pathname === '/dashboard';
		}
		return $page.url.pathname.startsWith(href);
	};

	// Handle logout
	const handleLogout = () => {
		sessionStorage.removeItem('adminAccess');
		goto('/');
	};

	// Toggle sidebar
	const toggleSidebar = () => {
		isSidebarOpen = !isSidebarOpen;
	};
</script>

<div class="min-h-screen bg-gray-900 text-white">
	<!-- Mobile menu button -->
	<div class="lg:hidden fixed top-4 left-4 z-50">
		<button
			on:click={toggleSidebar}
			class="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
		>
			{#if isSidebarOpen}
				<X size="24" />
			{:else}
				<Menu size="24" />
			{/if}
		</button>
	</div>

	<!-- Sidebar -->
	<div class="flex">
		<aside
			class="fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
		>
			<!-- Logo -->
			<div class="flex items-center justify-center h-16 border-b border-gray-700">
				<h1 class="text-xl font-bold text-teal-400">PriceActionTalk</h1>
			</div>

			<!-- Navigation -->
			<nav class="mt-8 px-4">
				<ul class="space-y-2">
					{#each navItems as item}
						{@const Icon = item.icon}
						<li>
							<a
								href={item.href}
								class="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors {isActiveRoute(item.href) ? 'bg-gray-700 text-white' : ''}"
							>
								<Icon size="20" class="mr-3" />
								{t(item.label, $language)}
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<!-- User section -->
			<div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
				<div class="flex items-center justify-between">
					<ProfileBadge />
					<div class="flex items-center space-x-2">
						<LanguageSwitcher />
						<button
							on:click={handleLogout}
							class="p-2 text-gray-400 hover:text-white transition-colors"
							title={t('nav.logout', $language)}
						>
							<LogOut size="18" />
						</button>
					</div>
				</div>
			</div>
		</aside>

		<!-- Main content -->
		<main class="flex-1 lg:ml-0">
			<!-- Header -->
			<header class="bg-gray-800 border-b border-gray-700 px-4 py-4 lg:px-8">
				<div class="flex items-center justify-between">
					<div class="lg:ml-0 ml-12">
						<h1 class="text-2xl font-bold text-white">{currentPageTitle}</h1>
					</div>
					<div class="hidden lg:flex items-center space-x-4">
						<LanguageSwitcher />
						<ProfileBadge />
					</div>
				</div>
			</header>

			<!-- Page content -->
			<div class="p-4 lg:p-8">
				<slot />
			</div>
		</main>
	</div>

	<!-- Mobile overlay -->
	{#if isSidebarOpen}
		<div
			class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
			on:click={toggleSidebar}
			on:keydown={(e) => e.key === 'Escape' && toggleSidebar()}
			role="button"
			tabindex="0"
		></div>
	{/if}
</div>

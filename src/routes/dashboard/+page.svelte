<script lang="ts">
	import { language, t, type Language } from '$lib/stores/language';
	import IconMapping from '$lib/components/icons/IconMapping.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const user = data.user;

	const getNextLevelXp = (level: number) => (level + 1) * 100;
	const nextLevelXp = getNextLevelXp(user.level);
	const progressToNextLevel = (user.xp / nextLevelXp) * 100;

	const getLevelInfo = (level: number, lang: Language) => {
		if (level <= 3) return { description: t('level.beginner-trader', lang) };
		if (level <= 6) return { description: t('level.developing-trader', lang) };
		if (level <= 9) return { description: t('level.intermediate-trader', lang) };
		if (level <= 12) return { description: t('level.advanced-trader', lang) };
		return { description: t('level.expert-trader', lang) };
	};

	$: userLevelInfo = getLevelInfo(user.level, $language);

	const recentMarketPosts = data.recentMarketPosts;
	const recentForumPosts = data.recentForumPosts;

	// Mock recent activities for demo
	const recentActivities = [
		{ type: 'lesson', title: 'Completed "Support & Resistance Basics"', time: '2h ago' },
		{ type: 'forum', title: 'Posted in "Trading Psychology"', time: '4h ago' },
		{ type: 'trade', title: 'Logged EUR/USD trade', time: '6h ago' },
		{ type: 'achievement', title: 'Earned "Consistent Trader" badge', time: '1d ago' }
	];

	const getActivityIcon = (type: string) => {
		switch (type) {
			case 'lesson': return 'book-open';
			case 'forum': return 'message-square';
			case 'trade': return 'trending-up';
			case 'achievement': return 'award';
			default: return 'activity';
		}
	};

	const quickActions = [
		{ title: t('dashboard.log-trade', $language), icon: 'plus', href: '/dashboard/tradinglog', color: 'bg-blue-600' },
		{ title: t('dashboard.view-market', $language), icon: 'bar-chart-3', href: '/dashboard/market', color: 'bg-green-600' },
		{ title: t('dashboard.join-forum', $language), icon: 'users', href: '/dashboard/forum', color: 'bg-purple-600' },
		{ title: t('dashboard.continue-learning', $language), icon: 'graduation-cap', href: '/dashboard/school', color: 'bg-orange-600' }
	];
</script>

<svelte:head>
	<title>{t('dashboard.title', $language)} - PriceActionTalk</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white">
	<!-- Header Section -->
	<div class="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-white">
						{t('dashboard.welcome-back', $language)}, {user.username}!
					</h1>
					<p class="text-gray-300 mt-1">
						{t('dashboard.ready-to-trade', $language)}
					</p>
				</div>
				<div class="text-right">
					<div class="text-sm text-gray-400">{t('dashboard.current-level', $language)}</div>
					<div class="text-xl font-bold text-teal-400">
						{t('dashboard.level', $language)} {user.level}
					</div>
					<div class="text-sm text-gray-300">{userLevelInfo.description}</div>
				</div>
			</div>

			<!-- Progress Bar -->
			<div class="mt-4">
				<div class="flex items-center justify-between text-sm text-gray-400 mb-2">
					<span>{t('dashboard.progress-to-next-level', $language)}</span>
					<span>{user.xp}/{nextLevelXp} XP</span>
				</div>
				<div class="w-full bg-gray-700 rounded-full h-2">
					<div 
						class="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
						style="width: {progressToNextLevel}%"
					></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Left Column - Quick Actions & Stats -->
			<div class="lg:col-span-1 space-y-6">
				<!-- Quick Actions -->
				<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
					<h2 class="text-lg font-semibold text-white mb-4">
						{t('dashboard.quick-actions', $language)}
					</h2>
					<div class="space-y-3">
						{#each quickActions as action}
							<a 
								href={action.href}
								class="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors group"
							>
								<div class="flex-shrink-0 w-10 h-10 {action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
									<IconMapping icon={action.icon} class="w-5 h-5 text-white" />
								</div>
								<span class="ml-3 text-white font-medium">{action.title}</span>
							</a>
						{/each}
					</div>
				</div>

				<!-- Trading Stats -->
				<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
					<h2 class="text-lg font-semibold text-white mb-4">
						{t('dashboard.trading-stats', $language)}
					</h2>
					<div class="space-y-4">
						<div class="flex justify-between items-center">
							<span class="text-gray-400">{t('dashboard.total-trades', $language)}</span>
							<span class="text-white font-semibold">{user.total_trades}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-400">{t('dashboard.win-rate', $language)}</span>
							<span class="text-green-400 font-semibold">{user.win_rate}%</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-400">{t('dashboard.total-pnl', $language)}</span>
							<span class="text-{user.total_pnl >= 0 ? 'green' : 'red'}-400 font-semibold">
								{user.total_pnl >= 0 ? '+' : ''}{user.total_pnl}
							</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-gray-400">{t('dashboard.current-streak', $language)}</span>
							<span class="text-blue-400 font-semibold">{user.current_streak}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Column - Recent Activity & Market Updates -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Recent Activity -->
				<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
					<h2 class="text-lg font-semibold text-white mb-4">
						{t('dashboard.recent-activity', $language)}
					</h2>
					<div class="space-y-3">
						{#each recentActivities as activity}
							<div class="flex items-center p-3 rounded-lg bg-gray-700/50">
								<div class="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
									<IconMapping icon={getActivityIcon(activity.type)} class="w-4 h-4 text-gray-300" />
								</div>
								<div class="ml-3 flex-1">
									<p class="text-white text-sm">{activity.title}</p>
									<p class="text-gray-400 text-xs">{activity.time}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Recent Market Posts -->
				{#if recentMarketPosts && recentMarketPosts.length > 0}
					<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-lg font-semibold text-white">
								{t('dashboard.recent-market-posts', $language)}
							</h2>
							<a href="/dashboard/market" class="text-teal-400 hover:text-teal-300 text-sm">
								{t('dashboard.view-all', $language)}
							</a>
						</div>
						<div class="space-y-3">
							{#each recentMarketPosts.slice(0, 3) as post}
								<div class="p-3 rounded-lg bg-gray-700/50">
									<h3 class="text-white font-medium text-sm">{post.title}</h3>
									<p class="text-gray-400 text-xs mt-1">
										{t('dashboard.by', $language)} {post.author} • {post.created_at}
									</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Recent Forum Posts -->
				{#if recentForumPosts && recentForumPosts.length > 0}
					<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-lg font-semibold text-white">
								{t('dashboard.recent-forum-posts', $language)}
							</h2>
							<a href="/dashboard/forum" class="text-teal-400 hover:text-teal-300 text-sm">
								{t('dashboard.view-all', $language)}
							</a>
						</div>
						<div class="space-y-3">
							{#each recentForumPosts.slice(0, 3) as post}
								<div class="p-3 rounded-lg bg-gray-700/50">
									<h3 class="text-white font-medium text-sm">{post.title}</h3>
									<p class="text-gray-400 text-xs mt-1">
										{t('dashboard.by', $language)} {post.author} • {post.replies} {t('dashboard.replies', $language)}
									</p>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

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
		{ type: 'analysis', title: 'Shared EURUSD analysis', time: '1d ago' },
		{ type: 'level', title: 'Reached Level 3', time: '2d ago' },
		{ type: 'trade', title: 'Logged new GBPJPY trade', time: '3d ago' }
	];
</script>

<div class="space-y-6 transition-colors duration-200">
	<h1 class="text-gray-900 dark:text-gray-100 text-2xl font-bold transition-colors duration-200">{t('dashboard.welcome', $language)}, {user.username} 👋</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 dark:from-teal-600 dark:to-cyan-600 p-6 text-white shadow-lg transition-all duration-200">
			<div class="mb-3 flex items-center justify-between">
				<h3 class="font-semibold">{t('dashboard.level-progress', $language)}</h3>
			</div>
			<div class="flex items-center gap-4">
				<div class="relative flex h-20 w-20 items-center justify-center">
					<svg viewBox="0 0 36 36" class="h-full w-full">
						<path
							d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
							fill="none"
							stroke="rgba(255,255,255,0.3)"
							stroke-width="3.8" />
						<path
							d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831"
							fill="none"
							stroke="white"
							stroke-width="3.8"
							stroke-dasharray={`${progressToNextLevel}, 100`}
							stroke-linecap="round" />
						<text x="18" y="20.35" class="text-white" text-anchor="middle" font-size="8">
							{user.level}
						</text>
					</svg>
				</div>
				<div>
					<p class="text-sm font-medium">{user.xp} / {nextLevelXp} XP</p>
					<p class="text-xs opacity-80">Next level: {user.level + 1}</p>
					<a href="/school" class="mt-2 flex items-center gap-1 text-xs font-bold hover:underline">
						View details
					</a>
				</div>
			</div>
		</div>

		<div class="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-6 text-white shadow-lg transition-all duration-200">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="font-semibold text-white">Your Activity</h3>
			</div>
			<div class="space-y-3 text-sm">
				<div class="flex justify-between">
					<span class="text-white/80">Forum posts</span>
					<span class="font-semibold">{user.stats?.forumPosts ?? 0}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-white/80">Completed homework</span>
					<span class="font-semibold">{user.stats?.completedHomework ?? 0}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-white/80">Days active</span>
					<span class="font-semibold">{user.stats?.daysActive ?? 0}</span>
				</div>
			</div>
		</div>

		<div class="rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 p-6 shadow-md transition-all duration-200">
			<div class="mb-3 flex items-center justify-between">
				<h3 class="text-gray-900 dark:text-gray-100 font-semibold transition-colors duration-200">{t('dashboard.current-level', $language)}</h3>
			</div>
			<div>
				<p class="text-gray-900 dark:text-gray-100 text-lg font-bold transition-colors duration-200">Level {user.level}</p>
				<p class="text-gray-600 dark:text-gray-400 mb-3 text-sm transition-colors duration-200">{userLevelInfo.description}</p>
				<a
					href="/school"
					class="text-teal-600 dark:text-teal-400 flex items-center gap-1 text-sm font-semibold hover:underline transition-colors duration-200">
					{t('dashboard.continue-learning', $language)}
				</a>
			</div>
		</div>

		<div class="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 p-6 text-white shadow-lg transition-all duration-200">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="font-semibold text-white">Quick Actions</h3>
			</div>
			<div class="space-y-3">
				<a href="/market" class="block rounded-lg bg-white/20 hover:bg-white/30 p-3 text-sm font-medium transition-colors">
					Share Analysis
				</a>
				<a href="/tradinglog" class="block rounded-lg bg-white/20 hover:bg-white/30 p-3 text-sm font-medium transition-colors">
					Log Trade
				</a>
				<a href="/forum" class="block rounded-lg bg-white/20 hover:bg-white/30 p-3 text-sm font-medium transition-colors">
					Join Discussion
				</a>
			</div>
		</div>

	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<div class="card">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-gray-900 dark:text-gray-100 font-semibold transition-colors duration-200">{t('dashboard.recent-activities', $language)}</h3>
				<a href="/forum" class="text-teal-600 dark:text-teal-400 text-sm hover:underline transition-colors duration-200">View all</a>
			</div>
			<div class="space-y-4">
				{#if recentForumPosts.length}
					{#each recentForumPosts as post (post.id)}
						<div class="border-b border-gray-100 dark:border-gray-600 pb-3 last:border-0 last:pb-0 transition-colors duration-200">
							<a href={`/forum/${post.id}`} class="text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors duration-200">
								{post.title}
							</a>
							<div class="mt-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
								<span>
									by {post.author.username} in
									<span class="text-teal font-medium">{post.category.name}</span>
								</span>
								<span>{post.comments} replies</span>
							</div>
						</div>
					{/each}
				{:else}
					<p class="py-4 text-center text-sm text-gray-500">No forum activity yet.</p>
				{/if}
			</div>
		</div>

		<div class="card">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-gray-900 dark:text-gray-100 font-semibold transition-colors duration-200">Latest Market Analyses</h3>
				<a href="/market" class="text-teal-600 dark:text-teal-400 text-sm hover:underline transition-colors duration-200">View all</a>
			</div>
			<div class="space-y-4">
				{#if recentMarketPosts.length}
					{#each recentMarketPosts as idea (idea.id)}
						<div class="border-b border-gray-100 dark:border-gray-600 pb-3 last:border-0 last:pb-0 transition-colors duration-200">
							<a href="/market" class="text-gray-900 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors duration-200">
								{idea.title}
							</a>
							<div class="mt-1 text-xs text-gray-600 dark:text-gray-400">shared by {idea.author}</div>
						</div>
					{/each}
				{:else}
					<p class="py-4 text-center text-sm text-gray-500">No market posts yet.</p>
				{/if}
			</div>
		</div>

		<!-- Recent Activities -->
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-600 transition-all duration-200">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">Recent Activities</h3>
				<a href="/profile" class="text-teal-600 dark:text-teal-400 text-sm hover:underline transition-colors duration-200">View all</a>
			</div>
			<div class="space-y-4">
				{#each recentActivities as activity}
					<div class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
						<div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center transition-colors duration-200">
							<IconMapping iconType={activity.type} size={20} className="text-blue-600 dark:text-blue-400" />
						</div>
						<div class="flex-1">
							<p class="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{activity.title}</p>
							<p class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{activity.time}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

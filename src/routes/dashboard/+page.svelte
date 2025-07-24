<script lang="ts">
	import TradingViewEventsWidget from '$lib/components/TradingViewEventsWidget.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const user = data.user;

	const getNextLevelXp = (level: number) => (level + 1) * 100;
	const nextLevelXp = getNextLevelXp(user.level);
	const progressToNextLevel = (user.xp / nextLevelXp) * 100;

	const getTierInfo = (level: number) => {
		if (level < 5) return { name: 'D-Tier', description: 'Newbie Trader' };
		if (level < 10) return { name: 'C-Tier', description: 'Trend Seeker' };
		if (level < 15) return { name: 'B-Tier', description: 'Market Navigator' };
		if (level < 20) return { name: 'A-Tier', description: 'Price Action Strategist' };
		return { name: 'A++-Tier', description: 'Institutional Mind' };
	};

	const userTier = getTierInfo(user.level);

	const recentMarketPosts = data.recentMarketPosts;
	const recentForumPosts = data.recentForumPosts;
</script>

<div class="space-y-6">
	<h1 class="text-navy text-2xl font-bold">Welcome back, {user.username} 👋</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<div class="from-teal rounded-xl bg-gradient-to-br to-cyan-500 p-6 text-white shadow-lg">
			<div class="mb-3 flex items-center justify-between">
				<h3 class="font-semibold">Level Progress</h3>
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

		<div class="from-navy rounded-xl bg-gradient-to-br to-slate-700 p-6 text-white shadow-lg">
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

		<div class="rounded-xl border bg-white p-6 shadow-md">
			<div class="mb-3 flex items-center justify-between">
				<h3 class="text-navy font-semibold">Current Tier</h3>
			</div>
			<div>
				<p class="text-navy text-lg font-bold">{userTier.name}</p>
				<p class="text-graphite/80 mb-3 text-sm">{userTier.description}</p>
				<a
					href="/school"
					class="text-teal flex items-center gap-1 text-sm font-semibold hover:underline">
					Continue learning
				</a>
			</div>
		</div>

		<div class="h-64 rounded-xl border border-gray-700 bg-[#1D222D] p-6 shadow-md md:h-auto">
			<div class="mb-3 flex items-center justify-between">
				<h3 class="font-semibold text-white">Economic Calendar</h3>
			</div>
			<div class="h-[calc(100%-2rem)]">
				<TradingViewEventsWidget />
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<div class="card">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-navy font-semibold">Recent Forum Activity</h3>
				<a href="/forum" class="text-teal text-sm hover:underline">View all</a>
			</div>
			<div class="space-y-4">
				{#if recentForumPosts.length}
					{#each recentForumPosts as post (post.id)}
						<div class="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
							<a href={`/forum/${post.id}`} class="text-navy hover:text-teal font-medium">
								{post.title}
							</a>
							<div class="mt-1 flex items-center justify-between text-xs text-gray-500">
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
				<h3 class="text-navy font-semibold">Latest Market Analyses</h3>
				<a href="/market" class="text-teal text-sm hover:underline">View all</a>
			</div>
			<div class="space-y-4">
				{#if recentMarketPosts.length}
					{#each recentMarketPosts as idea (idea.id)}
						<div class="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
							<a href="/market" class="text-navy hover:text-teal font-medium">
								{idea.title}
							</a>
							<div class="mt-1 text-xs text-gray-500">shared by {idea.author}</div>
						</div>
					{/each}
				{:else}
					<p class="py-4 text-center text-sm text-gray-500">No market posts yet.</p>
				{/if}
			</div>
		</div>
	</div>
</div>

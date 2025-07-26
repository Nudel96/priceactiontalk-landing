<script lang="ts">

	import type { PageData } from './$types';

	export let data: PageData;

	const user = data.user;

	const getNextLevelXp = (level: number) => (level + 1) * 100;
	const nextLevelXp = getNextLevelXp(user.level);
	const progressToNextLevel = (user.xp / nextLevelXp) * 100;

	const getLevelInfo = (level: number) => {
		if (level <= 3) return { description: 'Beginner Trader' };
		if (level <= 6) return { description: 'Developing Trader' };
		if (level <= 9) return { description: 'Intermediate Trader' };
		if (level <= 12) return { description: 'Advanced Trader' };
		return { description: 'Expert Trader' };
	};

	const userLevelInfo = getLevelInfo(user.level);

	const recentMarketPosts = data.recentMarketPosts;
	const recentForumPosts = data.recentForumPosts;

	// Mock recent activities for demo
	const recentActivities = [
		{ type: 'lesson', title: 'Completed "Support & Resistance Basics"', time: '2h ago', icon: '📚' },
		{ type: 'forum', title: 'Posted in "Trading Psychology"', time: '4h ago', icon: '💬' },
		{ type: 'analysis', title: 'Shared EURUSD analysis', time: '1d ago', icon: '📈' },
		{ type: 'level', title: 'Reached Level 3', time: '2d ago', icon: '🎯' },
		{ type: 'trade', title: 'Logged new GBPJPY trade', time: '3d ago', icon: '💰' }
	];
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
				<h3 class="text-navy font-semibold">Current Level</h3>
			</div>
			<div>
				<p class="text-navy text-lg font-bold">Level {user.level}</p>
				<p class="text-graphite/80 mb-3 text-sm">{userLevelInfo.description}</p>
				<a
					href="/school"
					class="text-teal flex items-center gap-1 text-sm font-semibold hover:underline">
					Continue learning
				</a>
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

		<!-- Recent Activities -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-xl font-semibold text-navy">Recent Activities</h3>
				<a href="/profile" class="text-teal-600 text-sm hover:underline">View all</a>
			</div>
			<div class="space-y-4">
				{#each recentActivities as activity}
					<div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
						<div class="text-2xl">{activity.icon}</div>
						<div class="flex-1">
							<p class="font-medium text-navy">{activity.title}</p>
							<p class="text-sm text-gray-500">{activity.time}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

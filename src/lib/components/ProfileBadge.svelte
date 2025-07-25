<script lang="ts">
	// Define the TypeScript interface for the user object.
	interface User {
		avatar: string;
		username: string;
		level: number;
		xp: number;
	}

	// Use TypeScript syntax to define the types for the component's props.
	export let user: User;
	export let showXp: boolean = false;
	export let compact: boolean = false;

	// Reactive statements (`$:`) automatically recalculate when their dependencies change.
	// No changes are needed here as TypeScript correctly infers the types.
	$: currentLevelXp = user.level * 100;
	$: nextLevelXp = (user.level + 1) * 100;
	$: progressToNextLevel = ((user.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

	/**
	 * Get level badge color based on level.
	 * @param {number} level
	 * @returns {string} - The Tailwind CSS class for the background color.
	 */
	const getLevelBadgeColor = (level: number): string => {
		if (level <= 3) return 'bg-[#0d1b2a]'; // Beginner
		if (level <= 6) return 'bg-[#2e2e2e]'; // Developing
		if (level <= 9) return 'bg-[#1b9aaa]'; // Intermediate
		if (level <= 12) return 'bg-[#7cfc00]'; // Advanced
		return 'bg-gradient-to-r from-[#7cfc00] to-[#1b9aaa]'; // Expert
	};
</script>

{#if compact}
	<div class="flex items-center gap-2">
		<div class="relative">
			<img
				src={user.avatar}
				alt={user.username}
				class="h-8 w-8 rounded-full border-2 border-white object-cover" />
			<div
				class="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white {getLevelBadgeColor(
					user.level
				)}">
				{user.level}
			</div>
		</div>
		<span class="text-navy font-medium">{user.username}</span>
	</div>
{:else}
	<div class="flex items-center gap-3">
		<div class="relative">
			<div class="h-12 w-12 overflow-hidden rounded-full">
				<img src={user.avatar} alt={user.username} class="h-full w-full object-cover" />
			</div>
			<div
				class="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white {getLevelBadgeColor(
					user.level
				)}">
				{user.level}
			</div>
		</div>

		<div class="flex-1">
			<div class="flex items-center gap-2">
				<span class="font-semibold text-white">{user.username}</span>
				<span class="text-xs text-white/60">Level {user.level}</span>
			</div>

			{#if showXp}
				<div class="mt-1">
					<div class="flex items-center gap-2">
						<progress class="h-2 w-20" max="100" value={progressToNextLevel}></progress>
						<span class="text-xs text-white/70">
							{user.xp}/{nextLevelXp} XP
						</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	progress[value]{
		&::-webkit-progress-bar {
			border-radius: 10px;
		}
		&::-webkit-progress-value {
			border-radius: 10px;
			background-color: var(--color-signal);
		}
	}
</style>
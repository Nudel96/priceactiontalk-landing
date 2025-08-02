<script lang="ts">
	import { Play, BookOpen, Clock, Star, CheckCircle, Lock } from '@lucide/svelte';
	import { language, t } from '$lib/stores/language';

	// Mock course data
	const courses = [
		{
			id: 1,
			title: 'Price Action Fundamentals',
			description: 'Learn the basics of reading price action and market structure',
			level: 'Beginner',
			duration: '2h 30m',
			lessons: 12,
			rating: 4.8,
			progress: 75,
			thumbnail: '/course-thumbnails/price-action-fundamentals.jpg',
			isUnlocked: true
		},
		{
			id: 2,
			title: 'Support & Resistance Mastery',
			description: 'Master the art of identifying key support and resistance levels',
			level: 'Intermediate',
			duration: '3h 15m',
			lessons: 18,
			rating: 4.9,
			progress: 45,
			thumbnail: '/course-thumbnails/support-resistance.jpg',
			isUnlocked: true
		},
		{
			id: 3,
			title: 'Advanced Chart Patterns',
			description: 'Recognize and trade complex chart patterns like a pro',
			level: 'Advanced',
			duration: '4h 20m',
			lessons: 24,
			rating: 4.7,
			progress: 0,
			thumbnail: '/course-thumbnails/chart-patterns.jpg',
			isUnlocked: false
		},
		{
			id: 4,
			title: 'Risk Management Strategies',
			description: 'Protect your capital with proven risk management techniques',
			level: 'Intermediate',
			duration: '2h 45m',
			lessons: 15,
			rating: 4.9,
			progress: 100,
			thumbnail: '/course-thumbnails/risk-management.jpg',
			isUnlocked: true
		},
		{
			id: 5,
			title: 'Trading Psychology',
			description: 'Develop the mental edge needed for consistent trading success',
			level: 'All Levels',
			duration: '3h 30m',
			lessons: 20,
			rating: 4.8,
			progress: 20,
			thumbnail: '/course-thumbnails/trading-psychology.jpg',
			isUnlocked: true
		},
		{
			id: 6,
			title: 'Market Structure Analysis',
			description: 'Understand how markets move and identify high-probability setups',
			level: 'Advanced',
			duration: '5h 10m',
			lessons: 28,
			rating: 4.9,
			progress: 0,
			thumbnail: '/course-thumbnails/market-structure.jpg',
			isUnlocked: false
		}
	];

	const getLevelColor = (level: string) => {
		switch (level) {
			case 'Beginner': return 'bg-green-600';
			case 'Intermediate': return 'bg-yellow-600';
			case 'Advanced': return 'bg-red-600';
			default: return 'bg-blue-600';
		}
	};

	const getProgressColor = (progress: number) => {
		if (progress === 100) return 'bg-green-500';
		if (progress > 0) return 'bg-blue-500';
		return 'bg-gray-600';
	};
</script>

<svelte:head>
	<title>{t('school.title', $language)} - PriceActionTalk</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white">
	<!-- Header -->
	<div class="bg-gray-800 border-b border-gray-700 p-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-white">{t('school.title', $language)}</h1>
				<p class="text-gray-400 mt-1">{t('school.subtitle', $language)}</p>
			</div>
			<div class="text-right">
				<div class="text-sm text-gray-400">{t('school.your-progress', $language)}</div>
				<div class="text-xl font-bold text-teal-400">Level 5 Trader</div>
			</div>
		</div>
	</div>

	<!-- Course Grid -->
	<div class="max-w-7xl mx-auto p-6">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each courses as course}
				<div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
					<!-- Course Thumbnail -->
					<div class="relative h-48 bg-gray-700">
						<div class="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-blue-600/20 flex items-center justify-center">
							<BookOpen size="48" class="text-gray-400" />
						</div>
						
						<!-- Level Badge -->
						<div class="absolute top-3 left-3">
							<span class="px-2 py-1 text-xs font-medium text-white rounded-full {getLevelColor(course.level)}">
								{course.level}
							</span>
						</div>

						<!-- Lock Icon for Locked Courses -->
						{#if !course.isUnlocked}
							<div class="absolute top-3 right-3">
								<div class="p-2 bg-gray-800/80 rounded-full">
									<Lock size="16" class="text-gray-400" />
								</div>
							</div>
						{/if}

						<!-- Progress Badge -->
						{#if course.progress > 0}
							<div class="absolute bottom-3 right-3">
								<div class="flex items-center gap-1 px-2 py-1 bg-gray-800/80 rounded-full">
									{#if course.progress === 100}
										<CheckCircle size="14" class="text-green-400" />
									{/if}
									<span class="text-xs font-medium text-white">{course.progress}%</span>
								</div>
							</div>
						{/if}
					</div>

					<!-- Course Content -->
					<div class="p-6">
						<h3 class="text-lg font-semibold text-white mb-2">{course.title}</h3>
						<p class="text-gray-400 text-sm mb-4">{course.description}</p>

						<!-- Course Meta -->
						<div class="flex items-center justify-between text-sm text-gray-400 mb-4">
							<div class="flex items-center gap-1">
								<Clock size="14" />
								<span>{course.duration}</span>
							</div>
							<div class="flex items-center gap-1">
								<BookOpen size="14" />
								<span>{course.lessons} lessons</span>
							</div>
							<div class="flex items-center gap-1">
								<Star size="14" class="text-yellow-400" />
								<span>{course.rating}</span>
							</div>
						</div>

						<!-- Progress Bar -->
						{#if course.isUnlocked}
							<div class="mb-4">
								<div class="flex items-center justify-between text-xs text-gray-400 mb-1">
									<span>{t('school.progress', $language)}</span>
									<span>{course.progress}%</span>
								</div>
								<div class="w-full bg-gray-700 rounded-full h-2">
									<div 
										class="h-2 rounded-full transition-all duration-300 {getProgressColor(course.progress)}"
										style="width: {course.progress}%"
									></div>
								</div>
							</div>
						{/if}

						<!-- Action Button -->
						<button 
							class="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors {course.isUnlocked ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}"
							disabled={!course.isUnlocked}
						>
							{#if course.isUnlocked}
								{#if course.progress === 0}
									<Play size="16" />
									{t('school.start-course', $language)}
								{:else if course.progress === 100}
									<CheckCircle size="16" />
									{t('school.review-course', $language)}
								{:else}
									<Play size="16" />
									{t('school.continue-course', $language)}
								{/if}
							{:else}
								<Lock size="16" />
								{t('school.unlock-course', $language)}
							{/if}
						</button>
					</div>
				</div>
			{/each}
		</div>

		<!-- Learning Path Section -->
		<div class="mt-12">
			<h2 class="text-xl font-bold text-white mb-6">{t('school.learning-path', $language)}</h2>
			<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-lg font-semibold text-white">{t('school.recommended-next', $language)}</h3>
						<p class="text-gray-400 mt-1">{t('school.continue-journey', $language)}</p>
					</div>
					<button class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
						{t('school.view-path', $language)}
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

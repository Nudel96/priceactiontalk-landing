<script lang="ts">
	import { Clock, CheckCircle, ChevronRight, TrendingUp, Activity, Shield, Settings, Brain } from '@lucide/svelte';

	// Define difficulty levels
	const difficultyLevels = [
		{
			id: 'beginner',
			name: 'Beginner',
			description: 'Perfect for those just starting their trading journey',
			color: 'bg-green-500',
			textColor: 'text-green-600',
			bgColor: 'bg-green-50'
		},
		{
			id: 'intermediate',
			name: 'Intermediate',
			description: 'For traders with basic knowledge looking to expand',
			color: 'bg-blue-500',
			textColor: 'text-blue-600',
			bgColor: 'bg-blue-50'
		},
		{
			id: 'advanced',
			name: 'Advanced',
			description: 'Complex strategies and advanced market concepts',
			color: 'bg-orange-500',
			textColor: 'text-orange-600',
			bgColor: 'bg-orange-50'
		},
		{
			id: 'expert',
			name: 'Expert',
			description: 'Professional-level trading techniques and psychology',
			color: 'bg-red-500',
			textColor: 'text-red-600',
			bgColor: 'bg-red-50'
		},
		{
			id: 'master',
			name: 'Master',
			description: 'Institutional-grade strategies and market mastery',
			color: 'bg-purple-500',
			textColor: 'text-purple-600',
			bgColor: 'bg-purple-50'
		}
	];

	// Define main categories with subcategories
	const categories = [
		{
			id: 'technical',
			name: 'Technical Analysis',
			icon: TrendingUp,
			subcategories: [
				'Chart Patterns',
				'Support & Resistance',
				'Trend Analysis',
				'Indicators & Oscillators',
				'Candlestick Patterns',
				'Volume Analysis'
			]
		},
		{
			id: 'fundamental',
			name: 'Fundamental Analysis',
			icon: Activity,
			subcategories: [
				'Economic Indicators',
				'Central Bank Policies',
				'Market Sentiment',
				'News Trading',
				'Correlation Analysis',
				'Market Structure'
			]
		},
		{
			id: 'risk',
			name: 'Risk Management',
			icon: Shield,
			subcategories: [
				'Position Sizing',
				'Stop Loss Strategies',
				'Risk-Reward Ratios',
				'Portfolio Management',
				'Drawdown Control',
				'Money Management'
			]
		},
		{
			id: 'tools',
			name: 'Websites / Tools',
			icon: Settings,
			subcategories: [
				'Trading Platforms',
				'Economic Calendars',
				'Market Scanners',
				'Analysis Software',
				'News Sources',
				'Mobile Apps'
			]
		},
		{
			id: 'personal',
			name: 'Personal Development',
			icon: Brain,
			subcategories: [
				'Trading Psychology',
				'Discipline & Patience',
				'Goal Setting',
				'Performance Review',
				'Stress Management',
				'Continuous Learning'
			]
		}
	];

	let selectedLevel = 'beginner';
	let selectedCategory = null;

	// Mock completion data
	const getCompletionStatus = (level: string, category: string, subcategory: string) => {
		// Random completion for demo purposes
		return Math.random() > 0.7;
	};

	const getLevelProgress = (level: string) => {
		const totalLessons = categories.length * 6; // 6 subcategories per category
		const completed = Math.floor(Math.random() * totalLessons);
		return { completed, total: totalLessons, percentage: Math.round((completed / totalLessons) * 100) };
	};

	const handleSubcategoryClick = (categoryId: string, subcategory: string) => {
		console.log(`Navigating to ${categoryId} -> ${subcategory}`);
		// In a real app, this would navigate to the specific subcategory content
		alert(`Opening ${subcategory} lessons. This will be implemented with actual content.`);
	};

	// Reactive calculations
	$: selectedLevelData = difficultyLevels.find(l => l.id === selectedLevel);
	$: overallProgress = getLevelProgress(selectedLevel);
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-navy">Trading School</h1>
			<p class="text-gray-600 mt-2">Master the fundamentals of technical analysis, risk management and trading psychology</p>
		</div>
	</div>

	<!-- Difficulty Level Selector -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h2 class="text-xl font-semibold text-navy mb-4">Choose Your Learning Path</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
			{#each difficultyLevels as level}
				{@const progress = getLevelProgress(level.id)}
				<button
					class="p-4 rounded-lg border-2 transition-all duration-200 text-left {selectedLevel === level.id
						? 'border-teal-500 bg-teal-50'
						: 'border-gray-200 hover:border-gray-300'}"
					on:click={() => selectedLevel = level.id}>
					<div class="flex items-center gap-3 mb-2">
						<div class="w-3 h-3 rounded-full {level.color}"></div>
						<h3 class="font-semibold text-navy">{level.name}</h3>
					</div>
					<p class="text-sm text-gray-600 mb-3">{level.description}</p>
					<div class="flex items-center justify-between text-xs">
						<span class="text-gray-500">{progress.completed}/{progress.total} completed</span>
						<span class="font-semibold {level.textColor}">{progress.percentage}%</span>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
						<div class="h-1.5 rounded-full {level.color}" style="width: {progress.percentage}%"></div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Learning Categories -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		{#each categories as category}
			{@const categoryProgress = category.subcategories.filter(sub => getCompletionStatus(selectedLevel, category.id, sub)).length}
			<div class="bg-white rounded-xl shadow-md overflow-hidden">
				<div class="p-6 border-b border-gray-100">
					<div class="flex items-center gap-3 mb-2">
						<div class="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
							<svelte:component this={category.icon} class="w-5 h-5 text-teal-600" />
						</div>
						<h3 class="text-xl font-semibold text-navy">{category.name}</h3>
					</div>
				</div>
				<div class="p-6">
					<div class="space-y-3">
						{#each category.subcategories as subcategory}
							{@const isCompleted = getCompletionStatus(selectedLevel, category.id, subcategory)}
							<button
								class="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 text-left"
								on:click={() => handleSubcategoryClick(category.id, subcategory)}>
								<div class="flex items-center gap-3">
									{#if isCompleted}
										<CheckCircle class="w-5 h-5 text-green-500" />
									{:else}
										<Clock class="w-5 h-5 text-gray-400" />
									{/if}
									<span class="font-medium text-navy">{subcategory}</span>
								</div>
								<ChevronRight class="w-4 h-4 text-gray-400" />
							</button>
						{/each}
					</div>

					<!-- Category Progress -->
					<div class="mt-4 pt-4 border-t border-gray-100">
						<div class="flex items-center justify-between text-sm mb-2">
							<span class="text-gray-600">Progress</span>
							<span class="font-semibold text-navy">{categoryProgress}/{category.subcategories.length}</span>
						</div>
						<div class="w-full bg-gray-200 rounded-full h-2">
							<div
								class="h-2 rounded-full bg-teal-500"
								style="width: {(categoryProgress / category.subcategories.length) * 100}%">
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Overall Progress Summary -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h3 class="text-xl font-semibold text-navy mb-4">Your {selectedLevelData?.name} Level Progress</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="text-center">
				<div class="text-3xl font-bold text-teal-600 mb-1">{overallProgress.completed}</div>
				<div class="text-sm text-gray-600">Lessons Completed</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-navy mb-1">{overallProgress.total - overallProgress.completed}</div>
				<div class="text-sm text-gray-600">Lessons Remaining</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold {selectedLevelData?.textColor} mb-1">{overallProgress.percentage}%</div>
				<div class="text-sm text-gray-600">Overall Progress</div>
			</div>
		</div>
		<div class="mt-6">
			<div class="w-full bg-gray-200 rounded-full h-3">
				<div
					class="h-3 rounded-full {selectedLevelData?.color}"
					style="width: {overallProgress.percentage}%">
				</div>
			</div>
		</div>
	</div>
</div>

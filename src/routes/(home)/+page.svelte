<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	// Lucide icons for Svelte
	import {
		Mail,
		Send,
		Check,
		Loader,
		BookCopy,
		ChartCandlestick,
		MessageSquare,
		ChevronDown
	} from '@lucide/svelte';

	// Custom components and actions
	import CountdownTimer from './CountdownTimer.svelte';
	import { viewport } from '$lib/actions/viewport';

	// Component State using Svelte 5 Runes
	let email = $state('');
	let formState: 'idle' | 'loading' | 'success' = $state('idle');
	let showHeroContent = $state(false);

	// Lifecycle hook to trigger initial animation
	onMount(() => {
		showHeroContent = true;
	});

	const features = [
		{
			icon: ChartCandlestick,
			title: 'Live Market Practice',
			description:
				'Apply your knowledge in a hyper-realistic demo environment with live market data.'
		},
		{
			icon: BookCopy,
			title: 'Integrated Trading Journal',
			description:
				'Seamlessly log trades from the practice environment directly into your journal for analysis.'
		},
		{
			icon: MessageSquare,
			title: 'Community Insights',
			description:
				'Share your performance and strategies to learn from a community of dedicated traders.'
		}
	];

	// Form submission logic
	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		if (email && formState === 'idle') {
			formState = 'loading';
			setTimeout(() => {
				formState = 'success';
				setTimeout(() => {
					// In a real app, you'd use a toast notification instead of alert()
					alert(`Thank you! ${email} has been added to our waitlist.`);
					formState = 'idle';
					email = '';
				}, 1000);
			}, 1500);
		}
	};

	const embedUrl = 'https://www.youtube.com/embed/z-i6bQjElos';
</script>

<div class="bg-navy text-white">
	<!-- SECTION 1: The Hero Hook with 3D Background -->
	<section class="relative flex h-[calc(100vh-78px)] flex-col items-center justify-center p-4 text-center">
		<div class="relative z-10 h-full w-full flex items-center justify-center">
			{#if showHeroContent}
				<div in:fly={{ y: 20, duration: 800, delay: 200 }} class="w-full max-w-3xl">
					<h2 class="mb-4 text-2xl font-light uppercase tracking-[0.3em] text-gray-200/80">
						PRICEACTIONTALK
					</h2>
					<h1
						class="animate-text-shimmer mb-4 bg-gradient-to-r from-gray-200 via-white to-gray-400 bg-[200%_auto] bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-6xl">
						The Future of Trading is Here.
					</h1>
					<p class="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
						Stop juggling tools. Start mastering the market. Our integrated platform brings your
						journal, strategies, and education into one powerful hub.
					</p>

					<form onsubmit={handleSubmit} class="mx-auto w-full max-w-lg">
						<div class="relative flex items-center">
							<Mail class="absolute left-5 text-gray-400" size="20" />
							<input
								type="email"
								bind:value={email}
								placeholder="Enter your email to get notified"
								required
								disabled={formState !== 'idle'}
								class="focus:border-teal focus:ring-teal w-full rounded-full border border-white/20 bg-white/5 py-4 pl-14 pr-40 text-white placeholder-gray-400 backdrop-blur-sm transition duration-300" />
							<button
								type="submit"
								disabled={formState !== 'idle'}
								class="btn bg-teal hover:bg-teal/90 animate-subtle-glow absolute right-2 top-1/2 flex h-11 w-36 -translate-y-1/2 items-center justify-center gap-2 rounded-full px-5 py-2.5 font-bold text-white shadow-lg">
								<!-- Svelte's {#if} blocks with transitions replace AnimatePresence -->
								{#if formState === 'idle'}
									<span in:fade={{ duration: 200 }} class="flex items-center gap-2">
										<Send size="16" />Notify Me
									</span>
								{:else if formState === 'loading'}
									<span in:fade={{ duration: 200 }} class="flex items-center justify-center">
										<Loader class="animate-spin" size="20" />
									</span>
								{:else if formState === 'success'}
									<span in:fade={{ duration: 200 }} class="flex items-center justify-center">
										<Check size="20" />
									</span>
								{/if}
							</button>
						</div>
					</form>
				</div>
			{/if}
		</div>

		{#if showHeroContent}
			<div in:fade={{ delay: 1500, duration: 1000 }} class="absolute bottom-10">
				<ChevronDown size="28" class="animate-bounce text-white/50" />
			</div>
		{/if}
	</section>

	<!-- SECTION 2: Video Sneak Peek -->
	<section class="bg-navy py-20 md:py-32">
		<div
			class="mx-auto max-w-4xl px-4 text-center"
			use:viewport
			role="group">
			<div in:fly={{ y: 20, duration: 700 }}>
				<h2 class="mb-4 text-3xl font-bold text-white">See It In Action</h2>
				<p class="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
					Get a sneak peek of the seamless workflow and powerful tools designed to elevate your
					trading journey.
				</p>
				<div
					class="shadow-teal/10 border-teal/20 aspect-video overflow-hidden rounded-xl border bg-black shadow-2xl">
					<iframe
						class="h-full w-full"
						src={embedUrl}
						title="PriceActionTalk Platform Preview"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen>
					</iframe>
				</div>
			</div>
		</div>
	</section>

	<!-- SECTION 3: The Countdown Hook -->
	<section class="bg-gray-900/50 py-20 md:py-24">
		<div class="mx-auto max-w-7xl px-4 text-center">
			<h3 class="mb-6 text-xl font-semibold tracking-wider text-teal-300">LAUNCHING IN...</h3>
			<CountdownTimer />
		</div>
	</section>

	<!-- SECTION 4: The Feature Hook -->
	<section class="bg-gray-50 py-20 md:py-32">
		<div
			class="mx-auto max-w-7xl px-4 text-center"
			use:viewport
			role="group">
			<h2 class="text-navy mb-4 text-3xl font-bold">Your All-In-One Trading Hub</h2>
			<p class="mx-auto mb-12 max-w-3xl text-lg text-gray-600">
				We built the tools you've always needed, right where you need them. No more switching
				between apps.
			</p>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<!-- Svelte's {#each} block for list rendering -->
				<!-- Staggered animation is achieved with a calculated delay -->
				{#each features as feature, i}
					{@const Icon = feature.icon}
					<div
						in:fly={{ y: 20, duration: 500, delay: i * 200 }}
						class="rounded-lg border border-gray-200 bg-white p-8 text-left shadow-lg">
						<div class="flex items-center gap-4">
							<div class="bg-teal/10 rounded-full p-3">
								<!-- Svelte component usage for icons -->
								<Icon class="text-teal" size={24} />
							</div>
							<h3 class="text-navy text-xl font-bold">{feature.title}</h3>
						</div>
						<p class="mt-4 text-gray-600">
							{feature.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- SECTION 5: Payment Options -->
	<section class="bg-navy py-20 text-center text-white md:py-32">
		<div class="mx-auto max-w-3xl px-4">
			<h2 class="mb-4 text-3xl font-bold">Secure Lifetime Access</h2>
			<p class="mb-8 text-lg text-gray-300">
				Early supporters receive lifetime membership and immediate access to our Discord community
				while the full platform is in development.
			</p>
			<div class="flex flex-col justify-center gap-6 md:flex-row">
				<a
					href="https://buy.stripe.com/3cIeVdbeu0Dn7Sngrc04800"
					class="btn text-navy rounded-md bg-white px-6 py-3 font-bold hover:bg-gray-100">
					Pay with Stripe
				</a>
				<a
					href="https://nowpayments.io/payment/?iid=5885428476"
					class="btn bg-teal hover:bg-teal/90 rounded-md px-6 py-3 font-bold text-white">
					Pay with Crypto
				</a>
			</div>
			<p class="mt-6 text-sm text-gray-400">
				After payment you will receive an invoice via email with a link to join our Discord
				community.
			</p>
		</div>
	</section>
</div>

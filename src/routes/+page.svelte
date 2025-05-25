<script lang="ts">
	import { onMount } from 'svelte';
	import 'aos/dist/aos.css';
	import AOS from 'aos';

	const STRIPE_CHECKOUT_URL = 'https://dein-stripe-link.com/checkout';

	onMount(() => {
		AOS.init({ duration: 800, easing: 'ease-in-out' });
	});

	let openFaq = false;

	const faqs = [
		{
			title: 'Is it legit?',
			content: `Yes — and we're proud to say our community is led by real traders, not marketers. One of our key mentors, Abu Bakar, has helped shape the educational framework with real-world experience and results.\n\nWhile the platform is still under construction, we're working hard from day one to deliver high-value educational content. Our team is committed to offering you a reliable and honest environment to grow, not just flashy promises.`
		},
		{
			title: 'Do I need prior experience?',
			content: `In theory — no.\n\nThe level system is built so that even someone with basic foundational knowledge can follow along. However, we do expect strong interest and the willingness to learn.\n\nAnd you won't be alone. Our team is available to support you if you ever feel stuck or need help understanding a concept.`
		},
		{
			title: 'What makes you different from typical signal providers?',
			content: `We're not a signal group — and never will be.\n\nOur mission is to help you understand the market in a way that goes far beyond simple buy/sell calls. We want our members to learn how the macroeconomic engine works, how to anticipate financial developments, and how to make independent decisions.\n\nWe also put strong emphasis on personal development — because becoming a profitable trader is deeply tied to mastering your own emotions. Trading is a mirror of your personal life. Emotional control is everything.`
		},
		{
			title: 'What is the Level System?',
			content: `We've built a step-by-step level system to guide your growth. You don't level up by buying anything — you level up by mastering the craft.`
		}
	];
</script>

<section class="flex flex-1 items-center px-4 py-10 md:px-40" data-aos="fade-up">
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row">
		<!-- Hero Text & CTA -->
		<div class="flex flex-1 flex-col gap-6">
			<div>
				<h1 class="mb-2 text-4xl leading-tight font-black text-white">
					Trade Smarter. <span class="text-[#1b9aaa]">Together.</span>
				</h1>
				<h2 class="text-sm font-normal text-[#ffffff] md:text-base">
					Join our community of traders and investors, and learn how to navigate the markets
					alongside other like-minded individuals.
				</h2>
			</div>
			<div class="flex flex-wrap gap-3 items-center">
				<a
					class="flex items-center gap-2 rounded-full bg-[#1b9aaa] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#127e83]"
					href="https://discord.gg/2j8Skn2w"
					target="_blank">
					<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.2a.077.077 0 0 0-.081.038c-.357.637-.755 1.469-1.037 2.122a17.569 17.569 0 0 0-5.157 0c-.282-.664-.68-1.485-1.037-2.122a.077.077 0 0 0-.081-.038A19.736 19.736 0 0 0 3.683 4.369a.07.07 0 0 0-.032.027C.533 9.043-.32 13.56.099 18.057a.082.082 0 0 0 .031.056A19.911 19.911 0 0 0 7.257 21.8a.077.077 0 0 0 .084-.027c.635-.873 1.2-1.794 1.684-2.759a.076.076 0 0 0-.041-.105c-.544-.205-1.06-.453-1.557-.743a.077.077 0 0 1-.009-.127c.105-.08.21-.162.312-.246a.074.074 0 0 1 .078-.01c3.292 1.503 6.85 1.503 10.114 0a.073.073 0 0 1 .079.009c.102.084.207.167.312.247a.077.077 0 0 1-.009.127 12.298 12.298 0 0 1-1.558.743.076.076 0 0 0-.04.106c.484.963 1.049 1.884 1.683 2.757a.077.077 0 0 0 .084.028 19.888 19.888 0 0 0 7.127-3.687.077.077 0 0 0 .031-.055c.5-5.177-.838-9.657-3.607-13.661a.061.061 0 0 0-.03-.028ZM8.02 15.331c-1.029 0-1.874-.95-1.874-2.117 0-1.168.83-2.118 1.874-2.118 1.05 0 1.89.959 1.874 2.118 0 1.167-.83 2.117-1.874 2.117Zm7.974 0c-1.028 0-1.874-.95-1.874-2.117 0-1.168.83-2.118 1.874-2.118 1.05 0 1.89.959 1.874 2.118 0 1.167-.824 2.117-1.874 2.117Z" />
					</svg>
					Join our Discord for free
				</a>
				<a
					class="rounded-full bg-[#7cfc00] px-6 py-3 text-sm font-bold text-[#0d1b2a] transition hover:bg-[#59c200]"
					href={STRIPE_CHECKOUT_URL}>
					Join Now
				</a>
			</div>
		</div>
		<div
			class="aspect-video min-h-[200px] w-full max-w-[500px] rounded-xl bg-cover bg-center md:w-auto"
			style="background-image: url('https://cdn.usegalileo.ai/sdxl10/e8d3327f-1955-4321-9168-2bcd08fa6a09.png');">
		</div>
	</div>
</section>

<!-- WHY SECTION / Features -->
<section class="mx-auto w-full max-w-5xl px-4 pb-10" data-aos="fade-up">
	<h2 class="px-4 pt-5 pb-3 text-[22px] leading-tight font-bold text-[#7cfc00]">
		Why PriceActionTalk?
	</h2>
	<div class="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		<!-- Feature Cards wie oben ... (hier aus Platzgründen gekürzt, gerne kopieren!) -->
	</div>
</section>

<!-- ABOUT US SECTION -->
<section id="about" class="mx-auto w-full max-w-4xl px-4 py-12" data-aos="fade-up">
	<h2 class="mb-6 text-3xl font-bold text-white">
		<span class="text-[#1b9aaa]">About</span>
		<span class="text-white">Us</span>
		<div class="mt-1 h-1 w-32 rounded bg-[#1b9aaa]"></div>
	</h2>
	<div class="rounded-xl border-l-4 border-[#1b9aaa] bg-[#232c33] p-6 shadow-xl">
		<p class="mb-6 text-base text-white">
			Priceactiontalk was built by full-time traders who've weathered every market condition—not by
			marketers selling dreams. We reject the industry's false promises and "get-rich-quick"
			schemes. Instead, we offer transparent analysis based on macroeconomic fundamentals and proven
			price action strategies. Our community thrives on consistency and accountability—every call is
			tracked, every analysis explained. We don't hide behind cherry-picked results or vague
			predictions. What sets us apart isn't just our track record, but our commitment to building
			real traders through education, not dependency. We succeed when you develop the skills to
			succeed independently, not when you blindly follow alerts.
		</p>
		<div class="flex items-center gap-4">
			<div class="flex gap-1">
				<span class="rounded-full bg-[#1b9aaa] px-3 py-1 text-sm font-bold text-[#0d1b2a]">MS</span>
				<span class="rounded-full bg-[#1b9aaa] px-3 py-1 text-sm font-bold text-[#0d1b2a]">AB</span>
			</div>
			<div>
				<span class="font-bold text-white">Founded by active traders</span>
				<span class="block text-sm text-gray-400">With combined 13 years of market experience</span>
			</div>
		</div>
	</div>
</section>

<!-- FAQ SECTION -->
<section class="mx-auto w-full max-w-4xl px-4 py-12" data-aos="fade-up">
	<h2 class="mb-6 text-3xl font-bold text-white">
		Frequently Asked <span class="text-[#1b9aaa]">Questions</span>
		<div class="mt-1 h-1 w-32 rounded bg-[#1b9aaa]"></div>
	</h2>
	<div class="space-y-4">
		{#each faqs as faq, i}
			<div
				class="rounded-xl border-l-4 border-[#1b9aaa] bg-[#232c33] p-6 shadow-xl transition-all duration-300">
				<div class="mb-2 flex items-center">
					<span class="mr-2 text-lg font-bold text-[#1b9aaa]">
						{String(i + 1).padStart(2, '0')}
					</span>
					<span class="text-lg font-bold text-white">{faq.title}</span>
				</div>
				<div class="text-gray-200">{faq.content}</div>
			</div>
		{/each}
	</div>
</section>

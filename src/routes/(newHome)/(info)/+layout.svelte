<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import { page } from '$app/stores';
	$: currentPath = $page.url.pathname;

	const STRIPE_CHECKOUT_URL = 'https://dein-stripe-link.com/checkout';
</script>

<div class="flex flex-col font-[Manrope,sans-serif]" data-path={currentPath}>
	<header
		class="from-navy flex items-center justify-between bg-gradient-to-b to-[#16243c] px-8 py-4 shadow-md">
		<div class="flex items-center gap-4 text-white">
			<Logo />
			<span class="text-xl font-bold tracking-tight">PriceActionTalk</span>
		</div>
		<nav class="flex flex-1 items-center justify-end gap-6">
			<a
				class="rounded-md px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
				href="/">
				Home
			</a>
			<a
				class="rounded-md px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
				href="/about">
				About
			</a>
			<a
				class="rounded-md px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
				href="/resources">
				Free Resources
			</a>
			<a
				class="rounded-md px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
				href="/membership">
				Membership
			</a>
			<a
				class="rounded-md px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
				href="/contact">
				Contact
			</a>
			<a
				class="joinnowbtn from-teal to-signal text-navy rounded-md bg-gradient-to-r px-6 py-3 text-sm font-bold shadow hover:opacity-90"
				href={STRIPE_CHECKOUT_URL}>
				Join Now
			</a>
			<a
				class="flex items-center gap-2 rounded-md bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20"
				href="https://discord.gg/2j8Skn2w"
				target="_blank">
				<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.2a.077.077 0 0 0-.081.038c-.357.637-.755 1.469-1.037 2.122a17.569 17.569 0 0 0-5.157 0c-.282-.664-.68-1.485-1.037-2.122a.077.077 0 0 0-.081-.038A19.736 19.736 0 0 0 3.683 4.369a.07.07 0 0 0-.032.027C.533 9.043-.32 13.56.099 18.057a.082.082 0 0 0 .031.056A19.911 19.911 0 0 0 7.257 21.8a.077.077 0 0 0 .084-.027c.635-.873 1.2-1.794 1.684-2.759a.076.076 0 0 0-.041-.105c-.544-.205-1.06-.453-1.557-.743a.077.077 0 0 1-.009-.127c.105-.08.21-.162.312-.246a.074.074 0 0 1 .078-.01c3.292 1.503 6.85 1.503 10.114 0a.073.073 0 0 1 .079.009c.102.084.207.167.312.247a.077.077 0 0 1-.009.127 12.298 12.298 0 0 1-1.558.743.076.076 0 0 0-.04.106c.484.963 1.049 1.884 1.683 2.757a.077.077 0 0 0 .084.028 19.888 19.888 0 0 0 7.127-3.687.077.077 0 0 0 .031-.055c.5-5.177-.838-9.657-3.607-13.661a.061.061 0 0 0-.03-.028ZM8.02 15.331c-1.029 0-1.874-.95-1.874-2.117 0-1.168.83-2.118 1.874-2.118 1.05 0 1.89.959 1.874 2.118 0 1.167-.83 2.117-1.874 2.117Zm7.974 0c-1.028 0-1.874-.95-1.874-2.117 0-1.168.83-2.118 1.874-2.118 1.05 0 1.89.959 1.874 2.118 0 1.167-.824 2.117-1.874 2.117Z" />
				</svg>
				Join Discord
			</a>
		</nav>
	</header>
	<slot />
</div>

<style lang="postcss">
	:global(body) {
		background-color: #0d1b2a;
	}
</style>

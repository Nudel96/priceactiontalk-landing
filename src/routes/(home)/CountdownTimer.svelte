<script lang="ts">
	import { onMount } from 'svelte';

	// Set a future date for the countdown
	const launchDate = new Date('2026-01-01T00:00:00');

	// Use $state for reactive values
	let timeLeft = $state({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	});

	onMount(() => {
		const interval = setInterval(() => {
			const now = new Date().getTime();
			const distance = launchDate.getTime() - now;

			if (distance < 0) {
				clearInterval(interval);
				timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
				return;
			}

			// Assigning to the properties of the $state object triggers reactivity
			timeLeft.days = Math.floor(distance / (1000 * 60 * 60 * 24));
			timeLeft.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			timeLeft.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			timeLeft.seconds = Math.floor((distance % (1000 * 60)) / 1000);
		}, 1000);

		return () => clearInterval(interval);
	});

	// Use a derived rune for formatting to show its usage, although a simple function call in the template also works.
	const formattedTime = $derived({
		days: timeLeft.days.toString().padStart(2, '0'),
		hours: timeLeft.hours.toString().padStart(2, '0'),
		minutes: timeLeft.minutes.toString().padStart(2, '0'),
		seconds: timeLeft.seconds.toString().padStart(2, '0')
	});
</script>

<div class="flex items-center justify-center gap-4 text-white md:gap-8">
	<div class="text-center">
		<span class="block text-4xl font-bold md:text-6xl">{formattedTime.days}</span>
		<span class="text-sm text-gray-400 md:text-base">Days</span>
	</div>
	<div class="pb-6 text-4xl font-bold md:text-6xl">:</div>
	<div class="text-center">
		<span class="block text-4xl font-bold md:text-6xl">{formattedTime.hours}</span>
		<span class="text-sm text-gray-400 md:text-base">Hours</span>
	</div>
	<div class="pb-6 text-4xl font-bold md:text-6xl">:</div>
	<div class="text-center">
		<span class="block text-4xl font-bold md:text-6xl">{formattedTime.minutes}</span>
		<span class="text-sm text-gray-400 md:text-base">Minutes</span>
	</div>
	<div class="pb-6 text-4xl font-bold md:text-6xl">:</div>
	<div class="text-center">
		<span class="block text-4xl font-bold md:text-6xl">{formattedTime.seconds}</span>
		<span class="text-sm text-gray-400 md:text-base">Seconds</span>
	</div>
</div>

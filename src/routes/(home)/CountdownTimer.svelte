<script lang="ts">
  import { onMount } from 'svelte';

  // Set a future date for the countdown
  const launchDate = new Date('2026-01-01T00:00:00');

  // Use $state for reactive values
  let timeLeft = $state({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
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
      seconds: timeLeft.seconds.toString().padStart(2, '0'),
  });

</script>

<div class="flex justify-center items-center gap-4 md:gap-8 text-white">
  <div class="text-center">
    <span class="text-4xl md:text-6xl font-bold block">{formattedTime.days}</span>
    <span class="text-sm md:text-base text-gray-400">Days</span>
  </div>
  <div class="text-4xl md:text-6xl font-bold pb-6">:</div>
  <div class="text-center">
    <span class="text-4xl md:text-6xl font-bold block">{formattedTime.hours}</span>
    <span class="text-sm md:text-base text-gray-400">Hours</span>
  </div>
  <div class="text-4xl md:text-6xl font-bold pb-6">:</div>
  <div class="text-center">
    <span class="text-4xl md:text-6xl font-bold block">{formattedTime.minutes}</span>
    <span class="text-sm md:text-base text-gray-400">Minutes</span>
  </div>
  <div class="text-4xl md:text-6xl font-bold pb-6">:</div>
  <div class="text-center">
    <span class="text-4xl md:text-6xl font-bold block">{formattedTime.seconds}</span>
    <span class="text-sm md:text-base text-gray-400">Seconds</span>
  </div>
</div>
<script lang="ts">
	import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';

  const features = [
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#7cfc00" stroke-width="2" class="w-8 h-8 mb-2"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>`,
      title: 'Level System',
      description: 'Every bit of progress counts: Unlock new areas, knowledge, community privileges & real responsibility. No signals, just proof-of-skill.'
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#1b9aaa" stroke-width="2" class="w-8 h-8 mb-2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 16v-8m4 8V8m4 8V8"/></svg>`,
      title: 'Community',
      description: 'Engage in a global, honest trading community. Feedback, sparring, and networking on every level. Results, not talk.'
    },
    {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#7cfc00" stroke-width="2" class="w-8 h-8 mb-2"><path d="M4 19h16M4 15h16M7 11h10M10 7h4"/></svg>`,
      title: 'Education',
      description: 'Structured learning paths, homework, reflections & certified knowledge in price action, macro, trading psychology, and risk management.'
    }
  ];
</script>

<section class="w-full max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-16">
  {#each features as f, i}
    <div
      class="flex flex-col gap-4 items-start"
      in:fly={{ y: 64, opacity: 0, delay: 100 * i, duration: 800, easing: cubicOut }}
      >
      {@html f.icon}
      <h2 class="text-xl font-bold text-white mb-2">{f.title}</h2>
      <p class="text-[#b0bec5] text-base leading-relaxed">{f.description}</p>
    </div>
  {/each}
</section>


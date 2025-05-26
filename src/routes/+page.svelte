<script lang="ts">
  import FeaturesGrid from '$lib/components/FeaturesGrid.svelte';
  import Testimonials from '$lib/components/Testimonials.svelte';
  // weitere Imports...
</script>


<main class="min-h-screen w-full font-sans bg-[#0d1b2a] text-white flex flex-col">
  <!-- Header -->
  <header class="w-full flex items-center justify-between px-10 py-4 bg-[#0d1b2a] border-b border-[#1b9aaa]/10">
    <div class="flex items-center gap-3">
      <img src="/Logo.jpg" alt="PriceActionTalk Logo" class="h-8 w-auto select-none" />
      <span class="font-bold text-lg tracking-wide text-[#7cfc00]">PriceActionTalk</span>
    </div>
    <nav class="hidden md:flex items-center gap-7 text-sm font-medium">
      <a href="#levels" class="hover:text-[#7cfc00] transition">Levels</a>
      <a href="#community" class="hover:text-[#1b9aaa] transition">Community</a>
      <a href="#education" class="hover:text-[#7cfc00] transition">Education</a>
      <a href="/login" class="ml-5 px-6 py-2 bg-[#1b9aaa] hover:bg-[#1291a4] rounded-[3px] shadow text-white font-semibold transition">Login</a>
      <a href="https://www.instagram.com/priceactiontalk/" target="_blank" aria-label="Instagram" class="hover:text-[#1b9aaa] transition">
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1-5.25 5.25 5.25 5.25 0 0 1 5.25-5.25zm0 1.5A3.75 3.75 0 1 0 15.75 12a3.75 3.75 0 0 0-3.75-3.75zm5.25.75a1 1 0 1 1-1-1 1 1 0 0 1 1 1z"/>
      </svg>
    </a>
    </nav>
  </header>

  <!-- Hero Section -->
  <section class="w-full max-w-7xl mx-auto px-6 pt-16 pb-12 grid grid-cols-1 md:grid-cols-2 gap-16 border-b border-[#1b9aaa]/10 bg-[#101d2b]">
    <div class="flex flex-col justify-center">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-8 leading-tight">
        Competence. Clarity. No Bullshit.<br/>
        <span class="text-[#7cfc00]">The Level System for Real Traders.</span>
      </h1>
      <p class="text-lg text-[#b0bec5] mb-10 max-w-lg">
        Rise from D-Tier to A++: Master price action, macro, and trading psychology – with a community that delivers real results. Progress is visible here. No signals, just structure & real growth.
      </p>
      <div class="flex gap-6">
        <a href="/login" class="px-8 py-3 bg-[#1b9aaa] hover:bg-[#1291a4] rounded-[3px] font-semibold transition">Login</a>
        <a href="https://discord.gg/2j8Skn2w" target="_blank" class="px-8 py-3 border border-[#7cfc00] text-[#7cfc00] font-semibold rounded-[3px] hover:bg-[#7cfc00]/10 transition">Join the free Discord</a>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <img src="/level_landing.png" alt="Trading Level System" class="w-[420px] h-[420px] object-cover border border-[#0d1b2a] rounded-[6px] shadow-xl" />
    </div>
  </section>
  <FeaturesGrid />
  <!-- Testimonials Section -->
  <section id="testimonials" class="w-full bg-[#162635] border-y border-[#1b9aaa]/10 py-20 px-6">
    <Testimonials />
  </section>

  <!-- Secondary CTA Banner -->
  <section class="w-full bg-[#1b9aaa] text-[#0d1b2a] py-16 px-6 text-center">
    <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Start your trading journey on the next level</h2>
    <p class="text-lg max-w-2xl mx-auto mb-8">All premium features after sign-up & one-time payment. No subscription. Full control.</p>
    <a href="/login" class="inline-block px-12 py-4 bg-[#0d1b2a] text-[#7cfc00] font-semibold rounded-[3px] border-2 border-[#7cfc00] hover:bg-[#162635] transition">Login & get started</a>
  </section>

  <!-- Footer -->
  <footer class="w-full px-10 py-7 flex flex-col md:flex-row justify-between items-center border-t border-[#1b9aaa]/10 bg-[#0d1b2a] mt-auto">
  <span class="font-bold text-[#7cfc00] tracking-wide">PriceActionTalk</span>
  <span class="text-xs text-[#b0bec5] mt-2 md:mt-0">© 2025 – Competence. Clarity. No Bullshit.</span>
  <div class="flex gap-3 mt-2 md:mt-0">
    <a href="https://www.instagram.com/priceactiontalk/" target="_blank" aria-label="Instagram" class="hover:text-[#1b9aaa] transition">
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1-5.25 5.25 5.25 5.25 0 0 1 5.25-5.25zm0 1.5A3.75 3.75 0 1 0 15.75 12a3.75 3.75 0 0 0-3.75-3.75zm5.25.75a1 1 0 1 1-1-1 1 1 0 0 1 1 1z"/>
      </svg>
    </a>
  </div>
</footer>

</main>

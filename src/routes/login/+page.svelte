<script lang="ts">
  let email = '';
  let password = '';
  let showPassword = false;
</script>

<main class="min-h-screen w-full flex items-center justify-center bg-[#0d1b2a] px-3">
  <div class="w-full max-w-md rounded-2xl bg-[#162635] shadow-2xl border border-[#1b9aaa]/10 p-10 flex flex-col gap-4">
    <!-- Header-Bar -->
    <header class="flex items-center gap-3 mb-8">
      <img src="/Logo2.png" alt="PriceActionTalk Logo" class="h-7 w-7 rounded-lg object-contain bg-[#7cfc00]" />
      <span class="font-bold text-2xl tracking-wide text-white">PriceActionTalk</span>
    </header>

    <!-- Login Form -->
    <section class="flex flex-col gap-2">
      <h1 class="text-2xl md:text-3xl font-extrabold text-white mb-1">Login to Your Account</h1>
      <p class="text-base text-[#b0bec5] mb-6">Access your trading community and resources.</p>
      <form class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="email" class="text-sm font-semibold text-white">Email Address</label>
          <input id="email" name="email" type="email" bind:value={email} required autocomplete="username" placeholder="Enter your email"
                 class="px-4 py-3 rounded-lg border border-[#223749] bg-[#0d1b2a] text-white placeholder-[#b0bec5] focus:outline-none focus:ring-2 focus:ring-[#1b9aaa] transition" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="password" class="text-sm font-semibold text-white">Password</label>
          <div class="relative">
            <input id="password" name="password" type={showPassword ? 'text' : 'password'} bind:value={password} required autocomplete="current-password" placeholder="Enter your password"
                   class="w-full px-4 py-3 rounded-lg border border-[#223749] bg-[#0d1b2a] text-white placeholder-[#b0bec5] focus:outline-none focus:ring-2 focus:ring-[#1b9aaa] transition" />
            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center text-[#b0bec5] hover:text-[#1b9aaa] focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              on:click={() => showPassword = !showPassword}
            >
              {#if showPassword}
                <!-- Eye-off SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477-1 12-1s10 4.477 10 10c0 1.34-.265 2.616-.75 3.775M9.88 9.88a3 3 0 104.24 4.24" /></svg>
              {:else}
                <!-- Eye-on SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12A3 3 0 019 12a3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c1.657 0 3.156.402 4.462 1.08M21.542 12C20.268 16.057 16.477 19 12 19c-1.657 0-3.156-.402-4.462-1.08" /></svg>
              {/if}
            </button>
          </div>
        </div>
        <button type="submit" class="w-full py-3 bg-[#1b9aaa] hover:bg-[#1291a4] text-white font-semibold rounded-xl text-lg transition">Login</button>
      </form>
      <div class="flex flex-col items-center gap-2 mt-4">
        <a href="#" class="text-sm text-[#b0bec5] hover:text-[#7cfc00] underline">Forgot your password?</a>
        <a href="https://buy.stripe.com/3cIeVdbeu0Dn7Sngrc04800" target="_blank" class="text-sm text-[#b0bec5] hover:text-[#7cfc00] underline">Don’t have an account? Become a member!</a>
      </div>
    </section>
    <footer class="mt-8 flex flex-col md:flex-row justify-between items-center text-[#b0bec5] text-xs gap-4">
      <div class="flex gap-4">
        <a href="#" class="hover:text-[#7cfc00]">Privacy Policy</a>
        <a href="#" class="hover:text-[#7cfc00]">Terms of Service</a>
      </div>
      <div class="flex gap-3">
<a href="https://www.instagram.com/priceactiontalk/" target="_blank" aria-label="Instagram" class="hover:text-[#1b9aaa]">
  <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1-5.25 5.25 5.25 5.25 0 0 1 5.25-5.25zm0 1.5A3.75 3.75 0 1 0 15.75 12a3.75 3.75 0 0 0-3.75-3.75zm5.25.75a1 1 0 1 1-1-1 1 1 0 0 1 1 1z"/>
  </svg>
</a>


      </div>
      <div>© 2025 PriceActionTalk. All rights reserved.</div>
    </footer>
  </div>
</main>


<script lang="ts">
  let search = "";
</script>

<main class="relative flex min-h-screen flex-col bg-[#0d1b2a] font-sans overflow-x-hidden">
  <!-- Header/Navi -->
  <header class="flex items-center justify-between border-b border-[#1b9aaa]/10 px-8 py-4">
    <div class="flex items-center gap-3 text-white">
      <img src="/Logo2.png" alt="PriceActionTalk Logo" class="h-8 w-8 rounded-lg object-contain bg-[#7cfc00]" />
      <span class="text-xl font-bold tracking-tight">PriceActionTalk</span>
    </div>
    <div class="flex flex-1 justify-end gap-6">
      <input
        type="text"
        placeholder="Search..."
        bind:value={search}
        class="form-input w-60 h-10 px-4 rounded-xl border-none bg-[#1b9aaa]/10 text-white placeholder-[#7cfc00] focus:ring-2 focus:ring-[#1b9aaa] transition shadow"
      />
      <a href="#" class="flex items-center justify-center rounded-xl h-10 px-4 bg-[#1b9aaa] text-white text-sm font-bold hover:bg-[#7cfc00] transition">Create</a>
      <button class="flex items-center justify-center rounded-xl h-10 w-10 bg-[#1b9aaa]/20 text-white"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" /></svg></button>
      <img src="/avatar-default.png" alt="User Avatar" class="h-10 w-10 rounded-full object-cover bg-[#1b9aaa]/10" />
    </div>
  </header>

  <div class="flex flex-col md:flex-row gap-4 p-4 flex-1">
    <!-- Sidebar (links) -->
    <aside class="flex flex-col gap-2 w-full md:w-72 bg-[#162635] rounded-xl p-4 shadow-lg border border-[#1b9aaa]/10 min-h-[640px]">
      <button class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#1b9aaa]/10 text-white transition"><svg ...><!-- icon --></svg><span class="text-sm font-medium">School</span></button>
      <!-- Füge weitere Buttons analog hinzu (Level, Homework, ...) -->
      <button class="mt-8 w-full bg-[#1b9aaa] hover:bg-[#7cfc00] text-white font-bold rounded-xl py-2 transition">New post</button>
    </aside>

    <!-- Dashboard Area -->
    <section class="flex-1 flex flex-col gap-4 max-w-5xl">
      <h2 class="text-white text-3xl font-bold tracking-tight mb-2">Community</h2>
      <!-- Tabs und Cards -->
      <!-- ... (hier kommt dein Content, Cards etc.) ... -->
    </section>
  </div>
</main>

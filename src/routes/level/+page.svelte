<script lang="ts">
  // Search input binding
  let search = '';

  // SVG-Icons as HTML strings for sidebar
  function getIcon(name: string): string {
    const icons: Record<string, string> = {
      House: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0l80,75.48Z"/></svg>`,
      ChartLine: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56Z"/></svg>`,
      Briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M216,56H176V48a24,24,0,0,0-24-24H104a24,24,0,0,0-24,24v8H40a16,16,0,0,0-16,16V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56Z"/></svg>`,
      Eye: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M128,48a80,80,0,1,0,80,80A80,80,0,0,0,128,48Zm0,144a64,64,0,1,1,64-64A64,64,0,0,1,128,192Z"/></svg>`,
      UsersThree: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M128,128a32,32,0,1,0-32-32A32,32,0,0,0,128,128Z"/></svg>`,
      Calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect x="40" y="48" width="176" height="160" rx="8"/></svg>`,
      Question: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><circle cx="128" cy="176" r="12"/><path d="M128,72a36,36,0,0,0-36,36h0a36,36,0,0,0,36,36h0a36,36,0,0,0,36-36h0A36,36,0,0,0,128,72Z"/></svg>`
    };
    return icons[name] || '';
  }

  // Sidebar items with 'Level' active
  const sidebarItems = [
    { icon: 'House', label: 'School', route: '/school', active: false },
    { icon: 'ChartLine', label: 'Level', route: '/level', active: true },
    { icon: 'Briefcase', label: 'Homework', route: '/homework', active: false },
    { icon: 'Eye', label: 'Forum', route: '/forum', active: false },
    { icon: 'UsersThree', label: 'Market', route: '/market', active: false },
    { icon: 'Calendar', label: 'Event', route: '/event', active: false },
    { icon: 'Question', label: 'Support', route: '/support', active: false }
  ];

  // Level & tasks
  let currentLevel = 1;
  let tasks = Array.from({ length: 23 }, (_, i) => {
    const id = 101 + i;
    return { title: `Read the ${id} guide`, completed: i < 6 };
  });
  $: completedCount = tasks.filter(t => t.completed).length;
  $: percentComplete = Math.round((completedCount / tasks.length) * 100);
</script>

<svelte:head>
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900" rel="stylesheet" />
</svelte:head>

<main class="relative flex min-h-screen flex-col bg-[#111518] font-sans" style="font-family: 'Inter', 'Noto Sans', sans-serif;">
  <!-- Header -->
  <header class="flex items-center justify-between border-b border-[#283139] px-10 py-3">
    <div class="flex items-center gap-4 text-white">
      <svg viewBox="0 0 48 48" class="w-8 h-8 text-current"><path d="M42.4379 44..."/></svg>
      <h2 class="text-white text-lg font-bold">PriceActionTalk</h2>
    </div>
    <div class="flex flex-1 justify-end items-center gap-4">
      <input type="text" placeholder="Search" bind:value={search} class="form-input bg-[#283139] text-white placeholder-[#9cacba] rounded-xl px-4 py-2 focus:ring-0 focus:outline-none" />
      <button class="bg-[#2094f3] text-white px-4 py-2 rounded-xl">Create</button>
      <button class="bg-[#283139] text-white p-2 rounded-xl">
        <svg width="20" height="20" fill="currentColor"><path d="M221.8,175.94..."/></svg>
      </button>
      <div class="w-10 h-10 rounded-full bg-cover bg-center" style="background-image:url('/avatar.png')"></div>
    </div>
  </header>

  <div class="flex flex-1">
    <!-- Sidebar -->
    <aside class="w-80 bg-[#111518] p-4">
      {#each sidebarItems as item}
        <a href={item.route} class="flex items-center gap-3 px-3 py-2 rounded-xl mb-2 transition-colors {item.active ? 'bg-[#283139]' : 'hover:bg-[#283139]'}">
          {@html getIcon(item.icon)}
          <span class="text-white">{item.label}</span>
        </a>
      {/each}
    </aside>

    <!-- Level Section -->
    <section class="flex-1 p-6 overflow-auto">
      <h1 class="text-2xl font-bold text-white mb-2">Level up your trading</h1>
      <p class="text-[#9cacba] mb-4">You're currently at level {currentLevel}. Reach level {currentLevel + 1} by completing more tasks and achievements.</p>

      <!-- XP bar -->
      <div class="mb-6">
        <div class="w-full bg-[#283139] rounded-full h-4">
          <div class="h-4 rounded-full bg-[#2094f3]" style="width:{percentComplete}%"></div>
        </div>
        <p class="text-[#9cacba] text-sm mt-1">{percentComplete}% complete</p>
      </div>

      <!-- Tasks grid -->
      <div class="grid grid-cols-5 gap-4">
        {#each tasks as task}
          <div class="flex items-center justify-center h-20 bg-[#162635] rounded-xl cursor-pointer hover:bg-[#1e2a3a] transition">
            <span class="flex items-center space-x-2 text-white">
              {#if task.completed}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd"/></svg>
              {/if}
              <span class="text-sm font-medium">{task.title}</span>
            </span>
          </div>
        {/each}
      </div>
    </section>
  </div>
</main>
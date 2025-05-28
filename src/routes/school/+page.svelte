<script lang="ts">
  // Suchfeld-Value
  let search = '';

  // SVG-Icons für die Sidebar (wird im Markup gerendert)
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

  // Alle Level mit zugehörigen Unterkategorien
  const levels = [
    {
      name: 'D-Tier (Newbie Trader)',
      categories: [
        'Technical Basics',
        'Fundamentals Basics',
        'Liquidity Basics',
        'Risk Management',
        'Useful Websites & Tools',
        'Homework & Tasks'
      ]
    },
    {
      name: 'C-Tier (Trend Seeker)',
      categories: [
        'Technical Structures & Patterns',
        'Fundamentals Deep Dive',
        'Liquidity – Advanced Concepts',
        'Funded Accounts Basic',
        'Risk/Reward & Psychology',
        'Homework & Practice'
      ]
    },
    {
      name: 'B-Tier (Market Navigator)',
      categories: [
        'Price Action Advanced',
        'Fundamentals – Indicators',
        'Liquidity Pools & Execution',
        'Personal Development',
        'Books & Deep Dives',
        'Homework – Case Studies'
      ]
    },
    {
      name: 'A-Tier (Price Action Strategist)',
      categories: [
        'Macro Fundamentals',
        'Advanced Risk Management',
        'Strategy Development',
        'Prop Trading & Funding',
        'Elite Homework & Challenges',
        'Leadership'
      ]
    },
    {
      name: 'A++-Tier (Institutional Mind)',
      categories: [
        'Hedgefund & Institutional Insights',
        'Automation & Tools',
        'Market Making & Arbitrage',
        'Leadership & Community Building',
        'Research & Innovation',
        'Personal Brand & Scaling'
      ]
    }
  ];

  // Für geöffnetes Level und gewählte Kategorie
  let openLevel = 0;
  let selectedCategory = { level: 0, cat: 0 };

  // Beispiel-Kacheln (PDF, Video, Quiz etc.)
  const valueTypes = [
    { type: 'PDF', icon: '📄', title: 'Liquidity PDF' },
    { type: 'Video', icon: '🎬', title: 'Liquidity Video' },
    { type: 'PDF', icon: '📄', title: 'Deep Dive PDF' },
    { type: 'PDF', icon: '📄', title: 'Sheet & Slides' },
    { type: 'Homework', icon: '📝', title: 'Homework Task' },
    { type: 'Quiz', icon: '❓', title: 'Quick Quiz' }
  ];
</script>
<svelte:head>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900"
    rel="stylesheet"
  />
</svelte:head>
<main class="relative flex min-h-screen flex-col bg-[#111518] font-sans" style="font-family: 'Inter', 'Noto Sans', sans-serif;">
  <!-- Header -->
  <header class="flex items-center justify-between border-b border-[#283139] px-10 py-3">
    <div class="flex items-center gap-4 text-white">
      <svg viewBox="0 0 48 48" class="w-8 h-8 text-current"><path d="M42.4379 44..."/></svg>
      <h2 class="text-white text-lg font-bold">PriceActionTalk</h2>
    </div>
    <div class="flex flex-1 justify-end items-center gap-4">
      <input
        type="text"
        placeholder="Search"
        bind:value={search}
        class="form-input bg-[#283139] text-white placeholder-[#9cacba] rounded-xl px-4 py-2 focus:ring-0 focus:outline-none"
      />
      <button class="bg-[#2094f3] text-white px-4 py-2 rounded-xl">Create</button>
      <button class="bg-[#283139] text-white p-2 rounded-xl">
        <svg width="20" height="20" fill="currentColor"><path d="M221.8,175.94..."/></svg>
      </button>
      <div class="w-10 h-10 rounded-full bg-[#2e2e2e] flex items-center justify-center text-[#7cfc00] font-bold">PA</div>
    </div>
  </header>

  <div class="flex flex-1">
    <!-- Sidebar (15% Breite) -->
    <aside class="bg-[#111518] px-2 py-8 w-[15vw] min-w-[180px] max-w-[220px]">
      <h3 class="text-white font-bold mb-4 pl-2">School</h3>
      <ul>
        {#each levels as level, i}
          <li>
            <button
              class="flex items-center gap-2 px-3 py-2 rounded-xl w-full text-left transition-colors mb-1 {openLevel === i ? 'bg-[#283139] text-[#7cfc00]' : 'hover:bg-[#283139] text-white'}"
              on:click={() => openLevel = openLevel === i ? -1 : i}
            >
              <span class="flex-1 truncate">{level.name}</span>
              <svg width="18" height="18" fill="currentColor" class="ml-auto transition-transform" style="transform: rotate({openLevel === i ? 90 : 0}deg);">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {#if openLevel === i}
              <ul class="ml-4 mt-1 mb-2">
                {#each level.categories as cat, j}
                  <li>
                    <button
                      class="w-full text-left px-3 py-2 my-1 rounded-lg transition-colors {selectedCategory.level === i && selectedCategory.cat === j ? 'bg-[#2094f3] text-white' : 'hover:bg-[#1b9aaa] text-[#9cacba]'}"
                      on:click={() => selectedCategory = { level: i, cat: j }}
                    >
                      {cat}
                    </button>
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    </aside>

    <!-- Main Content -->
    <section class="flex-1 p-8 flex flex-col">
      <h1 class="text-2xl font-bold text-white mb-2">
        {levels[selectedCategory.level].name}: 
        <span class="text-[#7cfc00]">{levels[selectedCategory.level].categories[selectedCategory.cat]}</span>
      </h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {#each valueTypes as value}
          <div class="bg-[#162635] rounded-xl flex flex-col items-center justify-center shadow-lg p-6 min-h-[170px] transition hover:scale-105 hover:bg-[#1b9aaa] cursor-pointer">
            <div class="text-4xl mb-2">{value.icon}</div>
            <h3 class="text-lg font-bold text-white mb-2">{value.title}</h3>
            <span class="text-[#9cacba] text-sm">{value.type}</span>
          </div>
        {/each}
      </div>
    </section>
  </div>
</main>

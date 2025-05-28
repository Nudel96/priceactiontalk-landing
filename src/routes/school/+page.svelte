<script lang="ts">
  import { slide } from 'svelte/transition';
  let search = '';

  function getIcon(name: string): string {
    const icons: Record<string,string> = {
      Dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z"/></svg>`,
      House: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9.5l9-7 9 7V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"/></svg>`,
      ChartLine: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M4 17l6-6 4 4 6-6v7H4z"/></svg>`,
      Briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M2 7h20v14H2V7zm2 2v10h16V9H4zm4-6h8v4H8V3z"/></svg>`,
      Eye: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/></svg>`,
      UsersThree: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
      Calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18v2H3V5zm0 4h18v12H3V9zm5-7v2h2V2H8zm6 0v2h2V2h-2z"/></svg>`,
      Profile: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/></svg>`
    };
    return icons[name] || '';
  }

  const sidebarItems = [
    { icon: 'Dashboard', label: 'Dashboard', route: '/dashboard', active: false },
    { icon: 'House',     label: 'School',    route: '/school', active: true },
    { icon: 'ChartLine', label: 'Level',     route: '/level', active: false },
    { icon: 'Briefcase', label: 'Homework',  route: '/homework', active: false },
    { icon: 'Eye',       label: 'Forum',     route: '/forum', active: false },
    { icon: 'UsersThree',label: 'Market',    route: '/market', active: false },
    { icon: 'Calendar',  label: 'Event',     route: '/event', active: false },
    { icon: 'Profile',   label: 'Profile',   route: '/profile', active: false }
  ];

  // Dropdown state
  let schoolOpen = false;
  let openLevel = -1;
  let selectedCategory = { level: -1, cat: -1 };

  // Levels structure
  const levels = [
    { name: 'D-Tier (Newbie Trader)', categories: ['Technical Basics','Fundamentals Basics','Liquidity Basics','Risk Management','Useful Websites & Tools','Homework & Tasks'] },
    { name: 'C-Tier (Trend Seeker)', categories: ['Technical Structures & Patterns','Fundamentals Deep Dive','Liquidity – Advanced Concepts','Funded Accounts Basic','Risk/Reward & Psychology','Homework & Practice'] },
    { name: 'B-Tier (Market Navigator)', categories: ['Price Action Advanced','Fundamentals – Indicators','Liquidity Pools & Execution','Personal Development','Books & Deep Dives','Homework – Case Studies'] },
    { name: 'A-Tier (Price Action Strategist)', categories: ['Macro Fundamentals','Advanced Risk Management','Strategy Development','Prop Trading & Funding','Elite Homework & Challenges','Leadership'] },
    { name: 'A++-Tier (Institutional Mind)', categories: ['Hedgefund & Institutional Insights','Automation & Tools','Market Making & Arbitrage','Leadership & Community Building','Research & Innovation','Personal Brand & Scaling'] }
  ];
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900" rel="stylesheet" />
</svelte:head>

<main class="relative flex min-h-screen bg-[#111518] font-sans" style="font-family:'Inter','Noto Sans',sans-serif;">
  <!-- Sidebar, hebt sich durch Border und Schatten ab -->
  <aside class="w-80 bg-[#1a1e24] border-r border-[#283139] p-4 shadow-lg">
    {#each sidebarItems as item}
      <a
        href={item.route}
        class="flex items-center gap-3 px-3 py-2 rounded-xl mb-2 hover:bg-[#283139] text-[#9cacba] transition-colors duration-200"
      >
        {@html getIcon(item.icon)}
        <span class="text-white">{item.label}</span>
      </a>
      {#if item.label === 'School'}
        <!-- School dropdown button -->
        <button
          on:click={() => schoolOpen = !schoolOpen}
          class="flex items-center justify-between w-full px-3 py-2 mb-2 rounded-xl hover:bg-[#283139] text-[#9cacba] transition-colors duration-200"
        >
          <span class="text-white">Tier</span>
          <span class="text-[#9cacba]">{schoolOpen ? '▼' : '▶'}</span>
        </button>
        {#if schoolOpen}
          <ul transition:slide class="ml-6 mb-4">
            {#each levels as lvl, i}
              <li class="mb-1">
                <button
                  on:click={() => { openLevel = openLevel === i ? -1 : i; selectedCategory = { level: i, cat: -1 }; }}
                  class="flex items-center justify-between w-full px-2 py-1 rounded-lg transition-colors duration-200 hover:bg-[#1b9aaa] text-[#9cacba] {openLevel === i ? 'bg-[#1b9aaa] text-white' : ''}"
                >
                  {lvl.name}
                  <span>{openLevel === i ? '▼' : '▶'}</span>
                </button>
                {#if openLevel === i}
                  <ul transition:slide class="ml-4 mt-1">
                    {#each lvl.categories as cat, j}
                      <li>
                        <button
                          on:click={() => selectedCategory = { level: i, cat: j }}
                          class="block w-full text-left px-2 py-1 rounded-lg transition-colors duration-200 hover:bg-[#1b9aaa] text-[#9cacba] {selectedCategory.level === i && selectedCategory.cat === j ? 'bg-[#2094f3] text-white' : ''}"
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
        {/if}
      {/if}
    {/each}
  </aside>

  <!-- Main area -->
  <div class="flex-1 flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between border-b border-[#283139] px-10 py-3 text-white">
      <div class="flex items-center gap-4">
        <svg viewBox="0 0 48 48" class="w-8 h-8 text-current"><path d="M42.43 44..."/></svg>
        <h2 class="text-white text-lg font-bold">PriceActionTalk</h2>
      </div>
      <div class="flex flex-1 justify-end items-center gap-4">
        <input type="text" placeholder="Search" bind:value={search}
               class="form-input bg-[#283139] text-white placeholder-[#9cacba] rounded-xl px-4 py-2 focus:outline-none transition duration-200" />
        <a href="/create" class="bg-[#2094f3] text-white px-4 py-2 rounded-xl transition duration-200 hover:bg-[#3aa0ff]">Create</a>
        <a href="/notifications" class="bg-[#283139] p-2 rounded-xl text-white transition duration-200 hover:bg-[#3b4954]"><svg width="20" height="20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v4H3l2 2v1h14v-1l2-2h-1V8a6 6 0 00-6-6z"/></svg></a>
        <a href="/profile" class="w-10 h-10 rounded-full bg-cover bg-center transition duration-200 hover:ring-2 hover:ring-[#2094f3]" style="background-image:url('/avatar.png')"></a>
      </div>
    </header>

    <!-- Content -->
    <section class="p-8 overflow-auto flex-1 text-white">
      {#if selectedCategory.cat < 0}
        <p>Select a tier and category to view content.</p>
      {:else}
        <h1 class="text-2xl font-bold mb-2">{levels[selectedCategory.level].name}</h1>
        <h2 class="text-xl text-[#7cfc00] mb-4">{levels[selectedCategory.level].categories[selectedCategory.cat]}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div class="bg-[#162635] p-6 rounded-xl hover:bg-[#1b9aaa] transition duration-200">Content for {levels[selectedCategory.level].categories[selectedCategory.cat]}</div>
        </div>
      {/if}
    </section>
  </div>
</main>


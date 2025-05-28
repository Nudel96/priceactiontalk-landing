<script lang="ts">
  import { slide } from 'svelte/transition';
  let search = '';

  function getIcon(name: string): string {
    const icons: Record<string,string> = {
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
    { icon:'House', label:'School',route:'/school' },
    { icon:'ChartLine',label:'Level',route:'/level' },
    { icon:'Briefcase',label:'Homework',route:'/homework' },
    { icon:'Eye',label:'Forum',route:'/forum' },
    { icon:'UsersThree',label:'Market',route:'/market' },
    { icon:'Calendar',label:'Event',route:'/event' },
    { icon:'Profile',label:'Profile',route:'/profile' }
  ];

  let currentLevel=1;
  let tasks=Array.from({length:23},(_,i)=>({title:`Read the ${101+i} guide`,completed:i<6}));
  $:completedCount=tasks.filter(t=>t.completed).length;
  $:percentComplete=Math.round(completedCount/tasks.length*100);
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css?family=Inter:400,500,700,900&family=Noto+Sans:400,500,700,900&display=swap" rel="stylesheet" />
</svelte:head>

<main class="flex min-h-screen font-sans" style="font-family:'Inter','Noto Sans',sans-serif;">
  <!-- Sidebar -->
  <aside class="w-80 bg-[#1a1e24] border-r border-[#283139] p-4 shadow-lg">
    {#each sidebarItems as item}
      <a href={item.route} class="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl hover:bg-[#283139] text-[#9cacba] transition duration-200">
        {@html getIcon(item.icon)}
        <span class="text-white">{item.label}</span>
      </a>
    {/each}
  </aside>

  <div class="flex-1 flex flex-col bg-[#111518]">
    <!-- Header -->
    <header class="flex items-center justify-between px-10 py-3 border-b border-[#283139] text-white">
      <div class="flex items-center gap-4">
        <svg viewBox="0 0 48 48" class="w-8 h-8"><path fill="#fff" d="M42.43 44..."/></svg>
        <h2 class="text-lg font-bold">PriceActionTalk</h2>
      </div>
      <div class="flex items-center gap-4">        
        <input type="text" placeholder="Search" bind:value={search} class="bg-[#283139] px-4 py-2 rounded-xl text-white placeholder-[#9cacba] focus:outline-none transition duration-200" />
        <a href="/create" class="bg-[#2094f3] px-4 py-2 rounded-xl text-white transition duration-200 hover:bg-[#3aa0ff]">Create</a>
        <a href="/notifications" class="bg-[#283139] p-2 rounded-xl text-white transition duration-200 hover:bg-[#3b4954]"><svg width="20" height="20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v4H3l2 2v1h14v-1l2-2h-1V8a6 6 0 00-6-6z"/></svg></a>
        <a href="/profile" class="w-10 h-10 rounded-full bg-cover bg-center transition duration-200 hover:ring-2 hover:ring-[#2094f3]" style="background-image:url('/avatar.png')"></a>
      </div>
    </header>

    <!-- Level Content -->
    <section class="p-6 flex-1 overflow-auto">
      <h1 class="text-2xl font-bold text-white mb-2">Level up your trading</h1>
      <p class="text-[#9cacba] mb-4">You're currently at level {currentLevel}. Reach level {currentLevel + 1} by completing more tasks and achievements.</p>

      <div class="mb-6">
        <div class="w-full bg-[#283139] h-4 rounded-full overflow-hidden">
          <div class="h-full bg-[#2094f3]" style="width:{percentComplete}%"></div>
        </div>
        <p class="text-[#9cacba] text-sm mt-1">{percentComplete}% complete</p>
      </div>

      <div class="grid grid-cols-5 gap-4">
        {#each tasks as task}
          <div class="flex items-center justify-center h-20 bg-[#162635] rounded-xl cursor-pointer hover:bg-[#1e2a3a] transition duration-200">
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
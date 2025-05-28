<script lang="ts">
  import { onMount } from 'svelte';

  // Search field
  let search = '';

  // SVG icons for sidebar
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

  // Sidebar items, marking 'Profile' active
  const sidebarItems = [
    { icon: 'House', label: 'School', route: '/school', active: false },
    { icon: 'ChartLine', label: 'Level', route: '/level', active: false },
    { icon: 'Briefcase', label: 'Homework', route: '/homework', active: false },
    { icon: 'Eye', label: 'Forum', route: '/forum', active: false },
    { icon: 'UsersThree', label: 'Market', route: '/market', active: false },
    { icon: 'Calendar', label: 'Event', route: '/event', active: false },
    { icon: 'Question', label: 'Support', route: '/support', active: false },
    { icon: 'ChartLine', label: 'Profile', route: '/profile', active: true }
  ];

  // Profile data
  let avatarUrl = '/default-avatar.png';
  let avatarFile: File | null = null;
  let displayName = '';
  let bio = '';
  let location = '';
  let pronouns = '';
  let tags = '';
  let links = '';

  // XP and level (dummy)
  let xp = 700;
  let xpForNext = 1000;
  let level = 3;
  $: xpPercent = Math.round((xp / xpForNext) * 100);

  // Fetch initial profile on mount (dummy)
  onMount(async () => {
    // Dummy fetch
    const data = await Promise.resolve({
      displayName: 'Trader Joe',
      bio: 'Price action enthusiast.',
      location: 'Berlin',
      pronouns: 'He/Him',
      tags: 'trading,forex,crypto',
      links: 'https://twitter.com/traderjoe'
    });
    ({ displayName, bio, location, pronouns, tags, links } = data);
  });

  // Change avatar
  function onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      avatarFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => avatarUrl = e.target!.result as string;
      reader.readAsDataURL(avatarFile);
    }
  }

  // Save profile (dummy)
  async function saveProfile() {
    const payload = { displayName, bio, location, pronouns, tags, links };
    await fetch('/api/profile', { method: 'POST', body: JSON.stringify(payload) });
    alert('Profile saved (dummy)!');
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900" rel="stylesheet" />
</svelte:head>

<main class="relative flex min-h-screen bg-[#111518] font-sans" style="font-family:'Inter','Noto Sans',sans-serif;">
  <!-- Sidebar -->
  <aside class="w-80 bg-[#111518] p-4">
    {#each sidebarItems as item}
      <a href={item.route}
         class="flex items-center gap-3 px-3 py-2 rounded-xl mb-2 transition-colors {item.active ? 'bg-[#283139]' : 'hover:bg-[#283139]'}">
        {@html getIcon(item.icon)}
        <span class="text-white">{item.label}</span>
      </a>
    {/each}
  </aside>

  <div class="flex-1 flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between border-b border-[#283139] px-10 py-3">
      <div class="flex items-center gap-4 text-white">
        <svg viewBox="0 0 48 48" class="w-8 h-8 text-current"><path d="M42.4379 44..."/></svg>
        <h2 class="text-white text-lg font-bold">PriceActionTalk</h2>
      </div>
      <div class="flex flex-1 justify-end items-center gap-4">
        <input type="text" placeholder="Search" bind:value={search}
               class="form-input bg-[#283139] text-white placeholder-[#9cacba] rounded-xl px-4 py-2 focus:outline-none" />
        <button class="bg-[#2094f3] text-white px-4 py-2 rounded-xl">Create</button>
        <div class="w-10 h-10 rounded-full bg-cover bg-center" style="background-image:url('/avatar.png')"></div>
      </div>
    </header>

    <!-- Profile Form -->
    <section class="p-8 overflow-auto flex-1">
      <h1 class="text-3xl font-bold text-white mb-2">Your profile</h1>
      <p class="text-[#9cacba] mb-6">How you appear to others in the community</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Avatar Upload -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">Upload a photo</label>
          <div class="w-32 h-32 rounded-full bg-gray-800 overflow-hidden">
            <img src={avatarUrl} alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <input type="file" accept="image/*" on:change={onAvatarChange}
                 class="mt-2 text-sm text-gray-300" />
        </div>

        <!-- Display Name -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">Display name</label>
          <input type="text" bind:value={displayName} placeholder="Your name"
                 class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white" />
        </div>
      </div>

      <!-- XP bar -->
      <div class="mt-8">
        <label class="block text-sm font-medium text-white mb-1">XP</label>
        <div class="w-full bg-[#283139] rounded-full h-4">
          <div class="h-4 rounded-full bg-[#2094f3]" style="width:{xpPercent}%"></div>
        </div>
        <div class="flex justify-between text-[#9cacba] text-xs mt-1">
          <span>Level {level}</span>
          <span>{xp}/{xpForNext}</span>
        </div>
      </div>

      <!-- Profile Fields -->
      <div class="mt-8 space-y-6 max-w-xl">
        <div>
          <label class="block text-sm font-medium text-white mb-1">Bio</label>
          <textarea bind:value={bio} rows={3} placeholder="Write a few sentences about yourself"
                    class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Location</label>
          <input type="text" bind:value={location} placeholder="Where you're based"
                 class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white" />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Pronouns</label>
          <input type="text" bind:value={pronouns} placeholder="She/her, he/him, they/them"
                 class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white" />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Tags</label>
          <input type="text" bind:value={tags} placeholder="Add some tags, comma-separated"
                 class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white" />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Links</label>
          <input type="text" bind:value={links} placeholder="Add your Twitter, GitHub, website"
                 class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white" />
        </div>
      </div>

      <button on:click={saveProfile} class="mt-6 px-6 py-2 bg-[#2094f3] rounded-lg hover:bg-blue-500 text-white">
        Save profile
      </button>
    </section>
  </div>
</main>
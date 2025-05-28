<script lang="ts">
  import { onMount } from 'svelte';
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
    { icon:'House', label:'School', route:'/school' },
    { icon:'ChartLine', label:'Level', route:'/level' },
    { icon:'Briefcase', label:'Homework', route:'/homework' },
    { icon:'Eye', label:'Forum', route:'/forum' },
    { icon:'UsersThree', label:'Market', route:'/market' },
    { icon:'Calendar', label:'Event', route:'/event' },
    { icon:'Profile', label:'Profile', route:'/profile' }
  ];

  let avatarUrl = '/default-avatar.png';
  let avatarFile: File | null = null;
  let displayName = '';
  let bio = '';
  let location = '';
  let pronouns = '';
  let tags = '';
  let links = '';

  let xp = 700;
  let xpForNext = 1000;
  let level = 3;
  $: xpPercent = Math.round((xp / xpForNext) * 100);

  onMount(async () => {
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

  function onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      avatarFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => avatarUrl = e.target!.result as string;
      reader.readAsDataURL(avatarFile);
    }
  }

  async function saveProfile() {
    const payload = { displayName, bio, location, pronouns, tags, links };
    await fetch('/api/profile', { method: 'POST', body: JSON.stringify(payload) });
    alert('Profile saved (dummy)!');
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link href="https://fonts.googleapis.com/css?family=Inter:400,500,700,900&family=Noto+Sans:400,500,700,900&display=swap" rel="stylesheet" />
</svelte:head>

<main class="flex min-h-screen font-sans" style="font-family:'Inter','Noto Sans',sans-serif;">
  <aside class="w-80 bg-[#1a1e24] border-r border-[#283139] p-4 shadow-lg">
    {#each sidebarItems as item}
      <a href={item.route} class="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl hover:bg-[#283139] text-[#9cacba] transition duration-200">
        {@html getIcon(item.icon)}
        <span class="text-white">{item.label}</span>
      </a>
    {/each}
  </aside>

  <div class="flex-1 flex flex-col bg-[#111518]">
    <header class="flex items-center justify-between px-10 py-3 border-b border-[#283139] text-white">
      <div class="flex items-center gap-4">
        <svg viewBox="0 0 48 48" class="w-8 h-8 text-white"><path d="M42.43 44..."/></svg>
        <h2 class="text-lg font-bold">PriceActionTalk</h2>
      </div>
      <div class="flex items-center gap-4">
        <input type="text" placeholder="Search" bind:value={search} class="bg-[#283139] px-4 py-2 rounded-xl text-white placeholder-[#9cacba] focus:outline-none transition duration-200" />
        <a href="/create" class="bg-[#2094f3] px-4 py-2 rounded-xl text-white transition duration-200 hover:bg-[#3aa0ff]">Create</a>
        <a href="/notifications" class="bg-[#283139] p-2 rounded-xl text-white transition duration-200 hover:bg-[#3b4954]"><svg width="20" height="20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v4H3l2 2v1h14v-1l2-2h-1V8a6 6 0 00-6-6z"/></svg></a>
        <div class="w-10 h-10 rounded-full bg-cover bg-center transition duration-200 hover:ring-2 hover:ring-[#2094f3]" style="background-image:url('/avatar.png')"></div>
      </div>
    </header>

    <section class="p-8 overflow-auto flex-1 text-white">
      <h1 class="text-3xl font-bold mb-2">Your profile</h1>
      <p class="text-[#9cacba] mb-6">How you appear to others in the community</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">        
        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">Upload a photo</label>
          <div class="w-32 h-32 rounded-full bg-gray-800 overflow-hidden">
            <img src={avatarUrl} alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <input type="file" accept="image/*" on:change={onAvatarChange} class="mt-2 text-sm text-gray-300" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">Display name</label>
          <input type="text" bind:value={displayName} placeholder="Your name" class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white" />
        </div>
      </div>

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

      <div class="mt-8 space-y-6 max-w-xl">
        <div>
          <label class="block text-sm font-medium text-white mb-1">Bio</label>
          <textarea bind:value={bio} rows={3} placeholder="Write a few sentences about yourself" class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Location</label>
          <input type="text" bind:value={location} placeholder="Where you're based" class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white" />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Pronouns</label>
          <input type="text" bind:value={pronouns} placeholder="She/her, he/him, they/them" class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white" />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Tags</label>
          <input type="text" bind:value={tags} placeholder="Add some tags, comma-separated" class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white" />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Links</label>
          <input type="text" bind:value={links} placeholder="Add your Twitter, GitHub, website" class="w-full px-4 py-2 bg-[#283139] rounded-lg focus:outline-none text-white" />
        </div>
      </div>

      <button on:click={saveProfile} class="mt-6 px-6 py-2 bg-[#2094f3] rounded-lg hover:bg-blue-500 text-white">Save profile</button>
    </section>
  </div>
</main>

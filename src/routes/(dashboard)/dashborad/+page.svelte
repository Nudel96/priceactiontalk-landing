// ✅ Datei: src/routes/dashboard/+page.svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let token = '';

  onMount(() => {
    token = localStorage.getItem('token') ?? '';
    if (!token) {
      goto('/login');
    }
    // Optional: Du kannst hier eine API aufrufen, um den Token serverseitig zu prüfen
  });
</script>

<div class="p-8 max-w-xl mx-auto">
  <h1 class="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
  <p class="mb-4">You are now logged in.</p>
  <button class="bg-[#1b9aaa] text-white p-2 rounded" on:click={() => { localStorage.removeItem('token'); goto('/login'); }}>
    Logout
  </button>
</div>

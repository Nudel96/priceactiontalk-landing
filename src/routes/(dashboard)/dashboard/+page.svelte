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

// ✅ Datei: src/routes/dashboard/+page.svelte
<div class="mx-auto max-w-xl p-8">
	<h1 class="mb-4 text-2xl font-bold">Welcome to your Dashboard</h1>
	<p class="mb-4">You are now logged in.</p>
	<button
		class="rounded bg-[#1b9aaa] p-2 text-white"
		on:click={() => {
			localStorage.removeItem('token');
			goto('/login');
		}}>
		Logout
	</button>
</div>

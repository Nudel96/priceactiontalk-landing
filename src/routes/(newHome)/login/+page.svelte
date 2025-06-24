<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { Eye, EyeOff, ArrowRight } from '@lucide/svelte';

	import { login } from '$lib/stores/authStore';

	// Svelte 5 State-Variablen mit Runen
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let isLoading = $state(false);
	let error = $state('');

	async function handleSubmit() {
		error = '';
		isLoading = true;
		try {
			await login(email, password);
			goto('/'); // Bei Erfolg zur Startseite navigieren
		} catch (err) {
			error = err instanceof Error ? err.message : 'Authentication failed';
		} finally {
			isLoading = false;
		}
	}
</script>

<main class="flex flex-grow items-center justify-center px-4 py-10">
	<div
		in:fly={{ y: 20, duration: 400 }}
		class="w-150 max-w-md rounded-lg bg-white p-6 shadow-lg md:p-8">
		<h1 class="text-navy mb-2 text-2xl font-bold">Welcome back</h1>
		<p class="text-graphite/80 mb-6">Sign in to access your PriceActionTalk account</p>

		{#if error}
			<div class="mb-6 rounded-md bg-red-50 px-4 py-3 text-red-700">
				{error}
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<label for="email" class="text-graphite mb-1 block text-sm font-medium">
					Email Address
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					class="focus:ring-teal w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-1"
					placeholder="your.email@example.com"
					required />
			</div>

			<div>
				<label for="password" class="text-graphite mb-1 block text-sm font-medium">Password</label>
				<div class="relative">
					<input
						id="password"
						type={showPassword ? 'text' : 'password'}
						bind:value={password}
						class="focus:ring-teal w-full rounded-md border border-gray-200 px-4 py-2 focus:outline-none focus:ring-1"
						placeholder="••••••••"
						required />
					<button
						type="button"
						onclick={() => (showPassword = !showPassword)}
						class="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600 cursor-pointer"
						aria-label={showPassword ? 'Hide password' : 'Show password'}>
						{#if showPassword}
							<EyeOff size={18} />
						{:else}
							<Eye size={18} />
						{/if}
					</button>
				</div>
			</div>

			<div class="flex justify-end">
				<a href="/forgot-password" class="text-teal text-sm hover:underline">Forgot password?</a>
			</div>

			<button
				type="submit"
				class="btn bg-teal flex w-full items-center justify-center rounded-md px-4 py-2.5 font-bold text-white transition-colors hover:bg-teal-600 disabled:bg-teal-300 cursor-pointer"
				disabled={isLoading}>
				{#if isLoading}
					<span>Loading...</span>
				{:else}
					<span class="flex items-center justify-center">
						Sign In
						<ArrowRight size={18} class="ml-1" />
					</span>
				{/if}
			</button>
		</form>

		<div class="mt-6 text-center">
			<p class="text-graphite/80">
				Don't have an account?
				<a href="/register" class="text-teal font-medium hover:underline">Sign up</a>
			</p>
		</div>
	</div>
</main>

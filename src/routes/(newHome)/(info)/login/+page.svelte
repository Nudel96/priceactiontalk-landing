<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { Eye, EyeOff, ArrowRight } from '@lucide/svelte';
	import Logo from '$lib/components/Logo.svelte';

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

		// Login akzeptiert beliebige Daten und leitet zum Dashboard weiter
		await login(email, password);
		goto('/dashboard');

		isLoading = false;
	}
</script>

<main class="flex flex-grow items-center justify-center px-4 py-10">
	<div
		in:fly={{ y: 20, duration: 400 }}
		class="shadow-card text-gray-100 w-full max-w-md rounded-xl bg-gray-800 p-8 ring-1 ring-gray-700 transition-colors duration-200">
		<Logo class="mx-auto mb-6 h-12 w-auto" />
		<h1 class="mb-2 text-3xl font-bold">Welcome back</h1>
		<p class="mb-6 text-sm text-gray-300">Sign in to access your PriceActionTalk account</p>

		{#if error}
			<div class="mb-6 rounded-md bg-red-900/20 px-4 py-3 text-red-300">
				{error}
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-gray-300">
					Email Address
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					class="focus:border-teal focus:ring-teal w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none transition-colors duration-200"
					placeholder="your.email@example.com"
					required />
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-gray-300">Password</label>
				<div class="relative">
					<input
						id="password"
						type={showPassword ? 'text' : 'password'}
						bind:value={password}
						class="focus:border-teal focus:ring-teal w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none transition-colors duration-200"
						placeholder="••••••••"
						required />
					<button
						type="button"
						onclick={() => (showPassword = !showPassword)}
						class="hover:text-teal absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-400"
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
				class="btn bg-teal flex w-full cursor-pointer items-center justify-center rounded-md px-4 py-2.5 font-bold text-white transition-colors hover:bg-teal-600 disabled:bg-teal-300"
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

		<div class="mt-6 text-center text-gray-300">
			<p>
				Don't have an account?
				<a href="/register" class="text-teal font-medium hover:underline">Sign up</a>
			</p>
		</div>
	</div>
</main>



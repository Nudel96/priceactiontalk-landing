<script lang="ts">
	import { X, Upload, Eye, EyeOff } from '@lucide/svelte';

	export let showModal = false;
	export let user = {
		username: '',
		email: '',
		country: '',
		avatar: null
	};

	let editForm = { ...user };
	let showCurrentPassword = false;
	let showNewPassword = false;
	let showConfirmPassword = false;
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';

	const countries = [
		'United States', 'United Kingdom', 'Germany', 'France', 'Canada', 
		'Australia', 'Japan', 'South Korea', 'Singapore', 'Switzerland',
		'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Austria'
	];

	const handleSave = () => {
		// Validate passwords if changing
		if (newPassword && newPassword !== confirmPassword) {
			alert('New passwords do not match');
			return;
		}

		// Save logic would go here
		console.log('Saving profile:', editForm);
		if (newPassword) {
			console.log('Changing password');
		}

		// Update user object
		Object.assign(user, editForm);
		
		// Reset form
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
		showModal = false;
	};

	const handleCancel = () => {
		// Reset form to original values
		editForm = { ...user };
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
		showModal = false;
	};

	const handleAvatarUpload = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			// In a real app, you would upload the file to a server
			const reader = new FileReader();
			reader.onload = (e) => {
				editForm.avatar = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	};
</script>

{#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-xl font-semibold text-navy">Edit Profile</h3>
				<button on:click={handleCancel} class="text-gray-400 hover:text-gray-600">
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="space-y-6">
				<!-- Avatar Upload -->
				<div class="text-center">
					<div class="relative inline-block">
						<div class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4">
							{#if editForm.avatar}
								<img src={editForm.avatar} alt="Avatar" class="w-full h-full object-cover" />
							{:else}
								<div class="w-full h-full flex items-center justify-center text-gray-400">
									<span class="text-2xl font-bold">{editForm.username.charAt(0).toUpperCase()}</span>
								</div>
							{/if}
						</div>
						<label class="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700 transition-colors">
							<Upload class="w-4 h-4" />
							<input type="file" accept="image/*" class="hidden" on:change={handleAvatarUpload} />
						</label>
					</div>
					<p class="text-sm text-gray-600">Click to upload new profile picture</p>
				</div>

				<!-- Basic Information -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
						<input
							id="username"
							type="text"
							bind:value={editForm.username}
							class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
						/>
					</div>

					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
						<input
							id="email"
							type="email"
							bind:value={editForm.email}
							class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
						/>
					</div>

					<div class="md:col-span-2">
						<label for="country" class="block text-sm font-medium text-gray-700 mb-2">Country</label>
						<select
							id="country"
							bind:value={editForm.country}
							class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
							<option value="">Select country</option>
							{#each countries as country}
								<option value={country}>{country}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Password Change Section -->
				<div class="border-t border-gray-200 pt-6">
					<h4 class="text-lg font-semibold text-navy mb-4">Change Password</h4>
					<div class="space-y-4">
						<div>
							<label for="current-password" class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
							<div class="relative">
								<input
									id="current-password"
									type={showCurrentPassword ? 'text' : 'password'}
									bind:value={currentPassword}
									placeholder="Enter current password"
									class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
								/>
								<button
									type="button"
									class="absolute inset-y-0 right-0 pr-3 flex items-center"
									on:click={() => showCurrentPassword = !showCurrentPassword}>
									{#if showCurrentPassword}
										<EyeOff class="w-5 h-5 text-gray-400" />
									{:else}
										<Eye class="w-5 h-5 text-gray-400" />
									{/if}
								</button>
							</div>
						</div>

						<div>
							<label for="new-password" class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
							<div class="relative">
								<input
									id="new-password"
									type={showNewPassword ? 'text' : 'password'}
									bind:value={newPassword}
									placeholder="Enter new password"
									class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
								/>
								<button
									type="button"
									class="absolute inset-y-0 right-0 pr-3 flex items-center"
									on:click={() => showNewPassword = !showNewPassword}>
									{#if showNewPassword}
										<EyeOff class="w-5 h-5 text-gray-400" />
									{:else}
										<Eye class="w-5 h-5 text-gray-400" />
									{/if}
								</button>
							</div>
						</div>

						<div>
							<label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
							<div class="relative">
								<input
									id="confirm-password"
									type={showConfirmPassword ? 'text' : 'password'}
									bind:value={confirmPassword}
									placeholder="Confirm new password"
									class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
								/>
								<button
									type="button"
									class="absolute inset-y-0 right-0 pr-3 flex items-center"
									on:click={() => showConfirmPassword = !showConfirmPassword}>
									{#if showConfirmPassword}
										<EyeOff class="w-5 h-5 text-gray-400" />
									{:else}
										<Eye class="w-5 h-5 text-gray-400" />
									{/if}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-3 mt-8">
				<button
					on:click={handleCancel}
					class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
					Cancel
				</button>
				<button
					on:click={handleSave}
					class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
					Save Changes
				</button>
			</div>
		</div>
	</div>
{/if}

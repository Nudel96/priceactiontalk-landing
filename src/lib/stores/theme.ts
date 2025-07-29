import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

// Create the theme store
function createThemeStore() {
	// Default to dark theme, but will be overridden by localStorage or system preference
	const { subscribe, set, update } = writable<Theme>('dark');

	return {
		subscribe,
		set,
		update,
		// Toggle between light and dark
		toggle: () => update(theme => theme === 'light' ? 'dark' : 'light'),
		// Set to light mode
		setLight: () => set('light'),
		// Set to dark mode
		setDark: () => set('dark'),
		// Initialize theme from localStorage or system preference
		init: () => {
			if (!browser) return;

			// Check what theme is already applied (from app.html script)
			const hasLightClass = !document.documentElement.classList.contains('dark');
			const currentTheme = hasLightClass ? 'light' : 'dark';

			// Sync the store with the already-applied theme
			set(currentTheme);

			// Ensure localStorage is in sync
			const stored = localStorage.getItem('theme');
			if (stored !== currentTheme) {
				localStorage.setItem('theme', currentTheme);
			}
		}
	};
}

export const theme = createThemeStore();

// Apply theme to document
export function applyTheme(newTheme: Theme) {
	if (!browser) return;

	const html = document.documentElement;
	const body = document.body;

	// Force remove any existing theme classes
	html.classList.remove('dark', 'light');

	if (newTheme === 'dark') {
		html.classList.add('dark');
		// Force body styling for immediate effect
		body.style.backgroundColor = '#111827'; // gray-900
		body.style.color = '#f9fafb'; // gray-50
	} else {
		// Force light mode styling
		body.style.backgroundColor = '#f9fafb'; // gray-50
		body.style.color = '#111827'; // gray-900
	}

	// Store in localStorage
	localStorage.setItem('theme', newTheme);

	// Force a repaint
	html.style.display = 'none';
	html.offsetHeight; // Trigger reflow
	html.style.display = '';
}

// Subscribe to theme changes and apply them
if (browser) {
	theme.subscribe(newTheme => {
		applyTheme(newTheme);
	});
}

// Listen for system theme changes
if (browser) {
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	mediaQuery.addEventListener('change', (e) => {
		// Only update if user hasn't manually set a preference
		const stored = localStorage.getItem('theme');
		if (!stored) {
			const systemTheme = e.matches ? 'dark' : 'light';
			theme.set(systemTheme);
		}
	});
}

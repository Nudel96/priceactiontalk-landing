// src/lib/stores/authStore.ts

import { writable } from 'svelte/store';

// Ein einfacher schreibbarer Store, um den Benutzerstatus zu halten.
// In einer echten App würde dieser z.B. das Benutzerobjekt oder null enthalten.
export const user = writable<string | null>(null);

/**
 * Simuliert einen Login-API-Aufruf.
 * Wirft einen Fehler bei ungültigen Anmeldeinformationen.
 * @param email - Die E-Mail des Benutzers.
 * @param password - Das Passwort des Benutzers.
 */
export async function login(email: string, _password: string): Promise<void> {
	// Simuliert eine Netzwerkverzögerung
	await new Promise((resolve) => setTimeout(resolve, 500));

	// In dieser vereinfachten Version akzeptieren wir beliebige Anmeldedaten
	// und setzen den Benutzer einfach auf die angegebene E-Mail-Adresse.
	user.set(email);
	console.log('Login successful');
}

/**
 * Simuliert einen Registrierungs-API-Aufruf.
 * Wirft einen Fehler, wenn die E-Mail bereits vergeben ist.
 * @param email - Die E-Mail des Benutzers.
 * @param password - Das Passwort des Benutzers.
 * @param username - Der Benutzername.
 */
export async function register(email: string, password: string, username: string): Promise<void> {
	// Simuliert eine Netzwerkverzögerung
	await new Promise((resolve) => setTimeout(resolve, 1000));

	if (email === 'taken@example.com') {
		throw new Error('This email address is already taken.');
	}

	if (password.length < 8) {
		throw new Error('Password must be at least 8 characters long.');
	}

	// Bei Erfolg den Benutzer direkt einloggen
	user.set(email);
	console.log('Registration successful for:', username);
}

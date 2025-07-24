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
export async function login(email: string, _password?: string): Promise<void> {
	// Simuliert eine Netzwerkverzögerung
	await new Promise((resolve) => setTimeout(resolve, 500));

	void _password;

	// Placeholder-Authentifizierung: akzeptiere beliebige Daten
	// und setze den Benutzer einfach auf die angegebene E-Mail-Adresse.
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
export async function register(email: string, _password?: string, username: string): Promise<void> {
	// Simuliert eine Netzwerkverzögerung
	await new Promise((resolve) => setTimeout(resolve, 1000));

	void _password;

	// Keine Validierung in der Platzhalter-Version
	// Bei Erfolg den Benutzer direkt einloggen
	user.set(email);
	console.log('Registration successful for:', username);
}

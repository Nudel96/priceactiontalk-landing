import { json } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';
import path from 'path';

// Datenbankverbindung
const dbPath = path.join(process.cwd(), 'economic_data.db');
let db;

try {
	db = new Database(dbPath);
	
	// Erstelle Tabelle falls sie nicht existiert
	db.exec(`
		CREATE TABLE IF NOT EXISTS economic_events (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			source TEXT NOT NULL,
			event_name TEXT NOT NULL,
			date TEXT NOT NULL,
			data TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`);
	
	console.log('✅ SQLite Datenbank verbunden:', dbPath);
} catch (error) {
	console.error('❌ Fehler beim Verbinden mit SQLite:', error);
}

// Rate limiting removed for development - immediate API testing enabled

/**
 * Hilfsfunktion zum Speichern der Daten in SQLite
 */
function saveData(source, eventName, date, data) {
	try {
		const stmt = db.prepare(`
			INSERT INTO economic_events (source, event_name, date, data)
			VALUES (?, ?, ?, ?)
		`);
		
		const result = stmt.run(source, eventName, date, JSON.stringify(data));
		console.log(`✅ Daten gespeichert: ${source} - ${eventName} (ID: ${result.lastInsertRowid})`);
		return result;
	} catch (error) {
		console.error(`❌ Fehler beim Speichern (${source}):`, error);
		throw error;
	}
}

/**
 * Finnhub API - Allgemeine Wirtschaftsnachrichten
 */
async function fetchFinnhubData() {
	const apiKey = env.FINNHUB_API_KEY;
	if (!apiKey || apiKey === 'your_finnhub_api_key_here') {
		throw new Error('FINNHUB_API_KEY nicht konfiguriert. Bitte echten API-Key in .env eintragen.');
	}

	const url = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`;
	
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Finnhub API Fehler: ${response.status} ${response.statusText}`);
		}
		
		const data = await response.json();
		
		// Speichere die ersten 10 Nachrichten (um Datenmenge zu begrenzen)
		const limitedData = data.slice(0, 10);
		
		saveData(
			'FINNHUB',
			'general_news',
			new Date().toISOString(),
			limitedData
		);
		
		return { success: true, count: limitedData.length };
	} catch (error) {
		console.error('❌ Finnhub Fehler:', error);
		throw error;
	}
}

/**
 * FRED API - Inflationsdaten (CPI)
 */
async function fetchFREDData() {
	const apiKey = env.FRED_API_KEY;
	if (!apiKey || apiKey === 'your_fred_api_key_here') {
		throw new Error('FRED_API_KEY nicht konfiguriert. Bitte echten API-Key in .env eintragen.');
	}

	const url = `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${apiKey}&file_type=json&limit=12&sort_order=desc`;
	
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`FRED API Fehler: ${response.status} ${response.statusText}`);
		}
		
		const data = await response.json();
		
		saveData(
			'FRED',
			'CPIAUCSL',
			new Date().toISOString(),
			data
		);
		
		return { success: true, count: data.observations?.length || 0 };
	} catch (error) {
		console.error('❌ FRED Fehler:', error);
		throw error;
	}
}

/**
 * MarketAux API - Zentralbank und Währungsdaten
 */
async function fetchMarketAuxData() {
	const apiKey = env.MARKETAUX_API_KEY;
	if (!apiKey || apiKey === 'your_marketaux_api_key_here') {
		throw new Error('MARKETAUX_API_KEY nicht konfiguriert. Bitte echten API-Key in .env eintragen.');
	}

	const url = `https://api.marketaux.com/v1/news/all?symbols=ECB,USD,GBP,JPY&filter_entities=true&language=en&api_token=${apiKey}&limit=20`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`MarketAux API Fehler: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		saveData(
			'MARKETAUX',
			'currency_news',
			new Date().toISOString(),
			data
		);

		return { success: true, count: data.data?.length || 0 };
	} catch (error) {
		console.error('❌ MarketAux Fehler:', error);
		throw error;
	}
}

/**
 * FCS API - Zusätzliche Währungsdaten (Optional)
 */
async function fetchFCSData() {
	const apiKey = env.FCS_API_KEY;
	if (!apiKey || apiKey === 'your_fcs_api_key_here') {
		console.log('ℹ️ FCS API nicht konfiguriert - überspringe');
		return { success: true, count: 0, skipped: true };
	}

	// FCS API für Währungskurse
	const url = `https://fcsapi.com/api-v3/forex/latest?symbol=EUR/USD,GBP/USD,USD/JPY,AUD/USD,USD/CAD,USD/CHF,USD/CNY,NZD/USD&access_key=${apiKey}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`FCS API Fehler: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (data.status && data.response) {
			saveData(
				'FCS',
				'currency_rates',
				new Date().toISOString(),
				data
			);

			return { success: true, count: data.response?.length || 0 };
		} else {
			throw new Error('FCS API: Unerwartete Antwortstruktur');
		}
	} catch (error) {
		console.error('❌ FCS Fehler:', error);
		throw error;
	}
}

// Rate limiting function removed - immediate API access enabled

/**
 * GET Handler - Führt alle API-Abfragen aus
 */
export async function GET() {
	try {
		console.log('🚀 Starte API-Datenabfrage...');
		
		const results = {
			finnhub: null,
			fred: null,
			marketaux: null,
			fcs: null,
			errors: []
		};

		// Finnhub Daten abrufen
		try {
			results.finnhub = await fetchFinnhubData();
		} catch (error) {
			results.errors.push(`Finnhub: ${error.message}`);
		}

		// FRED Daten abrufen
		try {
			results.fred = await fetchFREDData();
		} catch (error) {
			results.errors.push(`FRED: ${error.message}`);
		}

		// MarketAux Daten abrufen
		try {
			results.marketaux = await fetchMarketAuxData();
		} catch (error) {
			results.errors.push(`MarketAux: ${error.message}`);
		}

		// FCS Daten abrufen (optional)
		try {
			results.fcs = await fetchFCSData();
		} catch (error) {
			results.errors.push(`FCS: ${error.message}`);
		}

		// Count successful API calls
		const successCount = [results.finnhub, results.fred, results.marketaux, results.fcs].filter(r => r?.success).length;

		// Response erstellen
		if (results.errors.length === 0) {
			return json({
				success: true,
				message: '🎉 APIs erfolgreich geladen & gespeichert!',
				results: {
					finnhub: results.finnhub,
					fred: results.fred,
					marketaux: results.marketaux,
					fcs: results.fcs
				},
				timestamp: new Date().toISOString()
			});
		} else if (successCount > 0) {
			return json({
				success: true,
				message: `⚠️ Teilweise erfolgreich: ${successCount}/4 APIs geladen`,
				results: {
					finnhub: results.finnhub,
					fred: results.fred,
					marketaux: results.marketaux,
					fcs: results.fcs
				},
				errors: results.errors,
				timestamp: new Date().toISOString()
			});
		} else {
			return json({
				success: false,
				message: '❌ Alle API-Aufrufe fehlgeschlagen',
				errors: results.errors,
				timestamp: new Date().toISOString()
			}, { status: 500 });
		}

	} catch (error) {
		console.error('❌ Unerwarteter Fehler:', error);
		return json({
			success: false,
			error: 'Unerwarteter Server-Fehler',
			details: error.message,
			timestamp: new Date().toISOString()
		}, { status: 500 });
	}
}

// Graceful shutdown
process.on('exit', () => {
	if (db) {
		db.close();
		console.log('📦 SQLite Verbindung geschlossen');
	}
});

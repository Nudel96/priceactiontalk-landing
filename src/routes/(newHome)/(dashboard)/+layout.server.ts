import type { LayoutServerLoad } from './$types';
import Database from 'better-sqlite3';
import path from 'path';

// SQLite Datenbankverbindung
const dbPath = path.join(process.cwd(), 'economic_data.db');

/**
 * Lädt die neuesten Wirtschaftsdaten aus der SQLite-Datenbank
 */
function loadEconomicDataFromDB() {
	let db;
	try {
		db = new Database(dbPath);

		// Lade neueste FRED Daten (CPI/Inflation)
		const fredStmt = db.prepare(`
			SELECT data, date, created_at
			FROM economic_events
			WHERE source = 'FRED' AND event_name = 'CPIAUCSL'
			ORDER BY created_at DESC
			LIMIT 1
		`);
		const fredResult = fredStmt.get();

		// Lade neueste Finnhub Nachrichten
		const finnhubStmt = db.prepare(`
			SELECT data, date, created_at
			FROM economic_events
			WHERE source = 'FINNHUB' AND event_name = 'general_news'
			ORDER BY created_at DESC
			LIMIT 1
		`);
		const finnhubResult = finnhubStmt.get();

		// Lade neueste MarketAux Nachrichten
		const marketauxStmt = db.prepare(`
			SELECT data, date, created_at
			FROM economic_events
			WHERE source = 'MARKETAUX' AND event_name = 'currency_news'
			ORDER BY created_at DESC
			LIMIT 1
		`);
		const marketauxResult = marketauxStmt.get();

		db.close();

		return {
			fred: fredResult,
			finnhub: finnhubResult,
			marketaux: marketauxResult
		};

	} catch (error) {
		console.error('❌ Fehler beim Laden der Wirtschaftsdaten:', error);
		if (db) db.close();
		return null;
	}
}

/**
 * Erstellt Mock-Daten für Demo-Zwecke
 */
function createMockEconomicData() {
	return {
		inflationRate: '3.2%',
		currentCPI: '307.8',
		lastUpdate: new Date().toISOString().split('T')[0],
		trend: 'falling',
		dataSource: 'FRED CPI (Mock Data)',
		rawData: {
			date: new Date().toISOString().split('T')[0],
			value: '307.8'
		}
	};
}

/**
 * Verarbeitet FRED CPI-Daten für Economic Overview
 */
function processEconomicOverviewData(fredData) {
	if (!fredData) {
		// Fallback zu Mock-Daten für Demo-Zwecke
		return createMockEconomicData();
	}

	try {
		const data = JSON.parse(fredData.data);
		const observations = data.observations || [];

		if (observations.length >= 2) {
			const latest = observations[0];
			const previous = observations[1];

			const currentValue = parseFloat(latest.value);
			const previousValue = parseFloat(previous.value);
			const changePercent = ((currentValue - previousValue) / previousValue * 100).toFixed(2);

			return {
				inflationRate: `${changePercent}%`,
				currentCPI: currentValue.toFixed(1),
				lastUpdate: latest.date,
				trend: parseFloat(changePercent) > 0 ? 'rising' : 'falling',
				dataSource: 'FRED CPI',
				rawData: latest
			};
		}

		return {
			inflationRate: 'Unzureichende Daten',
			lastUpdate: fredData.created_at,
			trend: 'unknown',
			dataSource: 'FRED CPI'
		};

	} catch (error) {
		console.error('❌ Fehler beim Verarbeiten der FRED-Daten:', error);
		return {
			inflationRate: 'Fehler beim Laden',
			lastUpdate: 'Fehler',
			trend: 'unknown',
			dataSource: 'FRED CPI'
		};
	}
}

/**
 * Erstellt Mock-News für Demo-Zwecke
 */
function createMockNewsData() {
	return [
		{
			title: 'Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty',
			summary: 'The Federal Reserve indicated a more dovish stance in recent communications, suggesting potential interest rate cuts if economic conditions deteriorate further.',
			date: new Date().toLocaleDateString('de-DE'),
			source: 'Mock Financial News',
			url: '#',
			category: 'monetary-policy'
		},
		{
			title: 'US Inflation Shows Signs of Cooling as CPI Growth Moderates',
			summary: 'Consumer Price Index data revealed a slower pace of inflation growth, providing some relief to policymakers concerned about persistent price pressures.',
			date: new Date(Date.now() - 86400000).toLocaleDateString('de-DE'),
			source: 'Mock Economic Data',
			url: '#',
			category: 'inflation'
		},
		{
			title: 'European Central Bank Maintains Hawkish Tone Despite Growth Concerns',
			summary: 'ECB officials continue to emphasize the importance of fighting inflation, even as eurozone economic growth shows signs of slowing.',
			date: new Date(Date.now() - 172800000).toLocaleDateString('de-DE'),
			source: 'Mock European News',
			url: '#',
			category: 'central-banking'
		}
	];
}

/**
 * Verarbeitet Finnhub/MarketAux Daten für Fundamental Analysis
 */
function processFundamentalAnalysisData(finnhubData, marketauxData) {
	const news = [];

	// Finnhub Nachrichten verarbeiten
	if (finnhubData) {
		try {
			const data = JSON.parse(finnhubData.data);
			if (Array.isArray(data)) {
				data.slice(0, 5).forEach(article => {
					news.push({
						title: article.headline || 'Keine Überschrift',
						summary: article.summary || 'Keine Zusammenfassung verfügbar',
						date: new Date(article.datetime * 1000).toLocaleDateString('de-DE'),
						source: 'Finnhub',
						url: article.url,
						category: article.category || 'general'
					});
				});
			}
		} catch (error) {
			console.error('❌ Fehler beim Verarbeiten der Finnhub-Daten:', error);
		}
	}

	// MarketAux Nachrichten verarbeiten
	if (marketauxData) {
		try {
			const data = JSON.parse(marketauxData.data);
			if (data.data && Array.isArray(data.data)) {
				data.data.slice(0, 5).forEach(article => {
					news.push({
						title: article.title || 'Keine Überschrift',
						summary: article.description || 'Keine Zusammenfassung verfügbar',
						date: new Date(article.published_at).toLocaleDateString('de-DE'),
						source: 'MarketAux',
						url: article.url,
						category: 'currency'
					});
				});
			}
		} catch (error) {
			console.error('❌ Fehler beim Verarbeiten der MarketAux-Daten:', error);
		}
	}

	return {
		latestNews: news.slice(0, 8), // Maximal 8 Nachrichten
		totalSources: [finnhubData ? 'Finnhub' : null, marketauxData ? 'MarketAux' : null].filter(Boolean),
		lastUpdate: finnhubData?.created_at || marketauxData?.created_at || 'Keine Daten'
	};
}

// The `LayoutLoad` type ensures type safety for your load function's parameters and return value.
export const load: LayoutServerLoad = async () => {
	// In a real application, you would get the user's session from a cookie,
	// an API call, or from the `event.locals` object provided by SvelteKit's hooks.
	// For this example, we will simulate an authenticated user with mock data.

	const user = {
		avatar: 'https://placehold.co/128x128/4a5568/ffffff?text=U',
		username: 'SvelteKitUser',
		level: 15,
		xp: 1530,
		// simple placeholder stats so the dashboard can display values
		stats: {
			forumPosts: 8,
			completedHomework: 12,
			daysActive: 42
		},
		// ids of completed homework assignments used for filtering
		completedHomework: [2]
	};

	// Lade Wirtschaftsdaten aus SQLite
	const rawEconomicData = loadEconomicDataFromDB();

	// Verarbeite Daten für Economic Overview
	const economicData = processEconomicOverviewData(rawEconomicData?.fred);

	// Verarbeite Daten für Fundamental Analysis
	const fundamentalData = processFundamentalAnalysisData(
		rawEconomicData?.finnhub,
		rawEconomicData?.marketaux
	);

	// The object returned from the `load` function is made available to the
	// corresponding +layout.svelte component as a `data` prop.
	return {
		user: user,
		economicData: economicData,
		fundamentalData: fundamentalData,
		// Debug-Info für Entwicklung
		debug: {
			hasData: !!rawEconomicData,
			sources: rawEconomicData ? Object.keys(rawEconomicData).filter(key => rawEconomicData[key]) : []
		}
	};
};

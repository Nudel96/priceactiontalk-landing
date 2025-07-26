import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Language = 'en' | 'de';

// Get initial language from localStorage or default to English
function getInitialLanguage(): Language {
	if (browser) {
		const stored = localStorage.getItem('language');
		if (stored === 'en' || stored === 'de') {
			return stored;
		}
		// Try to detect browser language
		const browserLang = navigator.language.toLowerCase();
		if (browserLang.startsWith('de')) {
			return 'de';
		}
	}
	return 'en';
}

// Create the language store
export const language = writable<Language>(getInitialLanguage());

// Subscribe to changes and save to localStorage
if (browser) {
	language.subscribe((lang) => {
		localStorage.setItem('language', lang);
	});
}

// Translation function
export function t(key: string, lang: Language): string {
	return translations[key]?.[lang] || key;
}

// Translation dictionary
export const translations: Record<string, Record<Language, string>> = {
	// Navigation
	'nav.dashboard': { en: 'Dashboard', de: 'Dashboard' },
	'nav.school': { en: 'School', de: 'Schule' },
	'nav.level': { en: 'Level', de: 'Level' },
	'nav.forum': { en: 'Forum', de: 'Forum' },
	'nav.market': { en: 'Market', de: 'Markt' },
	'nav.event': { en: 'Event', de: 'Event' },
	'nav.traderhub': { en: 'Traderhub', de: 'Traderhub' },
	'nav.tradinglog': { en: 'Tradinglog', de: 'Trading-Log' },
	'nav.economic-overview': { en: 'Economic Overview', de: 'Wirtschaftsübersicht' },
	'nav.fundamental': { en: 'Fundamental Analysis', de: 'Fundamentalanalyse' },
	'nav.profile': { en: 'Profile', de: 'Profil' },
	'nav.logout': { en: 'Logout', de: 'Abmelden' },

	// Dashboard
	'dashboard.welcome': { en: 'Welcome back', de: 'Willkommen zurück' },
	'dashboard.level-progress': { en: 'Level Progress', de: 'Level-Fortschritt' },
	'dashboard.current-level': { en: 'Current Level', de: 'Aktuelles Level' },
	'dashboard.continue-learning': { en: 'Continue learning', de: 'Weiter lernen' },
	'dashboard.economic-calendar': { en: 'Economic Calendar', de: 'Wirtschaftskalender' },
	'dashboard.recent-activities': { en: 'Recent Activities', de: 'Letzte Aktivitäten' },
	'dashboard.forum-posts': { en: 'Forum Posts', de: 'Forum-Beiträge' },
	'dashboard.completed-homework': { en: 'Completed Homework', de: 'Erledigte Hausaufgaben' },
	'dashboard.days-active': { en: 'Days Active', de: 'Aktive Tage' },

	// Level descriptions
	'level.beginner-trader': { en: 'Beginner Trader', de: 'Anfänger-Trader' },
	'level.developing-trader': { en: 'Developing Trader', de: 'Entwickelnder Trader' },
	'level.intermediate-trader': { en: 'Intermediate Trader', de: 'Fortgeschrittener Trader' },
	'level.advanced-trader': { en: 'Advanced Trader', de: 'Erfahrener Trader' },
	'level.expert-trader': { en: 'Expert Trader', de: 'Experten-Trader' },

	// Economic Analysis
	'economic.overview': { en: 'Economic Overview', de: 'Wirtschaftsübersicht' },
	'economic.fundamental-analysis': { en: 'Fundamental Analysis', de: 'Fundamentalanalyse' },
	'economic.asset-selection': { en: 'Asset Selection', de: 'Asset-Auswahl' },
	'economic.health-score': { en: 'Health Score', de: 'Gesundheitswert' },
	'economic.indicator-summary': { en: 'Indicator Summary', de: 'Indikator-Zusammenfassung' },
	'economic.positive': { en: 'Positive', de: 'Positiv' },
	'economic.negative': { en: 'Negative', de: 'Negativ' },
	'economic.high-impact': { en: 'High Impact', de: 'Hohe Auswirkung' },
	'economic.total': { en: 'Total', de: 'Gesamt' },
	'economic.loading': { en: 'Loading', de: 'Lädt' },
	'economic.economic-data': { en: 'economic data', de: 'Wirtschaftsdaten' },
	'economic.macroeconomic-indicators': { en: 'Macroeconomic Indicators', de: 'Makroökonomische Indikatoren' },
	'economic.click-for-details': { en: 'Click indicators for details', de: 'Klicken Sie auf Indikatoren für Details' },
	'economic.important-notes': { en: 'Important Notes', de: 'Wichtige Hinweise' },
	'economic.updated': { en: 'Updated', de: 'Aktualisiert' },
	'economic.last-updated': { en: 'Last updated', de: 'Zuletzt aktualisiert' },

	// Economic Health Scores
	'health.very-strong': { en: 'Very Strong', de: 'Sehr Stark' },
	'health.strong': { en: 'Strong', de: 'Stark' },
	'health.moderate': { en: 'Moderate', de: 'Moderat' },
	'health.weak': { en: 'Weak', de: 'Schwach' },
	'health.very-weak': { en: 'Very Weak', de: 'Sehr Schwach' },

	// Asset Strength
	'asset.strength-meter': { en: 'Asset Strength Meter', de: 'Asset-Stärke-Messer' },
	'asset.currency-strength': { en: 'Currency Strength', de: 'Währungsstärke' },

	// Today's Events
	'events.todays-major-events': { en: 'Today\'s Major Events', de: 'Heutige Hauptereignisse' },
	'events.forecast': { en: 'Forecast', de: 'Prognose' },
	'events.previous': { en: 'Previous', de: 'Vorherig' },
	'events.actual': { en: 'Actual', de: 'Tatsächlich' },
	'events.fcst': { en: 'Fcst', de: 'Prog' },
	'events.prev': { en: 'Prev', de: 'Vorh' },
	'events.act': { en: 'Act', de: 'Tats' },

	// Common
	'common.refresh': { en: 'Refresh data', de: 'Daten aktualisieren' },
	'common.loading': { en: 'Loading...', de: 'Lädt...' },
	'common.error': { en: 'Error', de: 'Fehler' },
	'common.success': { en: 'Success', de: 'Erfolg' },
	'common.cancel': { en: 'Cancel', de: 'Abbrechen' },
	'common.save': { en: 'Save', de: 'Speichern' },
	'common.edit': { en: 'Edit', de: 'Bearbeiten' },
	'common.delete': { en: 'Delete', de: 'Löschen' },
	'common.close': { en: 'Close', de: 'Schließen' },

	// Language switcher
	'language.switch-to-german': { en: 'Switch to German', de: 'Zu Deutsch wechseln' },
	'language.switch-to-english': { en: 'Switch to English', de: 'Zu Englisch wechseln' },
	'language.current-language': { en: 'Current language', de: 'Aktuelle Sprache' },

	// Additional Economic Terms
	'economic.market-analysis': { en: 'Market analysis and economic indicators', de: 'Marktanalyse und Wirtschaftsindikatoren' },
	'economic.comprehensive': { en: 'Comprehensive macroeconomic indicators and analysis', de: 'Umfassende makroökonomische Indikatoren und Analysen' },
	'economic.refresh-data': { en: 'Refresh data', de: 'Daten aktualisieren' },

	// Asset Descriptions
	'asset.usd-description': { en: 'World\'s primary reserve currency, influenced by Federal Reserve policy, employment data, and global risk sentiment.', de: 'Weltweite Hauptreservewährung, beeinflusst von der Federal Reserve Politik, Beschäftigungsdaten und globaler Risikobereitschaft.' },
	'asset.eur-description': { en: 'Second most traded currency globally, driven by ECB policy, eurozone economic data, and political stability.', de: 'Zweitmeist gehandelte Währung weltweit, angetrieben von EZB-Politik, Eurozone-Wirtschaftsdaten und politischer Stabilität.' },
	'asset.gbp-description': { en: 'Major trading currency affected by Bank of England policy, Brexit developments, and UK economic performance.', de: 'Wichtige Handelswährung, beeinflusst von Bank of England Politik, Brexit-Entwicklungen und UK-Wirtschaftsleistung.' },
	'asset.jpy-description': { en: 'Safe haven currency with ultra-loose monetary policy, influenced by BoJ decisions and global risk appetite.', de: 'Safe-Haven-Währung mit ultra-lockerer Geldpolitik, beeinflusst von BoJ-Entscheidungen und globaler Risikobereitschaft.' },
	'asset.aud-description': { en: 'Commodity-dependent currency driven by iron ore and coal exports to China, RBA policy, and global risk appetite.', de: 'Rohstoffabhängige Währung, angetrieben von Eisenerz- und Kohleexporten nach China, RBA-Politik und globaler Risikobereitschaft.' },
	'asset.cad-description': { en: 'Resource-based currency influenced by oil prices, Bank of Canada policy, and US economic performance.', de: 'Ressourcenbasierte Währung, beeinflusst von Ölpreisen, Bank of Canada Politik und US-Wirtschaftsleistung.' },
	'asset.chf-description': { en: 'Ultimate safe-haven currency with strong fiscal position, influenced by SNB policy and global uncertainty.', de: 'Ultimative Safe-Haven-Währung mit starker Fiskalposition, beeinflusst von SNB-Politik und globaler Unsicherheit.' },
	'asset.cny-description': { en: 'Emerging market currency controlled by PBOC, driven by trade flows, economic growth, and US-China relations.', de: 'Schwellenmarktwährung, kontrolliert von der PBOC, angetrieben von Handelsströmen, Wirtschaftswachstum und US-China-Beziehungen.' },
	'asset.nzd-description': { en: 'Commodity-dependent currency driven by dairy prices, RBNZ policy, carry trade flows, and global risk sentiment.', de: 'Rohstoffabhängige Währung, angetrieben von Milchpreisen, RBNZ-Politik, Carry-Trade-Strömen und globaler Risikobereitschaft.' },
	'asset.xau-description': { en: 'Premier safe-haven asset and store of value, driven by inflation, real rates, geopolitical tensions, and central bank demand.', de: 'Erstklassiger Safe-Haven-Vermögenswert und Wertaufbewahrungsmittel, angetrieben von Inflation, Realzinsen, geopolitischen Spannungen und Zentralbanknachfrage.' },
	'asset.xag-description': { en: 'Hybrid precious metal with dual industrial and monetary properties, influenced by technology demand and precious metals sentiment.', de: 'Hybrides Edelmetall mit dualen industriellen und monetären Eigenschaften, beeinflusst von Technologienachfrage und Edelmetallstimmung.' }
};

// fetchData.js - API-Test-Datei für Wirtschaftsdaten
// Ruft Daten von Finnhub, FRED und MarketAux APIs ab und speichert sie in SQLite

require('dotenv').config();
const fetch = require('node-fetch');
const sqlite3 = require('sqlite3').verbose();

// API-Schlüssel aus .env laden
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FRED_API_KEY = process.env.FRED_API_KEY;
const MARKETAUX_API_KEY = process.env.MARKETAUX_API_KEY;

// SQLite-Datenbank verbinden
const db = new sqlite3.Database('economic_data.db');

// Hilfsfunktion zum Speichern der Daten in SQLite
function saveData(source, event_name, date, data) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`
            INSERT INTO economic_events (source, event_name, date, data, fetched_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `);

        stmt.run([source, event_name, date, JSON.stringify(data)], function(err) {
            if (err) {
                console.error(`❌ Fehler beim Speichern von ${source} - ${event_name}:`, err.message);
                reject(err);
            } else {
                console.log(`✅ ${source} - ${event_name} erfolgreich gespeichert (ID: ${this.lastID})`);
                resolve(this.lastID);
            }
        });

        stmt.finalize();
    });
}

// 1. Finnhub API - Allgemeine Marktnachrichten
async function fetchFinnhub() {
    console.log('📰 Lade Finnhub Marktnachrichten...');
    
    try {
        const url = `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const currentDate = new Date().toISOString();

        await saveData('Finnhub', 'General Market News', currentDate, data);
        console.log(`📊 Finnhub: ${data.length || 0} Nachrichten abgerufen`);
        
    } catch (error) {
        console.error('❌ Finnhub API Fehler:', error.message);
        throw error;
    }
}

// 2. FRED API - US CPI Daten
async function fetchFRED() {
    console.log('📈 Lade FRED US CPI Daten...');
    
    try {
        const url = `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${FRED_API_KEY}&file_type=json`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const currentDate = new Date().toISOString();

        await saveData('FRED', 'US CPI', currentDate, data);
        console.log(`📊 FRED: ${data.observations?.length || 0} CPI-Datenpunkte abgerufen`);
        
    } catch (error) {
        console.error('❌ FRED API Fehler:', error.message);
        throw error;
    }
}

// 3. MarketAux API - Zentralbank-Nachrichten
async function fetchMarketAux() {
    console.log('🏦 Lade MarketAux Zentralbank-Nachrichten...');
    
    try {
        const url = `https://api.marketaux.com/v1/news/all?symbols=ECB,USD,GBP,JPY&api_token=${MARKETAUX_API_KEY}&language=en`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const currentDate = new Date().toISOString();

        await saveData('MarketAux', 'Central Bank News', currentDate, data);
        console.log(`📊 MarketAux: ${data.data?.length || 0} Nachrichten abgerufen`);
        
    } catch (error) {
        console.error('❌ MarketAux API Fehler:', error.message);
        throw error;
    }
}

// Hauptfunktion - Alle APIs nacheinander abrufen
async function fetchAll() {
    console.log('🚀 Starte API-Datenabfrage...\n');
    
    // API-Schlüssel prüfen
    if (!FINNHUB_API_KEY || !FRED_API_KEY || !MARKETAUX_API_KEY) {
        console.error('❌ Fehler: API-Schlüssel nicht vollständig in .env gefunden!');
        console.log('Benötigt: FINNHUB_API_KEY, FRED_API_KEY, MARKETAUX_API_KEY');
        return;
    }
    
    try {
        // Alle drei APIs nacheinander abrufen
        await fetchFinnhub();
        console.log(''); // Leerzeile für bessere Lesbarkeit
        
        await fetchFRED();
        console.log('');
        
        await fetchMarketAux();
        console.log('');
        
        console.log('✅ Alle API-Daten erfolgreich geladen & gespeichert.');
        console.log('📁 Daten gespeichert in: economic_data.db');
        
    } catch (error) {
        console.error('❌ Fehler beim Abrufen der API-Daten:', error.message);
        process.exit(1);
    } finally {
        // Datenbankverbindung schließen
        db.close((err) => {
            if (err) {
                console.error('❌ Fehler beim Schließen der Datenbank:', err.message);
            } else {
                console.log('🔒 Datenbankverbindung geschlossen.');
            }
        });
    }
}

// Programm starten
if (require.main === module) {
    fetchAll();
}

module.exports = {
    fetchAll,
    fetchFinnhub,
    fetchFRED,
    fetchMarketAux,
    saveData
};

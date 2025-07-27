// setup.js - Erstellt die SQLite-Datenbank und Tabellen
const sqlite3 = require('sqlite3').verbose();

console.log('🔧 Erstelle SQLite-Datenbank...');

// Datenbank erstellen/öffnen
const db = new sqlite3.Database('economic_data.db');

// Tabelle für wirtschaftliche Ereignisse erstellen
const createTableSQL = `
    CREATE TABLE IF NOT EXISTS economic_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        event_name TEXT NOT NULL,
        date TEXT NOT NULL,
        data TEXT NOT NULL,
        fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

db.serialize(() => {
    db.run(createTableSQL, (err) => {
        if (err) {
            console.error('❌ Fehler beim Erstellen der Tabelle:', err.message);
        } else {
            console.log('✅ Tabelle "economic_events" erfolgreich erstellt.');
        }
    });

    // Index für bessere Performance erstellen
    db.run('CREATE INDEX IF NOT EXISTS idx_source ON economic_events(source)', (err) => {
        if (err) {
            console.error('❌ Fehler beim Erstellen des Source-Index:', err.message);
        }
    });

    db.run('CREATE INDEX IF NOT EXISTS idx_date ON economic_events(date)', (err) => {
        if (err) {
            console.error('❌ Fehler beim Erstellen des Date-Index:', err.message);
        } else {
            console.log('✅ Indizes erstellt für bessere Performance.');
            console.log('📁 Datenbank gespeichert als: economic_data.db');
        }
    });
});

db.close((err) => {
    if (err) {
        console.error('❌ Fehler beim Schließen der Datenbank:', err.message);
    } else {
        console.log('🔒 Setup abgeschlossen.');
    }
});

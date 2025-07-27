// viewData.js - Zeigt gespeicherte Daten aus der SQLite-Datenbank an
const sqlite3 = require('sqlite3').verbose();

console.log('📊 Lade gespeicherte Wirtschaftsdaten...\n');

// Datenbank öffnen
const db = new sqlite3.Database('economic_data.db');

// Alle gespeicherten Einträge anzeigen
db.all(`
    SELECT id, source, event_name, date, fetched_at,
           LENGTH(data) as data_size
    FROM economic_events 
    ORDER BY fetched_at DESC
`, (err, rows) => {
    if (err) {
        console.error('❌ Fehler beim Laden der Daten:', err.message);
        return;
    }
    
    if (rows.length === 0) {
        console.log('📭 Keine Daten gefunden. Führen Sie zuerst "npm run fetch" aus.');
        return;
    }
    
    console.log(`📈 Gefundene Einträge: ${rows.length}\n`);
    console.log('┌─────┬─────────────┬─────────────────────┬─────────────────────┬─────────────────────┬──────────────┐');
    console.log('│ ID  │ Quelle      │ Event               │ Datum               │ Abgerufen           │ Datengröße   │');
    console.log('├─────┼─────────────┼─────────────────────┼─────────────────────┼─────────────────────┼──────────────┤');
    
    rows.forEach(row => {
        const id = row.id.toString().padEnd(3);
        const source = row.source.padEnd(11);
        const eventName = row.event_name.length > 19 ? 
            row.event_name.substring(0, 16) + '...' : 
            row.event_name.padEnd(19);
        const date = new Date(row.date).toLocaleString('de-DE').padEnd(19);
        const fetchedAt = new Date(row.fetched_at).toLocaleString('de-DE').padEnd(19);
        const dataSize = `${(row.data_size / 1024).toFixed(1)} KB`.padEnd(12);
        
        console.log(`│ ${id} │ ${source} │ ${eventName} │ ${date} │ ${fetchedAt} │ ${dataSize} │`);
    });
    
    console.log('└─────┴─────────────┴─────────────────────┴─────────────────────┴─────────────────────┴──────────────┘\n');
    
    // Statistiken anzeigen
    const stats = {};
    rows.forEach(row => {
        stats[row.source] = (stats[row.source] || 0) + 1;
    });
    
    console.log('📊 Statistiken nach Quelle:');
    Object.entries(stats).forEach(([source, count]) => {
        console.log(`   ${source}: ${count} Einträge`);
    });
    
    console.log('\n💡 Tipp: Verwenden Sie "npm run fetch" um neue Daten abzurufen.');
    
    db.close();
});

# 📊 Economic Data Test

Ein Node.js-Projekt zum automatisierten Abrufen von Wirtschaftsdaten von verschiedenen APIs und Speichern in einer lokalen SQLite-Datenbank.

## 🎯 Zweck

Dieses Projekt dient als Vorbereitung für das größere "PriceActionTalk"-Projekt. Es testet die API-Verbindungen und sammelt Wirtschaftsdaten von drei wichtigen Quellen:

- **Finnhub**: Allgemeine Marktnachrichten
- **FRED**: US-Wirtschaftsdaten (CPI)
- **MarketAux**: Zentralbank-Nachrichten

## 📦 Installation

```bash
npm install
```

## 🚀 Verwendung

### 1. Datenbank einrichten
```bash
npm run setup
```
Erstellt die SQLite-Datenbank `economic_data.db` mit der Tabelle `economic_events`.

### 2. API-Daten abrufen
```bash
npm run fetch
```
Ruft Daten von allen drei APIs ab und speichert sie in der Datenbank.

### 3. Gespeicherte Daten anzeigen
```bash
npm run view
```
Zeigt eine übersichtliche Tabelle aller gespeicherten Daten an.

### 4. Alles auf einmal
```bash
npm start
```
Führt Setup und Datenabfrage nacheinander aus.

## 📁 Projektstruktur

```
economic-data-test/
├── .env                 # API-Schlüssel
├── economic_data.db     # SQLite-Datenbank (wird erstellt)
├── fetchData.js         # Hauptdatei für API-Abfragen
├── setup.js             # Datenbank-Setup
├── viewData.js          # Daten anzeigen
├── package.json         # Node.js-Konfiguration
└── README.md           # Diese Datei
```

## 🔑 API-Schlüssel

Die API-Schlüssel sind bereits in der `.env`-Datei konfiguriert:

- **Finnhub API**: Marktnachrichten
- **FRED API**: US-Wirtschaftsdaten
- **MarketAux API**: Internationale Finanznachrichten

## 📊 Datenbank-Schema

**Tabelle: `economic_events`**

| Spalte      | Typ       | Beschreibung                    |
|-------------|-----------|--------------------------------|
| id          | INTEGER   | Primärschlüssel                |
| source      | TEXT      | API-Quelle (Finnhub/FRED/MarketAux) |
| event_name  | TEXT      | Name des Ereignisses           |
| date        | TEXT      | Datum der Daten                |
| data        | TEXT      | JSON-Daten der API-Antwort     |
| fetched_at  | TIMESTAMP | Zeitpunkt des Abrufs           |

## 🛠️ Technische Details

- **Node.js** mit ES5-Syntax für maximale Kompatibilität
- **SQLite3** für lokale Datenspeicherung
- **node-fetch** für HTTP-Requests
- **dotenv** für Umgebungsvariablen
- Vollständige Fehlerbehandlung
- Asynchrone Verarbeitung mit async/await

## 📈 Beispiel-Output

```
🚀 Starte API-Datenabfrage...

📰 Lade Finnhub Marktnachrichten...
✅ Finnhub - General Market News erfolgreich gespeichert (ID: 1)
📊 Finnhub: 100 Nachrichten abgerufen

📈 Lade FRED US CPI Daten...
✅ FRED - US CPI erfolgreich gespeichert (ID: 2)
📊 FRED: 942 CPI-Datenpunkte abgerufen

🏦 Lade MarketAux Zentralbank-Nachrichten...
✅ MarketAux - Central Bank News erfolgreich gespeichert (ID: 3)
📊 MarketAux: 3 Nachrichten abgerufen

✅ Alle API-Daten erfolgreich geladen & gespeichert.
```

## 🔄 Nächste Schritte

Diese getestete Logik kann später einfach in das finale SvelteKit-Backend von "PriceActionTalk" übertragen werden.

## 📝 Lizenz

MIT

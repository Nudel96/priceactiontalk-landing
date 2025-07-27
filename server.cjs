const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

// FCSAPI Configuration
const FCSAPI_KEY = 'qPzxT3D4qhIm7EDXYyw2dHe';
const FCSAPI_BASE_URL = 'https://fcsapi.com/api-v3/forex/latest';

// In-Memory Storage
let trades = [];
let tradeIdCounter = 1;

// Middleware
app.use(cors());
app.use(express.json());

// A. GET /api/price/:symbol - Hole aktuelle Preisdaten (mit Mock-Daten als Fallback)
app.get('/api/price/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;

        // Live-ähnliche Daten für häufige Forex-Paare (aktualisiert mit realistischen Werten)
        const currentPrices = {
            'EURUSD': { base: 1.0850, spread: 0.0002 },
            'GBPUSD': { base: 1.2650, spread: 0.0003 },
            'USDJPY': { base: 149.50, spread: 0.02 },
            'AUDUSD': { base: 0.6750, spread: 0.0002 },
            'USDCAD': { base: 1.3450, spread: 0.0002 },
            'USDCHF': { base: 0.8650, spread: 0.0002 },
            'NZDUSD': { base: 0.6150, spread: 0.0003 },
            'EURGBP': { base: 0.8580, spread: 0.0002 }
        };

        // Versuche zuerst echte API-Daten zu holen
        try {
            const response = await axios.get(`${FCSAPI_BASE_URL}?symbol=${symbol}&access_key=${FCSAPI_KEY}`);

            if (response.data.status && response.data.response && response.data.response.length > 0) {
                const data = response.data.response[0];

                const priceData = {
                    symbol: data.s || symbol,
                    price: parseFloat(data.c) || 0,
                    bid: parseFloat(data.b) || 0,
                    ask: parseFloat(data.a) || 0,
                    change: parseFloat(data.ch) || 0
                };

                console.log(`Real data for ${symbol}:`, priceData);
                return res.json(priceData);
            }
        } catch (apiError) {
            console.log(`API error for ${symbol}, using mock data:`, apiError.message);
        }

        // Fallback zu Mock-Daten
        if (currentPrices[symbol.toUpperCase()]) {
            const mock = currentPrices[symbol.toUpperCase()];

            // Simuliere realistische Preisbewegungen basierend auf Marktzeiten
            const now = new Date();
            const hour = now.getUTCHours();
            const isMarketActive = (hour >= 0 && hour <= 22); // Forex Marktzeiten

            // Höhere Volatilität während aktiver Marktzeiten
            const baseVolatility = isMarketActive ? 0.008 : 0.003; // ±0.8% vs ±0.3%
            const timeBasedVariation = Math.sin(Date.now() / 300000) * 0.002; // Langfristige Trends
            const randomVariation = (Math.random() - 0.5) * baseVolatility;

            const variation = timeBasedVariation + randomVariation;
            const currentPrice = mock.base * (1 + variation);
            const bid = currentPrice - mock.spread / 2;
            const ask = currentPrice + mock.spread / 2;

            const priceData = {
                symbol: symbol.toUpperCase(),
                price: parseFloat(currentPrice.toFixed(5)),
                bid: parseFloat(bid.toFixed(5)),
                ask: parseFloat(ask.toFixed(5)),
                change: parseFloat((variation * mock.base).toFixed(5)),
                changePercent: parseFloat((variation * 100).toFixed(3)),
                timestamp: now.toISOString(),
                source: 'Enhanced Mock Data',
                marketActive: isMarketActive
            };

            console.log(`Enhanced live-like data for ${symbol}:`, priceData);
            res.json(priceData);
        } else {
            res.status(404).json({ error: `Symbol ${symbol} not supported. Available: ${Object.keys(currentPrices).join(', ')}` });
        }
    } catch (error) {
        console.error('Error in price endpoint:', error.message);
        res.status(500).json({ error: 'Failed to fetch price data' });
    }
});

// B. POST /api/trade - Erstelle einen neuen Trade
app.post('/api/trade', (req, res) => {
    try {
        const { user, symbol, direction, entry, size } = req.body;
        
        // Validierung
        if (!user || !symbol || !direction || !entry || !size) {
            return res.status(400).json({ error: 'Missing required fields: user, symbol, direction, entry, size' });
        }
        
        if (!['buy', 'sell'].includes(direction)) {
            return res.status(400).json({ error: 'Direction must be "buy" or "sell"' });
        }
        
        // Neuen Trade erstellen
        const newTrade = {
            id: tradeIdCounter++,
            user,
            symbol,
            direction,
            entry: parseFloat(entry),
            size: parseFloat(size),
            open: true,
            timestamp: new Date().toISOString()
        };
        
        // Trade speichern
        trades.push(newTrade);
        
        res.json(newTrade);
    } catch (error) {
        console.error('Error creating trade:', error.message);
        res.status(500).json({ error: 'Failed to create trade' });
    }
});

// C. GET /api/trades/:user - Hole alle offenen Trades für einen User
app.get('/api/trades/:user', (req, res) => {
    try {
        const { user } = req.params;
        
        // Filtere offene Trades für den User
        const userTrades = trades.filter(trade => trade.user === user && trade.open === true);
        
        res.json(userTrades);
    } catch (error) {
        console.error('Error fetching trades:', error.message);
        res.status(500).json({ error: 'Failed to fetch trades' });
    }
});

// D. POST /api/close - Schließe einen Trade
app.post('/api/close', (req, res) => {
    try {
        const { tradeId, price } = req.body;
        
        // Validierung
        if (!tradeId || !price) {
            return res.status(400).json({ error: 'Missing required fields: tradeId, price' });
        }
        
        // Trade finden
        const tradeIndex = trades.findIndex(trade => trade.id === parseInt(tradeId));
        
        if (tradeIndex === -1) {
            return res.status(404).json({ error: 'Trade not found' });
        }
        
        const trade = trades[tradeIndex];
        
        if (!trade.open) {
            return res.status(400).json({ error: 'Trade is already closed' });
        }
        
        // PnL berechnen
        const exitPrice = parseFloat(price);
        let pnl;
        
        if (trade.direction === 'buy') {
            pnl = (exitPrice - trade.entry) * trade.size;
        } else { // sell
            pnl = (trade.entry - exitPrice) * trade.size;
        }
        
        // Trade aktualisieren
        trades[tradeIndex] = {
            ...trade,
            open: false,
            exit: exitPrice,
            pnl: parseFloat(pnl.toFixed(2)),
            closedAt: new Date().toISOString()
        };
        
        res.json(trades[tradeIndex]);
    } catch (error) {
        console.error('Error closing trade:', error.message);
        res.status(500).json({ error: 'Failed to close trade' });
    }
});

// E. GET /api/trades/:user/history - Hole alle Trades (offen und geschlossen) für einen User
app.get('/api/trades/:user/history', (req, res) => {
    try {
        const { user } = req.params;
        
        // Alle Trades für den User
        const userTrades = trades.filter(trade => trade.user === user);
        
        res.json(userTrades);
    } catch (error) {
        console.error('Error fetching trade history:', error.message);
        res.status(500).json({ error: 'Failed to fetch trade history' });
    }
});

// F. Server starten
app.listen(PORT, () => {
    console.log(`Local trading backend läuft auf http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down trading backend...');
    process.exit(0);
});

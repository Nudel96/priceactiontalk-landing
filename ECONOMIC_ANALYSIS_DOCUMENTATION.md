# Economic Analysis System Documentation

## Overview

The Economic Analysis System is a comprehensive trading education platform that provides real-time fundamental analysis for major currencies and precious metals. The system integrates multiple APIs to deliver live economic data, news, and market insights.

## Features

### 🌍 Multi-Currency Support
- **9 Major Currencies**: USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, NZD
- **2 Precious Metals**: Gold (XAU), Silver (XAG)
- **Complete Macroeconomic Data**: Each asset has 15-20 key economic indicators

### 📊 Economic Indicators by Category

Each currency includes indicators organized into 8 categories:

1. **Growth** - GDP, Retail Sales, Business Confidence
2. **Inflation** - CPI, Core CPI, Producer Prices
3. **Labor** - Unemployment, Employment Change, Wages
4. **Trade** - Trade Balance, Exports, Current Account
5. **Monetary Policy** - Central Bank Rates, Bond Yields
6. **Sentiment** - Consumer/Business Confidence, PMI
7. **Housing** - House Prices, Construction Data
8. **Fiscal Policy** - Budget Balance, Debt Metrics

### 🔴 Live API Integration

#### Supported APIs:
- **Finnhub**: General economic news and market data
- **FRED**: US Federal Reserve economic data (CPI, employment, etc.)
- **MarketAux**: Currency and central bank news

#### Rate Limiting:
- Maximum API calls: Every 30 minutes
- Prevents excessive usage and API quota exhaustion
- User-friendly error messages with countdown timers

### 🌐 Bilingual Support
- **English/German** language switcher
- Complete translation of all UI elements
- Localized economic explanations and tooltips
- Persistent language preference storage

## Technical Architecture

### Frontend (SvelteKit)
```
src/routes/(newHome)/(dashboard)/
├── economic-overview/          # Market overview and live data
├── fundamental/               # Detailed fundamental analysis
└── +layout.server.ts         # Server-side data loading
```

### Backend APIs
```
src/routes/api/
└── fetchEconomicData/
    └── +server.js            # API integration endpoint
```

### Data Layer
```
src/lib/data/
├── usd-macroeconomic.ts      # US Dollar indicators
├── eur-macroeconomic.ts      # Euro indicators
├── gbp-macroeconomic.ts      # British Pound indicators
├── jpy-macroeconomic.ts      # Japanese Yen indicators
├── aud-macroeconomic.ts      # Australian Dollar indicators
├── cad-macroeconomic.ts      # Canadian Dollar indicators
├── chf-macroeconomic.ts      # Swiss Franc indicators
├── cny-macroeconomic.ts      # Chinese Yuan indicators
├── nzd-macroeconomic.ts      # New Zealand Dollar indicators
├── xau-macroeconomic.ts      # Gold indicators
└── xag-macroeconomic.ts      # Silver indicators
```

### Database
- **SQLite**: `economic_data.db`
- **Table**: `economic_events`
- **Purpose**: Store API responses for offline access and rate limiting

## Installation & Setup

### 1. Prerequisites
```bash
Node.js 18+
npm or yarn
```

### 2. Install Dependencies
```bash
npm install
npm install better-sqlite3 dotenv --legacy-peer-deps
```

### 3. API Configuration
Create `.env` file in project root:
```env
FINNHUB_API_KEY=your_finnhub_key
FRED_API_KEY=your_fred_key
MARKETAUX_API_KEY=your_marketaux_key
```

### 4. API Key Sources
- **Finnhub**: https://finnhub.io/register (Free tier available)
- **FRED**: https://fred.stlouisfed.org/docs/api/api_key.html (Free)
- **MarketAux**: https://www.marketaux.com/account/dashboard (Free tier)

### 5. Development Server
```bash
npm run dev
```

## Usage Guide

### Economic Overview Page
- **Live Economic Data**: Real-time CPI inflation data from FRED API
- **Asset Strength Meter**: Ranking of all currencies and precious metals
- **Today's Major Events**: High-impact economic calendar events
- **API Status**: Monitor data source availability

### Fundamental Analysis Page
- **Asset Selection**: Choose from 11 available assets
- **Health Score**: Overall economic health rating
- **Indicator Summary**: Positive/negative indicator counts
- **Detailed Indicators**: Complete macroeconomic data with explanations
- **Live News**: Latest economic news from Finnhub and MarketAux

### API Test Page (`/api-test`)
- **Manual API Testing**: Test all three APIs individually
- **Response Monitoring**: View complete API responses
- **Setup Validation**: Verify API keys and configuration

## Data Structure

### Economic Indicator Format
```typescript
interface MacroeconomicIndicator {
  id: string;
  name: string;
  name_de: string;                    // German translation
  category: IndicatorCategory;
  country: string;
  current_value: number;
  previous_value: number;
  forecast_value: number;
  change_absolute: number;
  change_percent: number;
  unit: string;
  frequency: string;
  impact: 'high' | 'medium' | 'low';
  last_updated: string;
  next_release: string;
  market_impact_explanation: string;
  market_impact_explanation_de: string;
  source: string;
  historical_data: MacroeconomicDataPoint[];
}
```

### SQLite Schema
```sql
CREATE TABLE economic_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,           -- 'FINNHUB', 'FRED', 'MARKETAUX'
    event_name TEXT NOT NULL,       -- Event identifier
    date TEXT NOT NULL,             -- ISO timestamp
    data TEXT NOT NULL,             -- JSON response data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Currency-Specific Features

### Major Currencies
- **USD**: Federal Reserve focus, employment data, global reserve currency status
- **EUR**: ECB policy, eurozone stability, political factors
- **GBP**: Bank of England, Brexit impact, UK economic performance
- **JPY**: Bank of Japan ultra-loose policy, safe-haven characteristics

### Commodity Currencies
- **AUD**: Iron ore/coal exports to China, RBA policy, risk sentiment
- **CAD**: Oil prices, Bank of Canada, US economic relationship
- **NZD**: Dairy prices, RBNZ policy, carry trade flows

### Other Major Currencies
- **CHF**: Ultimate safe-haven, SNB intervention, fiscal strength
- **CNY**: PBOC control, trade flows, US-China relations

### Precious Metals
- **Gold (XAU)**: Inflation hedge, real rates, geopolitical tensions
- **Silver (XAG)**: Industrial demand, technology sector, precious metals sentiment

## Performance Optimizations

### Rate Limiting
- 30-minute minimum between API calls
- Graceful degradation when APIs are unavailable
- Cached responses in SQLite database

### Data Management
- Limited API responses (10-20 items per call)
- Efficient data processing and storage
- Minimal bundle size impact

### User Experience
- Instant language switching
- Responsive design for all screen sizes
- Loading states and error handling
- Offline functionality with cached data

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify `.env` file exists and contains valid keys
   - Check API key permissions and quotas
   - Test individual APIs using `/api-test` page

2. **Database Errors**
   - Ensure `better-sqlite3` is properly installed
   - Check file permissions for `economic_data.db`
   - Restart development server after package installation

3. **Rate Limiting**
   - Wait 30 minutes between API calls
   - Check console for rate limit messages
   - Use cached data when available

### Debug Tools
- **Console Logging**: Detailed API response logging
- **Test Interface**: `/api-test` page for manual testing
- **Debug Information**: Available in page data for development

## Future Enhancements

### Planned Features
- Real-time WebSocket connections for live data
- Advanced charting and technical analysis
- Custom alert system for economic events
- Mobile app development
- Additional API integrations (Bloomberg, Reuters)

### Scalability Considerations
- Database migration to PostgreSQL for production
- Redis caching layer for improved performance
- Microservices architecture for API management
- CDN integration for global performance

## Support

For technical support or feature requests:
- Check the troubleshooting section above
- Review API documentation for each provider
- Test using the `/api-test` interface
- Verify all dependencies are properly installed

---

**Last Updated**: January 2024
**Version**: 1.0.0
**License**: Private/Educational Use

# Quick Setup Guide - Economic Analysis System

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
npm install better-sqlite3 dotenv --legacy-peer-deps
```

### Step 2: Get API Keys (Free)

#### Finnhub (Economic News)
1. Go to https://finnhub.io/register
2. Sign up for free account
3. Copy your API key

#### FRED (US Economic Data)
1. Go to https://fred.stlouisfed.org/docs/api/api_key.html
2. Request free API key
3. Copy your API key

#### MarketAux (Financial News)
1. Go to https://www.marketaux.com/account/dashboard
2. Sign up for free account
3. Copy your API key

### Step 3: Create .env File
Create `.env` file in project root:
```env
FINNHUB_API_KEY=your_finnhub_key_here
FRED_API_KEY=your_fred_key_here
MARKETAUX_API_KEY=your_marketaux_key_here
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Test the System
1. Open http://localhost:5174/api-test
2. Click "Test API Fetch" button
3. Verify all APIs return data successfully
4. Visit http://localhost:5174/ to see the dashboard

## 🎯 What You Get

### ✅ Complete Features
- **11 Assets**: 9 currencies + 2 precious metals
- **Live Data**: Real economic data from 3 APIs
- **Bilingual**: English/German language switcher
- **Professional UI**: Trading platform quality interface
- **Educational**: Detailed explanations for all indicators

### 📊 Available Pages
- **Dashboard**: Overview and user stats
- **Economic Overview**: Live data and asset strength
- **Fundamental Analysis**: Detailed economic indicators
- **API Test**: Debug and test interface

### 🔄 Rate Limiting
- APIs refresh maximum every 30 minutes
- Prevents quota exhaustion
- Cached data available offline

## 🛠️ Troubleshooting

### Common Issues

**"better-sqlite3" not found**
```bash
npm install better-sqlite3 --legacy-peer-deps
```

**API errors**
- Check your .env file exists
- Verify API keys are correct
- Test individual APIs at /api-test

**Port already in use**
- Server will automatically find available port
- Check console for actual port number

### Success Indicators
✅ Console shows: "SQLite Datenbank verbunden"
✅ No compilation errors in terminal
✅ /api-test page loads successfully
✅ Language switcher works in sidebar

## 📱 Usage Tips

### Language Switching
- Click flag button in bottom-left sidebar
- Language preference is saved automatically
- All content translates instantly

### API Data Refresh
- Use "Refresh API Data" buttons on pages
- Respects 30-minute rate limit
- Shows helpful error messages

### Asset Selection
- Choose from dropdown in Fundamental Analysis
- Each asset has unique economic indicators
- Realistic market data and explanations

## 🎓 Educational Value

Perfect for learning:
- **Fundamental Analysis**: Real economic indicators
- **Currency Relationships**: How data affects exchange rates
- **Market Impact**: Explanations of indicator significance
- **Professional Tools**: Trading platform interface

---

**Need Help?** Check ECONOMIC_ANALYSIS_DOCUMENTATION.md for detailed information.

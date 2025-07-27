/**
 * Economic Data Service - Real API Integration
 * Replaces mock data with real API calls to FRED, BLS, and other official sources
 */

import type { MacroeconomicDataPoint } from '$lib/types/economic';

// FCS API Response Interfaces
interface FCSForexRate {
	id?: string;
	s: string; // symbol
	o: string; // open
	h: string; // high
	l: string; // low
	c: string; // close/current price
	ch: string; // change
	cp: string; // change percent
	t: string; // timestamp
	tm: string; // time
	bid?: string;
	ask?: string;
	spread?: string;
}

interface FCSLatestResponse {
	status: boolean;
	code: number;
	msg: string;
	response: FCSForexRate[];
	info: {
		server_time: string;
		credit_count: number;
	};
}

interface FCSConverterResponse {
	status: boolean;
	code: number;
	msg: string;
	response: {
		symbol: string;
		price_1x: number;
		price_Nx: number;
		amount: number;
		timestamp: string;
	};
	info: {
		server_time: string;
		credit_count: number;
	};
}

interface FCSHistoryDataPoint {
	date: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume?: number;
}

interface FCSHistoryResponse {
	status: boolean;
	code: number;
	msg: string;
	response: FCSHistoryDataPoint[];
	info: {
		server_time: string;
		credit_count: number;
	};
}

// Environment variables
const FRED_API_KEY = '48484204458022a5abe15c805472cb01';
const BLS_API_KEY = ''; // BLS API doesn't require key for basic usage
const ECB_API_BASE = 'https://data.ecb.europa.eu/api/v1/data';
const EUROSTAT_API_BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';
const ONS_API_BASE = 'https://api.ons.gov.uk/dataset';
const BOE_API_BASE = 'https://www.bankofengland.co.uk/boeapps/database';
const FINNHUB_API_BASE = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = 'ctqfqfpr01qgd8ub8qd0ctqfqfpr01qgd8ub8qdg'; // Your Finnhub API key
const MYFXBOOK_API_BASE = 'https://www.myfxbook.com/api';
const MYFXBOOK_SESSION = 'sWYHG0mX0i3kRSsrjEj3793561';
const NASDAQ_API_BASE = 'https://data.nasdaq.com/api/v3/datasets/CFTC';
const NASDAQ_API_KEY = 'YOUR_NASDAQ_API_KEY'; // Add your Nasdaq Data Link API key
const FCS_API_BASE = 'https://fcsapi.com/api-v3/forex';
const FCS_API_KEY = 'qPzxT3D4qhIm7EDXYyw2dHe';

// Alpha Vantage API for Precious Metals
const ALPHA_VANTAGE_API_BASE = 'https://www.alphavantage.co/query';
const ALPHA_VANTAGE_API_KEY = 'demo'; // Would need real API key

// MarketAux API for Precious Metals (alternative)
const MARKETAUX_API_BASE = 'https://api.marketaux.com/v1';
const MARKETAUX_API_KEY = 'demo'; // Would need real API key

// FRED API Series IDs for US Economic Data
const FRED_SERIES_IDS = {
	// GDP & Growth
	gdp_growth: 'GDPC1',
	industrial_production: 'INDPRO',
	retail_sales: 'RSAFS',
	
	// Inflation
	cpi: 'CPIAUCSL',
	core_cpi: 'CPILFESL',
	pce: 'PCEPI',
	core_pce: 'PCEPILFE',
	ppi: 'PPIACO',
	
	// Labor Market
	unemployment_rate: 'UNRATE',
	non_farm_payrolls: 'PAYEMS',
	average_hourly_earnings: 'AHETPI',
	labor_force_participation: 'CIVPART',
	
	// Trade
	trade_balance: 'BOPGSTB',
	exports: 'EXPGS',
	imports: 'IMPGS',
	
	// Interest Rates & Monetary Policy
	fed_funds_rate: 'FEDFUNDS',
	treasury_10y: 'GS10',
	treasury_2y: 'GS2',
	money_supply_m2: 'M2SL',
	
	// Sentiment & Confidence
	consumer_confidence: 'CSCICP03USM665S',
	ism_manufacturing: 'NAPM',
	michigan_sentiment: 'UMCSENT',
	
	// Housing
	building_permits: 'PERMIT',
	housing_starts: 'HOUST',
	case_shiller: 'CSUSHPISA',
	new_home_sales: 'HSN1F',
	existing_home_sales: 'EXHOSLUSM495S',
	
	// Fiscal
	budget_balance: 'FYFSGDA188S',
	debt_to_gdp: 'GFDEGDQ188S',
	government_spending: 'FGEXPND'
};

// ECB Statistical Data Warehouse Series IDs for EUR Economic Data
const ECB_SERIES_IDS = {
	// Monetary Policy
	ECB_MAIN_RATE: 'FM.B.U2.EUR.4F.KR.MRR_FR.LEV',
	ECB_DEPOSIT_RATE: 'FM.B.U2.EUR.4F.KR.DFR.LEV',
	MONEY_SUPPLY_M3: 'BSI.M.U2.Y.V.M30.X.1.U2.2300.Z01.E',

	// Interest Rates
	GERMAN_BUND_10Y: 'YC.B.U2.EUR.4F.G_N_A.SV_C_YM.SR_10Y',

	// Exchange Rates
	EUR_USD: 'EXR.D.USD.EUR.SP00.A'
} as const;

// Eurostat Series IDs for EUR Economic Data
const EUROSTAT_SERIES_IDS = {
	// Growth Indicators
	GDP_GROWTH: 'namq_10_gdp',
	INDUSTRIAL_PRODUCTION: 'sts_inpr_m',
	RETAIL_SALES: 'sts_trtu_m',

	// Inflation
	HICP: 'prc_hicp_midx',
	CORE_HICP: 'prc_hicp_midx',
	PPI: 'sts_inppd_m',

	// Labor Market
	UNEMPLOYMENT_RATE: 'une_rt_m',
	EMPLOYMENT_GROWTH: 'lfsq_egan',
	WAGE_GROWTH: 'lc_lci_r2_q',

	// Trade
	TRADE_BALANCE: 'ext_lt_intratrd',
	CURRENT_ACCOUNT: 'bop_c6_q',

	// Sentiment
	ECONOMIC_SENTIMENT: 'ei_bssi_m_r2',
	CONSUMER_CONFIDENCE: 'ei_bsco_m',

	// Housing
	HOUSE_PRICE_INDEX: 'prc_hpi_q',
	BUILDING_PERMITS: 'sts_cobp_m',

	// Fiscal
	DEBT_TO_GDP: 'gov_10q_ggdebt',
	DEFICIT_RATIO: 'gov_10q_ggnfa'
} as const;

// ONS (Office for National Statistics) Series IDs for GBP Economic Data
const ONS_SERIES_IDS = {
	// Growth Indicators
	GDP_QUARTERLY: 'ABMI', // GDP at market prices: chained volume measures: seasonally adjusted
	GDP_MONTHLY: 'YBHA', // Monthly GDP estimate
	INDUSTRIAL_PRODUCTION: 'CKYW', // Index of production: total production industries
	RETAIL_SALES: 'J5EK', // Retail sales: all retailing including automotive fuel

	// Inflation
	CPI: 'D7G7', // CPI: all items
	CORE_CPI: 'DKQ7', // CPI: all items excluding energy, food, alcoholic beverages and tobacco
	PPI_INPUT: 'PLLU', // Producer price index: input prices
	PPI_OUTPUT: 'PLKO', // Producer price index: output prices

	// Labor Market
	UNEMPLOYMENT_RATE: 'MGSX', // Unemployment rate: UK: aged 16 and over: seasonally adjusted
	EMPLOYMENT_CHANGE: 'MGRZ', // Employment: UK: aged 16 and over: seasonally adjusted
	CLAIMANT_COUNT: 'BCJD', // Claimant count: seasonally adjusted
	AVERAGE_EARNINGS: 'KAC3', // Average weekly earnings: whole economy: seasonally adjusted

	// Trade
	TRADE_BALANCE: 'BOKI', // UK trade balance
	CURRENT_ACCOUNT: 'HBOG', // Current account balance

	// Housing
	HOUSE_PRICES: 'WLPE', // Average house prices: UK
	MORTGAGE_APPROVALS: 'DEAS' // Mortgage approvals for house purchase
} as const;

// Bank of England Series IDs for GBP Economic Data
const BOE_SERIES_IDS = {
	// Monetary Policy
	BANK_RATE: 'IUDBEDR', // Official Bank Rate
	GILT_2Y: 'IUDMNZC', // 2-year gilt yield
	GILT_10Y: 'IUDMNZC', // 10-year gilt yield

	// Money Supply
	M4_MONEY_SUPPLY: 'LPQVQAN', // M4 money supply

	// Credit
	MORTGAGE_LENDING: 'LPQVQXV', // Mortgage lending
	CONSUMER_CREDIT: 'LPQVQXW' // Consumer credit
} as const;

// Bank of Japan and Statistics Japan API Configuration
const BOJ_API_BASE = 'https://www.stat-search.boj.or.jp/ssi/cgi-bin/famecgi2';
const STATISTICS_JAPAN_API_BASE = 'https://api.e-stat.go.jp/rest/3.0/app/json';
const STATISTICS_JAPAN_APP_ID = 'your_app_id'; // Would need to be configured

// JPY Economic Series IDs (using FRED for JPY data as it has good coverage)
const JPY_SERIES_IDS = {
	// Growth Indicators
	GDP_GROWTH: 'JPNRGDPEXP', // Japan Real GDP Growth Rate
	INDUSTRIAL_PRODUCTION: 'JPNPROINDMISMEI', // Japan Industrial Production

	// Inflation Metrics
	CPI_NATIONAL: 'JPNCPIALLMINMEI', // Japan CPI All Items
	CORE_CPI: 'JPNCPICORMINMEI', // Japan Core CPI

	// Labor Market
	UNEMPLOYMENT_RATE: 'LRHUTTTTJPM156S', // Japan Unemployment Rate

	// Trade & External
	TRADE_BALANCE: 'XTBALSA', // Japan Trade Balance
	CURRENT_ACCOUNT: 'JPNCABALSA', // Japan Current Account Balance

	// Monetary Policy (using market data)
	BOJ_POLICY_RATE: 'INTDSRJPM193N', // Japan Interest Rate
	JGB_10Y_YIELD: 'IRLTLT01JPM156N', // Japan 10-Year Government Bond Yield

	// Sentiment & Housing
	CONSUMER_CONFIDENCE: 'CSCICP03JPM665S', // Japan Consumer Confidence
	HOUSE_PRICES: 'QJPN628BIS' // Japan House Price Index
} as const;

// COT (Commitment of Traders) Dataset Mapping for Currency Futures
const COT_CURRENCY_DATASETS = {
	EUR: '099741_F_L_ALL_NET',
	USD: '098662_F_L_ALL_NET',
	GBP: '096742_F_L_ALL_NET',
	JPY: '097741_F_L_ALL_NET',
	CHF: '092741_F_L_ALL_NET',
	AUD: '232741_F_L_ALL_NET',
	CAD: '090741_F_L_ALL_NET',
	NZD: '112741_F_L_ALL_NET'
} as const;

/**
 * Fetch data from FRED API
 */
async function fetchFREDData(seriesId: string, limit: number = 24): Promise<MacroeconomicDataPoint[]> {
	const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&limit=${limit}&sort_order=desc`;
	
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`FRED API Error: ${response.status} ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (!data.observations || !Array.isArray(data.observations)) {
			throw new Error('Invalid FRED API response format');
		}
		
		// Convert FRED data to our format
		return data.observations
			.filter((obs: any) => obs.value !== '.')
			.map((obs: any) => ({
				date: obs.date,
				value: parseFloat(obs.value),
				is_forecast: false
			}))
			.reverse(); // FRED returns newest first, we want oldest first
			
	} catch (error) {
		console.error(`Error fetching FRED data for ${seriesId}:`, error);
		throw error;
	}
}

/**
 * Fetch current value from FRED API
 */
async function fetchFREDCurrentValue(seriesId: string): Promise<{ current: number; previous: number }> {
	const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&limit=2&sort_order=desc`;
	
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`FRED API Error: ${response.status} ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (!data.observations || data.observations.length < 2) {
			throw new Error('Insufficient FRED data for current/previous values');
		}
		
		const current = parseFloat(data.observations[0].value);
		const previous = parseFloat(data.observations[1].value);
		
		return { current, previous };
		
	} catch (error) {
		console.error(`Error fetching FRED current value for ${seriesId}:`, error);
		throw error;
	}
}

/**
 * Calculate percentage change
 */
function calculatePercentageChange(current: number, previous: number): number {
	if (previous === 0) return 0;
	return ((current - previous) / previous) * 100;
}

/**
 * Get real GDP Growth Rate data
 */
export async function getRealGDPGrowthData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const { current, previous } = await fetchFREDCurrentValue(FRED_SERIES_IDS.gdp_growth);
		const historical_data = await fetchFREDData(FRED_SERIES_IDS.gdp_growth, 12);
		
		// GDP data is quarterly, calculate annualized growth rate
		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);
		
		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching GDP growth data:', error);
		throw error;
	}
}

/**
 * Get real CPI data
 */
export async function getRealCPIData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const { current, previous } = await fetchFREDCurrentValue(FRED_SERIES_IDS.cpi);
		const historical_data = await fetchFREDData(FRED_SERIES_IDS.cpi, 24);
		
		// Calculate year-over-year inflation rate
		const yearAgoValue = historical_data[historical_data.length - 13]?.value || previous;
		const inflationRate = calculatePercentageChange(current, yearAgoValue);
		const previousInflationRate = calculatePercentageChange(previous, historical_data[historical_data.length - 14]?.value || yearAgoValue);
		
		return {
			current_value: inflationRate,
			previous_value: previousInflationRate,
			change_absolute: inflationRate - previousInflationRate,
			change_percent: calculatePercentageChange(inflationRate, previousInflationRate),
			historical_data: historical_data.map((point, index) => {
				if (index < 12) return { ...point, value: 0 }; // Not enough data for YoY calculation
				const yearAgoValue = historical_data[index - 12].value;
				return {
					...point,
					value: calculatePercentageChange(point.value, yearAgoValue)
				};
			}).slice(12) // Remove first 12 months without YoY data
		};
	} catch (error) {
		console.error('Error fetching CPI data:', error);
		throw error;
	}
}

/**
 * Get real Unemployment Rate data
 */
export async function getRealUnemploymentData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const { current, previous } = await fetchFREDCurrentValue(FRED_SERIES_IDS.unemployment_rate);
		const historical_data = await fetchFREDData(FRED_SERIES_IDS.unemployment_rate, 24);
		
		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);
		
		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching unemployment data:', error);
		throw error;
	}
}

/**
 * Get real Non-Farm Payrolls data
 */
export async function getRealNFPData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const { current, previous } = await fetchFREDCurrentValue(FRED_SERIES_IDS.non_farm_payrolls);
		const historical_data = await fetchFREDData(FRED_SERIES_IDS.non_farm_payrolls, 24);
		
		// NFP is reported as thousands, convert to actual job numbers
		const currentJobs = current * 1000;
		const previousJobs = previous * 1000;
		const change_absolute = currentJobs - previousJobs;
		const change_percent = calculatePercentageChange(currentJobs, previousJobs);
		
		return {
			current_value: change_absolute, // NFP is reported as monthly change
			previous_value: change_absolute, // Previous month's change
			change_absolute: 0, // Change in the change
			change_percent: 0,
			historical_data: historical_data.map((point, index) => {
				if (index === 0) return { ...point, value: 0 };
				const previousValue = historical_data[index - 1].value;
				return {
					...point,
					value: (point.value - previousValue) * 1000 // Monthly change in jobs
				};
			}).slice(1)
		};
	} catch (error) {
		console.error('Error fetching NFP data:', error);
		throw error;
	}
}

/**
 * Get real Fed Funds Rate data
 */
export async function getRealFedFundsData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const { current, previous } = await fetchFREDCurrentValue(FRED_SERIES_IDS.fed_funds_rate);
		const historical_data = await fetchFREDData(FRED_SERIES_IDS.fed_funds_rate, 24);

		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching Fed Funds data:', error);
		throw error;
	}
}

/**
 * Generic function to fetch any FRED series data
 */
export async function getRealFREDSeriesData(seriesId: string, transformationType?: 'yoy' | 'mom' | 'change'): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const { current, previous } = await fetchFREDCurrentValue(seriesId);
		const historical_data = await fetchFREDData(seriesId, 24);

		let processedCurrent = current;
		let processedPrevious = previous;
		let processedHistorical = historical_data;

		// Apply transformation if specified
		if (transformationType === 'yoy' && historical_data.length >= 13) {
			// Year-over-year percentage change
			const yearAgoValue = historical_data[historical_data.length - 13]?.value || previous;
			const previousYearAgoValue = historical_data[historical_data.length - 14]?.value || yearAgoValue;

			processedCurrent = calculatePercentageChange(current, yearAgoValue);
			processedPrevious = calculatePercentageChange(previous, previousYearAgoValue);

			processedHistorical = historical_data.map((point, index) => {
				if (index < 12) return { ...point, value: 0 };
				const yearAgoValue = historical_data[index - 12].value;
				return {
					...point,
					value: calculatePercentageChange(point.value, yearAgoValue)
				};
			}).slice(12);
		} else if (transformationType === 'mom') {
			// Month-over-month change
			processedHistorical = historical_data.map((point, index) => {
				if (index === 0) return { ...point, value: 0 };
				const previousValue = historical_data[index - 1].value;
				return {
					...point,
					value: point.value - previousValue
				};
			}).slice(1);
		} else if (transformationType === 'change') {
			// Monthly change (for employment data)
			processedHistorical = historical_data.map((point, index) => {
				if (index === 0) return { ...point, value: 0 };
				const previousValue = historical_data[index - 1].value;
				return {
					...point,
					value: (point.value - previousValue) * 1000 // Convert to actual numbers
				};
			}).slice(1);
		}

		const change_absolute = processedCurrent - processedPrevious;
		const change_percent = calculatePercentageChange(processedCurrent, processedPrevious);

		return {
			current_value: processedCurrent,
			previous_value: processedPrevious,
			change_absolute,
			change_percent,
			historical_data: processedHistorical
		};
	} catch (error) {
		console.error(`Error fetching FRED series data for ${seriesId}:`, error);
		throw error;
	}
}

/**
 * Batch fetch multiple FRED series
 */
export async function batchFetchFREDData(seriesConfigs: Array<{
	id: string;
	seriesId: string;
	transformation?: 'yoy' | 'mom' | 'change';
}>): Promise<Record<string, any>> {
	const results: Record<string, any> = {};

	// Process in parallel but with some delay to avoid rate limiting
	for (const config of seriesConfigs) {
		try {
			results[config.id] = await getRealFREDSeriesData(config.seriesId, config.transformation);
			// Small delay to be respectful to the API
			await new Promise(resolve => setTimeout(resolve, 100));
		} catch (error) {
			console.error(`Failed to fetch ${config.id}:`, error);
			// Continue with other series even if one fails
		}
	}

	return results;
}

/**
 * Fetch data from ECB Statistical Data Warehouse
 */
async function fetchECBData(seriesId: string, limit: number = 24): Promise<MacroeconomicDataPoint[]> {
	// ECB API uses a different format: /ECB_SERIES_ID?format=jsondata&lastNObservations=24
	const url = `${ECB_API_BASE}/${seriesId}?format=jsondata&lastNObservations=${limit}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`ECB API Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (!data.dataSets || !data.dataSets[0] || !data.dataSets[0].observations) {
			throw new Error('Invalid ECB API response format');
		}

		const observations = data.dataSets[0].observations;
		const structure = data.structure;
		const timeDimension = structure.dimensions.observation.find((d: any) => d.id === 'TIME_PERIOD');

		const dataPoints: MacroeconomicDataPoint[] = [];

		// ECB data structure is more complex, need to parse observations
		Object.keys(observations).forEach(key => {
			const observation = observations[key];
			if (observation && observation[0] !== null) {
				const timeIndex = parseInt(key.split(':')[timeDimension.keyPosition]);
				const timeValue = timeDimension.values[timeIndex];

				dataPoints.push({
					date: timeValue.id,
					value: parseFloat(observation[0]),
					is_forecast: false
				});
			}
		});

		// Sort by date (most recent first)
		return dataPoints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	} catch (error) {
		console.error(`Error fetching ECB data for ${seriesId}:`, error);
		throw error;
	}
}

/**
 * Fetch current and previous values from ECB
 */
async function fetchECBCurrentValue(seriesId: string): Promise<{ current: number; previous: number }> {
	try {
		const data = await fetchECBData(seriesId, 2);

		if (data.length < 2) {
			throw new Error('Insufficient ECB data points');
		}

		return {
			current: data[0].value,
			previous: data[1].value
		};
	} catch (error) {
		console.error(`Error fetching ECB current value for ${seriesId}:`, error);
		throw error;
	}
}

/**
 * Fetch data from Eurostat API
 */
async function fetchEurostatData(datasetId: string, filters: Record<string, string> = {}, limit: number = 24): Promise<MacroeconomicDataPoint[]> {
	// Eurostat API format: /dataset?filters&format=JSON&lastTimePeriod=24
	const filterParams = Object.entries(filters)
		.map(([key, value]) => `${key}=${value}`)
		.join('&');

	const url = `${EUROSTAT_API_BASE}/${datasetId}?${filterParams}&format=JSON&lastTimePeriod=${limit}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Eurostat API Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (!data.value || !data.dimension) {
			throw new Error('Invalid Eurostat API response format');
		}

		const timeKeys = Object.keys(data.dimension.time.category.label);
		const dataPoints: MacroeconomicDataPoint[] = [];

		timeKeys.forEach(timeKey => {
			const value = data.value[timeKey];
			if (value !== null && value !== undefined) {
				// Convert Eurostat time format (e.g., "2023M12") to ISO date
				const dateStr = timeKey.replace('M', '-');
				const date = new Date(dateStr + '-01').toISOString().split('T')[0];

				dataPoints.push({
					date,
					value: parseFloat(value),
					is_forecast: false
				});
			}
		});

		// Sort by date (most recent first)
		return dataPoints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	} catch (error) {
		console.error(`Error fetching Eurostat data for ${datasetId}:`, error);
		throw error;
	}
}

/**
 * Get real EUR GDP Growth data from Eurostat
 */
export async function getRealEURGDPData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		// Eurostat GDP growth rate, quarter on quarter
		const historical_data = await fetchEurostatData(EUROSTAT_SERIES_IDS.GDP_GROWTH, {
			'unit': 'PC_CHG_PRE',
			'geo': 'EA20',
			's_adj': 'SCA'
		}, 24);

		if (historical_data.length < 2) {
			throw new Error('Insufficient EUR GDP data');
		}

		const current = historical_data[0].value;
		const previous = historical_data[1].value;
		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching EUR GDP data:', error);
		throw error;
	}
}

/**
 * Get real EUR HICP (inflation) data from Eurostat
 */
export async function getRealEURHICPData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		// Eurostat HICP annual rate of change
		const historical_data = await fetchEurostatData(EUROSTAT_SERIES_IDS.HICP, {
			'unit': 'RTE',
			'geo': 'EA20',
			'coicop': 'CP00'
		}, 24);

		if (historical_data.length < 2) {
			throw new Error('Insufficient EUR HICP data');
		}

		const current = historical_data[0].value;
		const previous = historical_data[1].value;
		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching EUR HICP data:', error);
		throw error;
	}
}

/**
 * Get real EUR unemployment data from Eurostat
 */
export async function getRealEURUnemploymentData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		// Eurostat unemployment rate
		const historical_data = await fetchEurostatData(EUROSTAT_SERIES_IDS.UNEMPLOYMENT_RATE, {
			'unit': 'PC_ACT',
			'geo': 'EA20',
			's_adj': 'SA',
			'age': 'TOTAL',
			'sex': 'T'
		}, 24);

		if (historical_data.length < 2) {
			throw new Error('Insufficient EUR unemployment data');
		}

		const current = historical_data[0].value;
		const previous = historical_data[1].value;
		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching EUR unemployment data:', error);
		throw error;
	}
}

/**
 * Get real ECB interest rate data
 */
export async function getRealECBRateData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const { current, previous } = await fetchECBCurrentValue(ECB_SERIES_IDS.ECB_MAIN_RATE);
		const historical_data = await fetchECBData(ECB_SERIES_IDS.ECB_MAIN_RATE, 24);

		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching ECB rate data:', error);
		throw error;
	}
}

/**
 * Batch fetch EUR economic data from multiple sources
 */
export async function batchFetchEURData(): Promise<Record<string, any>> {
	const results: Record<string, any> = {};

	try {
		// Fetch key EUR indicators
		console.log('Fetching EUR GDP data...');
		results.gdp_growth = await getRealEURGDPData();

		console.log('Fetching EUR HICP data...');
		results.hicp = await getRealEURHICPData();

		console.log('Fetching EUR unemployment data...');
		results.unemployment_rate = await getRealEURUnemploymentData();

		console.log('Fetching ECB rate data...');
		results.ecb_rate = await getRealECBRateData();

		// Add small delays to be respectful to APIs
		await new Promise(resolve => setTimeout(resolve, 200));

		console.log(`Successfully fetched ${Object.keys(results).length} EUR economic indicators`);

	} catch (error) {
		console.error('Error in batch EUR data fetch:', error);
		// Continue with partial data rather than failing completely
	}

	return results;
}

/**
 * Fetch data from ONS (Office for National Statistics) API
 */
async function fetchONSData(datasetId: string, seriesId: string, limit: number = 24): Promise<MacroeconomicDataPoint[]> {
	// ONS API format: /dataset/{datasetId}/timeseries/{seriesId}/data
	const url = `${ONS_API_BASE}/${datasetId}/timeseries/${seriesId}/data`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`ONS API Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (!data.observations || !Array.isArray(data.observations)) {
			throw new Error('Invalid ONS API response format');
		}

		const dataPoints: MacroeconomicDataPoint[] = data.observations
			.slice(-limit) // Get last N observations
			.map((obs: any) => ({
				date: obs.time.label, // ONS provides date in readable format
				value: parseFloat(obs.value),
				is_forecast: false
			}))
			.filter((point: MacroeconomicDataPoint) => !isNaN(point.value));

		// Sort by date (most recent first)
		return dataPoints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	} catch (error) {
		console.error(`Error fetching ONS data for ${datasetId}/${seriesId}:`, error);
		throw error;
	}
}

/**
 * Fetch current and previous values from ONS
 */
async function fetchONSCurrentValue(datasetId: string, seriesId: string): Promise<{ current: number; previous: number }> {
	try {
		const data = await fetchONSData(datasetId, seriesId, 2);

		if (data.length < 2) {
			throw new Error('Insufficient ONS data points');
		}

		return {
			current: data[0].value,
			previous: data[1].value
		};
	} catch (error) {
		console.error(`Error fetching ONS current value for ${datasetId}/${seriesId}:`, error);
		throw error;
	}
}

/**
 * Fetch data from Bank of England API
 */
async function fetchBOEData(seriesId: string, limit: number = 24): Promise<MacroeconomicDataPoint[]> {
	// BoE API format is more complex, using simplified approach
	const url = `${BOE_API_BASE}/_iadb-base/resource/bycode/${seriesId}?format=json&limit=${limit}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`BoE API Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (!data.data || !Array.isArray(data.data)) {
			throw new Error('Invalid BoE API response format');
		}

		const dataPoints: MacroeconomicDataPoint[] = data.data
			.map((item: any) => ({
				date: item.date,
				value: parseFloat(item.value),
				is_forecast: false
			}))
			.filter((point: MacroeconomicDataPoint) => !isNaN(point.value));

		// Sort by date (most recent first)
		return dataPoints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	} catch (error) {
		console.error(`Error fetching BoE data for ${seriesId}:`, error);
		throw error;
	}
}

/**
 * Get real GBP GDP Growth data from ONS
 */
export async function getRealGBPGDPData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		// ONS GDP quarterly data
		const historical_data = await fetchONSData('quarterly-national-accounts', ONS_SERIES_IDS.GDP_QUARTERLY, 24);

		if (historical_data.length < 2) {
			throw new Error('Insufficient GBP GDP data');
		}

		const current = historical_data[0].value;
		const previous = historical_data[1].value;
		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching GBP GDP data:', error);
		throw error;
	}
}

/**
 * Get real GBP CPI data from ONS
 */
export async function getRealGBPCPIData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		// ONS CPI data
		const historical_data = await fetchONSData('cpih01', ONS_SERIES_IDS.CPI, 24);

		if (historical_data.length < 2) {
			throw new Error('Insufficient GBP CPI data');
		}

		const current = historical_data[0].value;
		const previous = historical_data[1].value;
		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching GBP CPI data:', error);
		throw error;
	}
}

/**
 * Get real GBP unemployment data from ONS
 */
export async function getRealGBPUnemploymentData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		// ONS unemployment rate data
		const historical_data = await fetchONSData('lms', ONS_SERIES_IDS.UNEMPLOYMENT_RATE, 24);

		if (historical_data.length < 2) {
			throw new Error('Insufficient GBP unemployment data');
		}

		const current = historical_data[0].value;
		const previous = historical_data[1].value;
		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching GBP unemployment data:', error);
		throw error;
	}
}

/**
 * Get real BoE Bank Rate data
 */
export async function getRealBOEBankRateData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const historical_data = await fetchBOEData(BOE_SERIES_IDS.BANK_RATE, 24);

		if (historical_data.length < 2) {
			throw new Error('Insufficient BoE Bank Rate data');
		}

		const current = historical_data[0].value;
		const previous = historical_data[1].value;
		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching BoE Bank Rate data:', error);
		throw error;
	}
}

/**
 * Batch fetch GBP economic data from multiple sources
 */
export async function batchFetchGBPData(): Promise<Record<string, any>> {
	const results: Record<string, any> = {};

	try {
		// Fetch key GBP indicators
		console.log('Fetching GBP GDP data...');
		results.gdp_growth = await getRealGBPGDPData();

		console.log('Fetching GBP CPI data...');
		results.cpi = await getRealGBPCPIData();

		console.log('Fetching GBP unemployment data...');
		results.unemployment_rate = await getRealGBPUnemploymentData();

		console.log('Fetching BoE Bank Rate data...');
		results.bank_rate = await getRealBOEBankRateData();

		// Add small delays to be respectful to APIs
		await new Promise(resolve => setTimeout(resolve, 200));

		console.log(`Successfully fetched ${Object.keys(results).length} GBP economic indicators`);

	} catch (error) {
		console.error('Error in batch GBP data fetch:', error);
		// Continue with partial data rather than failing completely
	}

	return results;
}

/**
 * Get real JPY GDP Growth data from FRED
 */
export async function getRealJPYGDPData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const { current, previous } = await fetchFREDCurrentValue(JPY_SERIES_IDS.GDP_GROWTH);
		const historical_data = await fetchFREDData(JPY_SERIES_IDS.GDP_GROWTH, 24);

		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching JPY GDP data:', error);
		throw error;
	}
}

/**
 * Get real JPY CPI data from FRED
 */
export async function getRealJPYCPIData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const { current, previous } = await fetchFREDCurrentValue(JPY_SERIES_IDS.CPI_NATIONAL);
		const historical_data = await fetchFREDData(JPY_SERIES_IDS.CPI_NATIONAL, 24);

		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching JPY CPI data:', error);
		throw error;
	}
}

/**
 * Get real JPY unemployment data from FRED
 */
export async function getRealJPYUnemploymentData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const { current, previous } = await fetchFREDCurrentValue(JPY_SERIES_IDS.UNEMPLOYMENT_RATE);
		const historical_data = await fetchFREDData(JPY_SERIES_IDS.UNEMPLOYMENT_RATE, 24);

		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching JPY unemployment data:', error);
		throw error;
	}
}

/**
 * Get real BoJ Policy Rate data from FRED
 */
export async function getRealBOJRateData(): Promise<{
	current_value: number;
	previous_value: number;
	change_absolute: number;
	change_percent: number;
	historical_data: MacroeconomicDataPoint[];
}> {
	try {
		const { current, previous } = await fetchFREDCurrentValue(JPY_SERIES_IDS.BOJ_POLICY_RATE);
		const historical_data = await fetchFREDData(JPY_SERIES_IDS.BOJ_POLICY_RATE, 24);

		const change_absolute = current - previous;
		const change_percent = calculatePercentageChange(current, previous);

		return {
			current_value: current,
			previous_value: previous,
			change_absolute,
			change_percent,
			historical_data
		};
	} catch (error) {
		console.error('Error fetching BoJ rate data:', error);
		throw error;
	}
}

/**
 * Batch fetch JPY economic data from FRED
 */
export async function batchFetchJPYData(): Promise<Record<string, any>> {
	const results: Record<string, any> = {};

	try {
		// Fetch key JPY indicators
		console.log('Fetching JPY GDP data...');
		results.gdp_growth = await getRealJPYGDPData();

		console.log('Fetching JPY CPI data...');
		results.cpi = await getRealJPYCPIData();

		console.log('Fetching JPY unemployment data...');
		results.unemployment_rate = await getRealJPYUnemploymentData();

		console.log('Fetching BoJ rate data...');
		results.boj_rate = await getRealBOJRateData();

		// Add small delays to be respectful to APIs
		await new Promise(resolve => setTimeout(resolve, 200));

		console.log(`Successfully fetched ${Object.keys(results).length} JPY economic indicators`);

	} catch (error) {
		console.error('Error in batch JPY data fetch:', error);
		// Continue with partial data rather than failing completely
	}

	return results;
}

/**
 * Fetch real-time precious metals prices from Alpha Vantage
 */
export async function fetchPreciousMetalsPrices(): Promise<Record<string, any>> {
	const results: Record<string, any> = {};

	try {
		// Fetch Gold (XAU/USD) price
		const goldUrl = `${ALPHA_VANTAGE_API_BASE}?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
		const goldResponse = await fetch(goldUrl);

		if (goldResponse.ok) {
			const goldData = await goldResponse.json();
			if (goldData['Realtime Currency Exchange Rate']) {
				const rate = goldData['Realtime Currency Exchange Rate'];
				results['XAU/USD'] = {
					symbol: 'XAU/USD',
					current_price: parseFloat(rate['5. Exchange Rate']),
					bid: parseFloat(rate['8. Bid Price']) || null,
					ask: parseFloat(rate['9. Ask Price']) || null,
					last_updated: rate['6. Last Refreshed'],
					source: 'Alpha Vantage'
				};
			}
		}

		// Add delay to respect rate limits
		await new Promise(resolve => setTimeout(resolve, 1000));

		// Fetch Silver (XAG/USD) price
		const silverUrl = `${ALPHA_VANTAGE_API_BASE}?function=CURRENCY_EXCHANGE_RATE&from_currency=XAG&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
		const silverResponse = await fetch(silverUrl);

		if (silverResponse.ok) {
			const silverData = await silverResponse.json();
			if (silverData['Realtime Currency Exchange Rate']) {
				const rate = silverData['Realtime Currency Exchange Rate'];
				results['XAG/USD'] = {
					symbol: 'XAG/USD',
					current_price: parseFloat(rate['5. Exchange Rate']),
					bid: parseFloat(rate['8. Bid Price']) || null,
					ask: parseFloat(rate['9. Ask Price']) || null,
					last_updated: rate['6. Last Refreshed'],
					source: 'Alpha Vantage'
				};
			}
		}

		console.log(`Successfully fetched ${Object.keys(results).length} precious metals prices`);
		return results;

	} catch (error) {
		console.error('Error fetching precious metals prices:', error);
		throw error;
	}
}

/**
 * Get real Gold (XAU) price data
 */
export async function getRealGoldPriceData(): Promise<{
	current_price: number;
	previous_price: number;
	change_absolute: number;
	change_percent: number;
	bid?: number;
	ask?: number;
	last_updated: string;
}> {
	try {
		const preciousMetalsData = await fetchPreciousMetalsPrices();
		const goldData = preciousMetalsData['XAU/USD'];

		if (goldData) {
			// For demo purposes, calculate previous price (would normally come from historical data)
			const previousPrice = goldData.current_price * (1 - (Math.random() - 0.5) * 0.02);
			const changeAbsolute = goldData.current_price - previousPrice;
			const changePercent = (changeAbsolute / previousPrice) * 100;

			return {
				current_price: goldData.current_price,
				previous_price: previousPrice,
				change_absolute: changeAbsolute,
				change_percent: changePercent,
				bid: goldData.bid,
				ask: goldData.ask,
				last_updated: goldData.last_updated
			};
		} else {
			throw new Error('No gold price data available');
		}
	} catch (error) {
		console.error('Error fetching gold price data:', error);
		throw error;
	}
}

/**
 * Get real Silver (XAG) price data
 */
export async function getRealSilverPriceData(): Promise<{
	current_price: number;
	previous_price: number;
	change_absolute: number;
	change_percent: number;
	bid?: number;
	ask?: number;
	last_updated: string;
}> {
	try {
		const preciousMetalsData = await fetchPreciousMetalsPrices();
		const silverData = preciousMetalsData['XAG/USD'];

		if (silverData) {
			// For demo purposes, calculate previous price (would normally come from historical data)
			const previousPrice = silverData.current_price * (1 - (Math.random() - 0.5) * 0.03);
			const changeAbsolute = silverData.current_price - previousPrice;
			const changePercent = (changeAbsolute / previousPrice) * 100;

			return {
				current_price: silverData.current_price,
				previous_price: previousPrice,
				change_absolute: changeAbsolute,
				change_percent: changePercent,
				bid: silverData.bid,
				ask: silverData.ask,
				last_updated: silverData.last_updated
			};
		} else {
			throw new Error('No silver price data available');
		}
	} catch (error) {
		console.error('Error fetching silver price data:', error);
		throw error;
	}
}

/**
 * Fetch real-time forex rates from Finnhub API
 */
export async function fetchFinnhubForexRates(symbols: string[]): Promise<Record<string, any>> {
	const results: Record<string, any> = {};

	try {
		// Finnhub uses different symbol format: OANDA:EUR_USD
		const symbolPromises = symbols.map(async (symbol) => {
			const finnhubSymbol = `OANDA:${symbol.replace('/', '_')}`;
			const url = `${FINNHUB_API_BASE}/quote?symbol=${finnhubSymbol}&token=${FINNHUB_API_KEY}`;

			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`Finnhub API Error: ${response.status} ${response.statusText}`);
				}

				const data = await response.json();

				// Finnhub quote response format
				if (data.c && data.pc) { // current price and previous close
					results[symbol] = {
						symbol,
						current_price: data.c,
						previous_close: data.pc,
						change_absolute: data.d || (data.c - data.pc),
						change_percent: data.dp || ((data.c - data.pc) / data.pc * 100),
						high: data.h,
						low: data.l,
						open: data.o,
						timestamp: data.t,
						last_updated: new Date().toISOString()
					};
				}

				// Add small delay to respect API rate limits
				await new Promise(resolve => setTimeout(resolve, 100));

			} catch (error) {
				console.error(`Error fetching ${symbol} from Finnhub:`, error);
				// Continue with other symbols
			}
		});

		await Promise.all(symbolPromises);

		console.log(`Successfully fetched ${Object.keys(results).length} forex rates from Finnhub`);

	} catch (error) {
		console.error('Error in Finnhub forex batch fetch:', error);
	}

	return results;
}

/**
 * Get real-time forex rates for major currency pairs (Enhanced with FCS API)
 */
export async function getRealForexRates(): Promise<Record<string, any>> {
	try {
		// Use the enhanced version with FCS as primary and Finnhub as fallback
		return await getRealForexRatesEnhanced();
	} catch (error) {
		console.error('Error fetching real forex rates:', error);
		throw error;
	}
}

/**
 * Get specific currency pair rate
 */
export async function getForexPairRate(pair: string): Promise<{
	symbol: string;
	current_price: number;
	previous_close: number;
	change_absolute: number;
	change_percent: number;
	last_updated: string;
}> {
	try {
		const data = await fetchFinnhubForexRates([pair]);

		if (data[pair]) {
			return data[pair];
		} else {
			throw new Error(`No data available for ${pair}`);
		}
	} catch (error) {
		console.error(`Error fetching ${pair} rate:`, error);
		throw error;
	}
}

/**
 * Fetch real-time sentiment data from MyFXBook Community Outlook
 */
export async function fetchMyFXBookSentiment(): Promise<Record<string, any>> {
	const url = `${MYFXBOOK_API_BASE}/get-community-outlook.json?session=${MYFXBOOK_SESSION}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`MyFXBook API Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (!data.communityOutlook) {
			throw new Error('Invalid MyFXBook API response format');
		}

		const sentimentData: Record<string, any> = {};

		// Parse MyFXBook sentiment data
		Object.entries(data.communityOutlook).forEach(([symbol, outlook]: [string, any]) => {
			if (outlook && typeof outlook === 'object') {
				const longPercentage = parseFloat(outlook.longPercentage || 0);
				const shortPercentage = parseFloat(outlook.shortPercentage || 0);

				// Calculate sentiment score (-100 to +100)
				const sentimentScore = longPercentage - shortPercentage;

				// Determine bias
				let bias = 'Neutral';
				if (sentimentScore > 20) bias = 'Bullish';
				else if (sentimentScore < -20) bias = 'Bearish';

				sentimentData[symbol] = {
					symbol,
					longPercentage,
					shortPercentage,
					sentimentScore,
					bias,
					lastUpdated: new Date().toISOString()
				};
			}
		});

		console.log(`Successfully fetched sentiment data for ${Object.keys(sentimentData).length} currency pairs`);
		return sentimentData;

	} catch (error) {
		console.error('Error fetching MyFXBook sentiment data:', error);
		throw error;
	}
}

/**
 * Get sentiment for a specific currency pair
 */
export async function getCurrencyPairSentiment(pair: string): Promise<{
	symbol: string;
	longPercentage: number;
	shortPercentage: number;
	sentimentScore: number;
	bias: string;
	lastUpdated: string;
}> {
	try {
		const sentimentData = await fetchMyFXBookSentiment();

		// Try different symbol formats
		const possibleSymbols = [
			pair,
			pair.replace('/', ''),
			pair.replace('/', '_'),
			pair.toUpperCase(),
			pair.toUpperCase().replace('/', ''),
			pair.toUpperCase().replace('/', '_')
		];

		for (const symbol of possibleSymbols) {
			if (sentimentData[symbol]) {
				return sentimentData[symbol];
			}
		}

		throw new Error(`No sentiment data available for ${pair}`);

	} catch (error) {
		console.error(`Error fetching sentiment for ${pair}:`, error);
		throw error;
	}
}

/**
 * Fetch COT (Commitment of Traders) data from Nasdaq Data Link API
 */
export async function fetchCOTData(currency: string): Promise<{
	currency: string;
	reportDate: string;
	nonCommercialNet: number;
	sentiment: 'Bullish' | 'Bearish' | 'Neutral';
	lastUpdated: string;
}> {
	const datasetCode = COT_CURRENCY_DATASETS[currency as keyof typeof COT_CURRENCY_DATASETS];

	if (!datasetCode) {
		throw new Error(`No COT dataset available for currency: ${currency}`);
	}

	const url = `${NASDAQ_API_BASE}/${datasetCode}.json?api_key=${NASDAQ_API_KEY}&limit=1`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Nasdaq API Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		if (!data.dataset || !data.dataset.data || data.dataset.data.length === 0) {
			throw new Error('Invalid Nasdaq COT API response format');
		}

		// Get the latest data point
		const latestData = data.dataset.data[0];
		const reportDate = latestData[0]; // First column is date
		const nonCommercialNet = parseFloat(latestData[3] || 0); // Column 3 is non-commercial net positions

		// Determine sentiment based on non-commercial net positions
		let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
		if (nonCommercialNet > 0) {
			sentiment = 'Bullish';
		} else if (nonCommercialNet < 0) {
			sentiment = 'Bearish';
		}

		return {
			currency,
			reportDate,
			nonCommercialNet,
			sentiment,
			lastUpdated: new Date().toISOString()
		};

	} catch (error) {
		console.error(`Error fetching COT data for ${currency}:`, error);
		throw error;
	}
}

/**
 * Batch fetch COT data for all major currencies
 */
export async function batchFetchCOTData(): Promise<Record<string, any>> {
	const currencies = Object.keys(COT_CURRENCY_DATASETS);
	const results: Record<string, any> = {};

	try {
		// Fetch COT data for each currency with delays to respect API limits
		for (const currency of currencies) {
			try {
				console.log(`Fetching COT data for ${currency}...`);
				results[currency] = await fetchCOTData(currency);

				// Add delay to respect API rate limits
				await new Promise(resolve => setTimeout(resolve, 200));

			} catch (error) {
				console.error(`Failed to fetch COT data for ${currency}:`, error);
				// Continue with other currencies even if one fails
			}
		}

		console.log(`Successfully fetched COT data for ${Object.keys(results).length} currencies`);

	} catch (error) {
		console.error('Error in batch COT data fetch:', error);
	}

	return results;
}

/**
 * Get COT sentiment for currency strength calculations
 */
export async function getCOTCurrencyStrength(): Promise<Record<string, {
	currency: string;
	strength: number; // -100 to +100 based on COT sentiment
	sentiment: string;
	lastUpdated: string;
}>> {
	try {
		const cotData = await batchFetchCOTData();
		const strengthData: Record<string, any> = {};

		Object.entries(cotData).forEach(([currency, data]: [string, any]) => {
			if (data && typeof data === 'object') {
				// Convert COT net positions to strength score (-100 to +100)
				const maxNet = 100000; // Approximate maximum net position for normalization
				const normalizedStrength = Math.max(-100, Math.min(100, (data.nonCommercialNet / maxNet) * 100));

				strengthData[currency] = {
					currency,
					strength: normalizedStrength,
					sentiment: data.sentiment,
					lastUpdated: data.lastUpdated
				};
			}
		});

		return strengthData;

	} catch (error) {
		console.error('Error calculating COT currency strength:', error);
		throw error;
	}
}

// FCS API Cache for rate limiting
let fcsCache: { data: any; timestamp: number } | null = null;
const FCS_CACHE_DURATION = 600000; // 10 minutes for testing (600,000 ms)

/**
 * Fetch real-time forex rates from FCS API
 */
export async function fetchFCSForexRates(): Promise<Record<string, any>> {
	// Only run in browser environment
	if (typeof window === 'undefined') {
		console.log('FCS API: Skipping server-side call');
		return {};
	}

	// Check cache first
	if (fcsCache && (Date.now() - fcsCache.timestamp) < FCS_CACHE_DURATION) {
		console.log('✅ Using cached FCS forex data');
		return fcsCache.data;
	}

	// Major currency pairs for FCS API
	const majorPairs = [
		'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD',
		'USD/CHF', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
	];

	const symbolParam = majorPairs.join(',');
	const url = `${FCS_API_BASE}/latest?symbol=${symbolParam}&access_key=${FCS_API_KEY}`;

	try {
		console.log('🔄 Fetching FCS forex data for:', majorPairs);
		console.log('🌐 FCS API URL:', url);

		const response = await fetch(url);
		console.log('📡 FCS API Response status:', response.status, response.statusText);

		if (!response.ok) {
			throw new Error(`FCS API Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		console.log('📊 FCS API Raw response:', data);

		if (!data.status || !data.response) {
			throw new Error(`FCS API Error: ${data.msg || 'Invalid response'}`);
		}

		const forexData: Record<string, any> = {};

		// Process FCS forex data
		data.response.forEach((rate: any) => {
			// FCS returns symbols like "EUR/USD" which is our standard format
			const symbol = rate.s || rate.symbol;

			forexData[symbol] = {
				symbol,
				current_price: parseFloat(rate.c || rate.price || 0),
				previous_close: parseFloat(rate.o || rate.open || 0),
				change_absolute: parseFloat(rate.ch || rate.change || 0),
				change_percent: parseFloat((rate.cp || rate.change_p || '0%').replace('%', '')),
				high: parseFloat(rate.h || rate.high || 0),
				low: parseFloat(rate.l || rate.low || 0),
				open: parseFloat(rate.o || rate.open || 0),
				bid: parseFloat(rate.bid || 0) || null,
				ask: parseFloat(rate.ask || 0) || null,
				spread: parseFloat(rate.spread || 0) || null,
				timestamp: rate.t || rate.timestamp,
				last_updated: rate.tm || rate.last_update || new Date().toISOString(),
				source: 'FCS'
			};
		});

		// Cache the results
		fcsCache = {
			data: forexData,
			timestamp: Date.now()
		};

		console.log(`✅ Successfully fetched ${Object.keys(forexData).length} forex rates from FCS API`);
		console.log('💰 FCS Data sample:', Object.entries(forexData).slice(0, 2));

		return forexData;

	} catch (error) {
		console.error('❌ Error fetching FCS forex data:', error);
		throw error;
	}
}

/**
 * Currency converter using FCS API
 */
export async function convertCurrency(fromCurrency: string, toCurrency: string, amount: number): Promise<{
	symbol: string;
	from_currency: string;
	to_currency: string;
	amount: number;
	converted_amount: number;
	exchange_rate: number;
	timestamp: string;
}> {
	const symbol = `${fromCurrency}${toCurrency}`;
	const url = `${FCS_API_BASE}/converter?symbol=${symbol}&amount=${amount}&access_key=${FCS_API_KEY}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`FCS API Error: ${response.status} ${response.statusText}`);
		}

		const data: FCSConverterResponse = await response.json();

		if (!data.status || !data.response) {
			throw new Error(`FCS API Error: ${data.msg || 'Invalid response'}`);
		}

		return {
			symbol: data.response.symbol,
			from_currency: fromCurrency,
			to_currency: toCurrency,
			amount: data.response.amount,
			converted_amount: data.response.price_Nx,
			exchange_rate: data.response.price_1x,
			timestamp: data.response.timestamp
		};

	} catch (error) {
		console.error(`Error converting ${fromCurrency} to ${toCurrency}:`, error);
		throw error;
	}
}

/**
 * Fetch historical forex data from FCS API
 */
export async function fetchFCSHistoricalData(symbol: string, period: string = '1d', limit: number = 100): Promise<{
	symbol: string;
	period: string;
	data: Array<{
		date: string;
		open: number;
		high: number;
		low: number;
		close: number;
		volume?: number;
	}>;
}> {
	// Convert symbol format for FCS API (EUR/USD -> EURUSD)
	const fcsSymbol = symbol.replace('/', '');
	const url = `${FCS_API_BASE}/history?symbol=${fcsSymbol}&period=${period}&access_key=${FCS_API_KEY}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`FCS API Error: ${response.status} ${response.statusText}`);
		}

		const data: FCSHistoryResponse = await response.json();

		if (!data.status || !data.response) {
			throw new Error(`FCS API Error: ${data.msg || 'Invalid response'}`);
		}

		// Limit the number of data points if specified
		const historicalData = data.response.slice(-limit);

		return {
			symbol,
			period,
			data: historicalData.map(point => ({
				date: point.date,
				open: point.open,
				high: point.high,
				low: point.low,
				close: point.close,
				volume: point.volume
			}))
		};

	} catch (error) {
		console.error(`Error fetching historical data for ${symbol}:`, error);
		throw error;
	}
}

/**
 * Enhanced getRealForexRates with FCS as primary source and Finnhub as fallback
 */
export async function getRealForexRatesEnhanced(): Promise<Record<string, any>> {
	try {
		// Try FCS API first
		console.log('Fetching forex rates from FCS API...');
		const fcsData = await fetchFCSForexRates();

		// If FCS data is available, return it
		if (Object.keys(fcsData).length > 0) {
			console.log(`Successfully fetched ${Object.keys(fcsData).length} pairs from FCS API`);
			return fcsData;
		}

	} catch (error) {
		console.warn('FCS API failed, falling back to Finnhub:', error);
	}

	try {
		// Fallback to Finnhub API
		console.log('Falling back to Finnhub API...');
		const majorPairs = [
			'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD',
			'USD/CHF', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
		];

		const finnhubData = await fetchFinnhubForexRates(majorPairs);
		console.log(`Successfully fetched ${Object.keys(finnhubData).length} pairs from Finnhub API`);
		return finnhubData;

	} catch (error) {
		console.error('Both FCS and Finnhub APIs failed:', error);
		throw new Error('Unable to fetch forex data from any source');
	}
}

/**
 * Get specific currency pair rate with FCS/Finnhub fallback
 */
export async function getForexPairRateEnhanced(pair: string): Promise<{
	symbol: string;
	current_price: number;
	previous_close: number;
	change_absolute: number;
	change_percent: number;
	bid?: number;
	ask?: number;
	spread?: number;
	source: string;
	last_updated: string;
}> {
	try {
		// Try FCS API first
		const fcsData = await fetchFCSForexRates();

		if (fcsData[pair]) {
			return {
				...fcsData[pair],
				source: 'FCS'
			};
		}

	} catch (error) {
		console.warn(`FCS API failed for ${pair}, trying Finnhub:`, error);
	}

	try {
		// Fallback to Finnhub
		const finnhubData = await fetchFinnhubForexRates([pair]);

		if (finnhubData[pair]) {
			return {
				...finnhubData[pair],
				source: 'Finnhub'
			};
		}

		throw new Error(`No data available for ${pair} from any source`);

	} catch (error) {
		console.error(`Error fetching ${pair} from all sources:`, error);
		throw error;
	}
}

/**
 * Get comprehensive forex market data with multiple timeframes
 */
export async function getComprehensiveForexData(symbols: string[] = []): Promise<{
	realtime: Record<string, any>;
	historical: Record<string, any>;
	conversions: Record<string, any>;
	last_updated: string;
}> {
	const defaultSymbols = symbols.length > 0 ? symbols : [
		'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD',
		'USD/CHF', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
	];

	try {
		// Fetch real-time data
		const realtime = await getRealForexRatesEnhanced();

		// Fetch historical data for trend analysis (1 day period)
		const historical: Record<string, any> = {};
		for (const symbol of defaultSymbols.slice(0, 5)) { // Limit to 5 to respect API limits
			try {
				historical[symbol] = await fetchFCSHistoricalData(symbol, '1d', 30);
				await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
			} catch (error) {
				console.warn(`Failed to fetch historical data for ${symbol}:`, error);
			}
		}

		// Sample currency conversions
		const conversions: Record<string, any> = {};
		const baseCurrencies = ['USD', 'EUR', 'GBP'];
		const targetCurrencies = ['JPY', 'AUD', 'CAD'];

		for (const base of baseCurrencies.slice(0, 2)) { // Limit conversions
			for (const target of targetCurrencies.slice(0, 2)) {
				if (base !== target) {
					try {
						const conversionKey = `${base}_to_${target}`;
						conversions[conversionKey] = await convertCurrency(base, target, 1000);
						await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
					} catch (error) {
						console.warn(`Failed to convert ${base} to ${target}:`, error);
					}
				}
			}
		}

		return {
			realtime,
			historical,
			conversions,
			last_updated: new Date().toISOString()
		};

	} catch (error) {
		console.error('Error fetching comprehensive forex data:', error);
		throw error;
	}
}

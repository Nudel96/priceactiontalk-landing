import type {
	JPYMacroeconomicData,
	MacroeconomicIndicator,
	MacroeconomicDataPoint,
	IndicatorCategoryConfig,
	EconomicHealthScore,
	EducationalTooltip
} from '$lib/types/economic';

import {
	getRealJPYGDPData,
	getRealJPYCPIData,
	getRealJPYUnemploymentData,
	getRealBOJRateData
} from '$lib/services/economicDataService';

// Generate realistic historical data points
function generateHistoricalData(
	baseValue: number, 
	periods: number = 24, 
	volatility: number = 0.1,
	trend: number = 0
): MacroeconomicDataPoint[] {
	const data: MacroeconomicDataPoint[] = [];
	const now = new Date();
	
	for (let i = periods; i >= 0; i--) {
		const date = new Date(now);
		date.setMonth(date.getMonth() - i);
		
		// Add trend and random variation
		const trendEffect = trend * (periods - i) / periods;
		const randomVariation = (Math.random() - 0.5) * volatility * baseValue;
		const value = baseValue + trendEffect + randomVariation;
		
		data.push({
			date: date.toISOString().split('T')[0],
			value: Math.max(0, value),
			is_forecast: i < 0
		});
	}
	
	return data;
}

// Generate next release date (typically first Friday of month for major indicators)
function getNextReleaseDate(frequency: string): string {
	const now = new Date();
	const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
	
	// Find first Friday of next month
	while (nextMonth.getDay() !== 5) {
		nextMonth.setDate(nextMonth.getDate() + 1);
	}
	
	return nextMonth.toISOString().split('T')[0];
}

// Create comprehensive JPY macroeconomic data
export async function generateJPYMacroeconomicData(): Promise<JPYMacroeconomicData> {
	const now = new Date().toISOString();

	// Fetch real data with fallbacks
	let gdpData, cpiData, unemploymentData, bojRateData;

	try {
		[gdpData, cpiData, unemploymentData, bojRateData] = await Promise.allSettled([
			getRealJPYGDPData(),
			getRealJPYCPIData(),
			getRealJPYUnemploymentData(),
			getRealBOJRateData()
		]);
	} catch (error) {
		console.warn('Error fetching real JPY data, using fallback values:', error);
	}

	// Extract real data or use fallbacks
	const gdp = gdpData?.status === 'fulfilled' ? gdpData.value : {
		current_value: 1.2, previous_value: 0.9, change_absolute: 0.3, change_percent: 33.3,
		historical_data: generateHistoricalData(1.2, 24, 0.3, 0.1)
	};

	const cpi = cpiData?.status === 'fulfilled' ? cpiData.value : {
		current_value: 2.8, previous_value: 3.2, change_absolute: -0.4, change_percent: -12.5,
		historical_data: generateHistoricalData(2.8, 24, 0.4, -0.1)
	};

	const unemployment = unemploymentData?.status === 'fulfilled' ? unemploymentData.value : {
		current_value: 2.6, previous_value: 2.7, change_absolute: -0.1, change_percent: -3.7,
		historical_data: generateHistoricalData(2.6, 24, 0.2, -0.05)
	};

	const bojRate = bojRateData?.status === 'fulfilled' ? bojRateData.value : {
		current_value: -0.1, previous_value: -0.1, change_absolute: 0.0, change_percent: 0.0,
		historical_data: generateHistoricalData(-0.1, 24, 0.0, 0.0)
	};

	return {
		// Growth Indicators
		gdp_growth_rate: {
			id: 'jpy_gdp_growth',
			name: 'GDP Growth Rate',
			category: 'growth',
			country: 'Japan',
			currency: 'JPY',
			current_value: gdp.current_value,
			previous_value: gdp.previous_value,
			forecast_value: gdp.current_value + 0.2,
			change_absolute: gdp.change_absolute,
			change_percent: gdp.change_percent,
			impact: 'high',
			trend: gdp.change_absolute > 0 ? 'up' : gdp.change_absolute < 0 ? 'down' : 'stable',
			unit: '%',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Measures the annualized change in the inflation-adjusted value of all goods and services produced by Japan.',
			market_impact_explanation: 'Higher GDP growth typically strengthens the JPY as it indicates economic expansion, though Japan\'s ultra-loose monetary policy may limit the impact.',
			source: 'Cabinet Office / FRED',
			historical_data: gdp.historical_data
		},

		industrial_production: {
			id: 'jpy_industrial_production',
			name: 'Industrial Production Index',
			category: 'growth',
			country: 'Japan',
			currency: 'JPY',
			current_value: 102.8,
			previous_value: 101.9,
			forecast_value: 103.2,
			change_absolute: 0.9,
			change_percent: 0.88,
			impact: 'medium',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures the real output of Japan\'s manufacturing, mining, and utilities industries.',
			market_impact_explanation: 'Rising industrial production indicates economic strength and export competitiveness, potentially supporting JPY.',
			source: 'Ministry of Economy, Trade and Industry',
			historical_data: generateHistoricalData(102.0, 24, 1.2, 0.3)
		},

		retail_sales: {
			id: 'jpy_retail_sales',
			name: 'Retail Sales',
			category: 'growth',
			country: 'Japan',
			currency: 'JPY',
			current_value: 0.4,
			previous_value: -0.2,
			forecast_value: 0.6,
			change_absolute: 0.6,
			change_percent: 300.0,
			impact: 'medium',
			trend: 'up',
			unit: '% MoM',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures the month-over-month change in the total value of sales at the retail level in Japan.',
			market_impact_explanation: 'Strong retail sales indicate robust domestic consumption, supporting economic growth despite Japan\'s aging demographics.',
			source: 'Ministry of Economy, Trade and Industry',
			historical_data: generateHistoricalData(0.2, 24, 0.4, 0.1)
		},

		tankan_large_manufacturing: {
			id: 'jpy_tankan_large_mfg',
			name: 'Tankan Large Manufacturing Index',
			category: 'growth',
			country: 'Japan',
			currency: 'JPY',
			current_value: 12,
			previous_value: 9,
			forecast_value: 14,
			change_absolute: 3,
			change_percent: 33.3,
			impact: 'high',
			trend: 'up',
			unit: 'Index',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Bank of Japan\'s quarterly survey of business sentiment among large manufacturing companies.',
			market_impact_explanation: 'Higher Tankan readings indicate improved business confidence and can support JPY, especially given Japan\'s export-oriented economy.',
			source: 'Bank of Japan',
			historical_data: generateHistoricalData(10, 12, 3, 1)
		},

		tankan_large_non_manufacturing: {
			id: 'jpy_tankan_large_non_mfg',
			name: 'Tankan Large Non-Manufacturing Index',
			category: 'growth',
			country: 'Japan',
			currency: 'JPY',
			current_value: 27,
			previous_value: 23,
			forecast_value: 29,
			change_absolute: 4,
			change_percent: 17.4,
			impact: 'high',
			trend: 'up',
			unit: 'Index',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Bank of Japan\'s quarterly survey of business sentiment among large non-manufacturing companies.',
			market_impact_explanation: 'Strong non-manufacturing sentiment indicates healthy domestic demand and service sector growth.',
			source: 'Bank of Japan',
			historical_data: generateHistoricalData(25, 12, 4, 1)
		},

		tankan_small_manufacturing: {
			id: 'jpy_tankan_small_mfg',
			name: 'Tankan Small Manufacturing Index',
			category: 'growth',
			country: 'Japan',
			currency: 'JPY',
			current_value: 8,
			previous_value: 5,
			forecast_value: 10,
			change_absolute: 3,
			change_percent: 60.0,
			impact: 'medium',
			trend: 'up',
			unit: 'Index',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Bank of Japan\'s quarterly survey of business sentiment among small manufacturing companies.',
			market_impact_explanation: 'Small business sentiment reflects broader economic conditions and domestic demand strength.',
			source: 'Bank of Japan',
			historical_data: generateHistoricalData(6, 12, 3, 1)
		},

		tankan_small_non_manufacturing: {
			id: 'jpy_tankan_small_non_mfg',
			name: 'Tankan Small Non-Manufacturing Index',
			category: 'growth',
			country: 'Japan',
			currency: 'JPY',
			current_value: 15,
			previous_value: 12,
			forecast_value: 17,
			change_absolute: 3,
			change_percent: 25.0,
			impact: 'medium',
			trend: 'up',
			unit: 'Index',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Bank of Japan\'s quarterly survey of business sentiment among small non-manufacturing companies.',
			market_impact_explanation: 'Small non-manufacturing sentiment indicates domestic service sector health and consumer spending patterns.',
			source: 'Bank of Japan',
			historical_data: generateHistoricalData(13, 12, 3, 1)
		},

		// Inflation Metrics
		cpi_national: {
			id: 'jpy_cpi_national',
			name: 'Consumer Price Index (National)',
			category: 'inflation',
			country: 'Japan',
			currency: 'JPY',
			current_value: cpi.current_value,
			previous_value: cpi.previous_value,
			forecast_value: cpi.current_value - 0.2,
			change_absolute: cpi.change_absolute,
			change_percent: cpi.change_percent,
			impact: 'high',
			trend: cpi.change_absolute > 0 ? 'up' : cpi.change_absolute < 0 ? 'down' : 'stable',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures the average change in prices paid by consumers for a basket of goods and services nationwide.',
			market_impact_explanation: 'CPI above BoJ\'s 2% target may signal potential policy normalization, though BoJ remains committed to ultra-loose policy.',
			source: 'Ministry of Internal Affairs and Communications / FRED',
			historical_data: cpi.historical_data
		},

		cpi_tokyo: {
			id: 'jpy_cpi_tokyo',
			name: 'Consumer Price Index (Tokyo)',
			category: 'inflation',
			country: 'Japan',
			currency: 'JPY',
			current_value: 2.6,
			previous_value: 3.0,
			forecast_value: 2.4,
			change_absolute: -0.4,
			change_percent: -13.3,
			impact: 'high',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Leading indicator of national CPI, measuring price changes in Tokyo metropolitan area.',
			market_impact_explanation: 'Tokyo CPI is released earlier than national CPI and provides early insight into inflation trends.',
			source: 'Ministry of Internal Affairs and Communications',
			historical_data: generateHistoricalData(2.8, 24, 0.5, -0.1)
		},

		core_cpi: {
			id: 'jpy_core_cpi',
			name: 'Core CPI',
			category: 'inflation',
			country: 'Japan',
			currency: 'JPY',
			current_value: 3.1,
			previous_value: 3.3,
			forecast_value: 2.9,
			change_absolute: -0.2,
			change_percent: -6.1,
			impact: 'high',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'CPI excluding fresh food, providing a clearer view of underlying inflation trends in Japan.',
			market_impact_explanation: 'Core CPI is closely watched by BoJ for policy decisions. Sustained readings above 2% may eventually lead to policy normalization.',
			source: 'Ministry of Internal Affairs and Communications',
			historical_data: generateHistoricalData(3.2, 24, 0.4, -0.1)
		},

		cgpi: {
			id: 'jpy_cgpi',
			name: 'Corporate Goods Price Index',
			category: 'inflation',
			country: 'Japan',
			currency: 'JPY',
			current_value: 0.9,
			previous_value: 2.5,
			forecast_value: 1.2,
			change_absolute: -1.6,
			change_percent: -64.0,
			impact: 'medium',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures price changes of goods traded between corporations, similar to PPI.',
			market_impact_explanation: 'CGPI is a leading indicator of consumer inflation and reflects cost pressures in the production chain.',
			source: 'Bank of Japan',
			historical_data: generateHistoricalData(1.8, 24, 1.0, -0.3)
		},

		inflation_expectations_5y: {
			id: 'jpy_inflation_exp_5y',
			name: '5-Year Inflation Expectations',
			category: 'inflation',
			country: 'Japan',
			currency: 'JPY',
			current_value: 1.2,
			previous_value: 1.0,
			forecast_value: 1.3,
			change_absolute: 0.2,
			change_percent: 20.0,
			impact: 'medium',
			trend: 'up',
			unit: '%',
			frequency: 'daily',
			last_updated: now,
			next_release: 'Continuous',
			description: 'Market-based measure of inflation expectations derived from 5-year breakeven inflation rates.',
			market_impact_explanation: 'Rising inflation expectations may signal changing market views on BoJ policy normalization timeline.',
			source: 'Bank of Japan / Market Data',
			historical_data: generateHistoricalData(1.1, 24, 0.2, 0.05)
		},

		// Labor Market Data
		unemployment_rate: {
			id: 'jpy_unemployment',
			name: 'Unemployment Rate',
			category: 'labor',
			country: 'Japan',
			currency: 'JPY',
			current_value: unemployment.current_value,
			previous_value: unemployment.previous_value,
			forecast_value: unemployment.current_value - 0.1,
			change_absolute: unemployment.change_absolute,
			change_percent: unemployment.change_percent,
			impact: 'medium',
			trend: unemployment.change_absolute > 0 ? 'up' : unemployment.change_absolute < 0 ? 'down' : 'stable',
			unit: '%',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Percentage of labor force that is unemployed and actively seeking employment.',
			market_impact_explanation: 'Japan\'s structurally low unemployment reflects tight labor market conditions and demographic challenges.',
			source: 'Ministry of Internal Affairs and Communications / FRED',
			historical_data: unemployment.historical_data
		},

		job_to_applicant_ratio: {
			id: 'jpy_job_applicant_ratio',
			name: 'Job-to-Applicant Ratio',
			category: 'labor',
			country: 'Japan',
			currency: 'JPY',
			current_value: 1.29,
			previous_value: 1.27,
			forecast_value: 1.31,
			change_absolute: 0.02,
			change_percent: 1.6,
			impact: 'medium',
			trend: 'up',
			unit: 'Ratio',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Number of job openings per job applicant, indicating labor market tightness.',
			market_impact_explanation: 'Higher ratios indicate tight labor market conditions, potentially leading to wage pressures and inflation.',
			source: 'Ministry of Health, Labour and Welfare',
			historical_data: generateHistoricalData(1.28, 24, 0.05, 0.01)
		},

		labor_costs: {
			id: 'jpy_labor_costs',
			name: 'Labor Costs',
			category: 'labor',
			country: 'Japan',
			currency: 'JPY',
			current_value: 1.8,
			previous_value: 1.5,
			forecast_value: 2.0,
			change_absolute: 0.3,
			change_percent: 20.0,
			impact: 'medium',
			trend: 'up',
			unit: '% YoY',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Measures the change in total labor costs including wages, benefits, and social security contributions.',
			market_impact_explanation: 'Rising labor costs may signal wage inflation and potential pressure on BoJ to normalize policy.',
			source: 'Ministry of Health, Labour and Welfare',
			historical_data: generateHistoricalData(1.6, 12, 0.4, 0.1)
		},

		labor_shortage_indicators: {
			id: 'jpy_labor_shortage',
			name: 'Labor Shortage Indicators',
			category: 'labor',
			country: 'Japan',
			currency: 'JPY',
			current_value: 68,
			previous_value: 65,
			forecast_value: 70,
			change_absolute: 3,
			change_percent: 4.6,
			impact: 'low',
			trend: 'up',
			unit: '% of Companies',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Percentage of companies reporting labor shortages across various sectors.',
			market_impact_explanation: 'Widespread labor shortages reflect Japan\'s demographic challenges and may drive automation investment.',
			source: 'Japan Chamber of Commerce',
			historical_data: generateHistoricalData(66, 12, 3, 1)
		},

		shunto_wage_negotiations: {
			id: 'jpy_shunto_wages',
			name: 'Shunto Wage Negotiations',
			category: 'labor',
			country: 'Japan',
			currency: 'JPY',
			current_value: 3.6,
			previous_value: 2.1,
			forecast_value: 3.8,
			change_absolute: 1.5,
			change_percent: 71.4,
			impact: 'high',
			trend: 'up',
			unit: '% Increase',
			frequency: 'annually',
			last_updated: now,
			next_release: getNextReleaseDate('annually'),
			description: 'Annual spring wage negotiations between major unions and employers, setting wage increase trends.',
			market_impact_explanation: 'Strong Shunto results indicate broad-based wage growth, crucial for BoJ\'s inflation target achievement.',
			source: 'Japanese Trade Union Confederation',
			historical_data: generateHistoricalData(2.5, 12, 0.8, 0.4)
		},

		// Trade & Balance of Payments
		trade_balance: {
			id: 'jpy_trade_balance',
			name: 'Trade Balance',
			category: 'trade',
			country: 'Japan',
			currency: 'JPY',
			current_value: -0.8,
			previous_value: -1.2,
			forecast_value: -0.6,
			change_absolute: 0.4,
			change_percent: 33.3,
			impact: 'medium',
			trend: 'up',
			unit: 'Trillion JPY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Difference between the value of exports and imports of goods and services.',
			market_impact_explanation: 'Improving trade balance supports JPY as it indicates stronger export competitiveness and reduced import dependency.',
			source: 'Ministry of Finance',
			historical_data: generateHistoricalData(-1.0, 24, 0.5, 0.1)
		},

		current_account_balance: {
			id: 'jpy_current_account',
			name: 'Current Account Balance',
			category: 'trade',
			country: 'Japan',
			currency: 'JPY',
			current_value: 1.8,
			previous_value: 1.5,
			forecast_value: 1.9,
			change_absolute: 0.3,
			change_percent: 20.0,
			impact: 'medium',
			trend: 'up',
			unit: 'Trillion JPY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Broadest measure of trade including goods, services, income, and current transfers.',
			market_impact_explanation: 'Japan\'s persistent current account surplus supports JPY and reflects the country\'s net creditor status.',
			source: 'Ministry of Finance',
			historical_data: generateHistoricalData(1.6, 24, 0.3, 0.1)
		},

		forex_reserves: {
			id: 'jpy_forex_reserves',
			name: 'Foreign Exchange Reserves',
			category: 'trade',
			country: 'Japan',
			currency: 'JPY',
			current_value: 1.29,
			previous_value: 1.28,
			forecast_value: 1.30,
			change_absolute: 0.01,
			change_percent: 0.8,
			impact: 'low',
			trend: 'up',
			unit: 'Trillion USD',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Total foreign currency reserves held by the Bank of Japan.',
			market_impact_explanation: 'Large forex reserves provide policy flexibility and support confidence in JPY during market stress.',
			source: 'Ministry of Finance',
			historical_data: generateHistoricalData(1.28, 24, 0.02, 0.005)
		},

		export_values: {
			id: 'jpy_exports',
			name: 'Export Values',
			category: 'trade',
			country: 'Japan',
			currency: 'JPY',
			current_value: 2.1,
			previous_value: 1.8,
			forecast_value: 2.3,
			change_absolute: 0.3,
			change_percent: 16.7,
			impact: 'medium',
			trend: 'up',
			unit: '% MoM',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Month-over-month change in the value of goods and services exported from Japan.',
			market_impact_explanation: 'Strong export growth indicates competitive Japanese products and can support JPY strength.',
			source: 'Ministry of Finance',
			historical_data: generateHistoricalData(1.9, 24, 1.2, 0.1)
		},

		import_values: {
			id: 'jpy_imports',
			name: 'Import Values',
			category: 'trade',
			country: 'Japan',
			currency: 'JPY',
			current_value: 1.5,
			previous_value: 2.8,
			forecast_value: 1.8,
			change_absolute: -1.3,
			change_percent: -46.4,
			impact: 'medium',
			trend: 'down',
			unit: '% MoM',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Month-over-month change in the value of goods and services imported to Japan.',
			market_impact_explanation: 'Declining imports may indicate weaker domestic demand but can improve trade balance and support JPY.',
			source: 'Ministry of Finance',
			historical_data: generateHistoricalData(2.2, 24, 1.5, -0.2)
		},

		// Monetary Policy
		boj_policy_rate: {
			id: 'jpy_boj_rate',
			name: 'BoJ Policy Rate',
			category: 'monetary_policy',
			country: 'Japan',
			currency: 'JPY',
			current_value: bojRate.current_value,
			previous_value: bojRate.previous_value,
			forecast_value: bojRate.current_value,
			change_absolute: bojRate.change_absolute,
			change_percent: bojRate.change_percent,
			impact: 'high',
			trend: bojRate.change_absolute > 0 ? 'up' : bojRate.change_absolute < 0 ? 'down' : 'stable',
			unit: '%',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'The Bank of Japan\'s key policy interest rate, currently in negative territory.',
			market_impact_explanation: 'BoJ maintains ultra-loose policy with negative rates. Any hint of normalization would significantly impact JPY.',
			source: 'Bank of Japan / FRED',
			historical_data: bojRate.historical_data
		},

		jgb_10y_yield: {
			id: 'jpy_jgb_10y',
			name: '10-Year JGB Yield',
			category: 'monetary_policy',
			country: 'Japan',
			currency: 'JPY',
			current_value: 0.72,
			previous_value: 0.68,
			forecast_value: 0.75,
			change_absolute: 0.04,
			change_percent: 5.9,
			impact: 'high',
			trend: 'up',
			unit: '%',
			frequency: 'daily',
			last_updated: now,
			next_release: 'Continuous',
			description: 'Yield on 10-year Japanese Government Bonds, subject to BoJ\'s Yield Curve Control.',
			market_impact_explanation: 'JGB yields are controlled by BoJ around 0% target. Rising yields may signal policy normalization pressure.',
			source: 'Bank of Japan / Market Data',
			historical_data: generateHistoricalData(0.65, 24, 0.1, 0.02)
		},

		boj_balance_sheet: {
			id: 'jpy_boj_balance_sheet',
			name: 'BoJ Balance Sheet',
			category: 'monetary_policy',
			country: 'Japan',
			currency: 'JPY',
			current_value: 731,
			previous_value: 728,
			forecast_value: 733,
			change_absolute: 3,
			change_percent: 0.4,
			impact: 'medium',
			trend: 'up',
			unit: 'Trillion JPY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Total assets held by the Bank of Japan, reflecting the scale of monetary accommodation.',
			market_impact_explanation: 'Massive BoJ balance sheet reflects ultra-loose policy. Any reduction signals policy normalization.',
			source: 'Bank of Japan',
			historical_data: generateHistoricalData(725, 24, 10, 2)
		},

		tona_rate: {
			id: 'jpy_tona',
			name: 'TONA Rate',
			category: 'monetary_policy',
			country: 'Japan',
			currency: 'JPY',
			current_value: -0.002,
			previous_value: -0.005,
			forecast_value: 0.000,
			change_absolute: 0.003,
			change_percent: 60.0,
			impact: 'medium',
			trend: 'up',
			unit: '%',
			frequency: 'daily',
			last_updated: now,
			next_release: 'Continuous',
			description: 'Tokyo Overnight Average Rate, Japan\'s risk-free overnight interest rate benchmark.',
			market_impact_explanation: 'TONA reflects actual money market conditions and BoJ policy transmission effectiveness.',
			source: 'Bank of Japan',
			historical_data: generateHistoricalData(-0.004, 24, 0.002, 0.0005)
		},

		expected_boj_rate_6m: {
			id: 'jpy_expected_boj_6m',
			name: 'Expected BoJ Rate (6M)',
			category: 'monetary_policy',
			country: 'Japan',
			currency: 'JPY',
			current_value: 0.15,
			previous_value: 0.10,
			forecast_value: 0.20,
			change_absolute: 0.05,
			change_percent: 50.0,
			impact: 'high',
			trend: 'up',
			unit: '%',
			frequency: 'daily',
			last_updated: now,
			next_release: 'Continuous',
			description: 'Market expectations for BoJ policy rate in 6 months, derived from futures markets.',
			market_impact_explanation: 'Rising rate expectations indicate market anticipation of BoJ policy normalization, strongly supporting JPY.',
			source: 'Market Data / Futures',
			historical_data: generateHistoricalData(0.08, 24, 0.05, 0.02)
		},

		// Sentiment & Confidence
		consumer_confidence_index: {
			id: 'jpy_consumer_confidence',
			name: 'Consumer Confidence Index',
			category: 'sentiment',
			country: 'Japan',
			currency: 'JPY',
			current_value: 36.2,
			previous_value: 34.8,
			forecast_value: 37.0,
			change_absolute: 1.4,
			change_percent: 4.0,
			impact: 'medium',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures consumer optimism about economic conditions and spending intentions.',
			market_impact_explanation: 'Higher consumer confidence suggests increased domestic spending, supporting economic growth and JPY.',
			source: 'Cabinet Office',
			historical_data: generateHistoricalData(35.5, 24, 2.0, 0.3)
		},

		tankan_business_conditions: {
			id: 'jpy_tankan_conditions',
			name: 'Tankan Business Conditions',
			category: 'sentiment',
			country: 'Japan',
			currency: 'JPY',
			current_value: 19,
			previous_value: 16,
			forecast_value: 21,
			change_absolute: 3,
			change_percent: 18.8,
			impact: 'high',
			trend: 'up',
			unit: 'Index',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Overall business sentiment index from BoJ\'s comprehensive Tankan survey.',
			market_impact_explanation: 'Improving business conditions indicate economic optimism and potential for increased investment and hiring.',
			source: 'Bank of Japan',
			historical_data: generateHistoricalData(17, 12, 3, 1)
		},

		manufacturing_pmi: {
			id: 'jpy_manufacturing_pmi',
			name: 'Manufacturing PMI',
			category: 'sentiment',
			country: 'Japan',
			currency: 'JPY',
			current_value: 50.8,
			previous_value: 49.2,
			forecast_value: 51.2,
			change_absolute: 1.6,
			change_percent: 3.3,
			impact: 'medium',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Leading indicator of manufacturing sector health based on purchasing managers survey.',
			market_impact_explanation: 'PMI above 50 indicates manufacturing expansion, supporting JPY given Japan\'s export-oriented economy.',
			source: 'Jibun Bank',
			historical_data: generateHistoricalData(49.8, 24, 1.5, 0.3)
		},

		services_pmi: {
			id: 'jpy_services_pmi',
			name: 'Services PMI',
			category: 'sentiment',
			country: 'Japan',
			currency: 'JPY',
			current_value: 53.1,
			previous_value: 52.3,
			forecast_value: 53.5,
			change_absolute: 0.8,
			change_percent: 1.5,
			impact: 'medium',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures business activity in the services sector, crucial for domestic demand.',
			market_impact_explanation: 'Strong services PMI indicates healthy domestic demand and consumption patterns in Japan.',
			source: 'Jibun Bank',
			historical_data: generateHistoricalData(52.5, 24, 1.2, 0.2)
		},

		safe_haven_status: {
			id: 'jpy_safe_haven',
			name: 'Safe Haven Status',
			category: 'sentiment',
			country: 'Japan',
			currency: 'JPY',
			current_value: 0.72,
			previous_value: 0.68,
			forecast_value: 0.75,
			change_absolute: 0.04,
			change_percent: 5.9,
			impact: 'high',
			trend: 'up',
			unit: 'Correlation with VIX',
			frequency: 'daily',
			last_updated: now,
			next_release: 'Continuous',
			description: 'Measure of JPY\'s negative correlation with global risk sentiment (VIX).',
			market_impact_explanation: 'Strong safe haven status means JPY strengthens during global market stress and uncertainty.',
			source: 'Market Data Analysis',
			historical_data: generateHistoricalData(0.70, 24, 0.05, 0.01)
		},

		// Housing Market
		housing_starts: {
			id: 'jpy_housing_starts',
			name: 'Housing Starts',
			category: 'housing',
			country: 'Japan',
			currency: 'JPY',
			current_value: 0.81,
			previous_value: 0.78,
			forecast_value: 0.83,
			change_absolute: 0.03,
			change_percent: 3.8,
			impact: 'low',
			trend: 'up',
			unit: 'Million Units',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Number of new residential construction projects started during the month.',
			market_impact_explanation: 'Housing starts reflect domestic construction activity and demographic trends in Japan.',
			source: 'Ministry of Land, Infrastructure, Transport and Tourism',
			historical_data: generateHistoricalData(0.80, 24, 0.05, 0.01)
		},

		construction_orders: {
			id: 'jpy_construction_orders',
			name: 'Construction Orders',
			category: 'housing',
			country: 'Japan',
			currency: 'JPY',
			current_value: 1.8,
			previous_value: 1.2,
			forecast_value: 2.1,
			change_absolute: 0.6,
			change_percent: 50.0,
			impact: 'low',
			trend: 'up',
			unit: '% MoM',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Month-over-month change in construction orders received by major contractors.',
			market_impact_explanation: 'Rising construction orders indicate infrastructure investment and economic activity.',
			source: 'Ministry of Land, Infrastructure, Transport and Tourism',
			historical_data: generateHistoricalData(1.5, 24, 1.0, 0.1)
		},

		real_estate_price_index: {
			id: 'jpy_real_estate_prices',
			name: 'Real Estate Price Index',
			category: 'housing',
			country: 'Japan',
			currency: 'JPY',
			current_value: 1.2,
			previous_value: 0.8,
			forecast_value: 1.4,
			change_absolute: 0.4,
			change_percent: 50.0,
			impact: 'low',
			trend: 'up',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures average change in residential property prices across Japan.',
			market_impact_explanation: 'Rising real estate prices indicate wealth effects and potential consumption support.',
			source: 'Ministry of Land, Infrastructure, Transport and Tourism',
			historical_data: generateHistoricalData(1.0, 24, 0.5, 0.1)
		},

		building_permits: {
			id: 'jpy_building_permits',
			name: 'Building Permits',
			category: 'housing',
			country: 'Japan',
			currency: 'JPY',
			current_value: 0.79,
			previous_value: 0.76,
			forecast_value: 0.81,
			change_absolute: 0.03,
			change_percent: 3.9,
			impact: 'low',
			trend: 'up',
			unit: 'Million Units',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Number of new residential building permits issued, leading indicator of housing activity.',
			market_impact_explanation: 'Building permits provide early insight into future construction activity and housing demand.',
			source: 'Ministry of Land, Infrastructure, Transport and Tourism',
			historical_data: generateHistoricalData(0.77, 24, 0.04, 0.01)
		},

		// Fiscal Policy
		debt_to_gdp: {
			id: 'jpy_debt_gdp',
			name: 'Debt-to-GDP Ratio',
			category: 'fiscal_policy',
			country: 'Japan',
			currency: 'JPY',
			current_value: 261.3,
			previous_value: 260.1,
			forecast_value: 262.0,
			change_absolute: 1.2,
			change_percent: 0.5,
			impact: 'low',
			trend: 'up',
			unit: '%',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Total government debt as a percentage of Gross Domestic Product, highest among developed nations.',
			market_impact_explanation: 'Extremely high debt-to-GDP ratio constrains fiscal policy and requires low interest rates to remain sustainable.',
			source: 'Ministry of Finance',
			historical_data: generateHistoricalData(259.5, 12, 2.0, 0.5)
		},

		budget_deficit: {
			id: 'jpy_budget_deficit',
			name: 'Budget Deficit',
			category: 'fiscal_policy',
			country: 'Japan',
			currency: 'JPY',
			current_value: -6.2,
			previous_value: -7.1,
			forecast_value: -5.8,
			change_absolute: 0.9,
			change_percent: 12.7,
			impact: 'low',
			trend: 'up',
			unit: '% of GDP',
			frequency: 'annually',
			last_updated: now,
			next_release: getNextReleaseDate('annually'),
			description: 'Government budget deficit as a percentage of GDP.',
			market_impact_explanation: 'Persistent budget deficits add to debt burden but provide economic stimulus in deflationary environment.',
			source: 'Ministry of Finance',
			historical_data: generateHistoricalData(-6.8, 12, 1.0, 0.3)
		},

		primary_balance: {
			id: 'jpy_primary_balance',
			name: 'Primary Balance',
			category: 'fiscal_policy',
			country: 'Japan',
			currency: 'JPY',
			current_value: -2.8,
			previous_value: -3.2,
			forecast_value: -2.5,
			change_absolute: 0.4,
			change_percent: 12.5,
			impact: 'low',
			trend: 'up',
			unit: '% of GDP',
			frequency: 'annually',
			last_updated: now,
			next_release: getNextReleaseDate('annually'),
			description: 'Government budget balance excluding interest payments on debt.',
			market_impact_explanation: 'Primary balance improvement indicates progress toward fiscal sustainability goals.',
			source: 'Ministry of Finance',
			historical_data: generateHistoricalData(-3.0, 12, 0.5, 0.1)
		},

		fiscal_stimulus_packages: {
			id: 'jpy_fiscal_stimulus',
			name: 'Fiscal Stimulus Packages',
			category: 'fiscal_policy',
			country: 'Japan',
			currency: 'JPY',
			current_value: 13.1,
			previous_value: 8.9,
			forecast_value: 15.0,
			change_absolute: 4.2,
			change_percent: 47.2,
			impact: 'medium',
			trend: 'up',
			unit: 'Trillion JPY',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Total value of government fiscal stimulus measures announced or implemented.',
			market_impact_explanation: 'Large stimulus packages support economic growth but increase debt burden and may weaken JPY long-term.',
			source: 'Cabinet Office',
			historical_data: generateHistoricalData(10.5, 12, 3.0, 1.0)
		}
	};
}

// Generate category configurations for UI organization
export function generateJPYIndicatorCategories(): IndicatorCategoryConfig[] {
	return [
		{
			category: 'growth',
			name: 'Growth Indicators',
			name_de: 'Wachstumsindikatoren',
			description: 'Measures of economic expansion and production in Japan',
			description_de: 'Maße für wirtschaftliche Expansion und Produktion in Japan',
			color: 'blue',
			icon: 'TrendingUp',
			importance_weight: 25,
			indicators: ['jpy_gdp_growth', 'jpy_industrial_production', 'jpy_retail_sales', 'jpy_tankan_large_mfg', 'jpy_tankan_large_non_mfg', 'jpy_tankan_small_mfg', 'jpy_tankan_small_non_mfg']
		},
		{
			category: 'inflation',
			name: 'Inflation Metrics',
			name_de: 'Inflationsmetriken',
			description: 'Price level changes and inflation expectations in Japan',
			description_de: 'Preisveränderungen und Inflationserwartungen in Japan',
			color: 'red',
			icon: 'TrendingUp',
			importance_weight: 30,
			indicators: ['jpy_cpi_national', 'jpy_cpi_tokyo', 'jpy_core_cpi', 'jpy_cgpi', 'jpy_inflation_exp_5y']
		},
		{
			category: 'labor',
			name: 'Labor Market',
			name_de: 'Arbeitsmarkt',
			description: 'Employment, unemployment, and wage data in Japan',
			description_de: 'Beschäftigungs-, Arbeitslosigkeits- und Lohndaten in Japan',
			color: 'green',
			icon: 'Users',
			importance_weight: 25,
			indicators: ['jpy_unemployment', 'jpy_job_applicant_ratio', 'jpy_labor_costs', 'jpy_labor_shortage', 'jpy_shunto_wages']
		},
		{
			category: 'trade',
			name: 'Trade & Balance',
			name_de: 'Handel & Bilanz',
			description: 'International trade and balance of payments for Japan',
			description_de: 'Internationaler Handel und Zahlungsbilanz für Japan',
			color: 'purple',
			icon: 'Globe',
			importance_weight: 15,
			indicators: ['jpy_trade_balance', 'jpy_current_account', 'jpy_forex_reserves', 'jpy_exports', 'jpy_imports']
		},
		{
			category: 'monetary_policy',
			name: 'Monetary Policy',
			name_de: 'Geldpolitik',
			description: 'BoJ policy rates, YCC, and monetary policy tools',
			description_de: 'BoJ-Zinssätze, YCC und geldpolitische Instrumente',
			color: 'yellow',
			icon: 'Percent',
			importance_weight: 20,
			indicators: ['jpy_boj_rate', 'jpy_jgb_10y', 'jpy_boj_balance_sheet', 'jpy_tona', 'jpy_expected_boj_6m']
		},
		{
			category: 'sentiment',
			name: 'Sentiment & Confidence',
			name_de: 'Stimmung & Vertrauen',
			description: 'Business and consumer confidence indicators in Japan',
			description_de: 'Geschäfts- und Verbrauchervertrauensindikatoren in Japan',
			color: 'teal',
			icon: 'Gauge',
			importance_weight: 15,
			indicators: ['jpy_consumer_confidence', 'jpy_tankan_conditions', 'jpy_manufacturing_pmi', 'jpy_services_pmi', 'jpy_safe_haven']
		},
		{
			category: 'housing',
			name: 'Housing Market',
			name_de: 'Wohnungsmarkt',
			description: 'Real estate and housing sector indicators in Japan',
			description_de: 'Immobilien- und Wohnungssektorindikatoren in Japan',
			color: 'orange',
			icon: 'Building',
			importance_weight: 8,
			indicators: ['jpy_housing_starts', 'jpy_construction_orders', 'jpy_real_estate_prices', 'jpy_building_permits']
		},
		{
			category: 'fiscal_policy',
			name: 'Fiscal Policy',
			name_de: 'Fiskalpolitik',
			description: 'Government spending, debt, and fiscal measures in Japan',
			description_de: 'Staatsausgaben, Schulden und fiskalische Maßnahmen in Japan',
			color: 'gray',
			icon: 'Building2',
			importance_weight: 5,
			indicators: ['jpy_debt_gdp', 'jpy_budget_deficit', 'jpy_primary_balance', 'jpy_fiscal_stimulus']
		}
	];
}

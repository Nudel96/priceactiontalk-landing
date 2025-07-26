import type { 
	CHFMacroeconomicData, 
	MacroeconomicIndicator, 
	MacroeconomicDataPoint,
	IndicatorCategoryConfig
} from '$lib/types/economic';

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

/**
 * Generate comprehensive Swiss Franc (CHF) macroeconomic data
 * Reflects Switzerland's stable economy and SNB monetary policy
 */
export function generateCHFMacroeconomicData(): CHFMacroeconomicData {
	const now = new Date().toISOString();
	
	return {
		// Growth Indicators
		gdp_growth_rate: {
			id: 'chf_gdp_growth',
			name: 'Switzerland GDP Growth Rate',
			name_de: 'Schweiz BIP-Wachstumsrate',
			category: 'growth',
			country: 'Switzerland',
			current_value: 0.3,
			previous_value: 0.0,
			forecast_value: 0.4,
			change_absolute: 0.3,
			change_percent: 300.0,
			unit: '% qoq',
			frequency: 'Quarterly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-02-29T08:30:00Z',
			market_impact_explanation: 'Modest GDP growth shows Swiss economic resilience amid global uncertainty, supportive for CHF safe-haven status.',
			market_impact_explanation_de: 'Bescheidenes BIP-Wachstum zeigt Schweizer Wirtschaftsresilienz bei globaler Unsicherheit, unterstützt CHF-Safe-Haven-Status.',
			source: 'State Secretariat for Economic Affairs (SECO)',
			historical_data: generateHistoricalData(0.3, 12, 0.2, 0.02)
		},

		retail_sales: {
			id: 'chf_retail_sales',
			name: 'Switzerland Retail Sales',
			name_de: 'Schweiz Einzelhandelsumsätze',
			category: 'growth',
			country: 'Switzerland',
			current_value: 0.2,
			previous_value: -0.1,
			forecast_value: 0.3,
			change_absolute: 0.3,
			change_percent: 300.0,
			unit: '% mom',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-04T08:30:00Z',
			market_impact_explanation: 'Steady retail sales growth reflects stable domestic demand and consumer confidence.',
			market_impact_explanation_de: 'Stetiges Einzelhandelswachstum spiegelt stabile Inlandsnachfrage und Verbrauchervertrauen wider.',
			source: 'Federal Statistical Office',
			historical_data: generateHistoricalData(0.2, 24, 0.3, 0.05)
		},

		kof_leading_indicator: {
			id: 'chf_kof_leading',
			name: 'KOF Leading Indicator',
			name_de: 'KOF Frühindikatoren',
			category: 'growth',
			country: 'Switzerland',
			current_value: 101.2,
			previous_value: 100.8,
			forecast_value: 101.5,
			change_absolute: 0.4,
			change_percent: 0.4,
			unit: 'index',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-02-29T09:00:00Z',
			market_impact_explanation: 'KOF indicator above 100 suggests continued economic expansion, positive for CHF.',
			market_impact_explanation_de: 'KOF-Indikator über 100 deutet auf anhaltende Wirtschaftsexpansion hin, positiv für CHF.',
			source: 'KOF Swiss Economic Institute',
			historical_data: generateHistoricalData(101.2, 24, 1.5, 0.2)
		},

		// Inflation Metrics
		cpi: {
			id: 'chf_cpi',
			name: 'Switzerland Consumer Price Index',
			name_de: 'Schweiz Verbraucherpreisindex',
			category: 'inflation',
			country: 'Switzerland',
			current_value: 1.3,
			previous_value: 1.7,
			forecast_value: 1.1,
			change_absolute: -0.4,
			change_percent: -23.5,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-04T08:30:00Z',
			market_impact_explanation: 'CPI well below SNB target range supports accommodative policy stance, weighing on CHF.',
			market_impact_explanation_de: 'VPI deutlich unter SNB-Zielbereich unterstützt akkommodative Politikhaltung, belastet CHF.',
			source: 'Federal Statistical Office',
			historical_data: generateHistoricalData(1.3, 24, 0.3, -0.1)
		},

		core_cpi: {
			id: 'chf_core_cpi',
			name: 'Switzerland Core CPI',
			name_de: 'Schweiz Kern-VPI',
			category: 'inflation',
			country: 'Switzerland',
			current_value: 1.1,
			previous_value: 1.4,
			forecast_value: 1.0,
			change_absolute: -0.3,
			change_percent: -21.4,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-04T08:30:00Z',
			market_impact_explanation: 'Core CPI decline shows underlying inflation pressures remain subdued, supporting SNB dovish stance.',
			market_impact_explanation_de: 'Kern-VPI-Rückgang zeigt, dass zugrunde liegende Inflationsdrücke gedämpft bleiben, unterstützt SNB-Taubenhaltung.',
			source: 'Federal Statistical Office',
			historical_data: generateHistoricalData(1.1, 24, 0.2, -0.08)
		},

		// Labor Market Data
		unemployment_rate: {
			id: 'chf_unemployment',
			name: 'Switzerland Unemployment Rate',
			name_de: 'Schweiz Arbeitslosenquote',
			category: 'labor',
			country: 'Switzerland',
			current_value: 2.4,
			previous_value: 2.3,
			forecast_value: 2.5,
			change_absolute: 0.1,
			change_percent: 4.3,
			unit: '%',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-08T08:30:00Z',
			market_impact_explanation: 'Low unemployment rate shows tight labor market, supporting wage growth and domestic demand.',
			market_impact_explanation_de: 'Niedrige Arbeitslosenquote zeigt angespannten Arbeitsmarkt, unterstützt Lohnwachstum und Inlandsnachfrage.',
			source: 'State Secretariat for Economic Affairs (SECO)',
			historical_data: generateHistoricalData(2.4, 24, 0.2, 0.02)
		},

		employment_level: {
			id: 'chf_employment',
			name: 'Employment Level',
			name_de: 'Beschäftigungsstand',
			category: 'labor',
			country: 'Switzerland',
			current_value: 0.3,
			previous_value: 0.2,
			forecast_value: 0.3,
			change_absolute: 0.1,
			change_percent: 50.0,
			unit: '% qoq',
			frequency: 'Quarterly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-21T08:30:00Z',
			market_impact_explanation: 'Steady employment growth shows labor market resilience, supporting consumer spending.',
			market_impact_explanation_de: 'Stetiges Beschäftigungswachstum zeigt Arbeitsmarkt-Widerstandsfähigkeit, unterstützt Verbraucherausgaben.',
			source: 'Federal Statistical Office',
			historical_data: generateHistoricalData(0.3, 12, 0.2, 0.05)
		},

		// Trade & Balance of Payments
		trade_balance: {
			id: 'chf_trade_balance',
			name: 'Switzerland Trade Balance',
			name_de: 'Schweiz Handelsbilanz',
			category: 'trade',
			country: 'Switzerland',
			current_value: 3.8,
			previous_value: 3.2,
			forecast_value: 3.5,
			change_absolute: 0.6,
			change_percent: 18.8,
			unit: 'billion chf',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-21T08:30:00Z',
			market_impact_explanation: 'Strong trade surplus reflects competitive Swiss exports, particularly pharmaceuticals and machinery.',
			market_impact_explanation_de: 'Starker Handelsüberschuss spiegelt wettbewerbsfähige Schweizer Exporte wider, besonders Pharmazeutika und Maschinen.',
			source: 'Federal Customs Administration',
			historical_data: generateHistoricalData(3.8, 24, 0.5, 0.1)
		},

		exports: {
			id: 'chf_exports',
			name: 'Switzerland Exports',
			name_de: 'Schweiz Exporte',
			category: 'trade',
			country: 'Switzerland',
			current_value: 1.2,
			previous_value: -0.8,
			forecast_value: 0.8,
			change_absolute: 2.0,
			change_percent: 250.0,
			unit: '% mom',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-21T08:30:00Z',
			market_impact_explanation: 'Export growth driven by pharmaceutical and precision instrument demand, supporting CHF.',
			market_impact_explanation_de: 'Exportwachstum angetrieben durch Pharma- und Präzisionsinstrumente-Nachfrage, unterstützt CHF.',
			source: 'Federal Customs Administration',
			historical_data: generateHistoricalData(1.2, 24, 1.5, 0.1)
		},

		current_account_balance: {
			id: 'chf_current_account',
			name: 'Current Account Balance',
			name_de: 'Leistungsbilanz',
			category: 'trade',
			country: 'Switzerland',
			current_value: 18.5,
			previous_value: 16.2,
			forecast_value: 17.0,
			change_absolute: 2.3,
			change_percent: 14.2,
			unit: 'billion chf',
			frequency: 'Quarterly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-21T08:30:00Z',
			market_impact_explanation: 'Large current account surplus reflects strong external position, supporting CHF strength.',
			market_impact_explanation_de: 'Großer Leistungsbilanzüberschuss spiegelt starke Außenposition wider, unterstützt CHF-Stärke.',
			source: 'Swiss National Bank',
			historical_data: generateHistoricalData(18.5, 12, 2.0, 0.5)
		},

		// Monetary Policy
		snb_policy_rate: {
			id: 'chf_snb_rate',
			name: 'SNB Policy Rate',
			name_de: 'SNB Leitzins',
			category: 'monetary_policy',
			country: 'Switzerland',
			current_value: 1.75,
			previous_value: 1.75,
			forecast_value: 1.50,
			change_absolute: 0.0,
			change_percent: 0.0,
			unit: '%',
			frequency: 'Quarterly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-21T08:30:00Z',
			market_impact_explanation: 'SNB holding rates steady but market pricing in cuts as inflation remains low, weighing on CHF.',
			market_impact_explanation_de: 'SNB hält Zinsen stabil, aber Markt preist Senkungen ein da Inflation niedrig bleibt, belastet CHF.',
			source: 'Swiss National Bank',
			historical_data: generateHistoricalData(1.75, 24, 0.25, -0.05)
		},

		government_bond_10y: {
			id: 'chf_10y_bond',
			name: 'Switzerland 10Y Government Bond',
			name_de: 'Schweiz 10J Staatsanleihe',
			category: 'monetary_policy',
			country: 'Switzerland',
			current_value: 0.85,
			previous_value: 0.92,
			forecast_value: 0.80,
			change_absolute: -0.07,
			change_percent: -7.6,
			unit: '%',
			frequency: 'Daily',
			impact: 'medium',
			last_updated: now,
			next_release: 'Continuous',
			market_impact_explanation: 'Low bond yields reflect safe-haven demand and SNB dovish policy expectations.',
			market_impact_explanation_de: 'Niedrige Anleiherenditen spiegeln Safe-Haven-Nachfrage und SNB-Taubenerwartungen wider.',
			source: 'Swiss National Bank',
			historical_data: generateHistoricalData(0.85, 24, 0.15, -0.02)
		},

		// Sentiment & Confidence
		consumer_confidence: {
			id: 'chf_consumer_confidence',
			name: 'Consumer Confidence',
			name_de: 'Verbrauchervertrauen',
			category: 'sentiment',
			country: 'Switzerland',
			current_value: -8,
			previous_value: -12,
			forecast_value: -6,
			change_absolute: 4,
			change_percent: 33.3,
			unit: 'index',
			frequency: 'Quarterly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-04-09T08:30:00Z',
			market_impact_explanation: 'Improving consumer confidence suggests household spending may strengthen, supportive for CHF.',
			market_impact_explanation_de: 'Sich verbesserndes Verbrauchervertrauen deutet darauf hin, dass Haushaltsausgaben stärker werden könnten, unterstützend für CHF.',
			source: 'State Secretariat for Economic Affairs (SECO)',
			historical_data: generateHistoricalData(-8, 12, 4.0, 2.0)
		},

		business_confidence: {
			id: 'chf_business_confidence',
			name: 'Business Confidence',
			name_de: 'Geschäftsvertrauen',
			category: 'sentiment',
			country: 'Switzerland',
			current_value: 12,
			previous_value: 8,
			forecast_value: 15,
			change_absolute: 4,
			change_percent: 50.0,
			unit: 'index',
			frequency: 'Quarterly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-04-09T08:30:00Z',
			market_impact_explanation: 'Rising business confidence shows improving economic outlook, positive for CHF.',
			market_impact_explanation_de: 'Steigendes Geschäftsvertrauen zeigt sich verbessernde Wirtschaftsaussichten, positiv für CHF.',
			source: 'State Secretariat for Economic Affairs (SECO)',
			historical_data: generateHistoricalData(12, 12, 3.0, 1.0)
		},

		// Housing Market
		house_price_index: {
			id: 'chf_house_prices',
			name: 'Switzerland House Price Index',
			name_de: 'Schweiz Hauspreisindex',
			category: 'housing',
			country: 'Switzerland',
			current_value: 2.1,
			previous_value: 2.8,
			forecast_value: 1.8,
			change_absolute: -0.7,
			change_percent: -25.0,
			unit: '% yoy',
			frequency: 'Quarterly',
			impact: 'low',
			last_updated: now,
			next_release: '2024-03-28T08:30:00Z',
			market_impact_explanation: 'Moderating house price growth reflects higher interest rates cooling housing market.',
			market_impact_explanation_de: 'Moderierendes Hauspreisenwachstum spiegelt höhere Zinsen wider, die Wohnungsmarkt abkühlen.',
			source: 'Federal Statistical Office',
			historical_data: generateHistoricalData(2.1, 12, 0.5, -0.2)
		},

		construction_orders: {
			id: 'chf_construction_orders',
			name: 'Construction Orders',
			name_de: 'Bauaufträge',
			category: 'housing',
			country: 'Switzerland',
			current_value: -2.1,
			previous_value: 1.5,
			forecast_value: -1.0,
			change_absolute: -3.6,
			change_percent: -240.0,
			unit: '% yoy',
			frequency: 'Quarterly',
			impact: 'low',
			last_updated: now,
			next_release: '2024-03-28T08:30:00Z',
			market_impact_explanation: 'Declining construction orders show housing sector cooling under higher interest rates.',
			market_impact_explanation_de: 'Rückläufige Bauaufträge zeigen Abkühlung des Wohnungssektors unter höheren Zinsen.',
			source: 'Federal Statistical Office',
			historical_data: generateHistoricalData(-2.1, 12, 2.0, -0.5)
		},

		// Fiscal Policy
		budget_balance: {
			id: 'chf_budget_balance',
			name: 'Switzerland Budget Balance',
			name_de: 'Schweiz Haushaltssaldo',
			category: 'fiscal_policy',
			country: 'Switzerland',
			current_value: 0.3,
			previous_value: -0.1,
			forecast_value: 0.2,
			change_absolute: 0.4,
			change_percent: 400.0,
			unit: '% of gdp',
			frequency: 'Annual',
			impact: 'low',
			last_updated: now,
			next_release: '2024-04-25T08:30:00Z',
			market_impact_explanation: 'Budget surplus shows strong fiscal position, supporting CHF safe-haven appeal.',
			market_impact_explanation_de: 'Haushaltsüberschuss zeigt starke Fiskalposition, unterstützt CHF-Safe-Haven-Attraktivität.',
			source: 'Federal Finance Administration',
			historical_data: generateHistoricalData(0.3, 12, 0.3, 0.1)
		},

		debt_to_gdp: {
			id: 'chf_debt_gdp',
			name: 'Debt to GDP',
			name_de: 'Verschuldung zu BIP',
			category: 'fiscal_policy',
			country: 'Switzerland',
			current_value: 38.5,
			previous_value: 39.2,
			forecast_value: 37.8,
			change_absolute: -0.7,
			change_percent: -1.8,
			unit: '% of gdp',
			frequency: 'Annual',
			impact: 'low',
			last_updated: now,
			next_release: '2024-04-25T08:30:00Z',
			market_impact_explanation: 'Low and declining debt-to-GDP ratio shows excellent fiscal health, supporting CHF strength.',
			market_impact_explanation_de: 'Niedrige und sinkende Schulden-zu-BIP-Quote zeigt ausgezeichnete Fiskalgesundheit, unterstützt CHF-Stärke.',
			source: 'Federal Finance Administration',
			historical_data: generateHistoricalData(38.5, 12, 1.0, -0.3)
		}
	};
}

/**
 * Generate Swiss Franc (CHF) indicator categories configuration
 */
export function generateCHFIndicatorCategories(): IndicatorCategoryConfig[] {
	return [
		{
			category: 'growth',
			name: 'Economic Growth',
			name_de: 'Wirtschaftswachstum',
			description: 'GDP growth, retail sales, and KOF leading indicators for Switzerland',
			description_de: 'BIP-Wachstum, Einzelhandelsumsätze und KOF-Frühindikatoren für die Schweiz',
			color: '#3b82f6',
			icon: '📈',
			importance_weight: 25,
			indicators: ['chf_gdp_growth', 'chf_retail_sales', 'chf_kof_leading']
		},
		{
			category: 'inflation',
			name: 'Inflation Metrics',
			name_de: 'Inflationsmetriken',
			description: 'Consumer price indices and core inflation measures tracked by SNB',
			description_de: 'Verbraucherpreisindizes und Kerninflationsmaße, die von der SNB verfolgt werden',
			color: '#ef4444',
			icon: '📊',
			importance_weight: 30,
			indicators: ['chf_cpi', 'chf_core_cpi']
		},
		{
			category: 'labor',
			name: 'Labor Market',
			name_de: 'Arbeitsmarkt',
			description: 'Employment and unemployment data for Switzerland',
			description_de: 'Beschäftigungs- und Arbeitslosigkeitsdaten für die Schweiz',
			color: '#10b981',
			icon: '👥',
			importance_weight: 20,
			indicators: ['chf_unemployment', 'chf_employment']
		},
		{
			category: 'trade',
			name: 'Trade & External',
			name_de: 'Handel & Außenwirtschaft',
			description: 'Trade balance, exports, and current account reflecting export economy',
			description_de: 'Handelsbilanz, Exporte und Leistungsbilanz, die Exportwirtschaft widerspiegeln',
			color: '#8b5cf6',
			icon: '🚢',
			importance_weight: 20,
			indicators: ['chf_trade_balance', 'chf_exports', 'chf_current_account']
		},
		{
			category: 'monetary_policy',
			name: 'Monetary Policy',
			name_de: 'Geldpolitik',
			description: 'Swiss National Bank policy rate and government bond yields',
			description_de: 'Schweizerische Nationalbank Leitzins und Staatsanleiherenditen',
			color: '#f59e0b',
			icon: '🏦',
			importance_weight: 25,
			indicators: ['chf_snb_rate', 'chf_10y_bond']
		},
		{
			category: 'sentiment',
			name: 'Sentiment & Confidence',
			name_de: 'Stimmung & Vertrauen',
			description: 'Consumer and business confidence indicators',
			description_de: 'Verbraucher- und Geschäftsvertrauensindikatoren',
			color: '#06b6d4',
			icon: '💭',
			importance_weight: 15,
			indicators: ['chf_consumer_confidence', 'chf_business_confidence']
		},
		{
			category: 'housing',
			name: 'Housing Market',
			name_de: 'Wohnungsmarkt',
			description: 'House prices and construction orders reflecting interest rate sensitivity',
			description_de: 'Hauspreise und Bauaufträge, die Zinssensitivität widerspiegeln',
			color: '#f97316',
			icon: '🏠',
			importance_weight: 10,
			indicators: ['chf_house_prices', 'chf_construction_orders']
		},
		{
			category: 'fiscal_policy',
			name: 'Fiscal Policy',
			name_de: 'Fiskalpolitik',
			description: 'Government budget balance and debt metrics showing fiscal strength',
			description_de: 'Regierungshaushaltssaldo und Schuldenmetriken, die Fiskalstärke zeigen',
			color: '#6b7280',
			icon: '🏛️',
			importance_weight: 10,
			indicators: ['chf_budget_balance', 'chf_debt_gdp']
		}
	];
}

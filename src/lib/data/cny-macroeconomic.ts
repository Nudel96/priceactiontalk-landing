import type { 
	CNYMacroeconomicData, 
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
 * Generate comprehensive Chinese Yuan (CNY) macroeconomic data
 * Reflects China's state-controlled economy and PBOC monetary policy
 */
export function generateCNYMacroeconomicData(): CNYMacroeconomicData {
	const now = new Date().toISOString();
	
	return {
		// Growth Indicators
		gdp_growth_rate: {
			id: 'cny_gdp_growth',
			name: 'China GDP Growth Rate',
			name_de: 'China BIP-Wachstumsrate',
			category: 'growth',
			country: 'China',
			current_value: 5.2,
			previous_value: 4.9,
			forecast_value: 5.0,
			change_absolute: 0.3,
			change_percent: 6.1,
			unit: '% yoy',
			frequency: 'Quarterly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-04-16T02:00:00Z',
			market_impact_explanation: 'GDP growth above 5% target shows economic resilience, supportive for CNY and global commodity demand.',
			market_impact_explanation_de: 'BIP-Wachstum über 5%-Ziel zeigt wirtschaftliche Widerstandsfähigkeit, unterstützt CNY und globale Rohstoffnachfrage.',
			source: 'National Bureau of Statistics',
			historical_data: generateHistoricalData(5.2, 12, 0.3, -0.1)
		},

		industrial_production: {
			id: 'cny_industrial_production',
			name: 'China Industrial Production',
			name_de: 'China Industrieproduktion',
			category: 'growth',
			country: 'China',
			current_value: 7.0,
			previous_value: 6.8,
			forecast_value: 6.5,
			change_absolute: 0.2,
			change_percent: 2.9,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-18T02:00:00Z',
			market_impact_explanation: 'Strong industrial production shows manufacturing sector recovery, positive for CNY and global trade.',
			market_impact_explanation_de: 'Starke Industrieproduktion zeigt Erholung des Fertigungssektors, positiv für CNY und globalen Handel.',
			source: 'National Bureau of Statistics',
			historical_data: generateHistoricalData(7.0, 24, 0.8, 0.2)
		},

		retail_sales: {
			id: 'cny_retail_sales',
			name: 'China Retail Sales',
			name_de: 'China Einzelhandelsumsätze',
			category: 'growth',
			country: 'China',
			current_value: 5.5,
			previous_value: 5.0,
			forecast_value: 5.2,
			change_absolute: 0.5,
			change_percent: 10.0,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-18T02:00:00Z',
			market_impact_explanation: 'Accelerating retail sales show domestic consumption recovery, supporting economic rebalancing.',
			market_impact_explanation_de: 'Beschleunigende Einzelhandelsumsätze zeigen Erholung des Inlandsverbrauchs, unterstützt wirtschaftliche Neuausrichtung.',
			source: 'National Bureau of Statistics',
			historical_data: generateHistoricalData(5.5, 24, 0.6, 0.2)
		},

		// Inflation Metrics
		cpi: {
			id: 'cny_cpi',
			name: 'China Consumer Price Index',
			name_de: 'China Verbraucherpreisindex',
			category: 'inflation',
			country: 'China',
			current_value: -0.8,
			previous_value: -0.3,
			forecast_value: -0.5,
			change_absolute: -0.5,
			change_percent: -166.7,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-09T01:30:00Z',
			market_impact_explanation: 'Deflation concerns weigh on CNY as weak consumer prices suggest domestic demand challenges.',
			market_impact_explanation_de: 'Deflationssorgen belasten CNY, da schwache Verbraucherpreise Herausforderungen der Inlandsnachfrage andeuten.',
			source: 'National Bureau of Statistics',
			historical_data: generateHistoricalData(-0.8, 24, 0.4, -0.1)
		},

		ppi: {
			id: 'cny_ppi',
			name: 'China Producer Price Index',
			name_de: 'China Erzeugerpreisindex',
			category: 'inflation',
			country: 'China',
			current_value: -2.5,
			previous_value: -2.7,
			forecast_value: -2.2,
			change_absolute: 0.2,
			change_percent: 7.4,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-09T01:30:00Z',
			market_impact_explanation: 'PPI deflation moderating suggests industrial price pressures stabilizing.',
			market_impact_explanation_de: 'Moderierende PPI-Deflation deutet darauf hin, dass sich industrielle Preisdrücke stabilisieren.',
			source: 'National Bureau of Statistics',
			historical_data: generateHistoricalData(-2.5, 24, 1.0, 0.3)
		},

		// Labor Market Data
		unemployment_rate: {
			id: 'cny_unemployment',
			name: 'China Urban Unemployment Rate',
			name_de: 'China Städtische Arbeitslosenquote',
			category: 'labor',
			country: 'China',
			current_value: 5.2,
			previous_value: 5.1,
			forecast_value: 5.3,
			change_absolute: 0.1,
			change_percent: 2.0,
			unit: '%',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-18T02:00:00Z',
			market_impact_explanation: 'Stable unemployment rate shows labor market resilience amid economic transition.',
			market_impact_explanation_de: 'Stabile Arbeitslosenquote zeigt Arbeitsmarkt-Widerstandsfähigkeit bei wirtschaftlichem Wandel.',
			source: 'National Bureau of Statistics',
			historical_data: generateHistoricalData(5.2, 24, 0.2, 0.05)
		},

		youth_unemployment: {
			id: 'cny_youth_unemployment',
			name: 'Youth Unemployment Rate (16-24)',
			name_de: 'Jugendarbeitslosigkeit (16-24)',
			category: 'labor',
			country: 'China',
			current_value: 14.9,
			previous_value: 15.3,
			forecast_value: 15.0,
			change_absolute: -0.4,
			change_percent: -2.6,
			unit: '%',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-18T02:00:00Z',
			market_impact_explanation: 'High youth unemployment remains a structural challenge for China\'s economy.',
			market_impact_explanation_de: 'Hohe Jugendarbeitslosigkeit bleibt eine strukturelle Herausforderung für Chinas Wirtschaft.',
			source: 'National Bureau of Statistics',
			historical_data: generateHistoricalData(14.9, 24, 1.0, -0.2)
		},

		// Trade & Balance of Payments
		trade_balance: {
			id: 'cny_trade_balance',
			name: 'China Trade Balance',
			name_de: 'China Handelsbilanz',
			category: 'trade',
			country: 'China',
			current_value: 75.3,
			previous_value: 68.2,
			forecast_value: 70.0,
			change_absolute: 7.1,
			change_percent: 10.4,
			unit: 'billion usd',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-07T02:00:00Z',
			market_impact_explanation: 'Large trade surplus shows export competitiveness, supportive for CNY despite trade tensions.',
			market_impact_explanation_de: 'Großer Handelsüberschuss zeigt Exportwettbewerbsfähigkeit, unterstützt CNY trotz Handelsspannungen.',
			source: 'General Administration of Customs',
			historical_data: generateHistoricalData(75.3, 24, 8.0, 1.0)
		},

		exports: {
			id: 'cny_exports',
			name: 'China Exports',
			name_de: 'China Exporte',
			category: 'trade',
			country: 'China',
			current_value: 7.1,
			previous_value: -7.5,
			forecast_value: 2.0,
			change_absolute: 14.6,
			change_percent: 194.7,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-07T02:00:00Z',
			market_impact_explanation: 'Strong export rebound shows global demand recovery and Chinese competitiveness.',
			market_impact_explanation_de: 'Starke Exporterholung zeigt globale Nachfrageerholung und chinesische Wettbewerbsfähigkeit.',
			source: 'General Administration of Customs',
			historical_data: generateHistoricalData(7.1, 24, 5.0, 2.0)
		},

		imports: {
			id: 'cny_imports',
			name: 'China Imports',
			name_de: 'China Importe',
			category: 'trade',
			country: 'China',
			current_value: 3.5,
			previous_value: -3.2,
			forecast_value: 1.0,
			change_absolute: 6.7,
			change_percent: 209.4,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-07T02:00:00Z',
			market_impact_explanation: 'Import growth shows domestic demand recovery, positive for global commodity exporters.',
			market_impact_explanation_de: 'Importwachstum zeigt Erholung der Inlandsnachfrage, positiv für globale Rohstoffexporteure.',
			source: 'General Administration of Customs',
			historical_data: generateHistoricalData(3.5, 24, 4.0, 1.5)
		},

		// Monetary Policy
		pboc_1y_mlf_rate: {
			id: 'cny_mlf_rate',
			name: 'PBOC 1Y MLF Rate',
			name_de: 'PBOC 1J MLF-Satz',
			category: 'monetary_policy',
			country: 'China',
			current_value: 2.50,
			previous_value: 2.50,
			forecast_value: 2.30,
			change_absolute: 0.0,
			change_percent: 0.0,
			unit: '%',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-15T02:00:00Z',
			market_impact_explanation: 'PBOC holding MLF rate steady but market expects cuts to support growth, weighing on CNY.',
			market_impact_explanation_de: 'PBOC hält MLF-Satz stabil, aber Markt erwartet Senkungen zur Wachstumsunterstützung, belastet CNY.',
			source: 'People\'s Bank of China',
			historical_data: generateHistoricalData(2.50, 24, 0.15, -0.05)
		},

		lpr_1y: {
			id: 'cny_lpr_1y',
			name: 'Loan Prime Rate 1Y',
			name_de: 'Kreditzinssatz 1J',
			category: 'monetary_policy',
			country: 'China',
			current_value: 3.45,
			previous_value: 3.45,
			forecast_value: 3.30,
			change_absolute: 0.0,
			change_percent: 0.0,
			unit: '%',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-20T01:15:00Z',
			market_impact_explanation: 'LPR unchanged but expected cuts to support lending and economic growth.',
			market_impact_explanation_de: 'LPR unverändert, aber erwartete Senkungen zur Unterstützung von Krediten und Wirtschaftswachstum.',
			source: 'People\'s Bank of China',
			historical_data: generateHistoricalData(3.45, 24, 0.15, -0.03)
		},

		government_bond_10y: {
			id: 'cny_10y_bond',
			name: 'China 10Y Government Bond',
			name_de: 'China 10J Staatsanleihe',
			category: 'monetary_policy',
			country: 'China',
			current_value: 2.35,
			previous_value: 2.42,
			forecast_value: 2.30,
			change_absolute: -0.07,
			change_percent: -2.9,
			unit: '%',
			frequency: 'Daily',
			impact: 'medium',
			last_updated: now,
			next_release: 'Continuous',
			market_impact_explanation: 'Falling bond yields reflect expectations for monetary easing to support growth.',
			market_impact_explanation_de: 'Fallende Anleiherenditen spiegeln Erwartungen für geldpolitische Lockerung zur Wachstumsunterstützung wider.',
			source: 'China Central Depository & Clearing',
			historical_data: generateHistoricalData(2.35, 24, 0.15, -0.02)
		},

		// Sentiment & Confidence
		manufacturing_pmi: {
			id: 'cny_manufacturing_pmi',
			name: 'China Manufacturing PMI',
			name_de: 'China Verarbeitendes Gewerbe PMI',
			category: 'sentiment',
			country: 'China',
			current_value: 50.8,
			previous_value: 49.2,
			forecast_value: 50.0,
			change_absolute: 1.6,
			change_percent: 3.3,
			unit: 'index',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-31T01:00:00Z',
			market_impact_explanation: 'PMI above 50 shows manufacturing expansion, positive for CNY and global commodity demand.',
			market_impact_explanation_de: 'PMI über 50 zeigt Fertigungsexpansion, positiv für CNY und globale Rohstoffnachfrage.',
			source: 'National Bureau of Statistics',
			historical_data: generateHistoricalData(50.8, 24, 1.5, 0.3)
		},

		services_pmi: {
			id: 'cny_services_pmi',
			name: 'China Services PMI',
			name_de: 'China Dienstleistungs-PMI',
			category: 'sentiment',
			country: 'China',
			current_value: 52.7,
			previous_value: 50.7,
			forecast_value: 51.5,
			change_absolute: 2.0,
			change_percent: 3.9,
			unit: 'index',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-05T01:45:00Z',
			market_impact_explanation: 'Strong services PMI shows domestic consumption recovery, supporting economic rebalancing.',
			market_impact_explanation_de: 'Starker Dienstleistungs-PMI zeigt Erholung des Inlandsverbrauchs, unterstützt wirtschaftliche Neuausrichtung.',
			source: 'Caixin/S&P Global',
			historical_data: generateHistoricalData(52.7, 24, 1.2, 0.4)
		},

		// Housing Market
		property_investment: {
			id: 'cny_property_investment',
			name: 'Property Investment',
			name_de: 'Immobilieninvestitionen',
			category: 'housing',
			country: 'China',
			current_value: -9.6,
			previous_value: -9.8,
			forecast_value: -8.5,
			change_absolute: 0.2,
			change_percent: 2.0,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-18T02:00:00Z',
			market_impact_explanation: 'Property investment decline moderating suggests real estate sector stabilizing.',
			market_impact_explanation_de: 'Moderierende Immobilieninvestitionsrückgänge deuten auf Stabilisierung des Immobiliensektors hin.',
			source: 'National Bureau of Statistics',
			historical_data: generateHistoricalData(-9.6, 24, 2.0, 1.0)
		},

		new_home_prices: {
			id: 'cny_new_home_prices',
			name: 'New Home Prices',
			name_de: 'Neue Hauspreise',
			category: 'housing',
			country: 'China',
			current_value: -0.3,
			previous_value: -0.4,
			forecast_value: -0.2,
			change_absolute: 0.1,
			change_percent: 25.0,
			unit: '% mom',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-15T02:00:00Z',
			market_impact_explanation: 'Home price declines moderating shows property market finding bottom.',
			market_impact_explanation_de: 'Moderierende Hauspreisrückgänge zeigen, dass Immobilienmarkt Boden findet.',
			source: 'National Bureau of Statistics',
			historical_data: generateHistoricalData(-0.3, 24, 0.3, 0.1)
		},

		// Fiscal Policy
		fiscal_revenue: {
			id: 'cny_fiscal_revenue',
			name: 'Fiscal Revenue',
			name_de: 'Fiskaleinnahmen',
			category: 'fiscal_policy',
			country: 'China',
			current_value: 2.8,
			previous_value: -3.2,
			forecast_value: 3.5,
			change_absolute: 6.0,
			change_percent: 187.5,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'low',
			last_updated: now,
			next_release: '2024-03-18T02:00:00Z',
			market_impact_explanation: 'Fiscal revenue growth shows improving economic activity and tax collection.',
			market_impact_explanation_de: 'Fiskaleinnahmenwachstum zeigt sich verbessernde Wirtschaftsaktivität und Steuererhebung.',
			source: 'Ministry of Finance',
			historical_data: generateHistoricalData(2.8, 24, 3.0, 1.0)
		},

		local_government_debt: {
			id: 'cny_local_debt',
			name: 'Local Government Debt',
			name_de: 'Lokalregierungsschulden',
			category: 'fiscal_policy',
			country: 'China',
			current_value: 35.1,
			previous_value: 34.8,
			forecast_value: 35.5,
			change_absolute: 0.3,
			change_percent: 0.9,
			unit: 'trillion cny',
			frequency: 'Quarterly',
			impact: 'low',
			last_updated: now,
			next_release: '2024-04-16T02:00:00Z',
			market_impact_explanation: 'Rising local government debt remains a structural risk for China\'s fiscal stability.',
			market_impact_explanation_de: 'Steigende Lokalregierungsschulden bleiben ein strukturelles Risiko für Chinas Fiskalstabilität.',
			source: 'Ministry of Finance',
			historical_data: generateHistoricalData(35.1, 12, 1.0, 0.3)
		}
	};
}

/**
 * Generate Chinese Yuan (CNY) indicator categories configuration
 */
export function generateCNYIndicatorCategories(): IndicatorCategoryConfig[] {
	return [
		{
			category: 'growth',
			name: 'Economic Growth',
			name_de: 'Wirtschaftswachstum',
			description: 'GDP growth, industrial production, and retail sales for China',
			description_de: 'BIP-Wachstum, Industrieproduktion und Einzelhandelsumsätze für China',
			color: '#3b82f6',
			icon: '📈',
			importance_weight: 30,
			indicators: ['cny_gdp_growth', 'cny_industrial_production', 'cny_retail_sales']
		},
		{
			category: 'inflation',
			name: 'Inflation Metrics',
			name_de: 'Inflationsmetriken',
			description: 'Consumer and producer price indices showing deflationary pressures',
			description_de: 'Verbraucher- und Erzeugerpreisindizes, die deflationäre Drücke zeigen',
			color: '#ef4444',
			icon: '📊',
			importance_weight: 25,
			indicators: ['cny_cpi', 'cny_ppi']
		},
		{
			category: 'labor',
			name: 'Labor Market',
			name_de: 'Arbeitsmarkt',
			description: 'Urban unemployment and youth unemployment data',
			description_de: 'Städtische Arbeitslosigkeit und Jugendarbeitslosigkeitsdaten',
			color: '#10b981',
			icon: '👥',
			importance_weight: 15,
			indicators: ['cny_unemployment', 'cny_youth_unemployment']
		},
		{
			category: 'trade',
			name: 'Trade & External',
			name_de: 'Handel & Außenwirtschaft',
			description: 'Trade balance, exports, and imports reflecting global trade position',
			description_de: 'Handelsbilanz, Exporte und Importe, die globale Handelsposition widerspiegeln',
			color: '#8b5cf6',
			icon: '🚢',
			importance_weight: 25,
			indicators: ['cny_trade_balance', 'cny_exports', 'cny_imports']
		},
		{
			category: 'monetary_policy',
			name: 'Monetary Policy',
			name_de: 'Geldpolitik',
			description: 'PBOC policy rates and government bond yields',
			description_de: 'PBOC-Politikzinsen und Staatsanleiherenditen',
			color: '#f59e0b',
			icon: '🏦',
			importance_weight: 20,
			indicators: ['cny_mlf_rate', 'cny_lpr_1y', 'cny_10y_bond']
		},
		{
			category: 'sentiment',
			name: 'Sentiment & Confidence',
			name_de: 'Stimmung & Vertrauen',
			description: 'Manufacturing and services PMI indicators',
			description_de: 'Fertigungs- und Dienstleistungs-PMI-Indikatoren',
			color: '#06b6d4',
			icon: '💭',
			importance_weight: 20,
			indicators: ['cny_manufacturing_pmi', 'cny_services_pmi']
		},
		{
			category: 'housing',
			name: 'Housing Market',
			name_de: 'Wohnungsmarkt',
			description: 'Property investment and new home prices reflecting real estate sector',
			description_de: 'Immobilieninvestitionen und neue Hauspreise, die Immobiliensektor widerspiegeln',
			color: '#f97316',
			icon: '🏠',
			importance_weight: 15,
			indicators: ['cny_property_investment', 'cny_new_home_prices']
		},
		{
			category: 'fiscal_policy',
			name: 'Fiscal Policy',
			name_de: 'Fiskalpolitik',
			description: 'Fiscal revenue and local government debt metrics',
			description_de: 'Fiskaleinnahmen und Lokalregierungsschuldenmetriken',
			color: '#6b7280',
			icon: '🏛️',
			importance_weight: 10,
			indicators: ['cny_fiscal_revenue', 'cny_local_debt']
		}
	];
}

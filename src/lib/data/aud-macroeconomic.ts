import type { 
	AUDMacroeconomicData, 
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
 * Generate comprehensive Australian Dollar (AUD) macroeconomic data
 * Reflects Australia's commodity-dependent economy and RBA monetary policy
 */
export function generateAUDMacroeconomicData(): AUDMacroeconomicData {
	const now = new Date().toISOString();
	
	return {
		// Growth Indicators
		gdp_growth_rate: {
			id: 'aud_gdp_growth',
			name: 'Australia GDP Growth Rate',
			name_de: 'Australien BIP-Wachstumsrate',
			category: 'growth',
			country: 'Australia',
			current_value: 0.2,
			previous_value: 0.5,
			forecast_value: 0.3,
			change_absolute: -0.3,
			change_percent: -60.0,
			unit: '% qoq',
			frequency: 'Quarterly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-06T00:30:00Z',
			market_impact_explanation: 'Slower GDP growth reflects economic headwinds from China slowdown and high interest rates, weighing on AUD.',
			market_impact_explanation_de: 'Langsameres BIP-Wachstum spiegelt wirtschaftliche Gegenwinds durch China-Verlangsamung und hohe Zinsen wider, belastet AUD.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(0.2, 12, 0.3, -0.05)
		},

		retail_sales: {
			id: 'aud_retail_sales',
			name: 'Australia Retail Sales',
			name_de: 'Australien Einzelhandelsumsätze',
			category: 'growth',
			country: 'Australia',
			current_value: -0.2,
			previous_value: 0.1,
			forecast_value: 0.1,
			change_absolute: -0.3,
			change_percent: -300.0,
			unit: '% mom',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-05T00:30:00Z',
			market_impact_explanation: 'Declining retail sales show consumer spending weakness amid cost-of-living pressures, negative for AUD.',
			market_impact_explanation_de: 'Rückläufige Einzelhandelsumsätze zeigen Verbraucherschwäche bei Lebenshaltungskosten-Druck, negativ für AUD.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(-0.2, 24, 0.4, -0.1)
		},

		business_confidence: {
			id: 'aud_business_confidence',
			name: 'NAB Business Confidence',
			name_de: 'NAB Geschäftsvertrauen',
			category: 'growth',
			country: 'Australia',
			current_value: -5,
			previous_value: -8,
			forecast_value: -3,
			change_absolute: 3,
			change_percent: 37.5,
			unit: 'index',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-12T00:30:00Z',
			market_impact_explanation: 'Improving business confidence suggests economic conditions stabilizing, supportive for AUD.',
			market_impact_explanation_de: 'Sich verbesserndes Geschäftsvertrauen deutet auf stabilisierende Wirtschaftsbedingungen hin, unterstützend für AUD.',
			source: 'National Australia Bank',
			historical_data: generateHistoricalData(-5, 24, 3.0, 1.0)
		},

		// Inflation Metrics
		cpi: {
			id: 'aud_cpi',
			name: 'Australia Consumer Price Index',
			name_de: 'Australien Verbraucherpreisindex',
			category: 'inflation',
			country: 'Australia',
			current_value: 4.1,
			previous_value: 4.9,
			forecast_value: 3.8,
			change_absolute: -0.8,
			change_percent: -16.3,
			unit: '% yoy',
			frequency: 'Quarterly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-04-24T01:30:00Z',
			market_impact_explanation: 'CPI moving toward RBA target supports potential for rate cuts, weighing on AUD.',
			market_impact_explanation_de: 'VPI bewegt sich auf RBA-Ziel zu und unterstützt Potenzial für Zinssenkungen, belastet AUD.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(4.1, 12, 0.5, -0.3)
		},

		trimmed_mean_cpi: {
			id: 'aud_trimmed_mean_cpi',
			name: 'Trimmed Mean CPI',
			name_de: 'Getrimmter Mittelwert VPI',
			category: 'inflation',
			country: 'Australia',
			current_value: 4.0,
			previous_value: 4.2,
			forecast_value: 3.7,
			change_absolute: -0.2,
			change_percent: -4.8,
			unit: '% yoy',
			frequency: 'Quarterly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-04-24T01:30:00Z',
			market_impact_explanation: 'RBA\'s preferred inflation measure showing disinflation trend, supporting dovish policy expectations.',
			market_impact_explanation_de: 'RBAs bevorzugtes Inflationsmaß zeigt Desinflationstrend, unterstützt taubenhafte Politikerwartungen.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(4.0, 12, 0.3, -0.2)
		},

		// Labor Market Data
		unemployment_rate: {
			id: 'aud_unemployment',
			name: 'Australia Unemployment Rate',
			name_de: 'Australien Arbeitslosenquote',
			category: 'labor',
			country: 'Australia',
			current_value: 3.9,
			previous_value: 3.7,
			forecast_value: 4.0,
			change_absolute: 0.2,
			change_percent: 5.4,
			unit: '%',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-14T00:30:00Z',
			market_impact_explanation: 'Rising unemployment suggests labor market cooling, reducing wage pressure and supporting RBA dovish stance.',
			market_impact_explanation_de: 'Steigende Arbeitslosigkeit deutet auf abkühlenden Arbeitsmarkt hin, reduziert Lohndruck und unterstützt RBA-Taubenhaltung.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(3.9, 24, 0.3, 0.1)
		},

		employment_change: {
			id: 'aud_employment_change',
			name: 'Employment Change',
			name_de: 'Beschäftigungsveränderung',
			category: 'labor',
			country: 'Australia',
			current_value: 64800,
			previous_value: 61500,
			forecast_value: 25000,
			change_absolute: 3300,
			change_percent: 5.4,
			unit: 'persons',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-14T00:30:00Z',
			market_impact_explanation: 'Strong employment growth above expectations supports AUD, showing labor market resilience.',
			market_impact_explanation_de: 'Starkes Beschäftigungswachstum über Erwartungen unterstützt AUD, zeigt Arbeitsmarkt-Widerstandsfähigkeit.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(64800, 24, 25000, -2000)
		},

		participation_rate: {
			id: 'aud_participation_rate',
			name: 'Labor Force Participation Rate',
			name_de: 'Erwerbsquote',
			category: 'labor',
			country: 'Australia',
			current_value: 66.6,
			previous_value: 66.8,
			forecast_value: 66.7,
			change_absolute: -0.2,
			change_percent: -0.3,
			unit: '%',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-14T00:30:00Z',
			market_impact_explanation: 'Stable participation rate shows continued labor market engagement despite economic headwinds.',
			market_impact_explanation_de: 'Stabile Erwerbsquote zeigt anhaltende Arbeitsmarktbeteiligung trotz wirtschaftlicher Gegenwinds.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(66.6, 24, 0.3, -0.05)
		},

		// Trade & Balance of Payments
		trade_balance: {
			id: 'aud_trade_balance',
			name: 'Australia Trade Balance',
			name_de: 'Australien Handelsbilanz',
			category: 'trade',
			country: 'Australia',
			current_value: 11.0,
			previous_value: 11.9,
			forecast_value: 10.5,
			change_absolute: -0.9,
			change_percent: -7.6,
			unit: 'billion aud',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-07T00:30:00Z',
			market_impact_explanation: 'Strong trade surplus supported by commodity exports, particularly iron ore to China, positive for AUD.',
			market_impact_explanation_de: 'Starker Handelsüberschuss unterstützt durch Rohstoffexporte, besonders Eisenerz nach China, positiv für AUD.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(11.0, 24, 2.0, -0.2)
		},

		exports: {
			id: 'aud_exports',
			name: 'Australia Exports',
			name_de: 'Australien Exporte',
			category: 'trade',
			country: 'Australia',
			current_value: 1.2,
			previous_value: -0.8,
			forecast_value: 0.5,
			change_absolute: 2.0,
			change_percent: 250.0,
			unit: '% mom',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-07T00:30:00Z',
			market_impact_explanation: 'Export growth driven by commodity demand, especially from China, strongly supports AUD.',
			market_impact_explanation_de: 'Exportwachstum angetrieben durch Rohstoffnachfrage, besonders aus China, unterstützt AUD stark.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(1.2, 24, 2.5, 0.1)
		},

		current_account_balance: {
			id: 'aud_current_account',
			name: 'Current Account Balance',
			name_de: 'Leistungsbilanz',
			category: 'trade',
			country: 'Australia',
			current_value: 14.2,
			previous_value: 18.3,
			forecast_value: 12.0,
			change_absolute: -4.1,
			change_percent: -22.4,
			unit: 'billion aud',
			frequency: 'Quarterly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-05T00:30:00Z',
			market_impact_explanation: 'Current account surplus remains strong despite decline, reflecting commodity export strength.',
			market_impact_explanation_de: 'Leistungsbilanzüberschuss bleibt trotz Rückgang stark, spiegelt Rohstoffexportstärke wider.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(14.2, 12, 3.0, -1.0)
		},

		// Monetary Policy
		rba_cash_rate: {
			id: 'aud_rba_cash_rate',
			name: 'RBA Cash Rate',
			name_de: 'RBA Leitzins',
			category: 'monetary_policy',
			country: 'Australia',
			current_value: 4.35,
			previous_value: 4.35,
			forecast_value: 4.10,
			change_absolute: 0.0,
			change_percent: 0.0,
			unit: '%',
			frequency: '11 meetings per year',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-19T03:30:00Z',
			market_impact_explanation: 'RBA holding rates steady but market pricing in cuts as inflation moderates, weighing on AUD.',
			market_impact_explanation_de: 'RBA hält Zinsen stabil, aber Markt preist Senkungen ein da Inflation moderiert, belastet AUD.',
			source: 'Reserve Bank of Australia',
			historical_data: generateHistoricalData(4.35, 24, 0.25, -0.1)
		},

		government_bond_10y: {
			id: 'aud_10y_bond',
			name: 'Australia 10Y Government Bond',
			name_de: 'Australien 10J Staatsanleihe',
			category: 'monetary_policy',
			country: 'Australia',
			current_value: 4.12,
			previous_value: 4.28,
			forecast_value: 3.95,
			change_absolute: -0.16,
			change_percent: -3.7,
			unit: '%',
			frequency: 'Daily',
			impact: 'medium',
			last_updated: now,
			next_release: 'Continuous',
			market_impact_explanation: 'Falling bond yields reflect expectations for RBA rate cuts, reducing AUD yield advantage.',
			market_impact_explanation_de: 'Fallende Anleiherenditen spiegeln Erwartungen für RBA-Zinssenkungen wider, reduziert AUD-Renditevorteil.',
			source: 'Reserve Bank of Australia',
			historical_data: generateHistoricalData(4.12, 24, 0.3, -0.05)
		},

		// Sentiment & Confidence
		consumer_confidence: {
			id: 'aud_consumer_confidence',
			name: 'Westpac Consumer Confidence',
			name_de: 'Westpac Verbrauchervertrauen',
			category: 'sentiment',
			country: 'Australia',
			current_value: 83.2,
			previous_value: 78.8,
			forecast_value: 85.0,
			change_absolute: 4.4,
			change_percent: 5.6,
			unit: 'index',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-13T00:30:00Z',
			market_impact_explanation: 'Improving consumer confidence suggests household spending may stabilize, supportive for AUD.',
			market_impact_explanation_de: 'Sich verbesserndes Verbrauchervertrauen deutet darauf hin, dass Haushaltsausgaben stabilisieren könnten, unterstützend für AUD.',
			source: 'Westpac Banking Corporation',
			historical_data: generateHistoricalData(83.2, 24, 5.0, 2.0)
		},

		// Housing Market
		house_price_index: {
			id: 'aud_house_prices',
			name: 'Australia House Price Index',
			name_de: 'Australien Hauspreisindex',
			category: 'housing',
			country: 'Australia',
			current_value: 0.8,
			previous_value: 0.5,
			forecast_value: 0.6,
			change_absolute: 0.3,
			change_percent: 60.0,
			unit: '% qoq',
			frequency: 'Quarterly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-12T00:30:00Z',
			market_impact_explanation: 'Accelerating house price growth shows housing market resilience despite high rates.',
			market_impact_explanation_de: 'Beschleunigendes Hauspreisenwachstum zeigt Widerstandsfähigkeit des Wohnungsmarkts trotz hoher Zinsen.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(0.8, 12, 0.4, 0.1)
		},

		building_approvals: {
			id: 'aud_building_approvals',
			name: 'Building Approvals',
			name_de: 'Baugenehmigungen',
			category: 'housing',
			country: 'Australia',
			current_value: -6.2,
			previous_value: 9.9,
			forecast_value: -2.0,
			change_absolute: -16.1,
			change_percent: -162.6,
			unit: '% mom',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-11T00:30:00Z',
			market_impact_explanation: 'Declining building approvals reflect high construction costs and interest rates impacting housing supply.',
			market_impact_explanation_de: 'Rückläufige Baugenehmigungen spiegeln hohe Baukosten und Zinsen wider, die Wohnungsangebot beeinträchtigen.',
			source: 'Australian Bureau of Statistics',
			historical_data: generateHistoricalData(-6.2, 24, 8.0, -1.0)
		},

		// Fiscal Policy
		budget_balance: {
			id: 'aud_budget_balance',
			name: 'Australia Budget Balance',
			name_de: 'Australien Haushaltssaldo',
			category: 'fiscal_policy',
			country: 'Australia',
			current_value: 22.1,
			previous_value: -32.0,
			forecast_value: 15.0,
			change_absolute: 54.1,
			change_percent: 169.1,
			unit: 'billion aud',
			frequency: 'Annual',
			impact: 'low',
			last_updated: now,
			next_release: '2024-05-14T04:30:00Z',
			market_impact_explanation: 'Budget surplus supported by commodity revenues and strong employment, positive for fiscal outlook.',
			market_impact_explanation_de: 'Haushaltsüberschuss unterstützt durch Rohstoffeinnahmen und starke Beschäftigung, positiv für Fiskalausblick.',
			source: 'Australian Treasury',
			historical_data: generateHistoricalData(22.1, 12, 15.0, 5.0)
		},

		net_debt_to_gdp: {
			id: 'aud_net_debt_gdp',
			name: 'Net Debt to GDP',
			name_de: 'Nettoverschuldung zu BIP',
			category: 'fiscal_policy',
			country: 'Australia',
			current_value: 19.8,
			previous_value: 22.1,
			forecast_value: 18.5,
			change_absolute: -2.3,
			change_percent: -10.4,
			unit: '% of gdp',
			frequency: 'Annual',
			impact: 'low',
			last_updated: now,
			next_release: '2024-05-14T04:30:00Z',
			market_impact_explanation: 'Declining debt-to-GDP ratio shows improving fiscal position, supportive for long-term AUD outlook.',
			market_impact_explanation_de: 'Sinkendes Schulden-zu-BIP-Verhältnis zeigt sich verbessernde Fiskalposition, unterstützend für langfristige AUD-Aussichten.',
			source: 'Australian Treasury',
			historical_data: generateHistoricalData(19.8, 12, 1.5, -0.5)
		}
	};
}

/**
 * Generate Australian Dollar (AUD) indicator categories configuration
 */
export function generateAUDIndicatorCategories(): IndicatorCategoryConfig[] {
	return [
		{
			category: 'growth',
			name: 'Economic Growth',
			name_de: 'Wirtschaftswachstum',
			description: 'GDP growth, retail sales, and business confidence indicators for Australia',
			description_de: 'BIP-Wachstum, Einzelhandelsumsätze und Geschäftsvertrauensindikatoren für Australien',
			color: '#3b82f6',
			icon: '📈',
			importance_weight: 25,
			indicators: ['aud_gdp_growth', 'aud_retail_sales', 'aud_business_confidence']
		},
		{
			category: 'inflation',
			name: 'Inflation Metrics',
			name_de: 'Inflationsmetriken',
			description: 'Consumer price indices and inflation measures tracked by RBA',
			description_de: 'Verbraucherpreisindizes und Inflationsmaße, die von der RBA verfolgt werden',
			color: '#ef4444',
			icon: '📊',
			importance_weight: 30,
			indicators: ['aud_cpi', 'aud_trimmed_mean_cpi']
		},
		{
			category: 'labor',
			name: 'Labor Market',
			name_de: 'Arbeitsmarkt',
			description: 'Employment, unemployment, and labor force participation data',
			description_de: 'Beschäftigungs-, Arbeitslosigkeits- und Erwerbsquotendaten',
			color: '#10b981',
			icon: '👥',
			importance_weight: 25,
			indicators: ['aud_unemployment', 'aud_employment_change', 'aud_participation_rate']
		},
		{
			category: 'trade',
			name: 'Trade & External',
			name_de: 'Handel & Außenwirtschaft',
			description: 'Trade balance, exports, and current account reflecting commodity dependence',
			description_de: 'Handelsbilanz, Exporte und Leistungsbilanz, die Rohstoffabhängigkeit widerspiegeln',
			color: '#8b5cf6',
			icon: '🚢',
			importance_weight: 20,
			indicators: ['aud_trade_balance', 'aud_exports', 'aud_current_account']
		},
		{
			category: 'monetary_policy',
			name: 'Monetary Policy',
			name_de: 'Geldpolitik',
			description: 'RBA cash rate and government bond yields',
			description_de: 'RBA-Leitzins und Staatsanleiherenditen',
			color: '#f59e0b',
			icon: '🏦',
			importance_weight: 25,
			indicators: ['aud_rba_cash_rate', 'aud_10y_bond']
		},
		{
			category: 'sentiment',
			name: 'Sentiment & Confidence',
			name_de: 'Stimmung & Vertrauen',
			description: 'Consumer confidence and business sentiment indicators',
			description_de: 'Verbrauchervertrauen und Geschäftsstimmungsindikatoren',
			color: '#06b6d4',
			icon: '💭',
			importance_weight: 15,
			indicators: ['aud_consumer_confidence']
		},
		{
			category: 'housing',
			name: 'Housing Market',
			name_de: 'Wohnungsmarkt',
			description: 'House prices and building approvals reflecting interest rate sensitivity',
			description_de: 'Hauspreise und Baugenehmigungen, die Zinssensitivität widerspiegeln',
			color: '#f97316',
			icon: '🏠',
			importance_weight: 10,
			indicators: ['aud_house_prices', 'aud_building_approvals']
		},
		{
			category: 'fiscal_policy',
			name: 'Fiscal Policy',
			name_de: 'Fiskalpolitik',
			description: 'Government budget balance and debt metrics',
			description_de: 'Regierungshaushaltssaldo und Schuldenmetriken',
			color: '#6b7280',
			icon: '🏛️',
			importance_weight: 5,
			indicators: ['aud_budget_balance', 'aud_net_debt_gdp']
		}
	];
}

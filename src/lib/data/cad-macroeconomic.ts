import type { 
	CADMacroeconomicData, 
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
 * Generate comprehensive Canadian Dollar (CAD) macroeconomic data
 * Reflects Canada's resource-based economy and Bank of Canada monetary policy
 */
export function generateCADMacroeconomicData(): CADMacroeconomicData {
	const now = new Date().toISOString();
	
	return {
		// Growth Indicators
		gdp_growth_rate: {
			id: 'cad_gdp_growth',
			name: 'Canada GDP Growth Rate',
			name_de: 'Kanada BIP-Wachstumsrate',
			category: 'growth',
			country: 'Canada',
			current_value: 0.1,
			previous_value: -0.1,
			forecast_value: 0.2,
			change_absolute: 0.2,
			change_percent: 200.0,
			unit: '% qoq',
			frequency: 'Quarterly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-02-29T13:30:00Z',
			market_impact_explanation: 'Modest GDP growth shows economic resilience despite high interest rates, supportive for CAD.',
			market_impact_explanation_de: 'Bescheidenes BIP-Wachstum zeigt wirtschaftliche Widerstandsfähigkeit trotz hoher Zinsen, unterstützend für CAD.',
			source: 'Statistics Canada',
			historical_data: generateHistoricalData(0.1, 12, 0.3, 0.05)
		},

		retail_sales: {
			id: 'cad_retail_sales',
			name: 'Canada Retail Sales',
			name_de: 'Kanada Einzelhandelsumsätze',
			category: 'growth',
			country: 'Canada',
			current_value: 0.6,
			previous_value: -0.2,
			forecast_value: 0.3,
			change_absolute: 0.8,
			change_percent: 400.0,
			unit: '% mom',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-22T12:30:00Z',
			market_impact_explanation: 'Strong retail sales growth shows consumer spending resilience, positive for CAD and BoC policy outlook.',
			market_impact_explanation_de: 'Starkes Einzelhandelswachstum zeigt Widerstandsfähigkeit der Verbraucherausgaben, positiv für CAD und BoC-Politik.',
			source: 'Statistics Canada',
			historical_data: generateHistoricalData(0.6, 24, 0.5, 0.1)
		},

		manufacturing_sales: {
			id: 'cad_manufacturing_sales',
			name: 'Manufacturing Sales',
			name_de: 'Fertigungsumsätze',
			category: 'growth',
			country: 'Canada',
			current_value: 1.0,
			previous_value: -0.5,
			forecast_value: 0.5,
			change_absolute: 1.5,
			change_percent: 300.0,
			unit: '% mom',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-15T12:30:00Z',
			market_impact_explanation: 'Manufacturing sales rebound shows industrial sector recovery, supporting CAD strength.',
			market_impact_explanation_de: 'Erholung der Fertigungsumsätze zeigt Erholung des Industriesektors, unterstützt CAD-Stärke.',
			source: 'Statistics Canada',
			historical_data: generateHistoricalData(1.0, 24, 1.2, 0.2)
		},

		// Inflation Metrics
		cpi: {
			id: 'cad_cpi',
			name: 'Canada Consumer Price Index',
			name_de: 'Kanada Verbraucherpreisindex',
			category: 'inflation',
			country: 'Canada',
			current_value: 2.9,
			previous_value: 3.4,
			forecast_value: 2.7,
			change_absolute: -0.5,
			change_percent: -14.7,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-19T12:30:00Z',
			market_impact_explanation: 'CPI moving closer to BoC 2% target supports potential for rate cuts, weighing on CAD.',
			market_impact_explanation_de: 'VPI bewegt sich näher an BoC 2%-Ziel und unterstützt Potenzial für Zinssenkungen, belastet CAD.',
			source: 'Statistics Canada',
			historical_data: generateHistoricalData(2.9, 24, 0.4, -0.2)
		},

		core_cpi: {
			id: 'cad_core_cpi',
			name: 'Canada Core CPI',
			name_de: 'Kanada Kern-VPI',
			category: 'inflation',
			country: 'Canada',
			current_value: 3.2,
			previous_value: 3.5,
			forecast_value: 3.0,
			change_absolute: -0.3,
			change_percent: -8.6,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-19T12:30:00Z',
			market_impact_explanation: 'Core CPI decline shows underlying inflation pressures easing, supporting BoC dovish stance.',
			market_impact_explanation_de: 'Kern-VPI-Rückgang zeigt nachlassende zugrunde liegende Inflationsdrücke, unterstützt BoC-Taubenhaltung.',
			source: 'Statistics Canada',
			historical_data: generateHistoricalData(3.2, 24, 0.3, -0.15)
		},

		// Labor Market Data
		unemployment_rate: {
			id: 'cad_unemployment',
			name: 'Canada Unemployment Rate',
			name_de: 'Kanada Arbeitslosenquote',
			category: 'labor',
			country: 'Canada',
			current_value: 5.8,
			previous_value: 5.7,
			forecast_value: 5.9,
			change_absolute: 0.1,
			change_percent: 1.8,
			unit: '%',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-08T13:30:00Z',
			market_impact_explanation: 'Rising unemployment suggests labor market cooling, reducing wage pressure and supporting BoC dovish policy.',
			market_impact_explanation_de: 'Steigende Arbeitslosigkeit deutet auf abkühlenden Arbeitsmarkt hin, reduziert Lohndruck und unterstützt BoC-Taubenpolitik.',
			source: 'Statistics Canada',
			historical_data: generateHistoricalData(5.8, 24, 0.3, 0.1)
		},

		employment_change: {
			id: 'cad_employment_change',
			name: 'Employment Change',
			name_de: 'Beschäftigungsveränderung',
			category: 'labor',
			country: 'Canada',
			current_value: 37700,
			previous_value: -2800,
			forecast_value: 15000,
			change_absolute: 40500,
			change_percent: 1446.4,
			unit: 'persons',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-08T13:30:00Z',
			market_impact_explanation: 'Strong employment gains well above expectations support CAD, showing labor market resilience.',
			market_impact_explanation_de: 'Starke Beschäftigungszuwächse weit über Erwartungen unterstützen CAD, zeigen Arbeitsmarkt-Widerstandsfähigkeit.',
			source: 'Statistics Canada',
			historical_data: generateHistoricalData(37700, 24, 25000, -1000)
		},

		average_hourly_wages: {
			id: 'cad_hourly_wages',
			name: 'Average Hourly Wages',
			name_de: 'Durchschnittliche Stundenlöhne',
			category: 'labor',
			country: 'Canada',
			current_value: 5.0,
			previous_value: 5.2,
			forecast_value: 4.8,
			change_absolute: -0.2,
			change_percent: -3.8,
			unit: '% yoy',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-08T13:30:00Z',
			market_impact_explanation: 'Moderating wage growth reduces inflation pressure, supporting BoC pause in rate hikes.',
			market_impact_explanation_de: 'Moderierendes Lohnwachstum reduziert Inflationsdruck, unterstützt BoC-Pause bei Zinserhöhungen.',
			source: 'Statistics Canada',
			historical_data: generateHistoricalData(5.0, 24, 0.4, -0.1)
		},

		// Trade & Balance of Payments
		trade_balance: {
			id: 'cad_trade_balance',
			name: 'Canada Trade Balance',
			name_de: 'Kanada Handelsbilanz',
			category: 'trade',
			country: 'Canada',
			current_value: 0.8,
			previous_value: -0.5,
			forecast_value: 0.5,
			change_absolute: 1.3,
			change_percent: 260.0,
			unit: 'billion cad',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-05T13:30:00Z',
			market_impact_explanation: 'Return to trade surplus driven by energy and commodity exports, strongly supportive for CAD.',
			market_impact_explanation_de: 'Rückkehr zum Handelsüberschuss angetrieben durch Energie- und Rohstoffexporte, stark unterstützend für CAD.',
			source: 'Statistics Canada',
			historical_data: generateHistoricalData(0.8, 24, 1.5, 0.3)
		},

		exports: {
			id: 'cad_exports',
			name: 'Canada Exports',
			name_de: 'Kanada Exporte',
			category: 'trade',
			country: 'Canada',
			current_value: 2.1,
			previous_value: -1.2,
			forecast_value: 1.0,
			change_absolute: 3.3,
			change_percent: 275.0,
			unit: '% mom',
			frequency: 'Monthly',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-05T13:30:00Z',
			market_impact_explanation: 'Strong export growth led by energy and commodities, benefiting from global demand recovery.',
			market_impact_explanation_de: 'Starkes Exportwachstum angeführt von Energie und Rohstoffen, profitiert von globaler Nachfrageerholung.',
			source: 'Statistics Canada',
			historical_data: generateHistoricalData(2.1, 24, 2.0, 0.2)
		},

		current_account_balance: {
			id: 'cad_current_account',
			name: 'Current Account Balance',
			name_de: 'Leistungsbilanz',
			category: 'trade',
			country: 'Canada',
			current_value: -8.2,
			previous_value: -11.5,
			forecast_value: -7.0,
			change_absolute: 3.3,
			change_percent: 28.7,
			unit: 'billion cad',
			frequency: 'Quarterly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-02-29T13:30:00Z',
			market_impact_explanation: 'Improving current account deficit shows better external balance, supportive for CAD.',
			market_impact_explanation_de: 'Sich verbesserndes Leistungsbilanzdefizit zeigt bessere Außenbilanz, unterstützend für CAD.',
			source: 'Statistics Canada',
			historical_data: generateHistoricalData(-8.2, 12, 2.0, 1.0)
		},

		// Monetary Policy
		boc_overnight_rate: {
			id: 'cad_boc_rate',
			name: 'BoC Overnight Rate',
			name_de: 'BoC Tagesgeldsatz',
			category: 'monetary_policy',
			country: 'Canada',
			current_value: 5.00,
			previous_value: 5.00,
			forecast_value: 4.75,
			change_absolute: 0.0,
			change_percent: 0.0,
			unit: '%',
			frequency: '8 meetings per year',
			impact: 'high',
			last_updated: now,
			next_release: '2024-03-06T15:00:00Z',
			market_impact_explanation: 'BoC holding rates steady but market pricing in cuts as inflation moderates, weighing on CAD.',
			market_impact_explanation_de: 'BoC hält Zinsen stabil, aber Markt preist Senkungen ein da Inflation moderiert, belastet CAD.',
			source: 'Bank of Canada',
			historical_data: generateHistoricalData(5.00, 24, 0.25, -0.05)
		},

		government_bond_10y: {
			id: 'cad_10y_bond',
			name: 'Canada 10Y Government Bond',
			name_de: 'Kanada 10J Staatsanleihe',
			category: 'monetary_policy',
			country: 'Canada',
			current_value: 3.45,
			previous_value: 3.62,
			forecast_value: 3.30,
			change_absolute: -0.17,
			change_percent: -4.7,
			unit: '%',
			frequency: 'Daily',
			impact: 'medium',
			last_updated: now,
			next_release: 'Continuous',
			market_impact_explanation: 'Falling bond yields reflect expectations for BoC rate cuts, reducing CAD yield advantage.',
			market_impact_explanation_de: 'Fallende Anleiherenditen spiegeln Erwartungen für BoC-Zinssenkungen wider, reduziert CAD-Renditevorteil.',
			source: 'Bank of Canada',
			historical_data: generateHistoricalData(3.45, 24, 0.25, -0.03)
		},

		// Sentiment & Confidence
		consumer_confidence: {
			id: 'cad_consumer_confidence',
			name: 'Consumer Confidence Index',
			name_de: 'Verbrauchervertrauensindex',
			category: 'sentiment',
			country: 'Canada',
			current_value: 48.2,
			previous_value: 46.8,
			forecast_value: 49.0,
			change_absolute: 1.4,
			change_percent: 3.0,
			unit: 'index',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-28T14:00:00Z',
			market_impact_explanation: 'Improving consumer confidence suggests household spending may stabilize, supportive for CAD.',
			market_impact_explanation_de: 'Sich verbesserndes Verbrauchervertrauen deutet darauf hin, dass Haushaltsausgaben stabilisieren könnten, unterstützend für CAD.',
			source: 'Conference Board of Canada',
			historical_data: generateHistoricalData(48.2, 24, 3.0, 1.0)
		},

		business_outlook_survey: {
			id: 'cad_business_outlook',
			name: 'BoC Business Outlook Survey',
			name_de: 'BoC Geschäftsausblick-Umfrage',
			category: 'sentiment',
			country: 'Canada',
			current_value: -0.2,
			previous_value: -0.5,
			forecast_value: 0.0,
			change_absolute: 0.3,
			change_percent: 60.0,
			unit: 'balance of opinion',
			frequency: 'Quarterly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-04-15T14:00:00Z',
			market_impact_explanation: 'Less negative business outlook suggests improving economic sentiment, supportive for CAD.',
			market_impact_explanation_de: 'Weniger negativer Geschäftsausblick deutet auf sich verbessernde Wirtschaftsstimmung hin, unterstützend für CAD.',
			source: 'Bank of Canada',
			historical_data: generateHistoricalData(-0.2, 12, 0.4, 0.1)
		},

		// Housing Market
		housing_starts: {
			id: 'cad_housing_starts',
			name: 'Housing Starts',
			name_de: 'Wohnungsbaubeginn',
			category: 'housing',
			country: 'Canada',
			current_value: 240500,
			previous_value: 252800,
			forecast_value: 235000,
			change_absolute: -12300,
			change_percent: -4.9,
			unit: 'units annualized',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-18T13:15:00Z',
			market_impact_explanation: 'Declining housing starts reflect high interest rates impacting construction activity.',
			market_impact_explanation_de: 'Rückläufige Wohnungsbaubeginne spiegeln hohe Zinsen wider, die Bautätigkeit beeinträchtigen.',
			source: 'Canada Mortgage and Housing Corporation',
			historical_data: generateHistoricalData(240500, 24, 15000, -2000)
		},

		existing_home_sales: {
			id: 'cad_home_sales',
			name: 'Existing Home Sales',
			name_de: 'Verkäufe bestehender Häuser',
			category: 'housing',
			country: 'Canada',
			current_value: -0.3,
			previous_value: 3.1,
			forecast_value: 0.5,
			change_absolute: -3.4,
			change_percent: -109.7,
			unit: '% mom',
			frequency: 'Monthly',
			impact: 'medium',
			last_updated: now,
			next_release: '2024-03-15T14:00:00Z',
			market_impact_explanation: 'Declining home sales show housing market cooling under high interest rate pressure.',
			market_impact_explanation_de: 'Rückläufige Hausverkäufe zeigen Abkühlung des Wohnungsmarkts unter hohem Zinsdruck.',
			source: 'Canadian Real Estate Association',
			historical_data: generateHistoricalData(-0.3, 24, 2.5, -0.2)
		},

		// Fiscal Policy
		budget_balance: {
			id: 'cad_budget_balance',
			name: 'Canada Budget Balance',
			name_de: 'Kanada Haushaltssaldo',
			category: 'fiscal_policy',
			country: 'Canada',
			current_value: -40.0,
			previous_value: -35.3,
			forecast_value: -38.0,
			change_absolute: -4.7,
			change_percent: -13.3,
			unit: 'billion cad',
			frequency: 'Annual',
			impact: 'low',
			last_updated: now,
			next_release: '2024-04-16T16:00:00Z',
			market_impact_explanation: 'Widening budget deficit reflects economic support measures and lower commodity revenues.',
			market_impact_explanation_de: 'Sich erweiterndes Haushaltsdefizit spiegelt wirtschaftliche Unterstützungsmaßnahmen und niedrigere Rohstoffeinnahmen wider.',
			source: 'Department of Finance Canada',
			historical_data: generateHistoricalData(-40.0, 12, 8.0, -2.0)
		},

		net_debt_to_gdp: {
			id: 'cad_net_debt_gdp',
			name: 'Net Debt to GDP',
			name_de: 'Nettoverschuldung zu BIP',
			category: 'fiscal_policy',
			country: 'Canada',
			current_value: 42.4,
			previous_value: 41.7,
			forecast_value: 43.0,
			change_absolute: 0.7,
			change_percent: 1.7,
			unit: '% of gdp',
			frequency: 'Annual',
			impact: 'low',
			last_updated: now,
			next_release: '2024-04-16T16:00:00Z',
			market_impact_explanation: 'Gradually rising debt-to-GDP ratio reflects fiscal expansion, manageable but worth monitoring.',
			market_impact_explanation_de: 'Allmählich steigendes Schulden-zu-BIP-Verhältnis spiegelt Fiskalexpansion wider, beherrschbar aber überwachungswürdig.',
			source: 'Department of Finance Canada',
			historical_data: generateHistoricalData(42.4, 12, 1.0, 0.2)
		}
	};
}

/**
 * Generate Canadian Dollar (CAD) indicator categories configuration
 */
export function generateCADIndicatorCategories(): IndicatorCategoryConfig[] {
	return [
		{
			category: 'growth',
			name: 'Economic Growth',
			name_de: 'Wirtschaftswachstum',
			description: 'GDP growth, retail sales, and manufacturing data for Canada',
			description_de: 'BIP-Wachstum, Einzelhandelsumsätze und Fertigungsdaten für Kanada',
			color: '#3b82f6',
			icon: '📈',
			importance_weight: 25,
			indicators: ['cad_gdp_growth', 'cad_retail_sales', 'cad_manufacturing_sales']
		},
		{
			category: 'inflation',
			name: 'Inflation Metrics',
			name_de: 'Inflationsmetriken',
			description: 'Consumer price indices and core inflation measures tracked by BoC',
			description_de: 'Verbraucherpreisindizes und Kerninflationsmaße, die von der BoC verfolgt werden',
			color: '#ef4444',
			icon: '📊',
			importance_weight: 30,
			indicators: ['cad_cpi', 'cad_core_cpi']
		},
		{
			category: 'labor',
			name: 'Labor Market',
			name_de: 'Arbeitsmarkt',
			description: 'Employment, unemployment, and wage growth data',
			description_de: 'Beschäftigungs-, Arbeitslosigkeits- und Lohnwachstumsdaten',
			color: '#10b981',
			icon: '👥',
			importance_weight: 25,
			indicators: ['cad_unemployment', 'cad_employment_change', 'cad_hourly_wages']
		},
		{
			category: 'trade',
			name: 'Trade & External',
			name_de: 'Handel & Außenwirtschaft',
			description: 'Trade balance, exports, and current account reflecting resource economy',
			description_de: 'Handelsbilanz, Exporte und Leistungsbilanz, die Ressourcenwirtschaft widerspiegeln',
			color: '#8b5cf6',
			icon: '🚢',
			importance_weight: 20,
			indicators: ['cad_trade_balance', 'cad_exports', 'cad_current_account']
		},
		{
			category: 'monetary_policy',
			name: 'Monetary Policy',
			name_de: 'Geldpolitik',
			description: 'Bank of Canada overnight rate and government bond yields',
			description_de: 'Bank of Canada Tagesgeldsatz und Staatsanleiherenditen',
			color: '#f59e0b',
			icon: '🏦',
			importance_weight: 25,
			indicators: ['cad_boc_rate', 'cad_10y_bond']
		},
		{
			category: 'sentiment',
			name: 'Sentiment & Confidence',
			name_de: 'Stimmung & Vertrauen',
			description: 'Consumer confidence and BoC business outlook survey',
			description_de: 'Verbrauchervertrauen und BoC-Geschäftsausblick-Umfrage',
			color: '#06b6d4',
			icon: '💭',
			importance_weight: 15,
			indicators: ['cad_consumer_confidence', 'cad_business_outlook']
		},
		{
			category: 'housing',
			name: 'Housing Market',
			name_de: 'Wohnungsmarkt',
			description: 'Housing starts and existing home sales reflecting interest rate sensitivity',
			description_de: 'Wohnungsbaubeginne und Verkäufe bestehender Häuser, die Zinssensitivität widerspiegeln',
			color: '#f97316',
			icon: '🏠',
			importance_weight: 10,
			indicators: ['cad_housing_starts', 'cad_home_sales']
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
			indicators: ['cad_budget_balance', 'cad_net_debt_gdp']
		}
	];
}

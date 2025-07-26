import type { 
	MacroeconomicIndicator, 
	MacroeconomicDataPoint,
	IndicatorCategoryConfig,
	EconomicHealthScore
} from '$lib/types/economic';

// Generate realistic historical data points for GBP indicators
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

// Generate next release date for GBP indicators
function getNextReleaseDate(frequency: string): string {
	const now = new Date();
	const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
	
	// ONS typically releases data mid-month
	nextMonth.setDate(15);
	
	return nextMonth.toISOString().split('T')[0];
}

// GBP-specific indicator interface extending base
export interface GBPMacroeconomicData {
	// Growth Indicators
	gdp_growth_quarterly: MacroeconomicIndicator;
	gdp_growth_monthly: MacroeconomicIndicator;
	industrial_production: MacroeconomicIndicator;
	manufacturing_output: MacroeconomicIndicator;
	retail_sales_incl_fuel: MacroeconomicIndicator;
	retail_sales_excl_fuel: MacroeconomicIndicator;
	services_pmi: MacroeconomicIndicator;
	construction_pmi: MacroeconomicIndicator;
	
	// Inflation Metrics
	cpi: MacroeconomicIndicator;
	core_cpi: MacroeconomicIndicator;
	ppi_input: MacroeconomicIndicator;
	ppi_output: MacroeconomicIndicator;
	house_price_inflation_halifax: MacroeconomicIndicator;
	house_price_inflation_nationwide: MacroeconomicIndicator;
	
	// Labor Market Data
	ilo_unemployment_rate: MacroeconomicIndicator;
	employment_change: MacroeconomicIndicator;
	average_weekly_earnings: MacroeconomicIndicator;
	claimant_count: MacroeconomicIndicator;
	
	// Trade & Balance of Payments
	trade_balance: MacroeconomicIndicator;
	current_account_balance: MacroeconomicIndicator;
	terms_of_trade: MacroeconomicIndicator;
	export_price_index: MacroeconomicIndicator;
	import_price_index: MacroeconomicIndicator;
	
	// Monetary Policy
	boe_bank_rate: MacroeconomicIndicator;
	gilt_2y: MacroeconomicIndicator;
	gilt_10y: MacroeconomicIndicator;
	boe_asset_purchases: MacroeconomicIndicator;
	yield_curve_spread: MacroeconomicIndicator;
	
	// Sentiment & Confidence
	gfk_consumer_confidence: MacroeconomicIndicator;
	pmi_manufacturing: MacroeconomicIndicator;
	pmi_services: MacroeconomicIndicator;
	pmi_construction: MacroeconomicIndicator;
	cbi_business_optimism: MacroeconomicIndicator;
	lloyds_business_barometer: MacroeconomicIndicator;
	
	// Housing Market
	halifax_house_prices: MacroeconomicIndicator;
	nationwide_house_prices: MacroeconomicIndicator;
	mortgage_approvals: MacroeconomicIndicator;
	rics_housing_survey: MacroeconomicIndicator;
	construction_output: MacroeconomicIndicator;
	
	// Fiscal Policy
	public_sector_net_borrowing: MacroeconomicIndicator;
	debt_to_gdp: MacroeconomicIndicator;
	government_investment: MacroeconomicIndicator;
	social_spending: MacroeconomicIndicator;
}

// Create comprehensive GBP macroeconomic data
export function generateGBPMacroeconomicData(): GBPMacroeconomicData {
	const now = new Date().toISOString();
	
	return {
		// Growth Indicators
		gdp_growth_quarterly: {
			id: 'gbp_gdp_quarterly',
			name: 'UK GDP Growth (Quarterly)',
			name_de: 'UK BIP-Wachstum (Quartalsweise)',
			category: 'growth',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 0.2,
			previous_value: -0.1,
			forecast_value: 0.3,
			change_absolute: 0.3,
			change_percent: 300.0,
			impact: 'high',
			trend: 'up',
			unit: '% QoQ',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Measures the quarterly change in the inflation-adjusted value of all goods and services produced in the UK.',
			description_de: 'Misst die quartalsweise Veränderung des inflationsbereinigten Wertes aller im Vereinigten Königreich produzierten Güter und Dienstleistungen.',
			market_impact_explanation: 'UK GDP growth directly impacts GBP strength, with the service sector (~80% of economy) being particularly important.',
			market_impact_explanation_de: 'UK-BIP-Wachstum beeinflusst direkt die GBP-Stärke, wobei der Dienstleistungssektor (~80% der Wirtschaft) besonders wichtig ist.',
			source: 'ONS',
			historical_data: generateHistoricalData(0.1, 12, 0.3, 0.1)
		},

		gdp_growth_monthly: {
			id: 'gbp_gdp_monthly',
			name: 'UK GDP Growth (Monthly)',
			name_de: 'UK BIP-Wachstum (Monatlich)',
			category: 'growth',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 0.1,
			previous_value: -0.2,
			forecast_value: 0.2,
			change_absolute: 0.3,
			change_percent: 150.0,
			impact: 'high',
			trend: 'up',
			unit: '% MoM',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Unique monthly GDP estimate providing early insight into UK economic performance.',
			description_de: 'Einzigartige monatliche BIP-Schätzung, die frühe Einblicke in die britische Wirtschaftsleistung bietet.',
			market_impact_explanation: 'Monthly GDP is unique to the UK among major economies, providing early economic signals that can significantly move GBP.',
			market_impact_explanation_de: 'Monatliches BIP ist unter den großen Volkswirtschaften einzigartig für das Vereinigte Königreich und bietet frühe Wirtschaftssignale, die GBP erheblich bewegen können.',
			source: 'ONS',
			historical_data: generateHistoricalData(0.0, 24, 0.4, 0.05)
		},

		industrial_production: {
			id: 'gbp_industrial_production',
			name: 'UK Industrial Production',
			name_de: 'UK Industrieproduktion',
			category: 'growth',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -0.8,
			previous_value: -1.2,
			forecast_value: -0.5,
			change_absolute: 0.4,
			change_percent: 33.3,
			impact: 'medium',
			trend: 'up',
			unit: '% MoM',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures the monthly change in the volume of production in manufacturing, mining, and utilities in the UK.',
			description_de: 'Misst die monatliche Veränderung des Produktionsvolumens in Fertigung, Bergbau und Versorgungsunternehmen im Vereinigten Königreich.',
			market_impact_explanation: 'UK industrial production reflects manufacturing health, though less impactful than services given UK\'s economic structure.',
			market_impact_explanation_de: 'Die britische Industrieproduktion spiegelt die Gesundheit der Fertigung wider, ist aber weniger einflussreich als Dienstleistungen angesichts der britischen Wirtschaftsstruktur.',
			source: 'ONS',
			historical_data: generateHistoricalData(-1.0, 24, 0.8, 0.1)
		},

		manufacturing_output: {
			id: 'gbp_manufacturing',
			name: 'UK Manufacturing Output',
			name_de: 'UK Fertigungsproduktion',
			category: 'growth',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -1.1,
			previous_value: -1.8,
			forecast_value: -0.8,
			change_absolute: 0.7,
			change_percent: 38.9,
			impact: 'medium',
			trend: 'up',
			unit: '% MoM',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures the monthly change in manufacturing sector output in the UK.',
			description_de: 'Misst die monatliche Veränderung der Fertigungssektorproduktion im Vereinigten Königreich.',
			market_impact_explanation: 'Manufacturing output indicates industrial health and export competitiveness, important for post-Brexit trade dynamics.',
			market_impact_explanation_de: 'Die Fertigungsproduktion zeigt industrielle Gesundheit und Exportwettbewerbsfähigkeit an, wichtig für Post-Brexit-Handelsdynamik.',
			source: 'ONS',
			historical_data: generateHistoricalData(-1.5, 24, 1.0, 0.2)
		},

		retail_sales_incl_fuel: {
			id: 'gbp_retail_sales_incl',
			name: 'UK Retail Sales (incl. fuel)',
			name_de: 'UK Einzelhandelsumsätze (inkl. Kraftstoff)',
			category: 'growth',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 0.3,
			previous_value: -0.2,
			forecast_value: 0.4,
			change_absolute: 0.5,
			change_percent: 250.0,
			impact: 'medium',
			trend: 'up',
			unit: '% MoM',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures the month-over-month change in the total value of sales at the retail level including fuel.',
			description_de: 'Misst die monatliche Veränderung des Gesamtwerts der Verkäufe auf Einzelhandelsebene einschließlich Kraftstoff.',
			market_impact_explanation: 'Retail sales indicate consumer spending strength, crucial for the UK\'s consumption-driven economy.',
			market_impact_explanation_de: 'Einzelhandelsumsätze zeigen die Stärke der Verbraucherausgaben an, entscheidend für die verbrauchsgetriebene britische Wirtschaft.',
			source: 'ONS',
			historical_data: generateHistoricalData(0.0, 24, 0.6, 0.1)
		},

		retail_sales_excl_fuel: {
			id: 'gbp_retail_sales_excl',
			name: 'UK Retail Sales (excl. fuel)',
			name_de: 'UK Einzelhandelsumsätze (ohne Kraftstoff)',
			category: 'growth',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 0.2,
			previous_value: -0.3,
			forecast_value: 0.3,
			change_absolute: 0.5,
			change_percent: 166.7,
			impact: 'medium',
			trend: 'up',
			unit: '% MoM',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Retail sales excluding volatile fuel prices, providing clearer view of underlying consumer demand.',
			description_de: 'Einzelhandelsumsätze ohne volatile Kraftstoffpreise, bieten klarere Sicht auf zugrundeliegende Verbrauchernachfrage.',
			market_impact_explanation: 'Core retail sales better reflect underlying consumer health, important for BoE policy decisions.',
			market_impact_explanation_de: 'Kern-Einzelhandelsumsätze spiegeln besser die zugrundeliegende Verbrauchergesundheit wider, wichtig für BoE-Politikentscheidungen.',
			source: 'ONS',
			historical_data: generateHistoricalData(-0.1, 24, 0.5, 0.15)
		},

		services_pmi: {
			id: 'gbp_services_pmi',
			name: 'UK Services PMI',
			name_de: 'UK Dienstleistungs-PMI',
			category: 'growth',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 53.2,
			previous_value: 52.1,
			forecast_value: 53.5,
			change_absolute: 1.1,
			change_percent: 2.1,
			impact: 'high',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Purchasing Managers\' Index for the services sector, crucial given services represent ~80% of UK economy.',
			description_de: 'Einkaufsmanagerindex für den Dienstleistungssektor, entscheidend da Dienstleistungen ~80% der britischen Wirtschaft ausmachen.',
			market_impact_explanation: 'Services PMI is critical for GBP as services dominate the UK economy, values above 50 indicate expansion.',
			market_impact_explanation_de: 'Dienstleistungs-PMI ist entscheidend für GBP, da Dienstleistungen die britische Wirtschaft dominieren, Werte über 50 zeigen Expansion an.',
			source: 'S&P Global',
			historical_data: generateHistoricalData(52.5, 24, 2.0, 0.3)
		},

		construction_pmi: {
			id: 'gbp_construction_pmi',
			name: 'UK Construction PMI',
			name_de: 'UK Bau-PMI',
			category: 'growth',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 48.8,
			previous_value: 47.2,
			forecast_value: 49.5,
			change_absolute: 1.6,
			change_percent: 3.4,
			impact: 'low',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Purchasing Managers\' Index for the construction sector in the UK.',
			description_de: 'Einkaufsmanagerindex für den Bausektor im Vereinigten Königreich.',
			market_impact_explanation: 'Construction PMI reflects housing market health and infrastructure investment, sensitive to interest rate changes.',
			market_impact_explanation_de: 'Bau-PMI spiegelt die Gesundheit des Wohnungsmarktes und Infrastrukturinvestitionen wider, empfindlich gegenüber Zinsänderungen.',
			source: 'S&P Global',
			historical_data: generateHistoricalData(48.0, 24, 2.5, 0.4)
		},

		// Inflation Metrics
		cpi: {
			id: 'gbp_cpi',
			name: 'UK Consumer Price Index',
			name_de: 'UK Verbraucherpreisindex',
			category: 'inflation',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 4.0,
			previous_value: 6.7,
			forecast_value: 3.8,
			change_absolute: -2.7,
			change_percent: -40.3,
			impact: 'high',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'The BoE\'s primary inflation measure for the UK, targeting 2% inflation.',
			description_de: 'Das primäre Inflationsmaß der BoE für das Vereinigte Königreich mit einem Inflationsziel von 2%.',
			market_impact_explanation: 'UK CPI approaching BoE\'s 2% target may signal potential for policy easing, affecting GBP strength.',
			market_impact_explanation_de: 'UK-VPI, der sich dem 2%-Ziel der BoE nähert, kann Potenzial für Politiklockerung signalisieren und GBP-Stärke beeinflussen.',
			source: 'ONS',
			historical_data: generateHistoricalData(5.5, 24, 1.2, -0.6)
		},

		core_cpi: {
			id: 'gbp_core_cpi',
			name: 'UK Core CPI',
			name_de: 'UK Kern-VPI',
			category: 'inflation',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 5.1,
			previous_value: 5.7,
			forecast_value: 4.9,
			change_absolute: -0.6,
			change_percent: -10.5,
			impact: 'high',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'CPI excluding volatile energy and food prices, providing clearer view of underlying inflation trends.',
			description_de: 'VPI ohne volatile Energie- und Lebensmittelpreise, bietet klarere Sicht auf zugrundeliegende Inflationstrends.',
			market_impact_explanation: 'Core CPI remains well above BoE target, suggesting continued need for restrictive monetary policy.',
			market_impact_explanation_de: 'Kern-VPI bleibt deutlich über BoE-Ziel, deutet auf anhaltenden Bedarf für restriktive Geldpolitik hin.',
			source: 'ONS',
			historical_data: generateHistoricalData(6.0, 24, 0.8, -0.4)
		},

		ppi_input: {
			id: 'gbp_ppi_input',
			name: 'UK Producer Price Index (Input)',
			name_de: 'UK Erzeugerpreisindex (Input)',
			category: 'inflation',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -8.7,
			previous_value: -5.2,
			forecast_value: -7.5,
			change_absolute: -3.5,
			change_percent: -67.3,
			impact: 'medium',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures average change in prices of goods and services bought by UK manufacturers as inputs.',
			description_de: 'Misst durchschnittliche Preisveränderung von Gütern und Dienstleistungen, die britische Hersteller als Inputs kaufen.',
			market_impact_explanation: 'Input PPI decline indicates easing cost pressures for manufacturers, supporting disinflation narrative.',
			market_impact_explanation_de: 'Rückgang des Input-EPI zeigt nachlassende Kostendrücke für Hersteller an und unterstützt Desinflationsnarrativ.',
			source: 'ONS',
			historical_data: generateHistoricalData(-6.0, 24, 3.0, -1.5)
		},

		ppi_output: {
			id: 'gbp_ppi_output',
			name: 'UK Producer Price Index (Output)',
			name_de: 'UK Erzeugerpreisindex (Output)',
			category: 'inflation',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -2.1,
			previous_value: 0.8,
			forecast_value: -1.5,
			change_absolute: -2.9,
			change_percent: -362.5,
			impact: 'medium',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures average change in selling prices received by UK domestic producers.',
			description_de: 'Misst durchschnittliche Veränderung der Verkaufspreise britischer inländischer Produzenten.',
			market_impact_explanation: 'Output PPI turning negative suggests producer pricing power weakening, supporting BoE dovish stance.',
			market_impact_explanation_de: 'Output-EPI wird negativ, deutet auf schwächere Preissetzungsmacht der Produzenten hin und unterstützt BoE-taubenhaltung.',
			source: 'ONS',
			historical_data: generateHistoricalData(1.5, 24, 2.0, -1.2)
		},

		house_price_inflation_halifax: {
			id: 'gbp_hpi_halifax',
			name: 'Halifax House Price Index',
			name_de: 'Halifax Hauspreisindex',
			category: 'inflation',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -2.3,
			previous_value: 1.7,
			forecast_value: -1.8,
			change_absolute: -4.0,
			change_percent: -235.3,
			impact: 'medium',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Halifax measure of UK house price changes, important given housing wealth effects.',
			description_de: 'Halifax-Maß für britische Hauspreisveränderungen, wichtig angesichts der Wohnungsvermögenseffekte.',
			market_impact_explanation: 'Falling house prices reduce wealth effects and consumer spending, concerning for UK economic growth.',
			market_impact_explanation_de: 'Fallende Hauspreise reduzieren Vermögenseffekte und Verbraucherausgaben, besorgniserregend für britisches Wirtschaftswachstum.',
			source: 'Halifax',
			historical_data: generateHistoricalData(3.0, 24, 2.5, -2.0)
		},

		house_price_inflation_nationwide: {
			id: 'gbp_hpi_nationwide',
			name: 'Nationwide House Price Index',
			name_de: 'Nationwide Hauspreisindex',
			category: 'inflation',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -1.8,
			previous_value: 2.1,
			forecast_value: -1.3,
			change_absolute: -3.9,
			change_percent: -185.7,
			impact: 'medium',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Nationwide measure of UK house price changes, alternative to Halifax index.',
			description_de: 'Nationwide-Maß für britische Hauspreisveränderungen, Alternative zum Halifax-Index.',
			market_impact_explanation: 'House price declines reflect higher mortgage rates impact, reducing household wealth and spending capacity.',
			market_impact_explanation_de: 'Hauspreisrückgänge spiegeln Auswirkungen höherer Hypothekenzinsen wider, reduzieren Haushaltsvermögen und Ausgabenkapazität.',
			source: 'Nationwide',
			historical_data: generateHistoricalData(2.8, 24, 2.2, -1.8)
		},

		// Labor Market Data
		ilo_unemployment_rate: {
			id: 'gbp_unemployment',
			name: 'UK ILO Unemployment Rate',
			name_de: 'UK ILO Arbeitslosenquote',
			category: 'labor',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 4.2,
			previous_value: 3.9,
			forecast_value: 4.4,
			change_absolute: 0.3,
			change_percent: 7.7,
			impact: 'high',
			trend: 'up',
			unit: '%',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'International Labour Organization definition of unemployment rate for the UK.',
			description_de: 'Definition der Internationalen Arbeitsorganisation der Arbeitslosenquote für das Vereinigte Königreich.',
			market_impact_explanation: 'Rising unemployment indicates labor market softening, potentially supporting BoE dovish policy stance.',
			market_impact_explanation_de: 'Steigende Arbeitslosigkeit zeigt Arbeitsmarktschwächung an, könnte BoE-taubenhafte Politikhaltung unterstützen.',
			source: 'ONS',
			historical_data: generateHistoricalData(3.8, 24, 0.4, 0.2)
		},

		employment_change: {
			id: 'gbp_employment_change',
			name: 'UK Employment Change',
			name_de: 'UK Beschäftigungsveränderung',
			category: 'labor',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -66000,
			previous_value: 102000,
			forecast_value: -40000,
			change_absolute: -168000,
			change_percent: -164.7,
			impact: 'high',
			trend: 'down',
			unit: 'Thousands',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Three-month change in the number of people in employment in the UK.',
			description_de: 'Dreimonatige Veränderung der Anzahl der Beschäftigten im Vereinigten Königreich.',
			market_impact_explanation: 'Employment decline indicates economic weakness and reduced wage pressures, supporting BoE easing expectations.',
			market_impact_explanation_de: 'Beschäftigungsrückgang zeigt wirtschaftliche Schwäche und reduzierten Lohndruck an, unterstützt BoE-Lockerungserwartungen.',
			source: 'ONS',
			historical_data: generateHistoricalData(50000, 24, 80000, -30000)
		},

		average_weekly_earnings: {
			id: 'gbp_weekly_earnings',
			name: 'UK Average Weekly Earnings',
			name_de: 'UK Durchschnittliche Wochenlöhne',
			category: 'labor',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 7.8,
			previous_value: 8.2,
			forecast_value: 7.5,
			change_absolute: -0.4,
			change_percent: -4.9,
			impact: 'medium',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Year-over-year change in average weekly earnings including bonuses.',
			description_de: 'Jährliche Veränderung der durchschnittlichen Wochenlöhne einschließlich Boni.',
			market_impact_explanation: 'Slowing wage growth reduces inflation pressures and supports BoE dovish policy stance.',
			market_impact_explanation_de: 'Verlangsamtes Lohnwachstum reduziert Inflationsdrücke und unterstützt BoE-taubenhafte Politikhaltung.',
			source: 'ONS',
			historical_data: generateHistoricalData(8.5, 24, 1.0, -0.3)
		},

		claimant_count: {
			id: 'gbp_claimant_count',
			name: 'UK Claimant Count',
			name_de: 'UK Antragstellerzahl',
			category: 'labor',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 16800,
			previous_value: -13200,
			forecast_value: 20000,
			change_absolute: 30000,
			change_percent: 227.3,
			impact: 'medium',
			trend: 'up',
			unit: 'Change',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Monthly change in the number of people claiming unemployment benefits.',
			description_de: 'Monatliche Veränderung der Anzahl der Personen, die Arbeitslosengeld beantragen.',
			market_impact_explanation: 'Rising claimant count indicates labor market deterioration and economic weakness.',
			market_impact_explanation_de: 'Steigende Antragstellerzahl zeigt Arbeitsmarktverschlechterung und wirtschaftliche Schwäche an.',
			source: 'ONS',
			historical_data: generateHistoricalData(5000, 24, 15000, 5000)
		},

		// Trade & Balance of Payments
		trade_balance: {
			id: 'gbp_trade_balance',
			name: 'UK Trade Balance',
			name_de: 'UK Handelsbilanz',
			category: 'trade',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -13.8,
			previous_value: -15.2,
			forecast_value: -13.0,
			change_absolute: 1.4,
			change_percent: 9.2,
			impact: 'medium',
			trend: 'up',
			unit: 'Billion GBP',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Difference between the value of UK exports and imports of goods and services.',
			description_de: 'Differenz zwischen dem Wert britischer Exporte und Importe von Gütern und Dienstleistungen.',
			market_impact_explanation: 'Improving trade deficit indicates better export performance, supporting GBP strength.',
			market_impact_explanation_de: 'Sich verbesserndes Handelsdefizit zeigt bessere Exportleistung an und unterstützt GBP-Stärke.',
			source: 'ONS',
			historical_data: generateHistoricalData(-15.0, 24, 2.0, 0.5)
		},

		current_account_balance: {
			id: 'gbp_current_account',
			name: 'UK Current Account Balance',
			name_de: 'UK Leistungsbilanz',
			category: 'trade',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -4.2,
			previous_value: -4.8,
			forecast_value: -4.0,
			change_absolute: 0.6,
			change_percent: 12.5,
			impact: 'high',
			trend: 'up',
			unit: '% of GDP',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Broadest measure of UK trade including goods, services, income, and current transfers as percentage of GDP.',
			description_de: 'Breitestes Maß des britischen Handels einschließlich Güter, Dienstleistungen, Einkommen und laufende Transfers als Prozentsatz des BIP.',
			market_impact_explanation: 'Chronic current account deficit requires capital inflows to finance, making GBP vulnerable to sentiment shifts.',
			market_impact_explanation_de: 'Chronisches Leistungsbilanzdefizit erfordert Kapitalzuflüsse zur Finanzierung, macht GBP anfällig für Stimmungsveränderungen.',
			source: 'ONS',
			historical_data: generateHistoricalData(-4.5, 12, 0.8, 0.2)
		},

		terms_of_trade: {
			id: 'gbp_terms_of_trade',
			name: 'UK Terms of Trade',
			name_de: 'UK Terms of Trade',
			category: 'trade',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 102.3,
			previous_value: 101.8,
			forecast_value: 102.5,
			change_absolute: 0.5,
			change_percent: 0.5,
			impact: 'low',
			trend: 'up',
			unit: 'Index',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Ratio of export prices to import prices, indicating UK\'s trading competitiveness.',
			description_de: 'Verhältnis von Exportpreisen zu Importpreisen, zeigt britische Handelswettbewerbsfähigkeit an.',
			market_impact_explanation: 'Improving terms of trade indicate better export competitiveness and economic efficiency.',
			market_impact_explanation_de: 'Sich verbessernde Terms of Trade zeigen bessere Exportwettbewerbsfähigkeit und wirtschaftliche Effizienz an.',
			source: 'ONS',
			historical_data: generateHistoricalData(101.5, 12, 1.5, 0.3)
		},

		export_price_index: {
			id: 'gbp_export_prices',
			name: 'UK Export Price Index',
			name_de: 'UK Exportpreisindex',
			category: 'trade',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -3.2,
			previous_value: -1.8,
			forecast_value: -2.8,
			change_absolute: -1.4,
			change_percent: -77.8,
			impact: 'low',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures average change in prices of goods and services exported from the UK.',
			description_de: 'Misst durchschnittliche Preisveränderung von Gütern und Dienstleistungen, die aus dem Vereinigten Königreich exportiert werden.',
			market_impact_explanation: 'Declining export prices may indicate reduced competitiveness or global demand weakness.',
			market_impact_explanation_de: 'Sinkende Exportpreise können auf reduzierte Wettbewerbsfähigkeit oder globale Nachfrageschwäche hindeuten.',
			source: 'ONS',
			historical_data: generateHistoricalData(-2.0, 24, 2.0, -0.5)
		},

		import_price_index: {
			id: 'gbp_import_prices',
			name: 'UK Import Price Index',
			name_de: 'UK Importpreisindex',
			category: 'trade',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -6.8,
			previous_value: -4.2,
			forecast_value: -6.0,
			change_absolute: -2.6,
			change_percent: -61.9,
			impact: 'low',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures average change in prices of goods and services imported into the UK.',
			description_de: 'Misst durchschnittliche Preisveränderung von Gütern und Dienstleistungen, die in das Vereinigte Königreich importiert werden.',
			market_impact_explanation: 'Falling import prices help reduce inflation pressures and support consumer purchasing power.',
			market_impact_explanation_de: 'Fallende Importpreise helfen, Inflationsdrücke zu reduzieren und unterstützen die Kaufkraft der Verbraucher.',
			source: 'ONS',
			historical_data: generateHistoricalData(-4.5, 24, 3.0, -1.0)
		},

		// Monetary Policy
		boe_bank_rate: {
			id: 'gbp_bank_rate',
			name: 'BoE Bank Rate',
			name_de: 'BoE Leitzins',
			category: 'monetary_policy',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 5.25,
			previous_value: 5.00,
			forecast_value: 5.50,
			change_absolute: 0.25,
			change_percent: 5.0,
			impact: 'high',
			trend: 'up',
			unit: '%',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'The Bank of England\'s key policy interest rate.',
			description_de: 'Der wichtigste Leitzins der Bank of England.',
			market_impact_explanation: 'BoE Bank Rate directly influences GBP strength through yield differentials and economic expectations.',
			market_impact_explanation_de: 'BoE-Leitzins beeinflusst direkt GBP-Stärke durch Renditedifferenzen und wirtschaftliche Erwartungen.',
			source: 'Bank of England',
			historical_data: generateHistoricalData(4.8, 24, 0.5, 0.2)
		},

		gilt_2y: {
			id: 'gbp_gilt_2y',
			name: 'UK 2-Year Gilt Yield',
			name_de: 'UK 2-jährige Staatsanleihenrendite',
			category: 'monetary_policy',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 4.85,
			previous_value: 4.72,
			forecast_value: 4.90,
			change_absolute: 0.13,
			change_percent: 2.8,
			impact: 'high',
			trend: 'up',
			unit: '%',
			frequency: 'daily',
			last_updated: now,
			next_release: 'Continuous',
			description: 'Yield on 2-year UK government bonds, reflecting short-term interest rate expectations.',
			description_de: 'Rendite auf 2-jährige britische Staatsanleihen, spiegelt kurzfristige Zinserwartungen wider.',
			market_impact_explanation: 'Rising 2Y Gilt yields often strengthen GBP as they reflect higher BoE rate expectations.',
			market_impact_explanation_de: 'Steigende 2J-Gilt-Renditen stärken oft GBP, da sie höhere BoE-Zinserwartungen widerspiegeln.',
			source: 'UK Debt Management Office',
			historical_data: generateHistoricalData(4.6, 24, 0.4, 0.1)
		},

		gilt_10y: {
			id: 'gbp_gilt_10y',
			name: 'UK 10-Year Gilt Yield',
			name_de: 'UK 10-jährige Staatsanleihenrendite',
			category: 'monetary_policy',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 4.32,
			previous_value: 4.18,
			forecast_value: 4.40,
			change_absolute: 0.14,
			change_percent: 3.3,
			impact: 'high',
			trend: 'up',
			unit: '%',
			frequency: 'daily',
			last_updated: now,
			next_release: 'Continuous',
			description: 'Yield on 10-year UK government bonds, benchmark for long-term interest rates.',
			description_de: 'Rendite auf 10-jährige britische Staatsanleihen, Maßstab für langfristige Zinssätze.',
			market_impact_explanation: 'Rising 10Y Gilt yields attract foreign capital and support GBP strength through higher returns.',
			market_impact_explanation_de: 'Steigende 10J-Gilt-Renditen ziehen ausländisches Kapital an und unterstützen GBP-Stärke durch höhere Renditen.',
			source: 'UK Debt Management Office',
			historical_data: generateHistoricalData(4.1, 24, 0.3, 0.08)
		},

		boe_asset_purchases: {
			id: 'gbp_asset_purchases',
			name: 'BoE Asset Purchase Programme',
			name_de: 'BoE Anleihenkaufprogramm',
			category: 'monetary_policy',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 875.0,
			previous_value: 875.0,
			forecast_value: 850.0,
			change_absolute: 0.0,
			change_percent: 0.0,
			impact: 'medium',
			trend: 'flat',
			unit: 'Billion GBP',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Total value of government bonds held by the Bank of England under QE programme.',
			description_de: 'Gesamtwert der von der Bank of England unter dem QE-Programm gehaltenen Staatsanleihen.',
			market_impact_explanation: 'BoE balance sheet reduction (QT) typically supports GBP by reducing money supply and supporting yields.',
			market_impact_explanation_de: 'BoE-Bilanzreduzierung (QT) unterstützt typischerweise GBP durch Reduzierung der Geldmenge und Unterstützung der Renditen.',
			source: 'Bank of England',
			historical_data: generateHistoricalData(875.0, 24, 10.0, -5.0)
		},

		yield_curve_spread: {
			id: 'gbp_yield_spread',
			name: 'UK 10Y-2Y Yield Spread',
			name_de: 'UK 10J-2J Renditespread',
			category: 'monetary_policy',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -53,
			previous_value: -54,
			forecast_value: -50,
			change_absolute: 1,
			change_percent: 1.9,
			impact: 'medium',
			trend: 'up',
			unit: 'bps',
			frequency: 'daily',
			last_updated: now,
			next_release: 'Continuous',
			description: 'Difference between 10-year and 2-year gilt yields, indicating yield curve shape.',
			description_de: 'Differenz zwischen 10-jährigen und 2-jährigen Gilt-Renditen, zeigt Zinskurvenform an.',
			market_impact_explanation: 'Inverted yield curve (negative spread) often signals recession expectations and BoE easing ahead.',
			market_impact_explanation_de: 'Invertierte Zinskurve (negativer Spread) signalisiert oft Rezessionserwartungen und bevorstehende BoE-Lockerung.',
			source: 'UK Debt Management Office',
			historical_data: generateHistoricalData(-55, 24, 10, 2)
		},

		// Sentiment & Confidence
		gfk_consumer_confidence: {
			id: 'gbp_gfk_confidence',
			name: 'GfK Consumer Confidence',
			name_de: 'GfK Verbrauchervertrauen',
			category: 'sentiment',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -21,
			previous_value: -25,
			forecast_value: -19,
			change_absolute: 4,
			change_percent: 16.0,
			impact: 'medium',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures consumer optimism about economic conditions in the UK.',
			description_de: 'Misst Verbraucheroptimismus über wirtschaftliche Bedingungen im Vereinigten Königreich.',
			market_impact_explanation: 'Improving consumer confidence suggests increased spending propensity, supporting economic growth and GBP.',
			market_impact_explanation_de: 'Sich verbesserndes Verbrauchervertrauen deutet auf erhöhte Ausgabenbereitschaft hin und unterstützt Wirtschaftswachstum und GBP.',
			source: 'GfK',
			historical_data: generateHistoricalData(-23, 24, 4.0, 1.0)
		},

		pmi_manufacturing: {
			id: 'gbp_pmi_manufacturing',
			name: 'UK Manufacturing PMI',
			name_de: 'UK Verarbeitendes Gewerbe PMI',
			category: 'sentiment',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 45.2,
			previous_value: 44.8,
			forecast_value: 45.8,
			change_absolute: 0.4,
			change_percent: 0.9,
			impact: 'high',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Purchasing Managers\' Index for the UK manufacturing sector.',
			description_de: 'Einkaufsmanagerindex für den britischen Fertigungssektor.',
			market_impact_explanation: 'Manufacturing PMI below 50 indicates contraction, but improvement suggests stabilization in industrial sector.',
			market_impact_explanation_de: 'Fertigungs-PMI unter 50 zeigt Kontraktion an, aber Verbesserung deutet auf Stabilisierung im Industriesektor hin.',
			source: 'S&P Global',
			historical_data: generateHistoricalData(44.5, 24, 2.0, 0.3)
		},

		pmi_services: {
			id: 'gbp_pmi_services',
			name: 'UK Services PMI',
			name_de: 'UK Dienstleistungs-PMI',
			category: 'sentiment',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 53.2,
			previous_value: 52.1,
			forecast_value: 53.5,
			change_absolute: 1.1,
			change_percent: 2.1,
			impact: 'high',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Purchasing Managers\' Index for the UK services sector, critical given services represent ~80% of UK economy.',
			description_de: 'Einkaufsmanagerindex für den britischen Dienstleistungssektor, entscheidend da Dienstleistungen ~80% der britischen Wirtschaft ausmachen.',
			market_impact_explanation: 'Services PMI above 50 indicates expansion in the dominant sector of UK economy, strongly supporting GBP.',
			market_impact_explanation_de: 'Dienstleistungs-PMI über 50 zeigt Expansion im dominanten Sektor der britischen Wirtschaft an und unterstützt stark GBP.',
			source: 'S&P Global',
			historical_data: generateHistoricalData(52.5, 24, 2.0, 0.3)
		},

		pmi_construction: {
			id: 'gbp_pmi_construction',
			name: 'UK Construction PMI',
			name_de: 'UK Bau-PMI',
			category: 'sentiment',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 48.8,
			previous_value: 47.2,
			forecast_value: 49.5,
			change_absolute: 1.6,
			change_percent: 3.4,
			impact: 'low',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Purchasing Managers\' Index for the UK construction sector.',
			description_de: 'Einkaufsmanagerindex für den britischen Bausektor.',
			market_impact_explanation: 'Construction PMI reflects housing market health and infrastructure investment, sensitive to interest rate changes.',
			market_impact_explanation_de: 'Bau-PMI spiegelt die Gesundheit des Wohnungsmarktes und Infrastrukturinvestitionen wider, empfindlich gegenüber Zinsänderungen.',
			source: 'S&P Global',
			historical_data: generateHistoricalData(48.0, 24, 2.5, 0.4)
		},

		cbi_business_optimism: {
			id: 'gbp_cbi_optimism',
			name: 'CBI Business Optimism',
			name_de: 'CBI Geschäftsoptimismus',
			category: 'sentiment',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -18,
			previous_value: -22,
			forecast_value: -15,
			change_absolute: 4,
			change_percent: 18.2,
			impact: 'medium',
			trend: 'up',
			unit: 'Index',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Confederation of British Industry survey of business optimism and investment intentions.',
			description_de: 'Umfrage der Confederation of British Industry zu Geschäftsoptimismus und Investitionsabsichten.',
			market_impact_explanation: 'Improving business optimism indicates stronger investment intentions and economic confidence.',
			market_impact_explanation_de: 'Sich verbessernder Geschäftsoptimismus zeigt stärkere Investitionsabsichten und wirtschaftliches Vertrauen an.',
			source: 'CBI',
			historical_data: generateHistoricalData(-20, 12, 5.0, 2.0)
		},

		lloyds_business_barometer: {
			id: 'gbp_lloyds_barometer',
			name: 'Lloyds Business Barometer',
			name_de: 'Lloyds Geschäftsbarometer',
			category: 'sentiment',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 42,
			previous_value: 38,
			forecast_value: 45,
			change_absolute: 4,
			change_percent: 10.5,
			impact: 'low',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Lloyds Bank survey of business confidence and economic prospects.',
			description_de: 'Lloyds Bank Umfrage zu Geschäftsvertrauen und wirtschaftlichen Aussichten.',
			market_impact_explanation: 'Rising business barometer indicates improving business sentiment and economic outlook.',
			market_impact_explanation_de: 'Steigendes Geschäftsbarometer zeigt sich verbessernde Geschäftsstimmung und wirtschaftliche Aussichten an.',
			source: 'Lloyds Bank',
			historical_data: generateHistoricalData(40, 24, 6.0, 1.0)
		},

		// Housing Market
		halifax_house_prices: {
			id: 'gbp_halifax_prices',
			name: 'Halifax House Prices',
			name_de: 'Halifax Hauspreise',
			category: 'housing',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -2.3,
			previous_value: 1.7,
			forecast_value: -1.8,
			change_absolute: -4.0,
			change_percent: -235.3,
			impact: 'medium',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Halifax measure of UK house price changes, important given housing wealth effects.',
			description_de: 'Halifax-Maß für britische Hauspreisveränderungen, wichtig angesichts der Wohnungsvermögenseffekte.',
			market_impact_explanation: 'Falling house prices reduce wealth effects and consumer spending, concerning for UK economic growth.',
			market_impact_explanation_de: 'Fallende Hauspreise reduzieren Vermögenseffekte und Verbraucherausgaben, besorgniserregend für britisches Wirtschaftswachstum.',
			source: 'Halifax',
			historical_data: generateHistoricalData(3.0, 24, 2.5, -2.0)
		},

		nationwide_house_prices: {
			id: 'gbp_nationwide_prices',
			name: 'Nationwide House Prices',
			name_de: 'Nationwide Hauspreise',
			category: 'housing',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -1.8,
			previous_value: 2.1,
			forecast_value: -1.3,
			change_absolute: -3.9,
			change_percent: -185.7,
			impact: 'medium',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Nationwide measure of UK house price changes, alternative to Halifax index.',
			description_de: 'Nationwide-Maß für britische Hauspreisveränderungen, Alternative zum Halifax-Index.',
			market_impact_explanation: 'House price declines reflect higher mortgage rates impact, reducing household wealth and spending capacity.',
			market_impact_explanation_de: 'Hauspreisrückgänge spiegeln Auswirkungen höherer Hypothekenzinsen wider, reduzieren Haushaltsvermögen und Ausgabenkapazität.',
			source: 'Nationwide',
			historical_data: generateHistoricalData(2.8, 24, 2.2, -1.8)
		},

		mortgage_approvals: {
			id: 'gbp_mortgage_approvals',
			name: 'UK Mortgage Approvals',
			name_de: 'UK Hypothekengenehmigungen',
			category: 'housing',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 49200,
			previous_value: 52300,
			forecast_value: 51000,
			change_absolute: -3100,
			change_percent: -5.9,
			impact: 'medium',
			trend: 'down',
			unit: 'Number',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Number of mortgage approvals for house purchases, leading indicator of housing market activity.',
			description_de: 'Anzahl der Hypothekengenehmigungen für Hauskäufe, Frühindikator für Wohnungsmarktaktivität.',
			market_impact_explanation: 'Declining mortgage approvals indicate cooling housing market due to higher interest rates.',
			market_impact_explanation_de: 'Sinkende Hypothekengenehmigungen zeigen abkühlenden Wohnungsmarkt aufgrund höherer Zinsen an.',
			source: 'Bank of England',
			historical_data: generateHistoricalData(52000, 24, 5000, -1000)
		},

		rics_housing_survey: {
			id: 'gbp_rics_survey',
			name: 'RICS Housing Market Survey',
			name_de: 'RICS Wohnungsmarktumfrage',
			category: 'housing',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -68,
			previous_value: -72,
			forecast_value: -65,
			change_absolute: 4,
			change_percent: 5.6,
			impact: 'low',
			trend: 'up',
			unit: 'Net Balance',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Royal Institution of Chartered Surveyors survey of housing market sentiment.',
			description_de: 'Royal Institution of Chartered Surveyors Umfrage zur Wohnungsmarktstimmung.',
			market_impact_explanation: 'Negative RICS balance indicates pessimistic housing market outlook among property professionals.',
			market_impact_explanation_de: 'Negative RICS-Bilanz zeigt pessimistische Wohnungsmarktaussichten unter Immobilienfachleuten an.',
			source: 'RICS',
			historical_data: generateHistoricalData(-70, 24, 8.0, 2.0)
		},

		construction_output: {
			id: 'gbp_construction_output',
			name: 'UK Construction Output',
			name_de: 'UK Bauproduktion',
			category: 'housing',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: -2.7,
			previous_value: -4.1,
			forecast_value: -2.0,
			change_absolute: 1.4,
			change_percent: 34.1,
			impact: 'low',
			trend: 'up',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Year-over-year change in construction sector output in the UK.',
			description_de: 'Jährliche Veränderung der Bausektorproduktion im Vereinigten Königreich.',
			market_impact_explanation: 'Improving construction output indicates gradual recovery in the building sector despite headwinds.',
			market_impact_explanation_de: 'Sich verbessernde Bauproduktion zeigt allmähliche Erholung im Bausektor trotz Gegenwind an.',
			source: 'ONS',
			historical_data: generateHistoricalData(-3.5, 24, 1.5, 0.5)
		},

		// Fiscal Policy
		public_sector_net_borrowing: {
			id: 'gbp_psnb',
			name: 'Public Sector Net Borrowing (PSNB)',
			name_de: 'Öffentliche Nettokreditaufnahme (PSNB)',
			category: 'fiscal_policy',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 13.2,
			previous_value: 15.8,
			forecast_value: 12.5,
			change_absolute: -2.6,
			change_percent: -16.5,
			impact: 'medium',
			trend: 'down',
			unit: 'Billion GBP',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'UK government\'s monthly borrowing requirement, key measure of fiscal health.',
			description_de: 'Monatlicher Kreditbedarf der britischen Regierung, wichtiges Maß für fiskalische Gesundheit.',
			market_impact_explanation: 'Lower PSNB indicates improving fiscal position, supporting GBP and reducing gilt supply pressures.',
			market_impact_explanation_de: 'Niedrigere PSNB zeigt sich verbessernde fiskalische Position an, unterstützt GBP und reduziert Gilt-Angebotsdruck.',
			source: 'ONS',
			historical_data: generateHistoricalData(15.0, 24, 3.0, -1.0)
		},

		debt_to_gdp: {
			id: 'gbp_debt_gdp',
			name: 'UK Debt-to-GDP Ratio',
			name_de: 'UK Schulden-zu-BIP-Verhältnis',
			category: 'fiscal_policy',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 98.3,
			previous_value: 99.1,
			forecast_value: 97.8,
			change_absolute: -0.8,
			change_percent: -0.8,
			impact: 'low',
			trend: 'down',
			unit: '% of GDP',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Total UK government debt as a percentage of Gross Domestic Product.',
			description_de: 'Gesamte britische Staatsschuld als Prozentsatz des Bruttoinlandsprodukts.',
			market_impact_explanation: 'Declining debt-to-GDP ratio indicates improving fiscal sustainability and supports GBP confidence.',
			market_impact_explanation_de: 'Sinkendes Schulden-zu-BIP-Verhältnis zeigt sich verbessernde fiskalische Nachhaltigkeit an und unterstützt GBP-Vertrauen.',
			source: 'ONS',
			historical_data: generateHistoricalData(99.5, 12, 1.5, -0.5)
		},

		government_investment: {
			id: 'gbp_gov_investment',
			name: 'UK Government Investment',
			name_de: 'UK Regierungsinvestitionen',
			category: 'fiscal_policy',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 2.8,
			previous_value: 2.5,
			forecast_value: 3.0,
			change_absolute: 0.3,
			change_percent: 12.0,
			impact: 'low',
			trend: 'up',
			unit: '% of GDP',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'UK government capital investment as percentage of GDP.',
			description_de: 'Britische Regierungskapitalinvestitionen als Prozentsatz des BIP.',
			market_impact_explanation: 'Higher government investment supports long-term growth prospects and economic competitiveness.',
			market_impact_explanation_de: 'Höhere Regierungsinvestitionen unterstützen langfristige Wachstumsaussichten und wirtschaftliche Wettbewerbsfähigkeit.',
			source: 'ONS',
			historical_data: generateHistoricalData(2.6, 12, 0.3, 0.1)
		},

		social_spending: {
			id: 'gbp_social_spending',
			name: 'UK Social Spending',
			name_de: 'UK Sozialausgaben',
			category: 'fiscal_policy',
			country: 'United Kingdom',
			currency: 'GBP',
			current_value: 21.2,
			previous_value: 21.8,
			forecast_value: 20.8,
			change_absolute: -0.6,
			change_percent: -2.8,
			impact: 'low',
			trend: 'down',
			unit: '% of GDP',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'UK government social spending as percentage of GDP.',
			description_de: 'Britische Regierungssozialausgaben als Prozentsatz des BIP.',
			market_impact_explanation: 'Social spending changes reflect fiscal policy stance and political priorities affecting long-term sustainability.',
			market_impact_explanation_de: 'Sozialausgabenveränderungen spiegeln fiskalische Politikhaltung und politische Prioritäten wider, die langfristige Nachhaltigkeit beeinflussen.',
			source: 'ONS',
			historical_data: generateHistoricalData(22.0, 12, 0.8, -0.3)
		}
	};
}

// Generate GBP-specific category configurations
export function generateGBPIndicatorCategories(): IndicatorCategoryConfig[] {
	return [
		{
			category: 'growth',
			name: 'Growth Indicators',
			name_de: 'Wachstumsindikatoren',
			description: 'Measures of UK economic expansion including unique monthly GDP',
			description_de: 'Maße für britische wirtschaftliche Expansion einschließlich einzigartiger monatlicher BIP',
			color: 'blue',
			icon: 'TrendingUp',
			importance_weight: 25,
			indicators: ['gbp_gdp_quarterly', 'gbp_gdp_monthly', 'gbp_industrial_production', 'gbp_manufacturing', 'gbp_retail_sales_incl', 'gbp_retail_sales_excl', 'gbp_services_pmi', 'gbp_construction_pmi']
		},
		{
			category: 'inflation',
			name: 'Inflation Metrics',
			name_de: 'Inflationsmetriken',
			description: 'CPI and price level changes across the UK including housing inflation',
			description_de: 'VPI und Preisveränderungen im Vereinigten Königreich einschließlich Wohnungsinflation',
			color: 'red',
			icon: 'TrendingUp',
			importance_weight: 30,
			indicators: ['gbp_cpi', 'gbp_core_cpi', 'gbp_ppi_input', 'gbp_ppi_output', 'gbp_hpi_halifax', 'gbp_hpi_nationwide']
		},
		{
			category: 'labor',
			name: 'Labor Market',
			name_de: 'Arbeitsmarkt',
			description: 'Employment, unemployment, and wage data for the UK',
			description_de: 'Beschäftigungs-, Arbeitslosigkeits- und Lohndaten für das Vereinigte Königreich',
			color: 'green',
			icon: 'Users',
			importance_weight: 25,
			indicators: ['gbp_unemployment', 'gbp_employment_change', 'gbp_weekly_earnings', 'gbp_claimant_count']
		},
		{
			category: 'trade',
			name: 'Trade & Balance',
			name_de: 'Handel & Bilanz',
			description: 'International trade and balance of payments for the UK',
			description_de: 'Internationaler Handel und Zahlungsbilanz für das Vereinigte Königreich',
			color: 'purple',
			icon: 'Globe',
			importance_weight: 10,
			indicators: ['gbp_trade_balance', 'gbp_current_account', 'gbp_terms_of_trade', 'gbp_export_prices', 'gbp_import_prices']
		},
		{
			category: 'monetary_policy',
			name: 'Monetary Policy',
			name_de: 'Geldpolitik',
			description: 'BoE rates, gilt yields, and monetary policy tools',
			description_de: 'BoE-Zinsen, Gilt-Renditen und geldpolitische Instrumente',
			color: 'yellow',
			icon: 'Percent',
			importance_weight: 20,
			indicators: ['gbp_bank_rate', 'gbp_gilt_2y', 'gbp_gilt_10y', 'gbp_asset_purchases', 'gbp_yield_spread']
		},
		{
			category: 'sentiment',
			name: 'Sentiment & Confidence',
			name_de: 'Stimmung & Vertrauen',
			description: 'Business and consumer confidence indicators for the UK',
			description_de: 'Geschäfts- und Verbrauchervertrauensindikatoren für das Vereinigte Königreich',
			color: 'teal',
			icon: 'Gauge',
			importance_weight: 15,
			indicators: ['gbp_gfk_confidence', 'gbp_pmi_manufacturing', 'gbp_pmi_services', 'gbp_pmi_construction', 'gbp_cbi_optimism', 'gbp_lloyds_barometer']
		},
		{
			category: 'housing',
			name: 'Housing Market',
			name_de: 'Wohnungsmarkt',
			description: 'Real estate and construction sector indicators for the UK',
			description_de: 'Immobilien- und Bausektorindikatoren für das Vereinigte Königreich',
			color: 'orange',
			icon: 'Building',
			importance_weight: 8,
			indicators: ['gbp_halifax_prices', 'gbp_nationwide_prices', 'gbp_mortgage_approvals', 'gbp_rics_survey', 'gbp_construction_output']
		},
		{
			category: 'fiscal_policy',
			name: 'Fiscal Policy',
			name_de: 'Fiskalpolitik',
			description: 'Government borrowing, debt, and fiscal measures for the UK',
			description_de: 'Staatsverschuldung, Schulden und fiskalische Maßnahmen für das Vereinigte Königreich',
			color: 'gray',
			icon: 'Building2',
			importance_weight: 5,
			indicators: ['gbp_psnb', 'gbp_debt_gdp', 'gbp_gov_investment', 'gbp_social_spending']
		}
	];
}

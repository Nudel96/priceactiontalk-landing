import type { 
	MacroeconomicIndicator, 
	MacroeconomicDataPoint,
	IndicatorCategoryConfig,
	EconomicHealthScore
} from '$lib/types/economic';

// Generate realistic historical data points for EUR indicators
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

// Generate next release date for EUR indicators
function getNextReleaseDate(frequency: string): string {
	const now = new Date();
	const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
	
	// ECB typically releases data mid-month
	nextMonth.setDate(15);
	
	return nextMonth.toISOString().split('T')[0];
}

// EUR-specific indicator interface extending base
export interface EURMacroeconomicData {
	// Growth Indicators
	gdp_growth_rate: MacroeconomicIndicator;
	industrial_production: MacroeconomicIndicator;
	retail_sales: MacroeconomicIndicator;
	
	// Inflation Metrics
	hicp: MacroeconomicIndicator;
	core_hicp: MacroeconomicIndicator;
	ppi: MacroeconomicIndicator;
	
	// Labor Market Data
	unemployment_rate: MacroeconomicIndicator;
	employment_growth: MacroeconomicIndicator;
	wage_growth: MacroeconomicIndicator;
	unit_labor_costs: MacroeconomicIndicator;
	
	// Trade & Balance of Payments
	trade_balance: MacroeconomicIndicator;
	current_account_balance: MacroeconomicIndicator;
	target2_balances: MacroeconomicIndicator;
	
	// Monetary Policy
	ecb_main_rate: MacroeconomicIndicator;
	ecb_deposit_rate: MacroeconomicIndicator;
	german_bund_10y: MacroeconomicIndicator;
	italian_spread: MacroeconomicIndicator;
	spanish_spread: MacroeconomicIndicator;
	money_supply_m3: MacroeconomicIndicator;
	
	// Sentiment & Confidence
	economic_sentiment_indicator: MacroeconomicIndicator;
	consumer_confidence: MacroeconomicIndicator;
	ifo_business_climate: MacroeconomicIndicator;
	zew_indicator: MacroeconomicIndicator;
	eurozone_pmi_composite: MacroeconomicIndicator;
	eurozone_pmi_manufacturing: MacroeconomicIndicator;
	eurozone_pmi_services: MacroeconomicIndicator;
	
	// Housing Market
	house_price_index: MacroeconomicIndicator;
	building_permits: MacroeconomicIndicator;
	construction_output: MacroeconomicIndicator;
	
	// Fiscal Policy
	debt_to_gdp: MacroeconomicIndicator;
	deficit_ratio: MacroeconomicIndicator;
	fiscal_impulse: MacroeconomicIndicator;
}

// Create comprehensive EUR macroeconomic data
export function generateEURMacroeconomicData(): EURMacroeconomicData {
	const now = new Date().toISOString();
	
	return {
		// Growth Indicators
		gdp_growth_rate: {
			id: 'eur_gdp_growth',
			name: 'Eurozone GDP Growth Rate',
			name_de: 'Eurozone BIP-Wachstumsrate',
			category: 'growth',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 0.3,
			previous_value: 0.1,
			forecast_value: 0.4,
			change_absolute: 0.2,
			change_percent: 200.0,
			impact: 'high',
			trend: 'up',
			unit: '% QoQ',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Measures the quarterly change in the inflation-adjusted value of all goods and services produced in the Eurozone.',
			description_de: 'Misst die quartalsweise Veränderung des inflationsbereinigten Wertes aller in der Eurozone produzierten Güter und Dienstleistungen.',
			market_impact_explanation: 'Higher Eurozone GDP growth typically strengthens the EUR as it indicates economic expansion across the 19-member currency union.',
			market_impact_explanation_de: 'Höheres Eurozone-BIP-Wachstum stärkt typischerweise den EUR, da es wirtschaftliche Expansion in der 19-Mitglieder-Währungsunion anzeigt.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(0.2, 12, 0.2, 0.05)
		},

		industrial_production: {
			id: 'eur_industrial_production',
			name: 'Eurozone Industrial Production',
			name_de: 'Eurozone Industrieproduktion',
			category: 'growth',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: -0.6,
			previous_value: -1.1,
			forecast_value: -0.3,
			change_absolute: 0.5,
			change_percent: 45.5,
			impact: 'medium',
			trend: 'up',
			unit: '% MoM',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures the monthly change in the volume of production in manufacturing, mining, and utilities across the Eurozone.',
			description_de: 'Misst die monatliche Veränderung des Produktionsvolumens in Fertigung, Bergbau und Versorgungsunternehmen in der Eurozone.',
			market_impact_explanation: 'Improving industrial production indicates economic recovery and can support EUR strength, especially given manufacturing importance in Germany.',
			market_impact_explanation_de: 'Sich verbessernde Industrieproduktion zeigt wirtschaftliche Erholung an und kann EUR-Stärke unterstützen, besonders angesichts der Bedeutung der Fertigung in Deutschland.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(-0.8, 24, 0.8, 0.1)
		},

		retail_sales: {
			id: 'eur_retail_sales',
			name: 'Eurozone Retail Sales',
			name_de: 'Eurozone Einzelhandelsumsätze',
			category: 'growth',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 0.1,
			previous_value: -0.3,
			forecast_value: 0.2,
			change_absolute: 0.4,
			change_percent: 133.3,
			impact: 'medium',
			trend: 'up',
			unit: '% MoM',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures the month-over-month change in the total value of sales at the retail level across the Eurozone.',
			description_de: 'Misst die monatliche Veränderung des Gesamtwerts der Verkäufe auf Einzelhandelsebene in der Eurozone.',
			market_impact_explanation: 'Strong retail sales indicate robust consumer spending across the Eurozone, supporting economic growth and EUR strength.',
			market_impact_explanation_de: 'Starke Einzelhandelsumsätze zeigen robuste Verbraucherausgaben in der Eurozone an und unterstützen Wirtschaftswachstum und EUR-Stärke.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(-0.1, 24, 0.4, 0.15)
		},

		// Inflation Metrics
		hicp: {
			id: 'eur_hicp',
			name: 'Eurozone HICP',
			name_de: 'Eurozone HVPI',
			category: 'inflation',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 2.9,
			previous_value: 4.3,
			forecast_value: 2.7,
			change_absolute: -1.4,
			change_percent: -32.6,
			impact: 'high',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Harmonized Index of Consumer Prices - the ECB\'s primary inflation measure for the Eurozone.',
			description_de: 'Harmonisierter Verbraucherpreisindex - das primäre Inflationsmaß der EZB für die Eurozone.',
			market_impact_explanation: 'HICP approaching ECB\'s 2% target may signal potential for policy normalization, supporting EUR strength.',
			market_impact_explanation_de: 'HVPI, der sich dem 2%-Ziel der EZB nähert, kann Potenzial für Politiknormalisierung signalisieren und EUR-Stärke unterstützen.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(3.8, 24, 0.8, -0.4)
		},

		core_hicp: {
			id: 'eur_core_hicp',
			name: 'Eurozone Core HICP',
			name_de: 'Eurozone Kern-HVPI',
			category: 'inflation',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 4.2,
			previous_value: 4.5,
			forecast_value: 4.0,
			change_absolute: -0.3,
			change_percent: -6.7,
			impact: 'high',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'HICP excluding volatile energy and food prices, providing clearer view of underlying inflation trends.',
			description_de: 'HVPI ohne volatile Energie- und Lebensmittelpreise, bietet klarere Sicht auf zugrundeliegende Inflationstrends.',
			market_impact_explanation: 'Core HICP remains above ECB target, suggesting continued need for restrictive monetary policy to control inflation.',
			market_impact_explanation_de: 'Kern-HVPI bleibt über EZB-Ziel, deutet auf anhaltenden Bedarf für restriktive Geldpolitik zur Inflationskontrolle hin.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(4.6, 24, 0.4, -0.2)
		},

		ppi: {
			id: 'eur_ppi',
			name: 'Eurozone Producer Price Index',
			name_de: 'Eurozone Erzeugerpreisindex',
			category: 'inflation',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: -12.4,
			previous_value: -9.8,
			forecast_value: -11.0,
			change_absolute: -2.6,
			change_percent: -26.5,
			impact: 'medium',
			trend: 'down',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures average change in selling prices received by domestic producers in the Eurozone.',
			description_de: 'Misst durchschnittliche Veränderung der Verkaufspreise inländischer Produzenten in der Eurozone.',
			market_impact_explanation: 'Sharp decline in PPI indicates easing price pressures in the production pipeline, supporting disinflation narrative.',
			market_impact_explanation_de: 'Starker Rückgang des EPI zeigt nachlassenden Preisdruck in der Produktionspipeline an und unterstützt Desinflationsnarrativ.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(-8.0, 24, 3.0, -2.0)
		},

		// Labor Market Data
		unemployment_rate: {
			id: 'eur_unemployment',
			name: 'Eurozone Unemployment Rate',
			name_de: 'Eurozone Arbeitslosenquote',
			category: 'labor',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 6.4,
			previous_value: 6.5,
			forecast_value: 6.3,
			change_absolute: -0.1,
			change_percent: -1.5,
			impact: 'high',
			trend: 'down',
			unit: '%',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Percentage of labor force that is unemployed and actively seeking employment across the Eurozone.',
			description_de: 'Prozentsatz der Erwerbsbevölkerung, die arbeitslos ist und aktiv Arbeit sucht in der Eurozone.',
			market_impact_explanation: 'Declining unemployment indicates labor market strength, potentially supporting wage growth and EUR strength.',
			market_impact_explanation_de: 'Sinkende Arbeitslosigkeit zeigt Arbeitsmarktstärke an, könnte Lohnwachstum und EUR-Stärke unterstützen.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(6.6, 24, 0.3, -0.1)
		},

		employment_growth: {
			id: 'eur_employment_growth',
			name: 'Eurozone Employment Growth',
			name_de: 'Eurozone Beschäftigungswachstum',
			category: 'labor',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 1.3,
			previous_value: 1.1,
			forecast_value: 1.2,
			change_absolute: 0.2,
			change_percent: 18.2,
			impact: 'medium',
			trend: 'up',
			unit: '% YoY',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Year-over-year change in total employment across the Eurozone.',
			description_de: 'Jährliche Veränderung der Gesamtbeschäftigung in der Eurozone.',
			market_impact_explanation: 'Strong employment growth indicates economic resilience and supports consumer spending capacity.',
			market_impact_explanation_de: 'Starkes Beschäftigungswachstum zeigt wirtschaftliche Widerstandsfähigkeit an und unterstützt Verbraucherausgabenkapazität.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(1.0, 12, 0.3, 0.1)
		},

		wage_growth: {
			id: 'eur_wage_growth',
			name: 'Eurozone Wage Growth',
			name_de: 'Eurozone Lohnwachstum',
			category: 'labor',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 4.7,
			previous_value: 4.2,
			forecast_value: 4.5,
			change_absolute: 0.5,
			change_percent: 11.9,
			impact: 'medium',
			trend: 'up',
			unit: '% YoY',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Year-over-year change in negotiated wages across the Eurozone.',
			description_de: 'Jährliche Veränderung der ausgehandelten Löhne in der Eurozone.',
			market_impact_explanation: 'Rising wage growth may fuel inflation concerns and influence ECB policy decisions toward tightening.',
			market_impact_explanation_de: 'Steigendes Lohnwachstum kann Inflationssorgen schüren und EZB-Politikentscheidungen in Richtung Straffung beeinflussen.',
			source: 'ECB',
			historical_data: generateHistoricalData(3.8, 12, 0.5, 0.3)
		},

		unit_labor_costs: {
			id: 'eur_unit_labor_costs',
			name: 'Eurozone Unit Labor Costs',
			name_de: 'Eurozone Lohnstückkosten',
			category: 'labor',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 6.3,
			previous_value: 5.8,
			forecast_value: 6.0,
			change_absolute: 0.5,
			change_percent: 8.6,
			impact: 'medium',
			trend: 'up',
			unit: '% YoY',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Measures labor costs per unit of output, indicating wage-driven inflation pressures.',
			description_de: 'Misst Arbeitskosten pro Produktionseinheit, zeigt lohngetriebene Inflationsdrücke an.',
			market_impact_explanation: 'Rising unit labor costs indicate potential wage-price spiral risks, concerning for ECB inflation control.',
			market_impact_explanation_de: 'Steigende Lohnstückkosten zeigen potenzielle Lohn-Preis-Spiralrisiken an, besorgniserregend für EZB-Inflationskontrolle.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(5.5, 12, 0.8, 0.3)
		},

		// Trade & Balance of Payments
		trade_balance: {
			id: 'eur_trade_balance',
			name: 'Eurozone Trade Balance',
			name_de: 'Eurozone Handelsbilanz',
			category: 'trade',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 20.1,
			previous_value: 18.7,
			forecast_value: 19.5,
			change_absolute: 1.4,
			change_percent: 7.5,
			impact: 'medium',
			trend: 'up',
			unit: 'Billion EUR',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Difference between the value of exports and imports of goods and services for the Eurozone.',
			description_de: 'Differenz zwischen dem Wert von Exporten und Importen von Gütern und Dienstleistungen für die Eurozone.',
			market_impact_explanation: 'Improving trade surplus indicates strong export competitiveness and can support EUR strength.',
			market_impact_explanation_de: 'Sich verbessernder Handelsüberschuss zeigt starke Exportwettbewerbsfähigkeit an und kann EUR-Stärke unterstützen.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(18.5, 24, 3.0, 0.5)
		},

		current_account_balance: {
			id: 'eur_current_account',
			name: 'Eurozone Current Account Balance',
			name_de: 'Eurozone Leistungsbilanz',
			category: 'trade',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 2.8,
			previous_value: 2.1,
			forecast_value: 2.5,
			change_absolute: 0.7,
			change_percent: 33.3,
			impact: 'medium',
			trend: 'up',
			unit: '% of GDP',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Broadest measure of trade including goods, services, income, and current transfers as percentage of GDP.',
			description_de: 'Breitestes Handelsmaß einschließlich Güter, Dienstleistungen, Einkommen und laufende Transfers als Prozentsatz des BIP.',
			market_impact_explanation: 'Strong current account surplus indicates external competitiveness and supports EUR demand.',
			market_impact_explanation_de: 'Starker Leistungsbilanzüberschuss zeigt externe Wettbewerbsfähigkeit an und unterstützt EUR-Nachfrage.',
			source: 'ECB',
			historical_data: generateHistoricalData(2.3, 24, 0.5, 0.2)
		},

		target2_balances: {
			id: 'eur_target2',
			name: 'Target2 Balances',
			name_de: 'Target2-Salden',
			category: 'trade',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 1150.0,
			previous_value: 1180.0,
			forecast_value: 1140.0,
			change_absolute: -30.0,
			change_percent: -2.5,
			impact: 'low',
			trend: 'down',
			unit: 'Billion EUR',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Imbalances in the Eurozone payment system, indicating capital flows between member countries.',
			description_de: 'Ungleichgewichte im Eurozone-Zahlungssystem, zeigen Kapitalflüsse zwischen Mitgliedsländern an.',
			market_impact_explanation: 'Declining Target2 imbalances suggest reduced financial fragmentation within the Eurozone.',
			market_impact_explanation_de: 'Sinkende Target2-Ungleichgewichte deuten auf reduzierte Finanzfragmentierung in der Eurozone hin.',
			source: 'ECB',
			historical_data: generateHistoricalData(1200.0, 24, 50.0, -20.0)
		},

		// Monetary Policy
		ecb_main_rate: {
			id: 'eur_ecb_main_rate',
			name: 'ECB Main Refinancing Rate',
			name_de: 'EZB Hauptrefinanzierungssatz',
			category: 'monetary_policy',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 4.50,
			previous_value: 4.25,
			forecast_value: 4.75,
			change_absolute: 0.25,
			change_percent: 5.9,
			impact: 'high',
			trend: 'up',
			unit: '%',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'The interest rate on the main refinancing operations of the ECB.',
			description_de: 'Der Zinssatz für die Hauptrefinanzierungsgeschäfte der EZB.',
			market_impact_explanation: 'Higher ECB rates typically strengthen EUR by increasing yield differential with other currencies.',
			market_impact_explanation_de: 'Höhere EZB-Zinsen stärken typischerweise EUR durch Erhöhung der Renditedifferenz zu anderen Währungen.',
			source: 'ECB',
			historical_data: generateHistoricalData(4.0, 24, 0.5, 0.2)
		},

		ecb_deposit_rate: {
			id: 'eur_ecb_deposit_rate',
			name: 'ECB Deposit Facility Rate',
			name_de: 'EZB Einlagefazilitätssatz',
			category: 'monetary_policy',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 4.00,
			previous_value: 3.75,
			forecast_value: 4.25,
			change_absolute: 0.25,
			change_percent: 6.7,
			impact: 'high',
			trend: 'up',
			unit: '%',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'The rate on the deposit facility, which banks may use to make overnight deposits with the ECB.',
			description_de: 'Der Zinssatz für die Einlagefazilität, die Banken für Übernachteinlagen bei der EZB nutzen können.',
			market_impact_explanation: 'The deposit rate is the ECB\'s key policy rate, directly influencing money market rates and EUR strength.',
			market_impact_explanation_de: 'Der Einlagensatz ist der wichtigste Leitzins der EZB und beeinflusst direkt Geldmarktzinsen und EUR-Stärke.',
			source: 'ECB',
			historical_data: generateHistoricalData(3.5, 24, 0.5, 0.2)
		},

		german_bund_10y: {
			id: 'eur_bund_10y',
			name: 'German 10-Year Bund Yield',
			name_de: '10-jährige deutsche Bundesanleihenrendite',
			category: 'monetary_policy',
			country: 'Germany',
			currency: 'EUR',
			current_value: 2.45,
			previous_value: 2.38,
			forecast_value: 2.50,
			change_absolute: 0.07,
			change_percent: 2.9,
			impact: 'high',
			trend: 'up',
			unit: '%',
			frequency: 'daily',
			last_updated: now,
			next_release: 'Continuous',
			description: 'Yield on 10-year German government bonds, the benchmark for Eurozone long-term interest rates.',
			description_de: 'Rendite auf 10-jährige deutsche Staatsanleihen, der Maßstab für langfristige Zinssätze in der Eurozone.',
			market_impact_explanation: 'Rising Bund yields often strengthen EUR as they attract foreign capital seeking higher returns.',
			market_impact_explanation_de: 'Steigende Bund-Renditen stärken oft EUR, da sie ausländisches Kapital anziehen, das höhere Renditen sucht.',
			source: 'Deutsche Bundesbank',
			historical_data: generateHistoricalData(2.3, 24, 0.3, 0.05)
		},

		italian_spread: {
			id: 'eur_italian_spread',
			name: 'Italy-Germany 10Y Spread',
			name_de: 'Italien-Deutschland 10J-Spread',
			category: 'monetary_policy',
			country: 'Italy',
			currency: 'EUR',
			current_value: 185,
			previous_value: 195,
			forecast_value: 180,
			change_absolute: -10,
			change_percent: -5.1,
			impact: 'medium',
			trend: 'down',
			unit: 'bps',
			frequency: 'daily',
			last_updated: now,
			next_release: 'Continuous',
			description: 'Yield spread between Italian and German 10-year government bonds, indicating peripheral risk.',
			description_de: 'Renditespread zwischen italienischen und deutschen 10-jährigen Staatsanleihen, zeigt peripheres Risiko an.',
			market_impact_explanation: 'Narrowing spreads indicate reduced Eurozone fragmentation risk, supporting EUR strength.',
			market_impact_explanation_de: 'Sich verengende Spreads zeigen reduziertes Eurozone-Fragmentierungsrisiko an und unterstützen EUR-Stärke.',
			source: 'Bloomberg',
			historical_data: generateHistoricalData(200, 24, 20, -5)
		},

		spanish_spread: {
			id: 'eur_spanish_spread',
			name: 'Spain-Germany 10Y Spread',
			name_de: 'Spanien-Deutschland 10J-Spread',
			category: 'monetary_policy',
			country: 'Spain',
			currency: 'EUR',
			current_value: 105,
			previous_value: 115,
			forecast_value: 100,
			change_absolute: -10,
			change_percent: -8.7,
			impact: 'medium',
			trend: 'down',
			unit: 'bps',
			frequency: 'daily',
			last_updated: now,
			next_release: 'Continuous',
			description: 'Yield spread between Spanish and German 10-year government bonds.',
			description_de: 'Renditespread zwischen spanischen und deutschen 10-jährigen Staatsanleihen.',
			market_impact_explanation: 'Tightening Spanish spreads reflect improved fiscal confidence and Eurozone stability.',
			market_impact_explanation_de: 'Sich verengende spanische Spreads spiegeln verbessertes fiskalisches Vertrauen und Eurozone-Stabilität wider.',
			source: 'Bloomberg',
			historical_data: generateHistoricalData(120, 24, 15, -8)
		},

		money_supply_m3: {
			id: 'eur_m3',
			name: 'Eurozone Money Supply M3',
			name_de: 'Eurozone Geldmenge M3',
			category: 'monetary_policy',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: -1.2,
			previous_value: -1.8,
			forecast_value: -0.8,
			change_absolute: 0.6,
			change_percent: 33.3,
			impact: 'low',
			trend: 'up',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Broad measure of money supply including currency, deposits, and money market instruments.',
			description_de: 'Breites Maß der Geldmenge einschließlich Währung, Einlagen und Geldmarktinstrumente.',
			market_impact_explanation: 'Contracting money supply indicates tight monetary conditions, potentially supporting EUR strength.',
			market_impact_explanation_de: 'Schrumpfende Geldmenge zeigt straffe monetäre Bedingungen an, könnte EUR-Stärke unterstützen.',
			source: 'ECB',
			historical_data: generateHistoricalData(-1.5, 24, 1.0, 0.2)
		},

		// Sentiment & Confidence
		economic_sentiment_indicator: {
			id: 'eur_esi',
			name: 'Economic Sentiment Indicator',
			name_de: 'Wirtschaftsstimmungsindikator',
			category: 'sentiment',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 93.3,
			previous_value: 91.8,
			forecast_value: 94.0,
			change_absolute: 1.5,
			change_percent: 1.6,
			impact: 'medium',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Composite indicator of economic sentiment across industry, services, consumers, construction, and retail.',
			description_de: 'Zusammengesetzter Indikator der Wirtschaftsstimmung in Industrie, Dienstleistungen, Verbrauchern, Bau und Einzelhandel.',
			market_impact_explanation: 'Improving economic sentiment indicates growing confidence in Eurozone recovery prospects.',
			market_impact_explanation_de: 'Sich verbessernde Wirtschaftsstimmung zeigt wachsendes Vertrauen in Eurozone-Erholungsaussichten an.',
			source: 'European Commission',
			historical_data: generateHistoricalData(92.0, 24, 3.0, 0.5)
		},

		consumer_confidence: {
			id: 'eur_consumer_confidence',
			name: 'Eurozone Consumer Confidence',
			name_de: 'Eurozone Verbrauchervertrauen',
			category: 'sentiment',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: -15.1,
			previous_value: -17.8,
			forecast_value: -14.5,
			change_absolute: 2.7,
			change_percent: 15.2,
			impact: 'medium',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Measures consumer optimism about economic conditions across the Eurozone.',
			description_de: 'Misst Verbraucheroptimismus über wirtschaftliche Bedingungen in der Eurozone.',
			market_impact_explanation: 'Improving consumer confidence suggests increased spending propensity, supporting economic growth.',
			market_impact_explanation_de: 'Sich verbesserndes Verbrauchervertrauen deutet auf erhöhte Ausgabenbereitschaft hin und unterstützt Wirtschaftswachstum.',
			source: 'European Commission',
			historical_data: generateHistoricalData(-16.5, 24, 3.0, 1.0)
		},

		ifo_business_climate: {
			id: 'eur_ifo',
			name: 'IFO Business Climate Index',
			name_de: 'IFO Geschäftsklimaindex',
			category: 'sentiment',
			country: 'Germany',
			currency: 'EUR',
			current_value: 87.3,
			previous_value: 85.7,
			forecast_value: 88.0,
			change_absolute: 1.6,
			change_percent: 1.9,
			impact: 'high',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Leading indicator of German economic activity based on business sentiment surveys.',
			description_de: 'Frühindikator der deutschen Wirtschaftsaktivität basierend auf Geschäftsstimmungsumfragen.',
			market_impact_explanation: 'IFO improvement indicates strengthening German economy, crucial for overall Eurozone performance.',
			market_impact_explanation_de: 'IFO-Verbesserung zeigt sich stärkende deutsche Wirtschaft an, entscheidend für die Gesamtleistung der Eurozone.',
			source: 'IFO Institute',
			historical_data: generateHistoricalData(86.0, 24, 2.5, 0.5)
		},

		zew_indicator: {
			id: 'eur_zew',
			name: 'ZEW Economic Sentiment',
			name_de: 'ZEW Konjunkturerwartungen',
			category: 'sentiment',
			country: 'Germany',
			currency: 'EUR',
			current_value: 13.1,
			previous_value: 5.4,
			forecast_value: 15.0,
			change_absolute: 7.7,
			change_percent: 142.6,
			impact: 'medium',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Survey of financial market experts\' expectations for German economic development.',
			description_de: 'Umfrage unter Finanzmarktexperten zu Erwartungen für die deutsche Wirtschaftsentwicklung.',
			market_impact_explanation: 'Rising ZEW expectations indicate improving sentiment among financial professionals about German outlook.',
			market_impact_explanation_de: 'Steigende ZEW-Erwartungen zeigen sich verbessernde Stimmung unter Finanzprofis über deutsche Aussichten an.',
			source: 'ZEW',
			historical_data: generateHistoricalData(8.0, 24, 8.0, 2.0)
		},

		eurozone_pmi_composite: {
			id: 'eur_pmi_composite',
			name: 'Eurozone PMI Composite',
			name_de: 'Eurozone PMI Gesamt',
			category: 'sentiment',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 47.1,
			previous_value: 46.7,
			forecast_value: 47.5,
			change_absolute: 0.4,
			change_percent: 0.9,
			impact: 'high',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Composite PMI covering both manufacturing and services sectors across the Eurozone.',
			description_de: 'Zusammengesetzter PMI, der sowohl Fertigungs- als auch Dienstleistungssektoren in der Eurozone abdeckt.',
			market_impact_explanation: 'PMI below 50 indicates contraction, but improvement suggests economic stabilization.',
			market_impact_explanation_de: 'PMI unter 50 zeigt Kontraktion an, aber Verbesserung deutet auf wirtschaftliche Stabilisierung hin.',
			source: 'S&P Global',
			historical_data: generateHistoricalData(46.5, 24, 1.5, 0.2)
		},

		eurozone_pmi_manufacturing: {
			id: 'eur_pmi_manufacturing',
			name: 'Eurozone Manufacturing PMI',
			name_de: 'Eurozone Verarbeitendes Gewerbe PMI',
			category: 'sentiment',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 43.4,
			previous_value: 43.1,
			forecast_value: 44.0,
			change_absolute: 0.3,
			change_percent: 0.7,
			impact: 'high',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Purchasing Managers\' Index for the manufacturing sector across the Eurozone.',
			description_de: 'Einkaufsmanagerindex für den Fertigungssektor in der Eurozone.',
			market_impact_explanation: 'Manufacturing PMI remains in contraction territory but shows signs of stabilization.',
			market_impact_explanation_de: 'Fertigungs-PMI bleibt im Kontraktionsbereich, zeigt aber Anzeichen einer Stabilisierung.',
			source: 'S&P Global',
			historical_data: generateHistoricalData(43.0, 24, 1.8, 0.15)
		},

		eurozone_pmi_services: {
			id: 'eur_pmi_services',
			name: 'Eurozone Services PMI',
			name_de: 'Eurozone Dienstleistungs-PMI',
			category: 'sentiment',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 48.7,
			previous_value: 48.3,
			forecast_value: 49.0,
			change_absolute: 0.4,
			change_percent: 0.8,
			impact: 'high',
			trend: 'up',
			unit: 'Index',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Purchasing Managers\' Index for the services sector across the Eurozone.',
			description_de: 'Einkaufsmanagerindex für den Dienstleistungssektor in der Eurozone.',
			market_impact_explanation: 'Services PMI approaching 50 threshold suggests potential return to expansion in dominant sector.',
			market_impact_explanation_de: 'Dienstleistungs-PMI nähert sich 50er-Schwelle an, deutet auf mögliche Rückkehr zur Expansion im dominanten Sektor hin.',
			source: 'S&P Global',
			historical_data: generateHistoricalData(48.0, 24, 1.2, 0.25)
		},

		// Housing Market
		house_price_index: {
			id: 'eur_house_prices',
			name: 'Eurozone House Price Index',
			name_de: 'Eurozone Hauspreisindex',
			category: 'housing',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 1.2,
			previous_value: 2.9,
			forecast_value: 0.8,
			change_absolute: -1.7,
			change_percent: -58.6,
			impact: 'low',
			trend: 'down',
			unit: '% YoY',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Measures average change in house prices across the Eurozone.',
			description_de: 'Misst durchschnittliche Veränderung der Hauspreise in der Eurozone.',
			market_impact_explanation: 'Slowing house price growth indicates cooling real estate market amid higher interest rates.',
			market_impact_explanation_de: 'Verlangsamtes Hauspreisenwachstum zeigt abkühlenden Immobilienmarkt bei höheren Zinsen an.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(2.5, 12, 1.0, -0.5)
		},

		building_permits: {
			id: 'eur_building_permits',
			name: 'Eurozone Building Permits',
			name_de: 'Eurozone Baugenehmigungen',
			category: 'housing',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: -8.3,
			previous_value: -12.1,
			forecast_value: -6.0,
			change_absolute: 3.8,
			change_percent: 31.4,
			impact: 'low',
			trend: 'up',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Year-over-year change in building permits issued across the Eurozone.',
			description_de: 'Jährliche Veränderung der ausgestellten Baugenehmigungen in der Eurozone.',
			market_impact_explanation: 'Less negative building permits suggest potential stabilization in construction sector.',
			market_impact_explanation_de: 'Weniger negative Baugenehmigungen deuten auf mögliche Stabilisierung im Bausektor hin.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(-10.0, 24, 3.0, 1.0)
		},

		construction_output: {
			id: 'eur_construction',
			name: 'Eurozone Construction Output',
			name_de: 'Eurozone Bauproduktion',
			category: 'housing',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: -2.1,
			previous_value: -3.8,
			forecast_value: -1.5,
			change_absolute: 1.7,
			change_percent: 44.7,
			impact: 'low',
			trend: 'up',
			unit: '% YoY',
			frequency: 'monthly',
			last_updated: now,
			next_release: getNextReleaseDate('monthly'),
			description: 'Year-over-year change in construction sector output across the Eurozone.',
			description_de: 'Jährliche Veränderung der Bausektor-Produktion in der Eurozone.',
			market_impact_explanation: 'Improving construction output indicates gradual recovery in the building sector.',
			market_impact_explanation_de: 'Sich verbessernde Bauproduktion zeigt allmähliche Erholung im Bausektor an.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(-3.0, 24, 1.5, 0.5)
		},

		// Fiscal Policy
		debt_to_gdp: {
			id: 'eur_debt_gdp',
			name: 'Eurozone Debt-to-GDP Ratio',
			name_de: 'Eurozone Schulden-zu-BIP-Verhältnis',
			category: 'fiscal_policy',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: 91.4,
			previous_value: 92.1,
			forecast_value: 91.0,
			change_absolute: -0.7,
			change_percent: -0.8,
			impact: 'low',
			trend: 'down',
			unit: '% of GDP',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Total government debt as a percentage of Gross Domestic Product for the Eurozone.',
			description_de: 'Gesamte Staatsschuld als Prozentsatz des Bruttoinlandsprodukts für die Eurozone.',
			market_impact_explanation: 'Declining debt-to-GDP ratio indicates improving fiscal sustainability across the Eurozone.',
			market_impact_explanation_de: 'Sinkendes Schulden-zu-BIP-Verhältnis zeigt sich verbessernde fiskalische Nachhaltigkeit in der Eurozone an.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(92.5, 12, 1.0, -0.3)
		},

		deficit_ratio: {
			id: 'eur_deficit_ratio',
			name: 'Eurozone Deficit Ratio',
			name_de: 'Eurozone Defizitquote',
			category: 'fiscal_policy',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: -3.6,
			previous_value: -5.1,
			forecast_value: -3.2,
			change_absolute: 1.5,
			change_percent: 29.4,
			impact: 'low',
			trend: 'up',
			unit: '% of GDP',
			frequency: 'quarterly',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Government budget balance as a percentage of GDP for the Eurozone.',
			description_de: 'Staatshaushaltssaldo als Prozentsatz des BIP für die Eurozone.',
			market_impact_explanation: 'Improving deficit ratio shows fiscal consolidation progress, supporting Eurozone stability.',
			market_impact_explanation_de: 'Sich verbessernde Defizitquote zeigt fiskalischen Konsolidierungsfortschritt und unterstützt Eurozone-Stabilität.',
			source: 'Eurostat',
			historical_data: generateHistoricalData(-4.5, 12, 0.8, 0.5)
		},

		fiscal_impulse: {
			id: 'eur_fiscal_impulse',
			name: 'Eurozone Fiscal Impulse',
			name_de: 'Eurozone Fiskalimpuls',
			category: 'fiscal_policy',
			country: 'Eurozone',
			currency: 'EUR',
			current_value: -0.8,
			previous_value: -1.2,
			forecast_value: -0.5,
			change_absolute: 0.4,
			change_percent: 33.3,
			impact: 'low',
			trend: 'up',
			unit: '% of GDP',
			frequency: 'annually',
			last_updated: now,
			next_release: getNextReleaseDate('quarterly'),
			description: 'Change in the structural fiscal balance, indicating fiscal policy stance.',
			description_de: 'Veränderung des strukturellen Haushaltssaldos, zeigt fiskalische Politikhaltung an.',
			market_impact_explanation: 'Less negative fiscal impulse suggests reduced fiscal drag on economic growth.',
			market_impact_explanation_de: 'Weniger negativer Fiskalimpuls deutet auf reduzierten fiskalischen Widerstand gegen Wirtschaftswachstum hin.',
			source: 'ECB',
			historical_data: generateHistoricalData(-1.0, 12, 0.5, 0.2)
		}
	};
}

// Generate EUR-specific category configurations
export function generateEURIndicatorCategories(): IndicatorCategoryConfig[] {
	return [
		{
			category: 'growth',
			name: 'Growth Indicators',
			name_de: 'Wachstumsindikatoren',
			description: 'Measures of Eurozone economic expansion and production',
			description_de: 'Maße für wirtschaftliche Expansion und Produktion in der Eurozone',
			color: 'blue',
			icon: 'TrendingUp',
			importance_weight: 25,
			indicators: ['eur_gdp_growth', 'eur_industrial_production', 'eur_retail_sales']
		},
		{
			category: 'inflation',
			name: 'Inflation Metrics',
			name_de: 'Inflationsmetriken',
			description: 'HICP and price level changes across the Eurozone',
			description_de: 'HVPI und Preisveränderungen in der Eurozone',
			color: 'red',
			icon: 'TrendingUp',
			importance_weight: 30,
			indicators: ['eur_hicp', 'eur_core_hicp', 'eur_ppi']
		},
		{
			category: 'labor',
			name: 'Labor Market',
			name_de: 'Arbeitsmarkt',
			description: 'Employment, unemployment, and wage data for the Eurozone',
			description_de: 'Beschäftigungs-, Arbeitslosigkeits- und Lohndaten für die Eurozone',
			color: 'green',
			icon: 'Users',
			importance_weight: 25,
			indicators: ['eur_unemployment', 'eur_employment_growth', 'eur_wage_growth', 'eur_unit_labor_costs']
		},
		{
			category: 'trade',
			name: 'Trade & Balance',
			name_de: 'Handel & Bilanz',
			description: 'International trade and balance of payments for the Eurozone',
			description_de: 'Internationaler Handel und Zahlungsbilanz für die Eurozone',
			color: 'purple',
			icon: 'Globe',
			importance_weight: 10,
			indicators: ['eur_trade_balance', 'eur_current_account', 'eur_target2']
		},
		{
			category: 'monetary_policy',
			name: 'Monetary Policy',
			name_de: 'Geldpolitik',
			description: 'ECB rates, bond yields, and monetary policy tools',
			description_de: 'EZB-Zinsen, Anleihenrenditen und geldpolitische Instrumente',
			color: 'yellow',
			icon: 'Percent',
			importance_weight: 20,
			indicators: ['eur_ecb_main_rate', 'eur_ecb_deposit_rate', 'eur_bund_10y', 'eur_italian_spread', 'eur_spanish_spread', 'eur_m3']
		},
		{
			category: 'sentiment',
			name: 'Sentiment & Confidence',
			name_de: 'Stimmung & Vertrauen',
			description: 'Business and consumer confidence indicators for the Eurozone',
			description_de: 'Geschäfts- und Verbrauchervertrauensindikatoren für die Eurozone',
			color: 'teal',
			icon: 'Gauge',
			importance_weight: 15,
			indicators: ['eur_esi', 'eur_consumer_confidence', 'eur_ifo', 'eur_zew', 'eur_pmi_composite', 'eur_pmi_manufacturing', 'eur_pmi_services']
		},
		{
			category: 'housing',
			name: 'Housing Market',
			name_de: 'Wohnungsmarkt',
			description: 'Real estate and construction sector indicators for the Eurozone',
			description_de: 'Immobilien- und Bausektorindikatoren für die Eurozone',
			color: 'orange',
			icon: 'Building',
			importance_weight: 8,
			indicators: ['eur_house_prices', 'eur_building_permits', 'eur_construction']
		},
		{
			category: 'fiscal_policy',
			name: 'Fiscal Policy',
			name_de: 'Fiskalpolitik',
			description: 'Government debt, deficit, and fiscal measures for the Eurozone',
			description_de: 'Staatsschulden, Defizit und fiskalische Maßnahmen für die Eurozone',
			color: 'gray',
			icon: 'Building2',
			importance_weight: 5,
			indicators: ['eur_debt_gdp', 'eur_deficit_ratio', 'eur_fiscal_impulse']
		}
	];
}

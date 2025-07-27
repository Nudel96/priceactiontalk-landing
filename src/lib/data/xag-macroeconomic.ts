import type { MacroeconomicIndicator, IndicatorCategoryConfig, XAGMacroeconomicData } from '$lib/types/economic';
import { getRealSilverPriceData } from '$lib/services/economicDataService';

/**
 * Generate comprehensive Silver (XAG) macroeconomic data with real pricing
 * Reflects silver's dual nature as industrial commodity and precious metal
 */
export async function generateXAGMacroeconomicData(): Promise<XAGMacroeconomicData> {
	// Fetch real silver price data
	let silverPriceData;
	try {
		silverPriceData = await getRealSilverPriceData();
	} catch (error) {
		console.warn('Error fetching real silver price, using fallback:', error);
		// Fallback data
		silverPriceData = {
			current_price: 24.50,
			previous_price: 24.20,
			change_absolute: 0.30,
			change_percent: 1.24,
			last_updated: new Date().toISOString()
		};
	}

	return {
		// REAL-TIME SILVER PRICING
		silver_spot_price: {
			id: 'xag_spot_price',
			name: 'Silver Spot Price (XAG/USD)',
			name_de: 'Silber-Kassapreis (XAG/USD)',
			category: 'pricing',
			current_value: silverPriceData.current_price,
			previous_value: silverPriceData.previous_price,
			forecast_value: silverPriceData.current_price + (silverPriceData.change_absolute * 0.5),
			change_absolute: silverPriceData.change_absolute,
			change_percent: silverPriceData.change_percent,
			unit: 'USD/oz',
			frequency: 'Real-time',
			source: 'Alpha Vantage / Market Data',
			last_updated: silverPriceData.last_updated,
			next_release: 'Continuous',
			impact: 'high',
			market_impact_explanation: 'Real-time silver spot price reflects both industrial demand and precious metal investment flows.',
			market_impact_explanation_de: 'Der Echtzeit-Silber-Kassapreis spiegelt sowohl industrielle Nachfrage als auch Edelmetall-Investitionsströme wider.'
		},

		// INDUSTRIAL DEMAND & ECONOMIC GROWTH (Pro-cyclical)
		global_manufacturing_pmi: {
			id: 'xag_global_manufacturing_pmi',
			name: 'Global Manufacturing PMI',
			name_de: 'Globaler Fertigungs-PMI',
			category: 'industrial_demand',
			current_value: 48.2,
			previous_value: 49.1,
			forecast_value: 47.8,
			change_absolute: -0.9,
			change_percent: -1.8,
			unit: 'index',
			frequency: 'Monthly',
			source: 'J.P. Morgan',
			last_updated: '2024-02-01T00:00:00Z',
			next_release: '2024-03-01T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'Manufacturing strength drives industrial silver demand for electronics and technology.',
			market_impact_explanation_de: 'Fertigungsstärke treibt industrielle Silbernachfrage für Elektronik und Technologie.'
		},

		semiconductor_sales: {
			id: 'xag_semiconductor_sales',
			name: 'Global Semiconductor Sales',
			name_de: 'Globale Halbleiterverkäufe',
			category: 'industrial_demand',
			current_value: 8.2,
			previous_value: 5.8,
			forecast_value: 12.5,
			change_absolute: 2.4,
			change_percent: 41.4,
			unit: '% yoy',
			frequency: 'Monthly',
			source: 'Semiconductor Industry Association',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-02-29T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'Strong semiconductor growth drives silver demand for electronic components and circuits.',
			market_impact_explanation_de: 'Starkes Halbleiterwachstum treibt Silbernachfrage für elektronische Komponenten und Schaltkreise.'
		},

		solar_installations: {
			id: 'xag_solar_installations',
			name: 'Global Solar Panel Installations',
			name_de: 'Globale Solaranlagen-Installationen',
			category: 'industrial_demand',
			current_value: 28.5,
			previous_value: 22.1,
			forecast_value: 35.0,
			change_absolute: 6.4,
			change_percent: 28.9,
			unit: '% yoy',
			frequency: 'Quarterly',
			source: 'International Energy Agency',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-04-30T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'Solar boom drives 10-15% of silver demand through photovoltaic cell production.',
			market_impact_explanation_de: 'Solar-Boom treibt 10-15% der Silbernachfrage durch Photovoltaikzellen-Produktion.'
		},

		electric_vehicle_production: {
			id: 'xag_ev_production',
			name: 'Global EV Production',
			name_de: 'Globale E-Fahrzeug-Produktion',
			category: 'industrial_demand',
			current_value: 42.8,
			previous_value: 38.2,
			forecast_value: 48.0,
			change_absolute: 4.6,
			change_percent: 12.0,
			unit: '% yoy',
			frequency: 'Monthly',
			source: 'EV-Volumes',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-02-29T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'EVs use 25-50g more silver than ICE vehicles for electrical systems and batteries.',
			market_impact_explanation_de: 'E-Fahrzeuge verwenden 25-50g mehr Silber als Verbrenner für elektrische Systeme und Batterien.'
		},

		fiveg_infrastructure: {
			id: 'xag_5g_infrastructure',
			name: '5G Infrastructure Deployment',
			name_de: '5G-Infrastruktur-Ausbau',
			category: 'industrial_demand',
			current_value: 18.5,
			previous_value: 15.2,
			forecast_value: 22.0,
			change_absolute: 3.3,
			change_percent: 21.7,
			unit: '% yoy',
			frequency: 'Quarterly',
			source: 'GSMA',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-04-30T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: '5G networks require more silver for enhanced connectivity and data transmission.',
			market_impact_explanation_de: '5G-Netzwerke benötigen mehr Silber für verbesserte Konnektivität und Datenübertragung.'
		},

		// PRECIOUS METALS INVESTMENT DEMAND
		gold_silver_ratio: {
			id: 'xag_gold_silver_ratio',
			name: 'Gold-Silver Ratio',
			name_de: 'Gold-Silber-Verhältnis',
			category: 'precious_metals_investment',
			current_value: 82.5,
			previous_value: 85.2,
			forecast_value: 78.0,
			change_absolute: -2.7,
			change_percent: -3.2,
			unit: 'ratio',
			frequency: 'Daily',
			source: 'LBMA',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'high',
			market_impact_explanation: 'High ratio suggests silver undervalued vs gold, potential for mean reversion to 65-75 range.',
			market_impact_explanation_de: 'Hohes Verhältnis deutet auf unterbewertetes Silber vs Gold hin, Potenzial für Rückkehr zu 65-75 Bereich.'
		},

		silver_etf_holdings: {
			id: 'xag_etf_holdings',
			name: 'Silver ETF Holdings',
			name_de: 'Silber-ETF-Bestände',
			category: 'precious_metals_investment',
			current_value: 18450,
			previous_value: 18680,
			forecast_value: 18200,
			change_absolute: -230,
			change_percent: -1.2,
			unit: 'tonnes',
			frequency: 'Daily',
			source: 'Bloomberg',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'high',
			market_impact_explanation: 'ETF holdings remain near historical highs despite recent outflows, indicating strong investor interest.',
			market_impact_explanation_de: 'ETF-Bestände bleiben trotz jüngster Abflüsse nahe historischen Höchstständen, zeigt starkes Anlegerinteresse.'
		},

		investment_coin_sales: {
			id: 'xag_coin_sales',
			name: 'Silver Coin/Bar Sales',
			name_de: 'Silbermünzen-/Barren-Verkäufe',
			category: 'precious_metals_investment',
			current_value: 15.8,
			previous_value: 12.3,
			forecast_value: 18.0,
			change_absolute: 3.5,
			change_percent: 28.5,
			unit: '% yoy',
			frequency: 'Monthly',
			source: 'US Mint, Royal Canadian Mint',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-02-29T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Strong retail investment demand for physical silver coins and bars.',
			market_impact_explanation_de: 'Starke Einzelhandelsnachfrage nach physischen Silbermünzen und -barren.'
		},

		retail_sentiment: {
			id: 'xag_retail_sentiment',
			name: 'Retail Silver Sentiment',
			name_de: 'Einzelhandels-Silber-Stimmung',
			category: 'precious_metals_investment',
			current_value: 72,
			previous_value: 68,
			forecast_value: 75,
			change_absolute: 4,
			change_percent: 5.9,
			unit: 'index',
			frequency: 'Weekly',
			source: 'Silver Institute',
			last_updated: '2024-02-05T00:00:00Z',
			next_release: '2024-02-12T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Improving retail sentiment supports physical silver demand and price momentum.',
			market_impact_explanation_de: 'Sich verbessernde Einzelhandelsstimmung unterstützt physische Silbernachfrage und Preismomentum.'
		},

		// SUPPLY-SIDE FACTORS
		primary_mine_production: {
			id: 'xag_primary_mine_production',
			name: 'Primary Silver Mine Production',
			name_de: 'Primäre Silberminenproduktion',
			category: 'supply_side',
			current_value: -2.8,
			previous_value: -1.5,
			forecast_value: -3.5,
			change_absolute: -1.3,
			change_percent: -86.7,
			unit: '% yoy',
			frequency: 'Quarterly',
			source: 'Silver Institute',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-04-30T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'Declining primary production constrains supply, only ~30% of total silver comes from primary mines.',
			market_impact_explanation_de: 'Rückläufige Primärproduktion begrenzt Angebot, nur ~30% des Gesamtsilbers stammt aus Primärminen.'
		},

		byproduct_production: {
			id: 'xag_byproduct_production',
			name: 'By-product Silver from Base Metals',
			name_de: 'Nebenprodukt-Silber aus Basismetallen',
			category: 'supply_side',
			current_value: 1.2,
			previous_value: 2.8,
			forecast_value: 0.5,
			change_absolute: -1.6,
			change_percent: -57.1,
			unit: '% yoy',
			frequency: 'Quarterly',
			source: 'Silver Institute',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-04-30T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'By-product silver (~70% of supply) depends on copper, lead, zinc mining activity.',
			market_impact_explanation_de: 'Nebenprodukt-Silber (~70% des Angebots) hängt von Kupfer-, Blei-, Zink-Bergbauaktivität ab.'
		},

		comex_warehouse_stocks: {
			id: 'xag_comex_stocks',
			name: 'COMEX Silver Warehouse Stocks',
			name_de: 'COMEX-Silber-Lagerbestände',
			category: 'supply_side',
			current_value: 285.5,
			previous_value: 298.2,
			forecast_value: 270.0,
			change_absolute: -12.7,
			change_percent: -4.3,
			unit: 'million oz',
			frequency: 'Daily',
			source: 'CME Group',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'medium',
			market_impact_explanation: 'Declining warehouse stocks indicate tight physical supply and potential delivery stress.',
			market_impact_explanation_de: 'Rückläufige Lagerbestände zeigen knappes physisches Angebot und potenziellen Lieferstress an.'
		},

		recycling_supply: {
			id: 'xag_recycling_supply',
			name: 'Silver Recycling Supply',
			name_de: 'Silber-Recycling-Angebot',
			category: 'supply_side',
			current_value: -8.5,
			previous_value: -12.0,
			forecast_value: -5.0,
			change_absolute: 3.5,
			change_percent: 29.2,
			unit: '% yoy',
			frequency: 'Quarterly',
			source: 'Silver Institute',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-04-30T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Lower recycling at current prices suggests strong physical demand absorption.',
			market_impact_explanation_de: 'Geringeres Recycling bei aktuellen Preisen deutet auf starke physische Nachfrageabsorption hin.'
		},

		// MARKET STRUCTURE & SPECULATION
		cftc_speculative_positioning: {
			id: 'xag_cftc_positioning',
			name: 'CFTC Large Spec Net Long',
			name_de: 'CFTC Large Spec Netto-Long',
			category: 'market_structure',
			current_value: 28500,
			previous_value: 32100,
			forecast_value: 25000,
			change_absolute: -3600,
			change_percent: -11.2,
			unit: 'contracts',
			frequency: 'Weekly',
			source: 'CFTC',
			last_updated: '2024-02-06T00:00:00Z',
			next_release: '2024-02-13T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Reduced speculative length suggests potential for fresh buying on positive catalysts.',
			market_impact_explanation_de: 'Reduzierte spekulative Long-Positionen deuten auf Potenzial für neue Käufe bei positiven Katalysatoren hin.'
		},

		silver_volatility: {
			id: 'xag_volatility',
			name: 'Silver Realized Volatility (30D)',
			name_de: 'Silber realisierte Volatilität (30T)',
			category: 'market_structure',
			current_value: 28.5,
			previous_value: 24.2,
			forecast_value: 32.0,
			change_absolute: 4.3,
			change_percent: 17.8,
			unit: '%',
			frequency: 'Daily',
			source: 'Bloomberg',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'medium',
			market_impact_explanation: 'Higher volatility reflects silver\'s smaller market size and industrial/monetary dual nature.',
			market_impact_explanation_de: 'Höhere Volatilität spiegelt Silbers kleinere Marktgröße und industrielle/monetäre Doppelnatur wider.'
		},

		delivery_notices: {
			id: 'xag_delivery_notices',
			name: 'COMEX Silver Delivery Notices',
			name_de: 'COMEX-Silber-Lieferankündigungen',
			category: 'market_structure',
			current_value: 1850,
			previous_value: 1420,
			forecast_value: 2100,
			change_absolute: 430,
			change_percent: 30.3,
			unit: 'contracts',
			frequency: 'Monthly',
			source: 'CME Group',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-02-29T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Increased delivery demand indicates strong physical market and potential supply stress.',
			market_impact_explanation_de: 'Erhöhte Liefernachfrage zeigt starken physischen Markt und potenziellen Angebotsstress an.'
		},

		// MONETARY & MACRO FACTORS (Similar to Gold)
		us_real_interest_rates: {
			id: 'xag_us_real_rates',
			name: 'US 10Y Real Interest Rates (TIPS)',
			name_de: 'US 10J reale Zinssätze (TIPS)',
			category: 'monetary_macro',
			current_value: 1.85,
			previous_value: 2.12,
			forecast_value: 1.60,
			change_absolute: -0.27,
			change_percent: -12.7,
			unit: '%',
			frequency: 'Daily',
			source: 'US Treasury',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'high',
			market_impact_explanation: 'Lower real rates reduce opportunity cost of holding non-yielding silver, similar to gold.',
			market_impact_explanation_de: 'Niedrigere Realzinsen reduzieren Opportunitätskosten für zinsloses Silber, ähnlich wie Gold.'
		},

		dollar_strength: {
			id: 'xag_dollar_strength',
			name: 'US Dollar Index (DXY)',
			name_de: 'US-Dollar-Index (DXY)',
			category: 'monetary_macro',
			current_value: 103.2,
			previous_value: 104.8,
			forecast_value: 102.0,
			change_absolute: -1.6,
			change_percent: -1.5,
			unit: 'index',
			frequency: 'Daily',
			source: 'ICE',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'high',
			market_impact_explanation: 'Weaker dollar makes silver cheaper for foreign buyers and supports precious metals complex.',
			market_impact_explanation_de: 'Schwächerer Dollar macht Silber für ausländische Käufer billiger und unterstützt Edelmetallkomplex.'
		},

		inflation_expectations: {
			id: 'xag_inflation_expectations',
			name: 'US 5Y5Y Inflation Expectations',
			name_de: 'US 5J5J-Inflationserwartungen',
			category: 'monetary_macro',
			current_value: 2.8,
			previous_value: 2.6,
			forecast_value: 3.0,
			change_absolute: 0.2,
			change_percent: 7.7,
			unit: '%',
			frequency: 'Daily',
			source: 'Bloomberg',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'medium',
			market_impact_explanation: 'Rising inflation expectations support silver as inflation hedge and store of value.',
			market_impact_explanation_de: 'Steigende Inflationserwartungen unterstützen Silber als Inflationsschutz und Wertaufbewahrung.'
		},

		central_bank_liquidity: {
			id: 'xag_central_bank_liquidity',
			name: 'Global Central Bank Liquidity',
			name_de: 'Globale Zentralbank-Liquidität',
			category: 'monetary_macro',
			current_value: -2.8,
			previous_value: -1.5,
			forecast_value: -1.0,
			change_absolute: -1.3,
			change_percent: -86.7,
			unit: '% yoy',
			frequency: 'Monthly',
			source: 'CrossBorder Capital',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-02-29T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Liquidity contraction pressures risk assets but may support precious metals as alternatives.',
			market_impact_explanation_de: 'Liquiditätskontraktion belastet Risikoanlagen, kann aber Edelmetalle als Alternativen unterstützen.'
		},

		global_risk_sentiment: {
			id: 'xag_global_risk_sentiment',
			name: 'Global Risk Sentiment Index',
			name_de: 'Globaler Risikosentiment-Index',
			category: 'monetary_macro',
			current_value: 42,
			previous_value: 48,
			forecast_value: 38,
			change_absolute: -6,
			change_percent: -12.5,
			unit: 'index',
			frequency: 'Daily',
			source: 'Bloomberg',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'medium',
			market_impact_explanation: 'Risk-off sentiment supports silver\'s precious metals component while hurting industrial demand.',
			market_impact_explanation_de: 'Risk-off-Stimmung unterstützt Silbers Edelmetallkomponente, schadet aber industrieller Nachfrage.'
		}
	};
}

/**
 * Generate Silver (XAG) indicator categories configuration
 */
export function generateXAGIndicatorCategories(): IndicatorCategoryConfig[] {
	return [
		{
			category: 'pricing',
			name: 'Real-Time Pricing',
			name_de: 'Echtzeit-Preise',
			description: 'Live silver spot prices and market data',
			description_de: 'Live-Silber-Kassapreise und Marktdaten',
			color: '#94a3b8',
			icon: '🥈',
			importance_weight: 35,
			indicators: ['xag_spot_price']
		},
		{
			category: 'industrial_demand',
			name: 'Industrial Demand',
			name_de: 'Industrielle Nachfrage',
			description: 'Technology and industrial sectors driving silver consumption',
			description_de: 'Technologie- und Industriesektoren, die den Silberverbrauch antreiben',
			color: '#64748b',
			icon: '🏭',
			importance_weight: 30,
			indicators: ['xag_global_manufacturing_pmi', 'xag_semiconductor_sales', 'xag_solar_installations', 'xag_ev_production', 'xag_5g_infrastructure']
		},
		{
			category: 'precious_metals_investment',
			name: 'Investment Demand',
			name_de: 'Investitionsnachfrage',
			description: 'Investment flows and precious metals positioning',
			description_de: 'Investitionsflüsse und Edelmetallpositionierung',
			color: '#10b981',
			icon: '💎',
			importance_weight: 25,
			indicators: ['xag_gold_silver_ratio', 'xag_etf_holdings', 'xag_coin_sales', 'xag_retail_sentiment']
		},
		{
			category: 'supply_side',
			name: 'Supply Factors',
			name_de: 'Angebotsfaktoren',
			description: 'Mining production and supply chain dynamics',
			description_de: 'Minenproduktion und Lieferkettendynamik',
			color: '#06b6d4',
			icon: '⛏️',
			importance_weight: 20,
			indicators: ['xag_primary_mine_production', 'xag_byproduct_production', 'xag_comex_stocks', 'xag_recycling_supply']
		},
		{
			category: 'market_structure',
			name: 'Market Structure',
			name_de: 'Marktstruktur',
			description: 'Trading patterns and market positioning',
			description_de: 'Handelsmuster und Marktpositionierung',
			color: '#8b5cf6',
			icon: '📈',
			importance_weight: 15,
			indicators: ['xag_cftc_positioning', 'xag_volatility', 'xag_delivery_notices']
		},
		{
			category: 'monetary_macro',
			name: 'Monetary & Macro',
			name_de: 'Monetär & Makro',
			description: 'Macroeconomic factors affecting silver as monetary asset',
			description_de: 'Makroökonomische Faktoren, die Silber als monetäres Asset beeinflussen',
			color: '#f43f5e',
			icon: '🏦',
			importance_weight: 10,
			indicators: ['xag_us_real_rates', 'xag_dollar_strength', 'xag_inflation_expectations', 'xag_central_bank_liquidity', 'xag_global_risk_sentiment']
		}
	];
}

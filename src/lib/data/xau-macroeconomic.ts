import type { MacroeconomicIndicator, IndicatorCategoryConfig, XAUMacroeconomicData } from '$lib/types/economic';
import { getRealGoldPriceData } from '$lib/services/economicDataService';

/**
 * Generate comprehensive Gold (XAU) macroeconomic data with real pricing
 * Reflects gold's characteristics as a safe-haven asset and store of value
 */
export async function generateXAUMacroeconomicData(): Promise<XAUMacroeconomicData> {
	// Fetch real gold price data
	let goldPriceData;
	try {
		goldPriceData = await getRealGoldPriceData();
	} catch (error) {
		console.warn('Error fetching real gold price, using fallback:', error);
		// Fallback data
		goldPriceData = {
			current_price: 2050.00,
			previous_price: 2035.00,
			change_absolute: 15.00,
			change_percent: 0.74,
			last_updated: new Date().toISOString()
		};
	}

	return {
		// REAL-TIME GOLD PRICING
		gold_spot_price: {
			id: 'xau_spot_price',
			name: 'Gold Spot Price (XAU/USD)',
			name_de: 'Gold-Kassapreis (XAU/USD)',
			category: 'pricing',
			current_value: goldPriceData.current_price,
			previous_value: goldPriceData.previous_price,
			forecast_value: goldPriceData.current_price + (goldPriceData.change_absolute * 0.5),
			change_absolute: goldPriceData.change_absolute,
			change_percent: goldPriceData.change_percent,
			unit: 'USD/oz',
			frequency: 'Real-time',
			source: 'Alpha Vantage / Market Data',
			last_updated: goldPriceData.last_updated,
			next_release: 'Continuous',
			impact: 'high',
			market_impact_explanation: 'Real-time gold spot price reflects immediate market sentiment and safe-haven demand.',
			market_impact_explanation_de: 'Der Echtzeit-Gold-Kassapreis spiegelt die unmittelbare Marktstimmung und Safe-Haven-Nachfrage wider.'
		},

		// GLOBAL ECONOMIC GROWTH & SENTIMENT (Anti-cyclical)
		global_gdp_outlook: {
			id: 'xau_global_gdp_outlook',
			name: 'Global GDP Growth Outlook',
			name_de: 'Globaler BIP-Wachstumsausblick',
			category: 'growth_sentiment',
			current_value: 2.8,
			previous_value: 3.1,
			forecast_value: 2.5,
			change_absolute: -0.3,
			change_percent: -9.7,
			unit: '%',
			frequency: 'Quarterly',
			source: 'OECD',
			last_updated: '2024-01-15T00:00:00Z',
			next_release: '2024-04-15T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'Slower global growth increases safe-haven demand for gold. Economic uncertainty drives investors to precious metals.',
			market_impact_explanation_de: 'Langsameres globales Wachstum erhöht die Safe-Haven-Nachfrage nach Gold. Wirtschaftliche Unsicherheit treibt Investoren zu Edelmetallen.'
		},

		global_manufacturing_pmi: {
			id: 'xau_global_manufacturing_pmi',
			name: 'Global Manufacturing PMI',
			name_de: 'Globaler Fertigungs-PMI',
			category: 'growth_sentiment',
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
			market_impact_explanation: 'Manufacturing weakness below 50 signals economic contraction, boosting gold as safe-haven asset.',
			market_impact_explanation_de: 'Fertigungsschwäche unter 50 signalisiert wirtschaftliche Kontraktion und stärkt Gold als sicheren Hafen.'
		},

		world_trade_volume: {
			id: 'xau_world_trade_volume',
			name: 'World Trade Volume',
			name_de: 'Welthandelsvolumen',
			category: 'growth_sentiment',
			current_value: -2.1,
			previous_value: -1.5,
			forecast_value: -2.8,
			change_absolute: -0.6,
			change_percent: -40.0,
			unit: '% yoy',
			frequency: 'Monthly',
			source: 'WTO',
			last_updated: '2024-01-30T00:00:00Z',
			next_release: '2024-02-28T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Declining trade volumes indicate global economic stress, supporting gold demand.',
			market_impact_explanation_de: 'Rückläufige Handelsvolumen zeigen globalen wirtschaftlichen Stress an und unterstützen die Goldnachfrage.'
		},

		economic_policy_uncertainty: {
			id: 'xau_economic_policy_uncertainty',
			name: 'Global Economic Policy Uncertainty',
			name_de: 'Globale wirtschaftspolitische Unsicherheit',
			category: 'growth_sentiment',
			current_value: 285,
			previous_value: 268,
			forecast_value: 295,
			change_absolute: 17,
			change_percent: 6.3,
			unit: 'index',
			frequency: 'Monthly',
			source: 'Economic Policy Uncertainty',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-02-29T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'Rising policy uncertainty drives safe-haven flows into gold as investors seek stability.',
			market_impact_explanation_de: 'Steigende politische Unsicherheit treibt Safe-Haven-Flüsse in Gold, da Investoren Stabilität suchen.'
		},

		recession_probability: {
			id: 'xau_recession_probability',
			name: 'US Recession Probability (12M)',
			name_de: 'US-Rezessionswahrscheinlichkeit (12M)',
			category: 'growth_sentiment',
			current_value: 35.2,
			previous_value: 28.7,
			forecast_value: 42.0,
			change_absolute: 6.5,
			change_percent: 22.6,
			unit: '%',
			frequency: 'Monthly',
			source: 'NY Fed',
			last_updated: '2024-02-01T00:00:00Z',
			next_release: '2024-03-01T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'Higher recession probability increases gold allocation as portfolio insurance.',
			market_impact_explanation_de: 'Höhere Rezessionswahrscheinlichkeit erhöht Goldallokation als Portfolioversicherung.'
		},

		// INFLATION & CURRENCY DEBASEMENT
		us_consumer_price_index: {
			id: 'xau_us_cpi',
			name: 'US Consumer Price Index',
			name_de: 'US-Verbraucherpreisindex',
			category: 'inflation_currency',
			current_value: 3.4,
			previous_value: 3.7,
			forecast_value: 3.1,
			change_absolute: -0.3,
			change_percent: -8.1,
			unit: '% yoy',
			frequency: 'Monthly',
			source: 'Bureau of Labor Statistics',
			last_updated: '2024-02-13T00:00:00Z',
			next_release: '2024-03-12T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'Persistent inflation erodes currency purchasing power, making gold attractive as inflation hedge.',
			market_impact_explanation_de: 'Anhaltende Inflation erodiert Kaufkraft der Währung und macht Gold als Inflationsschutz attraktiv.'
		},

		global_inflation_expectations: {
			id: 'xau_global_inflation_expectations',
			name: 'Global 5Y5Y Inflation Expectations',
			name_de: 'Globale 5J5J-Inflationserwartungen',
			category: 'inflation_currency',
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
			impact: 'high',
			market_impact_explanation: 'Rising long-term inflation expectations support gold as traditional inflation hedge.',
			market_impact_explanation_de: 'Steigende langfristige Inflationserwartungen unterstützen Gold als traditionellen Inflationsschutz.'
		},

		us_real_interest_rates: {
			id: 'xau_us_real_rates',
			name: 'US 10Y Real Interest Rates (TIPS)',
			name_de: 'US 10J reale Zinssätze (TIPS)',
			category: 'inflation_currency',
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
			market_impact_explanation: 'Lower real rates reduce opportunity cost of holding non-yielding gold, key negative driver.',
			market_impact_explanation_de: 'Niedrigere Realzinsen reduzieren Opportunitätskosten für zinsloses Gold, wichtiger negativer Treiber.'
		},

		money_supply_growth: {
			id: 'xau_money_supply_growth',
			name: 'US M2 Money Supply Growth',
			name_de: 'US M2-Geldmengenwachstum',
			category: 'inflation_currency',
			current_value: 2.3,
			previous_value: 1.8,
			forecast_value: 2.8,
			change_absolute: 0.5,
			change_percent: 27.8,
			unit: '% yoy',
			frequency: 'Monthly',
			source: 'Federal Reserve',
			last_updated: '2024-01-25T00:00:00Z',
			next_release: '2024-02-26T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Money supply expansion can debase currency and support gold as store of value.',
			market_impact_explanation_de: 'Geldmengenexpansion kann Währung entwerten und Gold als Wertaufbewahrung unterstützen.'
		},

		dollar_index: {
			id: 'xau_dollar_index',
			name: 'US Dollar Index (DXY)',
			name_de: 'US-Dollar-Index (DXY)',
			category: 'inflation_currency',
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
			market_impact_explanation: 'Weaker dollar makes gold cheaper for foreign buyers and reduces opportunity cost.',
			market_impact_explanation_de: 'Schwächerer Dollar macht Gold für ausländische Käufer billiger und reduziert Opportunitätskosten.'
		},

		// MONETARY POLICY & INTEREST RATES
		fed_funds_rate: {
			id: 'xau_fed_funds_rate',
			name: 'Federal Funds Rate',
			name_de: 'Federal Funds Rate',
			category: 'monetary_policy',
			current_value: 5.50,
			previous_value: 5.25,
			forecast_value: 5.25,
			change_absolute: 0.25,
			change_percent: 4.8,
			unit: '%',
			frequency: '8 meetings per year',
			source: 'Federal Reserve',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-03-20T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'Higher rates increase opportunity cost of holding non-yielding gold, primary negative driver.',
			market_impact_explanation_de: 'Höhere Zinsen erhöhen Opportunitätskosten für zinsloses Gold, primärer negativer Treiber.'
		},

		us_10y_treasury_yield: {
			id: 'xau_us_10y_yield',
			name: 'US 10-Year Treasury Yield',
			name_de: 'US 10-Jahres-Staatsanleihenrendite',
			category: 'monetary_policy',
			current_value: 4.28,
			previous_value: 4.45,
			forecast_value: 4.10,
			change_absolute: -0.17,
			change_percent: -3.8,
			unit: '%',
			frequency: 'Daily',
			source: 'US Treasury',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'high',
			market_impact_explanation: 'Lower yields reduce competition for gold from interest-bearing assets.',
			market_impact_explanation_de: 'Niedrigere Renditen reduzieren Konkurrenz für Gold von zinsbringenden Anlagen.'
		},

		fed_balance_sheet: {
			id: 'xau_fed_balance_sheet',
			name: 'Fed Balance Sheet Size',
			name_de: 'Fed-Bilanzgröße',
			category: 'monetary_policy',
			current_value: 7.65,
			previous_value: 7.82,
			forecast_value: 7.45,
			change_absolute: -0.17,
			change_percent: -2.2,
			unit: 'trillion usd',
			frequency: 'Weekly',
			source: 'Federal Reserve',
			last_updated: '2024-02-08T00:00:00Z',
			next_release: '2024-02-15T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'QE expansion historically bullish for gold through currency debasement and lower real rates.',
			market_impact_explanation_de: 'QE-Expansion historisch bullisch für Gold durch Währungsentwertung und niedrigere Realzinsen.'
		},

		yield_curve_spread: {
			id: 'xau_yield_curve_spread',
			name: '10Y-2Y Yield Curve Spread',
			name_de: '10J-2J-Zinskurven-Spread',
			category: 'monetary_policy',
			current_value: -0.35,
			previous_value: -0.42,
			forecast_value: -0.25,
			change_absolute: 0.07,
			change_percent: 16.7,
			unit: '%',
			frequency: 'Daily',
			source: 'US Treasury',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'medium',
			market_impact_explanation: 'Inverted yield curve signals recession fears, supporting safe-haven gold demand.',
			market_impact_explanation_de: 'Invertierte Zinskurve signalisiert Rezessionsängste und unterstützt Safe-Haven-Goldnachfrage.'
		},

		// MARKET SENTIMENT & RISK APPETITE
		vix_volatility_index: {
			id: 'xau_vix',
			name: 'VIX Volatility Index',
			name_de: 'VIX-Volatilitätsindex',
			category: 'market_sentiment',
			current_value: 18.5,
			previous_value: 16.2,
			forecast_value: 20.0,
			change_absolute: 2.3,
			change_percent: 14.2,
			unit: 'index',
			frequency: 'Daily',
			source: 'CBOE',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'high',
			market_impact_explanation: 'Rising fear gauge drives safe-haven flows into gold during market stress.',
			market_impact_explanation_de: 'Steigender Angstmesser treibt Safe-Haven-Flüsse in Gold während Marktstress.'
		},

		credit_spreads: {
			id: 'xau_credit_spreads',
			name: 'Investment Grade Credit Spreads',
			name_de: 'Investment-Grade-Kreditspreads',
			category: 'market_sentiment',
			current_value: 125,
			previous_value: 118,
			forecast_value: 135,
			change_absolute: 7,
			change_percent: 5.9,
			unit: 'bps',
			frequency: 'Daily',
			source: 'Bloomberg',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'medium',
			market_impact_explanation: 'Widening credit spreads indicate financial stress, boosting gold as safe asset.',
			market_impact_explanation_de: 'Sich erweiternde Kreditspreads zeigen Finanzstress an und stärken Gold als sicheres Asset.'
		},

		sp500_performance: {
			id: 'xau_sp500',
			name: 'S&P 500 Performance',
			name_de: 'S&P 500 Performance',
			category: 'market_sentiment',
			current_value: -2.8,
			previous_value: 1.2,
			forecast_value: -1.5,
			change_absolute: -4.0,
			change_percent: -333.3,
			unit: '% mtd',
			frequency: 'Daily',
			source: 'S&P Dow Jones',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'medium',
			market_impact_explanation: 'Stock market weakness often correlates with gold strength as investors seek alternatives.',
			market_impact_explanation_de: 'Aktienschwäche korreliert oft mit Goldstärke, da Investoren Alternativen suchen.'
		},

		geopolitical_risk_index: {
			id: 'xau_geopolitical_risk',
			name: 'Geopolitical Risk Index',
			name_de: 'Geopolitischer Risikoindex',
			category: 'market_sentiment',
			current_value: 142,
			previous_value: 128,
			forecast_value: 155,
			change_absolute: 14,
			change_percent: 10.9,
			unit: 'index',
			frequency: 'Monthly',
			source: 'Federal Reserve Bank of St. Louis',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-02-29T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'Rising geopolitical tensions drive safe-haven demand for gold as crisis hedge.',
			market_impact_explanation_de: 'Steigende geopolitische Spannungen treiben Safe-Haven-Nachfrage nach Gold als Krisenabsicherung.'
		},

		// CENTRAL BANK & INSTITUTIONAL DEMAND
		central_bank_purchases: {
			id: 'xau_central_bank_purchases',
			name: 'Central Bank Gold Purchases',
			name_de: 'Zentralbank-Goldkäufe',
			category: 'institutional_demand',
			current_value: 387,
			previous_value: 312,
			forecast_value: 420,
			change_absolute: 75,
			change_percent: 24.0,
			unit: 'tonnes quarterly',
			frequency: 'Quarterly',
			source: 'World Gold Council',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-04-30T00:00:00Z',
			impact: 'high',
			market_impact_explanation: 'Record central bank buying, especially from emerging markets, provides strong demand floor.',
			market_impact_explanation_de: 'Rekord-Zentralbankkäufe, besonders aus Schwellenländern, bieten starken Nachfrageboden.'
		},

		gold_etf_holdings: {
			id: 'xau_etf_holdings',
			name: 'Gold ETF Holdings',
			name_de: 'Gold-ETF-Bestände',
			category: 'institutional_demand',
			current_value: 3245,
			previous_value: 3312,
			forecast_value: 3180,
			change_absolute: -67,
			change_percent: -2.0,
			unit: 'tonnes',
			frequency: 'Daily',
			source: 'Bloomberg',
			last_updated: '2024-02-09T00:00:00Z',
			next_release: 'Continuous',
			impact: 'high',
			market_impact_explanation: 'ETF outflows indicate profit-taking at high levels, but holdings remain elevated.',
			market_impact_explanation_de: 'ETF-Abflüsse zeigen Gewinnmitnahmen auf hohen Niveaus, aber Bestände bleiben erhöht.'
		},

		cot_positioning: {
			id: 'xau_cot_positioning',
			name: 'CFTC Large Spec Net Long',
			name_de: 'CFTC Large Spec Netto-Long',
			category: 'institutional_demand',
			current_value: 185000,
			previous_value: 198000,
			forecast_value: 175000,
			change_absolute: -13000,
			change_percent: -6.6,
			unit: 'contracts',
			frequency: 'Weekly',
			source: 'CFTC',
			last_updated: '2024-02-06T00:00:00Z',
			next_release: '2024-02-13T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Reduced speculative positioning suggests potential for fresh buying on dips.',
			market_impact_explanation_de: 'Reduzierte spekulative Positionierung deutet auf Potenzial für neue Käufe bei Rücksetzern hin.'
		},

		// PHYSICAL MARKET DYNAMICS
		mine_production: {
			id: 'xau_mine_production',
			name: 'Global Gold Mine Production',
			name_de: 'Globale Goldminenproduktion',
			category: 'physical_market',
			current_value: 1.8,
			previous_value: 2.1,
			forecast_value: 1.5,
			change_absolute: -0.3,
			change_percent: -14.3,
			unit: '% yoy',
			frequency: 'Quarterly',
			source: 'World Gold Council',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-04-30T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Declining production growth constrains supply, supporting higher prices.',
			market_impact_explanation_de: 'Rückläufiges Produktionswachstum begrenzt Angebot und unterstützt höhere Preise.'
		},

		all_in_sustaining_costs: {
			id: 'xau_aisc',
			name: 'All-in Sustaining Costs',
			name_de: 'All-in Sustaining Costs',
			category: 'physical_market',
			current_value: 1285,
			previous_value: 1265,
			forecast_value: 1310,
			change_absolute: 20,
			change_percent: 1.6,
			unit: 'usd per oz',
			frequency: 'Quarterly',
			source: 'Mining Companies',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-04-30T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Rising production costs provide price floor and support for gold prices.',
			market_impact_explanation_de: 'Steigende Produktionskosten bieten Preisuntergrenze und Unterstützung für Goldpreise.'
		},

		jewelry_demand: {
			id: 'xau_jewelry_demand',
			name: 'Global Jewelry Demand',
			name_de: 'Globale Schmucknachfrage',
			category: 'physical_market',
			current_value: -8.5,
			previous_value: -12.2,
			forecast_value: -5.0,
			change_absolute: 3.7,
			change_percent: 30.3,
			unit: '% yoy',
			frequency: 'Quarterly',
			source: 'World Gold Council',
			last_updated: '2024-01-31T00:00:00Z',
			next_release: '2024-04-30T00:00:00Z',
			impact: 'medium',
			market_impact_explanation: 'Improving jewelry demand from India and China supports physical gold consumption.',
			market_impact_explanation_de: 'Sich verbessernde Schmucknachfrage aus Indien und China unterstützt physischen Goldverbrauch.'
		}
	};
}

/**
 * Generate Gold (XAU) indicator categories configuration
 */
export function generateXAUIndicatorCategories(): IndicatorCategoryConfig[] {
	return [
		{
			category: 'pricing',
			name: 'Real-Time Pricing',
			name_de: 'Echtzeit-Preise',
			description: 'Live gold spot prices and market data',
			description_de: 'Live-Gold-Kassapreise und Marktdaten',
			color: '#fbbf24',
			icon: '💰',
			importance_weight: 35,
			indicators: ['xau_spot_price']
		},
		{
			category: 'growth_sentiment',
			name: 'Global Growth & Sentiment',
			name_de: 'Globales Wachstum & Stimmung',
			description: 'Economic growth indicators that inversely affect gold demand as safe-haven asset',
			description_de: 'Wirtschaftswachstumsindikatoren, die die Goldnachfrage als sicherer Hafen umgekehrt beeinflussen',
			color: '#f59e0b',
			icon: '📈',
			importance_weight: 25,
			indicators: ['xau_global_gdp_outlook', 'xau_global_manufacturing_pmi', 'xau_world_trade_volume', 'xau_economic_policy_uncertainty', 'xau_recession_probability']
		},
		{
			category: 'inflation_currency',
			name: 'Inflation & Currency',
			name_de: 'Inflation & Währung',
			description: 'Inflation metrics and currency debasement factors that drive gold as store of value',
			description_de: 'Inflationsmetriken und Währungsentwertungsfaktoren, die Gold als Wertaufbewahrung antreiben',
			color: '#eab308',
			icon: '💰',
			importance_weight: 30,
			indicators: ['xau_us_consumer_price_index', 'xau_global_inflation_expectations', 'xau_us_real_rates', 'xau_money_supply_growth', 'xau_dollar_index']
		},
		{
			category: 'monetary_policy',
			name: 'Monetary Policy',
			name_de: 'Geldpolitik',
			description: 'Central bank policies and interest rates that affect gold opportunity cost',
			description_de: 'Zentralbankpolitik und Zinssätze, die die Opportunitätskosten von Gold beeinflussen',
			color: '#f97316',
			icon: '🏦',
			importance_weight: 25,
			indicators: ['xau_fed_funds_rate', 'xau_us_10y_yield', 'xau_fed_balance_sheet', 'xau_yield_curve_spread']
		},
		{
			category: 'market_sentiment',
			name: 'Market Sentiment',
			name_de: 'Marktstimmung',
			description: 'Risk appetite and market stress indicators that drive safe-haven flows',
			description_de: 'Risikobereitschaft und Marktstressindikatoren, die Safe-Haven-Flüsse antreiben',
			color: '#06b6d4',
			icon: '📊',
			importance_weight: 20,
			indicators: ['xau_vix', 'xau_credit_spreads', 'xau_sp500', 'xau_geopolitical_risk']
		},
		{
			category: 'institutional_demand',
			name: 'Institutional Demand',
			name_de: 'Institutionelle Nachfrage',
			description: 'Central bank purchases and institutional investment flows',
			description_de: 'Zentralbankkäufe und institutionelle Investitionsflüsse',
			color: '#6366f1',
			icon: '🏛️',
			importance_weight: 15,
			indicators: ['xau_central_bank_purchases', 'xau_etf_holdings', 'xau_cot_positioning']
		},
		{
			category: 'physical_market',
			name: 'Physical Market',
			name_de: 'Physischer Markt',
			description: 'Supply and demand dynamics in the physical gold market',
			description_de: 'Angebots- und Nachfragedynamik im physischen Goldmarkt',
			color: '#78716c',
			icon: '⛏️',
			importance_weight: 10,
			indicators: ['xau_mine_production', 'xau_aisc', 'xau_jewelry_demand']
		}
	];
}

// Economic Dashboard Data Types

// Asset Data
export interface AssetData {
	symbol: string;
	name: string;
	price: number;
	change: number;
	changePercent: number;
	bid?: number;
	ask?: number;
	spread?: number;
	volume?: number;
	high24h?: number;
	low24h?: number;
	open24h?: number;
	marketCap?: number;
}

// Price History for Charts
export interface PricePoint {
	time: string;
	price: number;
	volume?: number;
	open?: number;
	high?: number;
	low?: number;
	close?: number;
}

// Technical Indicators
export interface TechnicalIndicators {
	rsi: number;
	macd: number;
	sma20: number;
	sma50: number;
	sma200: number;
	bollinger: {
		upper: number;
		middle: number;
		lower: number;
	};
	stochastic?: {
		k: number;
		d: number;
	};
	atr?: number;
}

// Fundamental Factors
export interface FundamentalFactor {
	factor: string;
	value: string;
	impact: 'high' | 'medium' | 'low';
	trend: 'up' | 'down' | 'stable' | 'neutral';
	description?: string;
	category?: MacroeconomicCategory;
	unit?: string;
	frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
	next_release?: string;
	source?: string;
}

// Macroeconomic Data Categories
export type MacroeconomicCategory =
	| 'growth'
	| 'inflation'
	| 'labor'
	| 'trade'
	| 'monetary_policy'
	| 'sentiment'
	| 'housing'
	| 'fiscal_policy'
	// Precious Metals specific categories
	| 'growth_sentiment'
	| 'inflation_currency'
	| 'institutional_demand'
	| 'physical_market'
	| 'industrial_demand'
	| 'precious_metals_investment'
	| 'supply_side'
	| 'market_structure'
	| 'monetary_macro';

// Comprehensive Macroeconomic Indicator
export interface MacroeconomicIndicator {
	id: string;
	name: string;
	name_de?: string; // German translation
	category: MacroeconomicCategory;
	country: string;
	currency: string;
	current_value: number;
	previous_value: number;
	forecast_value?: number;
	change_absolute: number;
	change_percent: number;
	impact: 'high' | 'medium' | 'low';
	trend: 'up' | 'down' | 'stable' | 'neutral';
	unit: string;
	frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
	last_updated: string;
	next_release?: string;
	description: string;
	description_de?: string; // German translation
	market_impact_explanation: string;
	market_impact_explanation_de?: string; // German translation
	source: string;
	historical_data?: MacroeconomicDataPoint[];
}

// Historical data point for indicators
export interface MacroeconomicDataPoint {
	date: string;
	value: number;
	is_forecast?: boolean;
	is_revised?: boolean;
}

// Multi-Currency Macroeconomic Data Structure
export interface CurrencyMacroeconomicData {
	currency: string;
	country: string;
	indicators: MacroeconomicIndicator[];
	categories: IndicatorCategoryConfig[];
	last_updated: string;
}

// USD Specific Indicators Structure
export interface USDMacroeconomicData {
	// Growth Indicators
	gdp_growth_rate: MacroeconomicIndicator;
	industrial_production: MacroeconomicIndicator;
	retail_sales: MacroeconomicIndicator;

	// Inflation Metrics
	cpi: MacroeconomicIndicator;
	core_cpi: MacroeconomicIndicator;
	pce: MacroeconomicIndicator;
	core_pce: MacroeconomicIndicator;
	ppi: MacroeconomicIndicator;

	// Labor Market Data
	unemployment_rate: MacroeconomicIndicator;
	non_farm_payrolls: MacroeconomicIndicator;
	average_hourly_earnings: MacroeconomicIndicator;
	labor_force_participation: MacroeconomicIndicator;

	// Trade & Balance of Payments
	trade_balance: MacroeconomicIndicator;
	current_account_balance: MacroeconomicIndicator;
	exports: MacroeconomicIndicator;
	imports: MacroeconomicIndicator;

	// Interest Rates & Monetary Policy
	fed_funds_rate: MacroeconomicIndicator;
	treasury_10y: MacroeconomicIndicator;
	treasury_2y: MacroeconomicIndicator;
	money_supply_m2: MacroeconomicIndicator;

	// Sentiment & Confidence
	consumer_confidence: MacroeconomicIndicator;
	ism_manufacturing: MacroeconomicIndicator;
	ism_services: MacroeconomicIndicator;
	michigan_sentiment: MacroeconomicIndicator;

	// Housing Market
	building_permits: MacroeconomicIndicator;
	housing_starts: MacroeconomicIndicator;
	case_shiller_index: MacroeconomicIndicator;
	new_home_sales: MacroeconomicIndicator;
	existing_home_sales: MacroeconomicIndicator;

	// Fiscal Policy
	budget_balance: MacroeconomicIndicator;
	debt_to_gdp: MacroeconomicIndicator;
	government_spending: MacroeconomicIndicator;
}

// EUR Specific Indicators Structure
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

// GBP Specific Indicators Structure
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

// JPY Specific Indicators Structure
export interface JPYMacroeconomicData {
	// Growth Indicators
	gdp_growth_rate: MacroeconomicIndicator;
	industrial_production: MacroeconomicIndicator;
	retail_sales: MacroeconomicIndicator;
	tankan_large_manufacturing: MacroeconomicIndicator;
	tankan_large_non_manufacturing: MacroeconomicIndicator;
	tankan_small_manufacturing: MacroeconomicIndicator;
	tankan_small_non_manufacturing: MacroeconomicIndicator;

	// Inflation Metrics
	cpi_national: MacroeconomicIndicator;
	cpi_tokyo: MacroeconomicIndicator;
	core_cpi: MacroeconomicIndicator;
	cgpi: MacroeconomicIndicator;
	inflation_expectations_5y: MacroeconomicIndicator;

	// Labor Market Data
	unemployment_rate: MacroeconomicIndicator;
	job_to_applicant_ratio: MacroeconomicIndicator;
	labor_costs: MacroeconomicIndicator;
	labor_shortage_indicators: MacroeconomicIndicator;
	shunto_wage_negotiations: MacroeconomicIndicator;

	// Trade & Balance of Payments
	trade_balance: MacroeconomicIndicator;
	current_account_balance: MacroeconomicIndicator;
	forex_reserves: MacroeconomicIndicator;
	export_values: MacroeconomicIndicator;
	import_values: MacroeconomicIndicator;

	// Monetary Policy
	boj_policy_rate: MacroeconomicIndicator;
	jgb_10y_yield: MacroeconomicIndicator;
	boj_balance_sheet: MacroeconomicIndicator;
	tona_rate: MacroeconomicIndicator;
	expected_boj_rate_6m: MacroeconomicIndicator;

	// Sentiment & Confidence
	consumer_confidence_index: MacroeconomicIndicator;
	tankan_business_conditions: MacroeconomicIndicator;
	manufacturing_pmi: MacroeconomicIndicator;
	services_pmi: MacroeconomicIndicator;
	safe_haven_status: MacroeconomicIndicator;

	// Housing Market
	housing_starts: MacroeconomicIndicator;
	construction_orders: MacroeconomicIndicator;
	real_estate_price_index: MacroeconomicIndicator;
	building_permits: MacroeconomicIndicator;

	// Fiscal Policy
	debt_to_gdp: MacroeconomicIndicator;
	budget_deficit: MacroeconomicIndicator;
	primary_balance: MacroeconomicIndicator;
	fiscal_stimulus_packages: MacroeconomicIndicator;
}

// Economic Events
export interface EconomicEvent {
	id: number;
	time: string;
	currency: string;
	event: string;
	impact: 'high' | 'medium' | 'low';
	forecast: string;
	previous: string;
	actual?: string;
	country?: string;
	importance?: number;
}

// COT (Commitment of Traders) Data
export interface COTData {
	date: string;
	commercial_long: number;
	commercial_short: number;
	non_commercial_long: number;
	non_commercial_short: number;
	retail_long: number;
	retail_short: number;
	open_interest?: number;
}

export interface COTSummary {
	asset: string;
	name: string;
	commercial_net: number;
	non_commercial_net: number;
	retail_net: number;
	commercial_change: number;
	non_commercial_change: number;
	retail_change: number;
	signal: 'bullish' | 'bearish' | 'neutral';
	strength?: 'strong' | 'moderate' | 'weak';
}

// Sentiment Data
export interface SentimentData {
	asset: string;
	name: string;
	long_percentage: number;
	short_percentage: number;
	timestamp: string;
	change_24h: number;
	signal: 'bullish' | 'bearish' | 'neutral';
	strength: 'strong' | 'moderate' | 'weak';
	volume?: number;
}

export interface BrokerData {
	broker: string;
	assets_covered: number;
	last_updated: string;
	reliability: number;
	data_source?: string;
}

// Interest Rates Data
export interface CentralBankMeeting {
	id: number;
	bank: string;
	country: string;
	currency: string;
	date: string;
	time: string;
	current_rate: number;
	expected_rate: number;
	probability_hike: number;
	probability_hold: number;
	probability_cut: number;
	impact: 'high' | 'medium' | 'low';
	meeting_type?: 'regular' | 'emergency';
}

export interface YieldData {
	maturity: string;
	yield: number;
	change_1d: number;
	change_1w: number;
	change_1m: number;
	change_ytd?: number;
}

export interface RateDifferential {
	pair: string;
	rate_diff: number;
	change_1d?: number;
	change_1w?: number;
	change_1m: number;
	trend: 'widening' | 'narrowing' | 'stable';
}

// Market Sentiment Overview
export interface MarketSentiment {
	overall: 'bullish' | 'bearish' | 'neutral';
	overall_percentage?: number;
	risk_on: number;
	fear_greed: number;
	vix: number;
	dxy?: number; // Dollar Index
	gold_sentiment?: number;
	crypto_sentiment?: number;
}

// Currency Strength
export interface CurrencyStrength {
	currency: string;
	strength: number;
	change: number;
	rank?: number;
	trend: 'up' | 'down' | 'stable';
}

// News Data
export interface NewsItem {
	id: number;
	headline: string;
	summary?: string;
	time: string;
	impact: 'high' | 'medium' | 'low';
	source: string;
	url?: string;
	tags?: string[];
	sentiment?: 'positive' | 'negative' | 'neutral';
}

// Related Assets
export interface RelatedAsset {
	symbol: string;
	name?: string;
	correlation: number;
	change: number;
	price?: number;
	relationship_type?: 'positive' | 'negative' | 'neutral';
}

// Chart Configuration
export interface ChartConfig {
	type: 'line' | 'candlestick' | 'bar' | 'area';
	timeframe: string;
	indicators?: string[];
	height?: number;
	theme?: 'light' | 'dark';
}

// API Response Types
export interface APIResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	timestamp: string;
	error?: string;
}

// Filter and Search Options
export interface FilterOptions {
	assets?: string[];
	timeframe?: string;
	impact?: ('high' | 'medium' | 'low')[];
	countries?: string[];
	currencies?: string[];
	date_range?: {
		start: string;
		end: string;
	};
}

// Dashboard State
export interface DashboardState {
	selectedAssets: string[];
	selectedTimeframe: string;
	selectedCountry: string;
	selectedCurrency: string;
	filters: FilterOptions;
	lastUpdated: string;
	isLoading: boolean;
	error?: string;
}

// Component Props Types
export interface AssetSelectorProps {
	assets: AssetData[];
	selectedAsset: string;
	onAssetChange: (asset: string) => void;
	multiSelect?: boolean;
	showSearch?: boolean;
}

export interface DataCardProps {
	title: string;
	value: string | number;
	change?: number;
	changePercent?: number;
	icon?: any;
	color?: string;
	size?: 'small' | 'medium' | 'large';
	loading?: boolean;
}

export interface ChartContainerProps {
	data: any[];
	config: ChartConfig;
	loading?: boolean;
	error?: string;
	height?: number;
}

// Utility Types
export type TimeframeOption = '1H' | '4H' | '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';
export type AssetType = 'forex' | 'commodity' | 'index' | 'crypto' | 'stock';
export type SignalStrength = 'strong' | 'moderate' | 'weak';
export type TrendDirection = 'up' | 'down' | 'sideways' | 'neutral';
export type ImpactLevel = 'high' | 'medium' | 'low';

// Educational Content Interface
export interface EducationalTooltip {
	title: string;
	title_de?: string;
	content: string;
	content_de?: string;
	learn_more_url?: string;
	related_indicators?: string[];
}

// Data Formatting Configuration
export interface DataFormatConfig {
	type: 'percentage' | 'currency' | 'number' | 'index' | 'ratio';
	decimal_places: number;
	prefix?: string;
	suffix?: string;
	multiplier?: number;
	show_sign?: boolean;
}

// Macroeconomic Event (enhanced economic event)
export interface MacroeconomicEvent extends EconomicEvent {
	indicator_id?: string;
	category: MacroeconomicCategory;
	market_moving_potential: number; // 1-10 scale
	typical_market_reaction: string;
	typical_market_reaction_de?: string;
	related_assets: string[]; // Asset symbols that typically react
	historical_volatility_impact: number; // Average pip/point movement
}

// Indicator Category Configuration
export interface IndicatorCategoryConfig {
	category: MacroeconomicCategory;
	name: string;
	name_de: string;
	description: string;
	description_de: string;
	color: string;
	icon: string;
	importance_weight: number; // For overall economic health calculation
	indicators: string[]; // List of indicator IDs in this category
}

// Economic Health Score
export interface EconomicHealthScore {
	country: string;
	currency: string;
	overall_score: number; // 0-100
	category_scores: {
		[K in MacroeconomicCategory]: number;
	};
	trend: 'improving' | 'deteriorating' | 'stable';
	last_updated: string;
	key_drivers: string[]; // Indicator IDs driving the score
	outlook: 'positive' | 'negative' | 'neutral';
}

// Market Impact Analysis
export interface MarketImpactAnalysis {
	indicator_id: string;
	release_date: string;
	actual_vs_forecast: number; // Percentage difference
	market_reaction: {
		currency_pairs: {
			[pair: string]: {
				immediate_reaction_pips: number;
				direction: 'up' | 'down' | 'neutral';
				volatility_increase: number; // Percentage
			};
		};
		indices: {
			[index: string]: {
				immediate_reaction_points: number;
				direction: 'up' | 'down' | 'neutral';
			};
		};
		bonds: {
			[bond: string]: {
				yield_change_bps: number;
				direction: 'up' | 'down' | 'neutral';
			};
		};
	};
	sentiment_impact: 'bullish' | 'bearish' | 'neutral';
	duration_of_impact: 'short' | 'medium' | 'long'; // How long the impact typically lasts
}

// Constants
export const MAJOR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'] as const;
export const MAJOR_PAIRS = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD'] as const;
export const TIMEFRAMES = ['1H', '4H', '1D', '1W', '1M'] as const;
export const IMPACT_LEVELS = ['high', 'medium', 'low'] as const;
export const MACROECONOMIC_CATEGORIES: MacroeconomicCategory[] = [
	'growth', 'inflation', 'labor', 'trade', 'monetary_policy', 'sentiment', 'housing', 'fiscal_policy'
] as const;

export type MajorCurrency = typeof MAJOR_CURRENCIES[number];
export type MajorPair = typeof MAJOR_PAIRS[number];
export type Timeframe = typeof TIMEFRAMES[number];

// Data Formatting Utilities
export const DATA_FORMAT_CONFIGS: Record<string, DataFormatConfig> = {
	percentage: { type: 'percentage', decimal_places: 2, suffix: '%', show_sign: true },
	currency_usd: { type: 'currency', decimal_places: 2, prefix: '$' },
	currency_eur: { type: 'currency', decimal_places: 2, prefix: '€' },
	currency_gbp: { type: 'currency', decimal_places: 2, prefix: '£' },
	currency_jpy: { type: 'currency', decimal_places: 0, prefix: '¥' },
	currency_billions: { type: 'currency', decimal_places: 1, prefix: '$', suffix: 'B', multiplier: 0.000000001 },
	currency_billions_eur: { type: 'currency', decimal_places: 1, prefix: '€', suffix: 'B', multiplier: 0.000000001 },
	currency_billions_gbp: { type: 'currency', decimal_places: 1, prefix: '£', suffix: 'B', multiplier: 0.000000001 },
	currency_billions_jpy: { type: 'currency', decimal_places: 1, prefix: '¥', suffix: 'B', multiplier: 0.000000001 },
	currency_trillions_jpy: { type: 'currency', decimal_places: 1, prefix: '¥', suffix: 'T', multiplier: 0.000000000001 },
	currency_millions_nzd: { type: 'currency', decimal_places: 1, prefix: 'NZ$', suffix: 'M', multiplier: 0.000001 },
	currency_billions_nzd: { type: 'currency', decimal_places: 1, prefix: 'NZ$', suffix: 'B', multiplier: 0.000000001 },
	index: { type: 'index', decimal_places: 1 },
	ratio: { type: 'ratio', decimal_places: 2 },
	thousands: { type: 'number', decimal_places: 0, suffix: 'K', multiplier: 0.001 },
	millions: { type: 'number', decimal_places: 1, suffix: 'M', multiplier: 0.000001 },
	basis_points: { type: 'number', decimal_places: 0, suffix: ' bps' }
};

// NZD Specific Indicators Structure
export interface NZDMacroeconomicData {
	// Growth Indicators
	gdp_growth_rate: MacroeconomicIndicator;
	retail_sales: MacroeconomicIndicator;
	electronic_card_transactions: MacroeconomicIndicator;
	milk_production_index: MacroeconomicIndicator;
	international_visitor_arrivals: MacroeconomicIndicator;
	nzier_business_confidence: MacroeconomicIndicator;
	anz_business_outlook: MacroeconomicIndicator;
	manufacturing_pmi: MacroeconomicIndicator;
	services_psi: MacroeconomicIndicator;

	// Inflation Metrics
	consumer_price_index: MacroeconomicIndicator;
	producer_price_index: MacroeconomicIndicator;
	inflation_expectations_2y: MacroeconomicIndicator;
	housing_cost_component: MacroeconomicIndicator;
	non_tradeable_inflation: MacroeconomicIndicator;
	tradeable_inflation: MacroeconomicIndicator;

	// Labor Market
	unemployment_rate: MacroeconomicIndicator;
	employment_change: MacroeconomicIndicator;
	labour_cost_index: MacroeconomicIndicator;
	average_hourly_earnings: MacroeconomicIndicator;
	participation_rate: MacroeconomicIndicator;
	net_migration: MacroeconomicIndicator;

	// Trade & Balance
	trade_balance: MacroeconomicIndicator;
	global_dairy_trade_index: MacroeconomicIndicator;
	current_account_deficit: MacroeconomicIndicator;
	anz_commodity_price_index: MacroeconomicIndicator;
	terms_of_trade: MacroeconomicIndicator;

	// Monetary Policy
	rbnz_official_cash_rate: MacroeconomicIndicator;
	nz_2y_government_bond: MacroeconomicIndicator;
	nz_10y_government_bond: MacroeconomicIndicator;
	nz_us_10y_spread: MacroeconomicIndicator;
	rbnz_balance_sheet: MacroeconomicIndicator;
	bank_bill_90d_rate: MacroeconomicIndicator;

	// Sentiment Indicators
	anz_consumer_confidence: MacroeconomicIndicator;
	anz_business_confidence_general: MacroeconomicIndicator;
	anz_own_activity_expectations: MacroeconomicIndicator;
	manufacturing_pmi_sentiment: MacroeconomicIndicator;
	services_pmi_sentiment: MacroeconomicIndicator;
	global_risk_appetite: MacroeconomicIndicator;

	// Housing Market
	reinz_house_price_index: MacroeconomicIndicator;
	property_sales_volumes: MacroeconomicIndicator;
	median_days_to_sell: MacroeconomicIndicator;
	building_consents: MacroeconomicIndicator;
	housing_affordability_index: MacroeconomicIndicator;

	// Fiscal Policy
	government_debt_to_gdp: MacroeconomicIndicator;
	operating_balance_obegal: MacroeconomicIndicator;
	core_crown_net_debt: MacroeconomicIndicator;
}

// XAU (Gold) Specific Indicators Structure
export interface XAUMacroeconomicData {
	// Global Economic Growth & Sentiment (Anti-cyclical)
	global_gdp_outlook: MacroeconomicIndicator;
	global_manufacturing_pmi: MacroeconomicIndicator;
	world_trade_volume: MacroeconomicIndicator;
	economic_policy_uncertainty: MacroeconomicIndicator;
	recession_probability: MacroeconomicIndicator;

	// Inflation & Currency Debasement
	us_consumer_price_index: MacroeconomicIndicator;
	global_inflation_expectations: MacroeconomicIndicator;
	us_real_interest_rates: MacroeconomicIndicator;
	money_supply_growth: MacroeconomicIndicator;
	dollar_index: MacroeconomicIndicator;

	// Monetary Policy & Interest Rates
	fed_funds_rate: MacroeconomicIndicator;
	us_10y_treasury_yield: MacroeconomicIndicator;
	fed_balance_sheet: MacroeconomicIndicator;
	yield_curve_spread: MacroeconomicIndicator;

	// Market Sentiment & Risk Appetite
	vix_volatility_index: MacroeconomicIndicator;
	credit_spreads: MacroeconomicIndicator;
	sp500_performance: MacroeconomicIndicator;
	geopolitical_risk_index: MacroeconomicIndicator;

	// Central Bank & Institutional Demand
	central_bank_purchases: MacroeconomicIndicator;
	gold_etf_holdings: MacroeconomicIndicator;
	cot_positioning: MacroeconomicIndicator;

	// Physical Market Dynamics
	mine_production: MacroeconomicIndicator;
	all_in_sustaining_costs: MacroeconomicIndicator;
	jewelry_demand: MacroeconomicIndicator;
}

// XAG (Silver) Specific Indicators Structure
export interface XAGMacroeconomicData {
	// Industrial Demand & Economic Growth (Pro-cyclical)
	global_manufacturing_pmi: MacroeconomicIndicator;
	semiconductor_sales: MacroeconomicIndicator;
	solar_installations: MacroeconomicIndicator;
	electric_vehicle_production: MacroeconomicIndicator;
	fiveg_infrastructure: MacroeconomicIndicator;

	// Precious Metals Investment Demand
	gold_silver_ratio: MacroeconomicIndicator;
	silver_etf_holdings: MacroeconomicIndicator;
	investment_coin_sales: MacroeconomicIndicator;
	retail_sentiment: MacroeconomicIndicator;

	// Supply-Side Factors
	primary_mine_production: MacroeconomicIndicator;
	byproduct_production: MacroeconomicIndicator;
	comex_warehouse_stocks: MacroeconomicIndicator;
	recycling_supply: MacroeconomicIndicator;

	// Market Structure & Speculation
	cftc_speculative_positioning: MacroeconomicIndicator;
	silver_volatility: MacroeconomicIndicator;
	delivery_notices: MacroeconomicIndicator;

	// Monetary & Macro Factors
	us_real_interest_rates: MacroeconomicIndicator;
	dollar_strength: MacroeconomicIndicator;
	inflation_expectations: MacroeconomicIndicator;
	central_bank_liquidity: MacroeconomicIndicator;
	global_risk_sentiment: MacroeconomicIndicator;
}

// AUD Specific Indicators Structure
export interface AUDMacroeconomicData {
	// Growth Indicators
	gdp_growth_rate: MacroeconomicIndicator;
	retail_sales: MacroeconomicIndicator;
	business_confidence: MacroeconomicIndicator;

	// Inflation Metrics
	cpi: MacroeconomicIndicator;
	trimmed_mean_cpi: MacroeconomicIndicator;

	// Labor Market Data
	unemployment_rate: MacroeconomicIndicator;
	employment_change: MacroeconomicIndicator;
	participation_rate: MacroeconomicIndicator;

	// Trade & Balance of Payments
	trade_balance: MacroeconomicIndicator;
	exports: MacroeconomicIndicator;
	current_account_balance: MacroeconomicIndicator;

	// Monetary Policy
	rba_cash_rate: MacroeconomicIndicator;
	government_bond_10y: MacroeconomicIndicator;

	// Sentiment & Confidence
	consumer_confidence: MacroeconomicIndicator;

	// Housing Market
	house_price_index: MacroeconomicIndicator;
	building_approvals: MacroeconomicIndicator;

	// Fiscal Policy
	budget_balance: MacroeconomicIndicator;
	net_debt_to_gdp: MacroeconomicIndicator;
}

// CAD Specific Indicators Structure
export interface CADMacroeconomicData {
	// Growth Indicators
	gdp_growth_rate: MacroeconomicIndicator;
	retail_sales: MacroeconomicIndicator;
	manufacturing_sales: MacroeconomicIndicator;

	// Inflation Metrics
	cpi: MacroeconomicIndicator;
	core_cpi: MacroeconomicIndicator;

	// Labor Market Data
	unemployment_rate: MacroeconomicIndicator;
	employment_change: MacroeconomicIndicator;
	average_hourly_wages: MacroeconomicIndicator;

	// Trade & Balance of Payments
	trade_balance: MacroeconomicIndicator;
	exports: MacroeconomicIndicator;
	current_account_balance: MacroeconomicIndicator;

	// Monetary Policy
	boc_overnight_rate: MacroeconomicIndicator;
	government_bond_10y: MacroeconomicIndicator;

	// Sentiment & Confidence
	consumer_confidence: MacroeconomicIndicator;
	business_outlook_survey: MacroeconomicIndicator;

	// Housing Market
	housing_starts: MacroeconomicIndicator;
	existing_home_sales: MacroeconomicIndicator;

	// Fiscal Policy
	budget_balance: MacroeconomicIndicator;
	net_debt_to_gdp: MacroeconomicIndicator;
}

// CHF Specific Indicators Structure
export interface CHFMacroeconomicData {
	// Growth Indicators
	gdp_growth_rate: MacroeconomicIndicator;
	retail_sales: MacroeconomicIndicator;
	kof_leading_indicator: MacroeconomicIndicator;

	// Inflation Metrics
	cpi: MacroeconomicIndicator;
	core_cpi: MacroeconomicIndicator;

	// Labor Market Data
	unemployment_rate: MacroeconomicIndicator;
	employment_level: MacroeconomicIndicator;

	// Trade & Balance of Payments
	trade_balance: MacroeconomicIndicator;
	exports: MacroeconomicIndicator;
	current_account_balance: MacroeconomicIndicator;

	// Monetary Policy
	snb_policy_rate: MacroeconomicIndicator;
	government_bond_10y: MacroeconomicIndicator;

	// Sentiment & Confidence
	consumer_confidence: MacroeconomicIndicator;
	business_confidence: MacroeconomicIndicator;

	// Housing Market
	house_price_index: MacroeconomicIndicator;
	construction_orders: MacroeconomicIndicator;

	// Fiscal Policy
	budget_balance: MacroeconomicIndicator;
	debt_to_gdp: MacroeconomicIndicator;
}

// CNY Specific Indicators Structure
export interface CNYMacroeconomicData {
	// Growth Indicators
	gdp_growth_rate: MacroeconomicIndicator;
	industrial_production: MacroeconomicIndicator;
	retail_sales: MacroeconomicIndicator;

	// Inflation Metrics
	cpi: MacroeconomicIndicator;
	ppi: MacroeconomicIndicator;

	// Labor Market Data
	unemployment_rate: MacroeconomicIndicator;
	youth_unemployment: MacroeconomicIndicator;

	// Trade & Balance of Payments
	trade_balance: MacroeconomicIndicator;
	exports: MacroeconomicIndicator;
	imports: MacroeconomicIndicator;

	// Monetary Policy
	pboc_1y_mlf_rate: MacroeconomicIndicator;
	lpr_1y: MacroeconomicIndicator;
	government_bond_10y: MacroeconomicIndicator;

	// Sentiment & Confidence
	manufacturing_pmi: MacroeconomicIndicator;
	services_pmi: MacroeconomicIndicator;

	// Housing Market
	property_investment: MacroeconomicIndicator;
	new_home_prices: MacroeconomicIndicator;

	// Fiscal Policy
	fiscal_revenue: MacroeconomicIndicator;
	local_government_debt: MacroeconomicIndicator;
}

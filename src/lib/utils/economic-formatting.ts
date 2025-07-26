import type { DataFormatConfig, MacroeconomicIndicator } from '$lib/types/economic';
import { DATA_FORMAT_CONFIGS } from '$lib/types/economic';

/**
 * Format macroeconomic indicator values according to their type and configuration
 */
export function formatIndicatorValue(
	value: number, 
	indicator: MacroeconomicIndicator,
	config?: DataFormatConfig
): string {
	// Use provided config or determine from indicator unit
	const formatConfig = config || getFormatConfigFromUnit(indicator.unit);
	
	// Apply multiplier if specified
	const adjustedValue = formatConfig.multiplier ? value * formatConfig.multiplier : value;
	
	// Format the number
	let formattedNumber: string;
	
	switch (formatConfig.type) {
		case 'percentage':
			formattedNumber = adjustedValue.toFixed(formatConfig.decimal_places);
			break;
		case 'currency':
			formattedNumber = Math.abs(adjustedValue).toLocaleString('en-US', {
				minimumFractionDigits: formatConfig.decimal_places,
				maximumFractionDigits: formatConfig.decimal_places
			});
			break;
		case 'number':
		case 'index':
		case 'ratio':
		default:
			formattedNumber = adjustedValue.toLocaleString('en-US', {
				minimumFractionDigits: formatConfig.decimal_places,
				maximumFractionDigits: formatConfig.decimal_places
			});
			break;
	}
	
	// Add sign if required
	if (formatConfig.show_sign && value !== 0) {
		formattedNumber = (value > 0 ? '+' : '') + formattedNumber;
	}
	
	// Add prefix and suffix
	const prefix = formatConfig.prefix || '';
	const suffix = formatConfig.suffix || '';
	
	return `${prefix}${formattedNumber}${suffix}`;
}

/**
 * Format change values with appropriate sign and color indication
 */
export function formatChange(
	change: number,
	changePercent: number,
	unit: string
): { absolute: string; percent: string; color: string; trend: 'up' | 'down' | 'neutral' } {
	const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
	const color = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
	
	const absoluteFormatted = formatIndicatorValue(change, { unit } as MacroeconomicIndicator);
	const percentFormatted = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`;
	
	return {
		absolute: absoluteFormatted,
		percent: percentFormatted,
		color,
		trend
	};
}

/**
 * Get format configuration based on indicator unit
 */
function getFormatConfigFromUnit(unit: string): DataFormatConfig {
	switch (unit.toLowerCase()) {
		case '%':
		case '% yoy':
		case '% mom':
		case '% qoq':
		case '% increase':
			return DATA_FORMAT_CONFIGS.percentage;
		case 'billion usd':
			return DATA_FORMAT_CONFIGS.currency_billions;
		case 'billion eur':
			return DATA_FORMAT_CONFIGS.currency_billions_eur;
		case 'billion gbp':
			return DATA_FORMAT_CONFIGS.currency_billions_gbp;
		case 'billion jpy':
			return DATA_FORMAT_CONFIGS.currency_billions_jpy;
		case 'trillion jpy':
			return DATA_FORMAT_CONFIGS.currency_trillions_jpy;
		case 'million':
		case 'million units':
			return DATA_FORMAT_CONFIGS.millions;
		case 'thousands':
		case 'jobs':
		case 'number':
			return DATA_FORMAT_CONFIGS.thousands;
		case 'change':
			return { type: 'number', decimal_places: 0, show_sign: true };
		case 'net balance':
			return { type: 'number', decimal_places: 0, show_sign: true };
		case 'index':
			return DATA_FORMAT_CONFIGS.index;
		case 'ratio':
			return DATA_FORMAT_CONFIGS.ratio;
		case 'bps':
		case ' bps':
			return DATA_FORMAT_CONFIGS.basis_points;
		case 'trillion usd':
			return { type: 'currency', decimal_places: 1, prefix: '$', suffix: 'T', multiplier: 0.000000000001 };
		case 'trillion eur':
			return { type: 'currency', decimal_places: 1, prefix: '€', suffix: 'T', multiplier: 0.000000000001 };
		case 'trillion gbp':
			return { type: 'currency', decimal_places: 1, prefix: '£', suffix: 'T', multiplier: 0.000000000001 };
		case '% of companies':
			return { type: 'percentage', decimal_places: 0, suffix: '%' };
		case 'correlation with vix':
			return { type: 'ratio', decimal_places: 3 };
		case 'usd per oz':
		case '$/oz':
			return { type: 'currency', decimal_places: 2, prefix: '$', suffix: '/oz' };
		case 'tonnes':
			return { type: 'number', decimal_places: 0, suffix: ' tonnes' };
		case 'tonnes quarterly':
			return { type: 'number', decimal_places: 0, suffix: ' tonnes' };
		case 'million oz':
			return { type: 'number', decimal_places: 1, suffix: 'M oz' };
		case 'contracts':
			return { type: 'number', decimal_places: 0, suffix: ' contracts' };
		default:
			return { type: 'number', decimal_places: 2 };
	}
}

/**
 * Get impact level color classes
 */
export function getImpactColor(impact: 'high' | 'medium' | 'low'): string {
	switch (impact) {
		case 'high':
			return 'text-red-600 bg-red-50 border-red-200';
		case 'medium':
			return 'text-yellow-600 bg-yellow-50 border-yellow-200';
		case 'low':
			return 'text-green-600 bg-green-50 border-green-200';
		default:
			return 'text-gray-600 bg-gray-50 border-gray-200';
	}
}

/**
 * Get trend color classes
 */
export function getTrendColor(trend: 'up' | 'down' | 'stable' | 'neutral'): string {
	switch (trend) {
		case 'up':
			return 'text-green-600';
		case 'down':
			return 'text-red-600';
		case 'stable':
		case 'neutral':
		default:
			return 'text-gray-600';
	}
}

/**
 * Get category color configuration
 */
export function getCategoryColor(category: string): { bg: string; text: string; border: string } {
	const colorMap: Record<string, { bg: string; text: string; border: string }> = {
		growth: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
		inflation: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
		labor: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
		trade: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
		monetary_policy: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
		sentiment: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
		housing: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
		fiscal_policy: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
		// Precious Metals specific categories
		growth_sentiment: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
		inflation_currency: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
		institutional_demand: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
		physical_market: { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' },
		industrial_demand: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
		precious_metals_investment: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
		supply_side: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
		market_structure: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
		monetary_macro: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
	};

	return colorMap[category] || colorMap.fiscal_policy;
}

/**
 * Calculate economic health score based on indicators
 */
export function calculateEconomicHealthScore(indicators: MacroeconomicIndicator[]): number {
	if (indicators.length === 0) return 50;
	
	let totalScore = 0;
	let totalWeight = 0;
	
	indicators.forEach(indicator => {
		const weight = getIndicatorWeight(indicator.category);
		const score = getIndicatorScore(indicator);
		
		totalScore += score * weight;
		totalWeight += weight;
	});
	
	return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
}

/**
 * Get indicator weight for health score calculation
 */
function getIndicatorWeight(category: string): number {
	const weights: Record<string, number> = {
		growth: 25,
		inflation: 30,
		labor: 25,
		trade: 10,
		monetary_policy: 20,
		sentiment: 15,
		housing: 8,
		fiscal_policy: 5
	};
	
	return weights[category] || 5;
}

/**
 * Calculate individual indicator score (0-100)
 */
function getIndicatorScore(indicator: MacroeconomicIndicator): number {
	// This is a simplified scoring system
	// In a real implementation, you would have more sophisticated scoring logic
	// based on historical ranges, targets, and economic context
	
	const changePercent = indicator.change_percent;
	
	// Base score of 50 (neutral)
	let score = 50;
	
	// Adjust based on trend and category
	switch (indicator.category) {
		case 'growth':
			// Positive growth is good
			score += Math.min(Math.max(changePercent * 2, -25), 25);
			break;
		case 'inflation':
			// Moderate inflation (around 2%) is good, too high or too low is bad
			const inflationTarget = 2.0;
			const deviation = Math.abs(indicator.current_value - inflationTarget);
			score -= deviation * 10;
			break;
		case 'labor':
			// Lower unemployment is generally good
			if (indicator.id.includes('unemployment')) {
				score -= changePercent * 5;
			} else {
				score += Math.min(Math.max(changePercent, -10), 10);
			}
			break;
		default:
			// For other categories, positive change is generally good
			score += Math.min(Math.max(changePercent, -15), 15);
			break;
	}
	
	return Math.min(Math.max(score, 0), 100);
}

/**
 * Format time until next release
 */
export function formatTimeUntilRelease(nextRelease: string): string {
	const now = new Date();
	const releaseDate = new Date(nextRelease);
	const diffTime = releaseDate.getTime() - now.getTime();
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	
	if (diffDays < 0) return 'Overdue';
	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Tomorrow';
	if (diffDays < 7) return `${diffDays} days`;
	if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
	return `${Math.ceil(diffDays / 30)} months`;
}

/**
 * Get market impact description based on indicator and change
 */
export function getMarketImpactDescription(
	indicator: MacroeconomicIndicator,
	language: 'en' | 'de' = 'en'
): string {
	const isPositive = indicator.change_absolute > 0;
	const impact = indicator.impact;

	if (language === 'de') {
		return indicator.market_impact_explanation_de || indicator.market_impact_explanation;
	}

	return indicator.market_impact_explanation;
}

/**
 * Format JPY currency values with appropriate yen symbol and precision
 */
export function formatJPYCurrency(value: number, unit: string): string {
	if (unit.toLowerCase().includes('trillion')) {
		return `¥${(value).toFixed(1)}T`;
	} else if (unit.toLowerCase().includes('billion')) {
		return `¥${(value).toFixed(1)}B`;
	} else if (unit.toLowerCase().includes('million')) {
		return `¥${(value).toFixed(1)}M`;
	} else {
		// For regular JPY amounts, no decimal places
		return `¥${Math.round(value).toLocaleString('en-US')}`;
	}
}

/**
 * Format NZD currency values with appropriate NZ$ symbol and precision
 */
export function formatNZDCurrency(value: number, unit: string): string {
	if (unit.toLowerCase().includes('billion')) {
		return `NZ$${(value).toFixed(1)}B`;
	} else if (unit.toLowerCase().includes('million')) {
		return `NZ$${(value).toFixed(1)}M`;
	} else if (unit.toLowerCase().includes('thousand')) {
		return `NZ$${(value).toFixed(0)}K`;
	} else {
		// For regular NZD amounts, 2 decimal places
		return `NZ$${value.toFixed(2)}`;
	}
}

/**
 * Get currency-specific formatting based on currency code
 */
export function getCurrencyFormatter(currency: string): (value: number, unit: string) => string {
	switch (currency.toUpperCase()) {
		case 'JPY':
			return formatJPYCurrency;
		case 'NZD':
			return formatNZDCurrency;
		case 'USD':
			return (value: number, unit: string) => {
				if (unit.toLowerCase().includes('trillion')) {
					return `$${(value).toFixed(1)}T`;
				} else if (unit.toLowerCase().includes('billion')) {
					return `$${(value).toFixed(1)}B`;
				} else {
					return `$${value.toFixed(2)}`;
				}
			};
		case 'EUR':
			return (value: number, unit: string) => {
				if (unit.toLowerCase().includes('trillion')) {
					return `€${(value).toFixed(1)}T`;
				} else if (unit.toLowerCase().includes('billion')) {
					return `€${(value).toFixed(1)}B`;
				} else {
					return `€${value.toFixed(2)}`;
				}
			};
		case 'GBP':
			return (value: number, unit: string) => {
				if (unit.toLowerCase().includes('trillion')) {
					return `£${(value).toFixed(1)}T`;
				} else if (unit.toLowerCase().includes('billion')) {
					return `£${(value).toFixed(1)}B`;
				} else {
					return `£${value.toFixed(2)}`;
				}
			};
		default:
			return (value: number) => value.toFixed(2);
	}
}

/**
 * Format Japan-specific indicators with appropriate context
 */
export function formatJapanSpecificIndicator(indicator: MacroeconomicIndicator): string {
	const { id, current_value, unit } = indicator;

	// Special formatting for Japan-specific indicators
	if (id.includes('tankan')) {
		// Tankan indices can be negative, show with appropriate sign
		return `${current_value > 0 ? '+' : ''}${current_value}`;
	} else if (id.includes('boj_rate') && current_value < 0) {
		// Negative interest rates
		return `${current_value.toFixed(2)}%`;
	} else if (id.includes('debt_gdp')) {
		// Japan's massive debt ratio
		return `${current_value.toFixed(1)}%`;
	} else if (id.includes('safe_haven')) {
		// Correlation coefficient
		return current_value.toFixed(3);
	}

	// Use standard formatting for other indicators
	return formatIndicatorValue(current_value, indicator);
}

/**
 * Format Gold (XAU) specific indicators with appropriate context
 */
export function formatGoldIndicator(indicator: MacroeconomicIndicator): string {
	const { id, current_value, unit } = indicator;

	// Special formatting for gold-specific indicators
	if (id.includes('gold_silver_ratio')) {
		return `${current_value.toFixed(1)}:1`;
	} else if (id.includes('central_bank_purchases')) {
		return `${current_value.toFixed(0)} tonnes`;
	} else if (id.includes('etf_holdings')) {
		return `${current_value.toFixed(0)} tonnes`;
	} else if (id.includes('aisc') || id.includes('sustaining_costs')) {
		return `$${current_value.toFixed(0)}/oz`;
	} else if (id.includes('mine_production')) {
		return `${current_value > 0 ? '+' : ''}${current_value.toFixed(1)}%`;
	}

	// Use standard formatting for other indicators
	return formatIndicatorValue(current_value, indicator);
}

/**
 * Format Silver (XAG) specific indicators with appropriate context
 */
export function formatSilverIndicator(indicator: MacroeconomicIndicator): string {
	const { id, current_value, unit } = indicator;

	// Special formatting for silver-specific indicators
	if (id.includes('gold_silver_ratio')) {
		return `${current_value.toFixed(1)}:1`;
	} else if (id.includes('solar_installations')) {
		return `${current_value > 0 ? '+' : ''}${current_value.toFixed(1)}%`;
	} else if (id.includes('semiconductor_sales')) {
		return `${current_value > 0 ? '+' : ''}${current_value.toFixed(1)}%`;
	} else if (id.includes('comex_stocks')) {
		return `${current_value.toFixed(1)}M oz`;
	} else if (id.includes('delivery_notices')) {
		return `${current_value.toLocaleString()} contracts`;
	} else if (id.includes('volatility')) {
		return `${current_value.toFixed(1)}%`;
	}

	// Use standard formatting for other indicators
	return formatIndicatorValue(current_value, indicator);
}

/**
 * Get precious metals symbol and emoji
 */
export function getPreciousMetalsSymbol(asset: 'XAU' | 'XAG'): { symbol: string; emoji: string; name: string } {
	switch (asset) {
		case 'XAU':
			return { symbol: 'XAU', emoji: '🥇', name: 'Gold' };
		case 'XAG':
			return { symbol: 'XAG', emoji: '🥈', name: 'Silver' };
		default:
			return { symbol: asset, emoji: '💰', name: 'Precious Metal' };
	}
}

/**
 * Format precious metals price with appropriate precision
 */
export function formatPreciousMetalsPrice(price: number, asset: 'XAU' | 'XAG'): string {
	switch (asset) {
		case 'XAU':
			// Gold: 2 decimal places
			return `$${price.toFixed(2)}/oz`;
		case 'XAG':
			// Silver: 3 decimal places for more precision
			return `$${price.toFixed(3)}/oz`;
		default:
			return `$${price.toFixed(2)}/oz`;
	}
}

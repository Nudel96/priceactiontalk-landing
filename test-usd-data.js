/**
 * Test script for USD real economic data integration
 */

import { initializeUSDRealData, generateUSDMacroeconomicData } from './src/lib/data/usd-macroeconomic.ts';

async function testUSDData() {
	console.log('🧪 Testing USD Real Economic Data Integration...\n');
	
	try {
		// Test 1: Initialize real data
		console.log('1️⃣ Initializing real data...');
		await initializeUSDRealData();
		console.log('✅ Real data initialization completed\n');
		
		// Test 2: Generate USD data with real API integration
		console.log('2️⃣ Generating USD macroeconomic data...');
		const usdData = generateUSDMacroeconomicData();
		
		// Test 3: Verify key indicators have real data
		console.log('3️⃣ Verifying key indicators:\n');
		
		const keyIndicators = [
			'gdp_growth_rate',
			'cpi', 
			'unemployment_rate',
			'non_farm_payrolls',
			'fed_funds_rate'
		];
		
		keyIndicators.forEach(indicator => {
			const data = usdData[indicator];
			if (data) {
				console.log(`📊 ${data.name}:`);
				console.log(`   Current: ${data.current_value} ${data.unit}`);
				console.log(`   Previous: ${data.previous_value} ${data.unit}`);
				console.log(`   Change: ${data.change_absolute > 0 ? '+' : ''}${data.change_absolute} (${data.change_percent > 0 ? '+' : ''}${data.change_percent.toFixed(2)}%)`);
				console.log(`   Trend: ${data.trend}`);
				console.log(`   Historical data points: ${data.historical_data?.length || 0}`);
				console.log(`   Source: ${data.source}\n`);
			}
		});
		
		console.log('✅ USD data integration test completed successfully!');
		
	} catch (error) {
		console.error('❌ Test failed:', error);
	}
}

// Run the test
testUSDData();

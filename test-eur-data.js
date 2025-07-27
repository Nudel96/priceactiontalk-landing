/**
 * Test script for EUR real economic data integration
 */

import { initializeEURRealData, generateEURMacroeconomicData } from './src/lib/data/eur-macroeconomic.ts';

async function testEURData() {
	console.log('🧪 Testing EUR Real Economic Data Integration...\n');
	
	try {
		// Test 1: Initialize real data
		console.log('1️⃣ Initializing real EUR data...');
		await initializeEURRealData();
		console.log('✅ Real EUR data initialization completed\n');
		
		// Test 2: Generate EUR data with real API integration
		console.log('2️⃣ Generating EUR macroeconomic data...');
		const eurData = await generateEURMacroeconomicData();
		
		// Test 3: Verify key indicators have real data
		console.log('3️⃣ Verifying key EUR indicators:\n');
		
		const keyIndicators = [
			'gdp_growth_rate',
			'hicp', 
			'unemployment_rate',
			'ecb_main_rate'
		];
		
		keyIndicators.forEach(indicator => {
			const data = eurData[indicator];
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
		
		console.log('✅ EUR data integration test completed successfully!');
		
	} catch (error) {
		console.error('❌ Test failed:', error);
	}
}

// Run the test
testEURData();

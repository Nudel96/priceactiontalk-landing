/**
 * Test script for Finnhub forex data integration
 */

import { getRealForexRates, getForexPairRate } from './src/lib/services/economicDataService.ts';

async function testForexData() {
	console.log('🧪 Testing Finnhub Forex Data Integration...\n');
	
	try {
		// Test 1: Get all major forex rates
		console.log('1️⃣ Fetching all major forex rates...');
		const allRates = await getRealForexRates();
		
		console.log('📊 Forex rates received:');
		Object.entries(allRates).forEach(([pair, data]) => {
			console.log(`   ${pair}: ${data.current_price} (${data.change_percent > 0 ? '+' : ''}${data.change_percent.toFixed(2)}%)`);
		});
		console.log('');
		
		// Test 2: Get specific pair
		console.log('2️⃣ Testing specific pair (EUR/USD)...');
		const eurUsd = await getForexPairRate('EUR/USD');
		
		console.log('📈 EUR/USD Details:');
		console.log(`   Current Price: ${eurUsd.current_price}`);
		console.log(`   Previous Close: ${eurUsd.previous_close}`);
		console.log(`   Change: ${eurUsd.change_absolute > 0 ? '+' : ''}${eurUsd.change_absolute.toFixed(4)}`);
		console.log(`   Change %: ${eurUsd.change_percent > 0 ? '+' : ''}${eurUsd.change_percent.toFixed(2)}%`);
		console.log(`   Last Updated: ${eurUsd.last_updated}\n`);
		
		// Test 3: Test another major pair
		console.log('3️⃣ Testing GBP/USD...');
		const gbpUsd = await getForexPairRate('GBP/USD');
		
		console.log('📈 GBP/USD Details:');
		console.log(`   Current Price: ${gbpUsd.current_price}`);
		console.log(`   Change %: ${gbpUsd.change_percent > 0 ? '+' : ''}${gbpUsd.change_percent.toFixed(2)}%\n`);
		
		console.log('✅ Forex data integration test completed successfully!');
		console.log(`📊 Total pairs fetched: ${Object.keys(allRates).length}`);
		
	} catch (error) {
		console.error('❌ Test failed:', error);
		console.log('\n🔧 Troubleshooting tips:');
		console.log('   - Check if Finnhub API key is valid');
		console.log('   - Verify internet connection');
		console.log('   - Check API rate limits');
	}
}

// Run the test
testForexData();

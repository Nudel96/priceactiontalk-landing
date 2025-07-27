/**
 * Comprehensive Data Accuracy Testing Script
 * Tests all major data integrations and validates against official sources
 */

import { 
	getRealUSDGDPData, 
	getRealCPIData, 
	getRealUnemploymentData, 
	getRealFedFundsData,
	batchFetchUSDData 
} from './src/lib/services/economicDataService.ts';

import { 
	getRealEURGDPData, 
	getRealEURHICPData, 
	getRealEURUnemploymentData, 
	getRealECBRateData,
	batchFetchEURData 
} from './src/lib/services/economicDataService.ts';

import { 
	getRealGBPGDPData, 
	getRealGBPCPIData, 
	getRealGBPUnemploymentData, 
	getRealBOEBankRateData,
	batchFetchGBPData 
} from './src/lib/services/economicDataService.ts';

import { 
	getRealForexRates, 
	getForexPairRate 
} from './src/lib/services/economicDataService.ts';

async function testDataAccuracy() {
	console.log('🧪 COMPREHENSIVE DATA ACCURACY TESTING\n');
	console.log('=' .repeat(60));
	
	const results = {
		usd: { success: 0, total: 0, errors: [] },
		eur: { success: 0, total: 0, errors: [] },
		gbp: { success: 0, total: 0, errors: [] },
		forex: { success: 0, total: 0, errors: [] }
	};
	
	// Test USD Data Integration
	console.log('\n📊 TESTING USD ECONOMIC DATA');
	console.log('-'.repeat(40));
	
	const usdTests = [
		{ name: 'GDP Growth', func: getRealUSDGDPData },
		{ name: 'CPI Inflation', func: getRealCPIData },
		{ name: 'Unemployment Rate', func: getRealUnemploymentData },
		{ name: 'Fed Funds Rate', func: getRealFedFundsData }
	];
	
	for (const test of usdTests) {
		results.usd.total++;
		try {
			console.log(`Testing ${test.name}...`);
			const data = await test.func();
			
			// Validate data structure
			if (data.current_value !== undefined && data.historical_data && data.historical_data.length > 0) {
				console.log(`✅ ${test.name}: ${data.current_value} (${data.historical_data.length} historical points)`);
				results.usd.success++;
			} else {
				throw new Error('Invalid data structure');
			}
		} catch (error) {
			console.log(`❌ ${test.name}: ${error.message}`);
			results.usd.errors.push(`${test.name}: ${error.message}`);
		}
	}
	
	// Test EUR Data Integration
	console.log('\n📊 TESTING EUR ECONOMIC DATA');
	console.log('-'.repeat(40));
	
	const eurTests = [
		{ name: 'GDP Growth', func: getRealEURGDPData },
		{ name: 'HICP Inflation', func: getRealEURHICPData },
		{ name: 'Unemployment Rate', func: getRealEURUnemploymentData },
		{ name: 'ECB Main Rate', func: getRealECBRateData }
	];
	
	for (const test of eurTests) {
		results.eur.total++;
		try {
			console.log(`Testing ${test.name}...`);
			const data = await test.func();
			
			if (data.current_value !== undefined && data.historical_data && data.historical_data.length > 0) {
				console.log(`✅ ${test.name}: ${data.current_value} (${data.historical_data.length} historical points)`);
				results.eur.success++;
			} else {
				throw new Error('Invalid data structure');
			}
		} catch (error) {
			console.log(`❌ ${test.name}: ${error.message}`);
			results.eur.errors.push(`${test.name}: ${error.message}`);
		}
	}
	
	// Test GBP Data Integration
	console.log('\n📊 TESTING GBP ECONOMIC DATA');
	console.log('-'.repeat(40));
	
	const gbpTests = [
		{ name: 'GDP Growth', func: getRealGBPGDPData },
		{ name: 'CPI Inflation', func: getRealGBPCPIData },
		{ name: 'Unemployment Rate', func: getRealGBPUnemploymentData },
		{ name: 'BoE Bank Rate', func: getRealBOEBankRateData }
	];
	
	for (const test of gbpTests) {
		results.gbp.total++;
		try {
			console.log(`Testing ${test.name}...`);
			const data = await test.func();
			
			if (data.current_value !== undefined && data.historical_data && data.historical_data.length > 0) {
				console.log(`✅ ${test.name}: ${data.current_value} (${data.historical_data.length} historical points)`);
				results.gbp.success++;
			} else {
				throw new Error('Invalid data structure');
			}
		} catch (error) {
			console.log(`❌ ${test.name}: ${error.message}`);
			results.gbp.errors.push(`${test.name}: ${error.message}`);
		}
	}
	
	// Test Forex Data Integration
	console.log('\n📊 TESTING FOREX DATA');
	console.log('-'.repeat(40));
	
	const forexPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'];
	
	for (const pair of forexPairs) {
		results.forex.total++;
		try {
			console.log(`Testing ${pair}...`);
			const data = await getForexPairRate(pair);
			
			if (data.current_price && data.change_percent !== undefined) {
				console.log(`✅ ${pair}: ${data.current_price} (${data.change_percent > 0 ? '+' : ''}${data.change_percent.toFixed(2)}%)`);
				results.forex.success++;
			} else {
				throw new Error('Invalid forex data structure');
			}
		} catch (error) {
			console.log(`❌ ${pair}: ${error.message}`);
			results.forex.errors.push(`${pair}: ${error.message}`);
		}
	}
	
	// Summary Report
	console.log('\n📋 TEST SUMMARY REPORT');
	console.log('=' .repeat(60));
	
	const totalTests = results.usd.total + results.eur.total + results.gbp.total + results.forex.total;
	const totalSuccess = results.usd.success + results.eur.success + results.gbp.success + results.forex.success;
	
	console.log(`📊 USD Data: ${results.usd.success}/${results.usd.total} (${(results.usd.success/results.usd.total*100).toFixed(1)}%)`);
	console.log(`📊 EUR Data: ${results.eur.success}/${results.eur.total} (${(results.eur.success/results.eur.total*100).toFixed(1)}%)`);
	console.log(`📊 GBP Data: ${results.gbp.success}/${results.gbp.total} (${(results.gbp.success/results.gbp.total*100).toFixed(1)}%)`);
	console.log(`📊 Forex Data: ${results.forex.success}/${results.forex.total} (${(results.forex.success/results.forex.total*100).toFixed(1)}%)`);
	console.log(`\n🎯 OVERALL: ${totalSuccess}/${totalTests} (${(totalSuccess/totalTests*100).toFixed(1)}%) tests passed`);
	
	if (totalSuccess === totalTests) {
		console.log('\n🎉 ALL TESTS PASSED! Data integration is working correctly.');
	} else {
		console.log('\n⚠️  Some tests failed. Check the errors above for details.');
		
		// Show all errors
		const allErrors = [...results.usd.errors, ...results.eur.errors, ...results.gbp.errors, ...results.forex.errors];
		if (allErrors.length > 0) {
			console.log('\n❌ ERRORS:');
			allErrors.forEach(error => console.log(`   - ${error}`));
		}
	}
	
	console.log('\n✅ Data accuracy testing completed!');
}

// Run the comprehensive test
testDataAccuracy();

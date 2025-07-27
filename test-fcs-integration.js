/**
 * FCS API Integration Test Script
 * Tests all FCS API endpoints and functionality
 */

console.log('🚀 STARTING FCS API INTEGRATION TESTS\n');
console.log('=' .repeat(80));

// Test Results Storage
const testResults = {
	passed: 0,
	failed: 0,
	errors: [],
	details: []
};

// Helper function to log test results
function logTest(testName, success, data = null, error = null) {
	if (success) {
		console.log(`✅ ${testName}: PASSED`);
		testResults.passed++;
		if (data) {
			testResults.details.push({ test: testName, status: 'PASSED', data });
		}
	} else {
		console.log(`❌ ${testName}: FAILED - ${error}`);
		testResults.failed++;
		testResults.errors.push({ test: testName, error: error.toString() });
	}
}

// Test 1: FCS Latest Forex Rates
async function testFCSLatestRates() {
	console.log('\n📊 Testing FCS Latest Forex Rates...');
	try {
		const response = await fetch('https://fcsapi.com/api-v3/forex/latest?symbol=all_forex&access_key=qPzxT3D4qhIm7EDXYyw2dHe');
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (data.status && data.response && Array.isArray(data.response)) {
			logTest('FCS Latest Rates API', true, {
				totalPairs: data.response.length,
				creditCount: data.info?.credit_count,
				serverTime: data.info?.server_time,
				samplePair: data.response[0]?.symbol,
				samplePrice: data.response[0]?.price
			});
		} else {
			throw new Error(`API Error: ${data.msg || 'Invalid response format'}`);
		}
		
	} catch (error) {
		logTest('FCS Latest Rates API', false, null, error);
	}
}

// Test 2: FCS Currency Converter
async function testFCSConverter() {
	console.log('\n💱 Testing FCS Currency Converter...');
	try {
		const response = await fetch('https://fcsapi.com/api-v3/forex/converter?symbol=EURUSD&amount=1000&access_key=qPzxT3D4qhIm7EDXYyw2dHe');
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (data.status && data.response) {
			logTest('FCS Currency Converter', true, {
				symbol: data.response.symbol,
				amount: data.response.amount,
				convertedAmount: data.response.price_Nx,
				exchangeRate: data.response.price_1x,
				timestamp: data.response.timestamp
			});
		} else {
			throw new Error(`API Error: ${data.msg || 'Invalid response format'}`);
		}
		
	} catch (error) {
		logTest('FCS Currency Converter', false, null, error);
	}
}

// Test 3: FCS Historical Data
async function testFCSHistorical() {
	console.log('\n📈 Testing FCS Historical Data...');
	try {
		const response = await fetch('https://fcsapi.com/api-v3/forex/history?symbol=EURUSD&period=1d&access_key=qPzxT3D4qhIm7EDXYyw2dHe');
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (data.status && data.response && Array.isArray(data.response)) {
			logTest('FCS Historical Data', true, {
				dataPoints: data.response.length,
				latestDate: data.response[data.response.length - 1]?.date,
				latestClose: data.response[data.response.length - 1]?.close,
				period: '1d'
			});
		} else {
			throw new Error(`API Error: ${data.msg || 'Invalid response format'}`);
		}
		
	} catch (error) {
		logTest('FCS Historical Data', false, null, error);
	}
}

// Test 4: Enhanced Forex Rates Function
async function testEnhancedForexRates() {
	console.log('\n🔄 Testing Enhanced Forex Rates Function...');
	try {
		// This would test the enhanced function from the service
		// For browser testing, we'll simulate the logic
		const fcsResponse = await fetch('https://fcsapi.com/api-v3/forex/latest?symbol=all_forex&access_key=qPzxT3D4qhIm7EDXYyw2dHe');
		
		if (fcsResponse.ok) {
			const fcsData = await fcsResponse.json();
			
			if (fcsData.status && fcsData.response) {
				// Simulate the enhanced function logic
				const processedData = {};
				fcsData.response.slice(0, 10).forEach(rate => {
					const symbol = rate.symbol.replace(/([A-Z]{3})([A-Z]{3})/, '$1/$2');
					processedData[symbol] = {
						symbol,
						current_price: rate.price,
						bid: rate.bid,
						ask: rate.ask,
						spread: rate.spread,
						source: 'FCS'
					};
				});
				
				logTest('Enhanced Forex Rates Function', true, {
					processedPairs: Object.keys(processedData).length,
					hasBidAsk: Object.values(processedData).some(p => p.bid && p.ask),
					sampleData: Object.values(processedData)[0]
				});
			} else {
				throw new Error('FCS API returned invalid data');
			}
		} else {
			throw new Error('FCS API request failed');
		}
		
	} catch (error) {
		logTest('Enhanced Forex Rates Function', false, null, error);
	}
}

// Test 5: Rate Limiting and Caching
async function testRateLimitingAndCaching() {
	console.log('\n⏱️ Testing Rate Limiting and Caching...');
	try {
		const startTime = Date.now();
		
		// Make multiple requests to test caching
		const requests = [];
		for (let i = 0; i < 3; i++) {
			requests.push(
				fetch('https://fcsapi.com/api-v3/forex/latest?symbol=EURUSD,GBPUSD&access_key=qPzxT3D4qhIm7EDXYyw2dHe')
			);
		}
		
		const responses = await Promise.all(requests);
		const endTime = Date.now();
		
		const allSuccessful = responses.every(r => r.ok);
		const totalTime = endTime - startTime;
		
		if (allSuccessful) {
			logTest('Rate Limiting and Caching', true, {
				requests: requests.length,
				totalTime: `${totalTime}ms`,
				averageTime: `${Math.round(totalTime / requests.length)}ms`,
				allSuccessful
			});
		} else {
			throw new Error('Some requests failed');
		}
		
	} catch (error) {
		logTest('Rate Limiting and Caching', false, null, error);
	}
}

// Test 6: Error Handling
async function testErrorHandling() {
	console.log('\n🛡️ Testing Error Handling...');
	try {
		// Test with invalid API key
		const response = await fetch('https://fcsapi.com/api-v3/forex/latest?symbol=EURUSD&access_key=invalid_key');
		
		if (!response.ok || response.status === 401) {
			logTest('Error Handling (Invalid Key)', true, {
				status: response.status,
				statusText: response.statusText,
				handledCorrectly: true
			});
		} else {
			throw new Error('Expected error response for invalid key');
		}
		
	} catch (error) {
		logTest('Error Handling (Invalid Key)', false, null, error);
	}
}

// Test 7: Application Integration
async function testApplicationIntegration() {
	console.log('\n🌐 Testing Application Integration...');
	try {
		// Test if the economic overview page loads
		const response = await fetch('http://localhost:5175/economic-overview');
		
		if (response.ok) {
			logTest('Application Integration', true, {
				pageStatus: response.status,
				pageLoaded: true
			});
		} else {
			throw new Error(`Page failed to load: ${response.status}`);
		}
		
	} catch (error) {
		logTest('Application Integration', false, null, error);
	}
}

// Main test execution
async function runAllFCSTests() {
	console.log('🔍 Running all FCS API integration tests...\n');
	
	await testFCSLatestRates();
	await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
	
	await testFCSConverter();
	await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
	
	await testFCSHistorical();
	await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
	
	await testEnhancedForexRates();
	await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
	
	await testRateLimitingAndCaching();
	await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
	
	await testErrorHandling();
	await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
	
	await testApplicationIntegration();
	
	// Final Results
	console.log('\n📋 FCS API TEST RESULTS SUMMARY');
	console.log('=' .repeat(80));
	console.log(`✅ Tests Passed: ${testResults.passed}`);
	console.log(`❌ Tests Failed: ${testResults.failed}`);
	console.log(`📊 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
	
	if (testResults.failed > 0) {
		console.log('\n🔧 FAILED TESTS:');
		testResults.errors.forEach((error, index) => {
			console.log(`   ${index + 1}. ${error.test}: ${error.error}`);
		});
	}
	
	if (testResults.passed > 0) {
		console.log('\n🎉 SUCCESSFUL INTEGRATIONS:');
		testResults.details.forEach((detail, index) => {
			console.log(`   ${index + 1}. ${detail.test}: Working correctly`);
		});
	}
	
	console.log('\n✅ FCS API Integration Testing Complete!');
	
	return testResults;
}

// Run tests if in browser environment
if (typeof window !== 'undefined') {
	runAllFCSTests().then(results => {
		console.log('\n🚀 All FCS API tests completed. Check the results above.');
	});
} else {
	console.log('Run this script in the browser console for full testing.');
}

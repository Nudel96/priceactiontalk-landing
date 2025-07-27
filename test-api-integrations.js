/**
 * Comprehensive API Integration Test Script
 * Tests all implemented APIs: FRED, Finnhub, MyFXBook, and COT data
 */

console.log('🚀 STARTING COMPREHENSIVE API INTEGRATION TESTS\n');
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

// Test 1: FRED API (US Economic Data)
async function testFREDAPI() {
	console.log('\n📊 Testing FRED API (US Economic Data)...');
	try {
		const response = await fetch('https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=48484204458022a5abe15c805472cb01&file_type=json&limit=1');
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (data.observations && data.observations.length > 0) {
			logTest('FRED API Connection', true, {
				observations: data.observations.length,
				latestValue: data.observations[0].value,
				date: data.observations[0].date
			});
		} else {
			throw new Error('No observations in FRED response');
		}
		
	} catch (error) {
		logTest('FRED API Connection', false, null, error);
	}
}

// Test 2: Finnhub API (Forex Data)
async function testFinnhubAPI() {
	console.log('\n📈 Testing Finnhub API (Forex Data)...');
	try {
		const response = await fetch('https://finnhub.io/api/v1/quote?symbol=OANDA:EUR_USD&token=ctqfqfpr01qgd8ub8qd0ctqfqfpr01qgd8ub8qdg');
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (data.c && data.pc) {
			logTest('Finnhub API Connection', true, {
				symbol: 'EUR/USD',
				currentPrice: data.c,
				previousClose: data.pc,
				change: data.d,
				changePercent: data.dp
			});
		} else {
			throw new Error('Invalid Finnhub response format');
		}
		
	} catch (error) {
		logTest('Finnhub API Connection', false, null, error);
	}
}

// Test 3: MyFXBook API (Sentiment Data)
async function testMyFXBookAPI() {
	console.log('\n📊 Testing MyFXBook API (Sentiment Data)...');
	try {
		const response = await fetch('https://www.myfxbook.com/api/get-community-outlook.json?session=sWYHG0mX0i3kRSsrjEj3793561');
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (data.communityOutlook && typeof data.communityOutlook === 'object') {
			const pairs = Object.keys(data.communityOutlook);
			const samplePair = pairs[0];
			const sampleData = data.communityOutlook[samplePair];
			
			logTest('MyFXBook API Connection', true, {
				totalPairs: pairs.length,
				samplePair,
				longPercentage: sampleData.longPercentage,
				shortPercentage: sampleData.shortPercentage
			});
		} else {
			throw new Error('Invalid MyFXBook response format');
		}
		
	} catch (error) {
		logTest('MyFXBook API Connection', false, null, error);
	}
}

// Test 4: ECB API (EUR Economic Data)
async function testECBAPI() {
	console.log('\n🏦 Testing ECB API (EUR Economic Data)...');
	try {
		const response = await fetch('https://data.ecb.europa.eu/api/v1/data/FM.B.U2.EUR.4F.KR.MRR_FR.LEV?format=jsondata&lastNObservations=1');
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (data.dataSets && data.dataSets[0] && data.dataSets[0].observations) {
			const observations = Object.keys(data.dataSets[0].observations);
			logTest('ECB API Connection', true, {
				observations: observations.length,
				dataAvailable: observations.length > 0
			});
		} else {
			throw new Error('Invalid ECB response format');
		}
		
	} catch (error) {
		logTest('ECB API Connection', false, null, error);
	}
}

// Test 5: Local Economic Data API
async function testLocalAPI() {
	console.log('\n🏠 Testing Local Economic Data API...');
	try {
		const response = await fetch('http://localhost:5175/api/fetchEconomicData');
		
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const data = await response.json();
		
		if (data.success) {
			logTest('Local API Connection', true, {
				success: data.success,
				message: data.message,
				results: data.results
			});
		} else {
			throw new Error('Local API returned unsuccessful response');
		}
		
	} catch (error) {
		logTest('Local API Connection', false, null, error);
	}
}

// Test 6: Application Pages
async function testApplicationPages() {
	console.log('\n🌐 Testing Application Pages...');
	
	const pages = [
		{ name: 'Economic Overview', url: 'http://localhost:5175/economic-overview' },
		{ name: 'Fundamental Analysis', url: 'http://localhost:5175/fundamental' },
		{ name: 'Home Page', url: 'http://localhost:5175/' }
	];
	
	for (const page of pages) {
		try {
			const response = await fetch(page.url);
			
			if (response.ok) {
				logTest(`${page.name} Page`, true, { status: response.status });
			} else {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			
		} catch (error) {
			logTest(`${page.name} Page`, false, null, error);
		}
	}
}

// Main test execution
async function runAllTests() {
	console.log('🔍 Running all API integration tests...\n');
	
	await testFREDAPI();
	await testFinnhubAPI();
	await testMyFXBookAPI();
	await testECBAPI();
	await testLocalAPI();
	await testApplicationPages();
	
	// Final Results
	console.log('\n📋 TEST RESULTS SUMMARY');
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
	
	console.log('\n✅ API Integration Testing Complete!');
	
	return testResults;
}

// Run tests if in browser environment
if (typeof window !== 'undefined') {
	runAllTests().then(results => {
		console.log('\n🚀 All tests completed. Check the results above.');
	});
} else {
	console.log('Run this script in the browser console for full testing.');
}

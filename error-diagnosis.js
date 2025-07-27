/**
 * Comprehensive Error Diagnosis Script
 * Tests all API integrations and identifies any remaining issues
 */

// Test all API endpoints
async function testAPIEndpoints() {
	console.log('🔍 COMPREHENSIVE ERROR DIAGNOSIS\n');
	console.log('=' .repeat(60));
	
	const results = {
		apis: [],
		imports: [],
		errors: []
	};
	
	// Test 1: FRED API
	console.log('\n📊 Testing FRED API...');
	try {
		const response = await fetch('https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=48484204458022a5abe15c805472cb01&file_type=json&limit=1');
		if (response.ok) {
			const data = await response.json();
			console.log('✅ FRED API: Working');
			results.apis.push({ name: 'FRED', status: 'working', data: data.observations?.length || 0 });
		} else {
			throw new Error(`HTTP ${response.status}`);
		}
	} catch (error) {
		console.log(`❌ FRED API: ${error.message}`);
		results.errors.push(`FRED API: ${error.message}`);
	}
	
	// Test 2: Finnhub API
	console.log('\n📈 Testing Finnhub API...');
	try {
		const response = await fetch('https://finnhub.io/api/v1/quote?symbol=OANDA:EUR_USD&token=ctqfqfpr01qgd8ub8qd0ctqfqfpr01qgd8ub8qdg');
		if (response.ok) {
			const data = await response.json();
			console.log('✅ Finnhub API: Working');
			results.apis.push({ name: 'Finnhub', status: 'working', data: data.c || 'No price' });
		} else {
			throw new Error(`HTTP ${response.status}`);
		}
	} catch (error) {
		console.log(`❌ Finnhub API: ${error.message}`);
		results.errors.push(`Finnhub API: ${error.message}`);
	}
	
	// Test 3: ECB API
	console.log('\n🏦 Testing ECB API...');
	try {
		const response = await fetch('https://data.ecb.europa.eu/api/v1/data/FM.B.U2.EUR.4F.KR.MRR_FR.LEV?format=jsondata&lastNObservations=1');
		if (response.ok) {
			const data = await response.json();
			console.log('✅ ECB API: Working');
			results.apis.push({ name: 'ECB', status: 'working', data: 'Connected' });
		} else {
			throw new Error(`HTTP ${response.status}`);
		}
	} catch (error) {
		console.log(`❌ ECB API: ${error.message}`);
		results.errors.push(`ECB API: ${error.message}`);
	}
	
	// Test 4: MyFXBook API (for sentiment)
	console.log('\n📊 Testing MyFXBook API...');
	try {
		const response = await fetch('https://www.myfxbook.com/api/get-community-outlook.json?session=sWYHG0mX0i3kRSsrjEj3793561');
		if (response.ok) {
			const data = await response.json();
			console.log('✅ MyFXBook API: Working');
			results.apis.push({ name: 'MyFXBook', status: 'working', data: Object.keys(data.communityOutlook || {}).length });
		} else {
			throw new Error(`HTTP ${response.status}`);
		}
	} catch (error) {
		console.log(`❌ MyFXBook API: ${error.message}`);
		results.errors.push(`MyFXBook API: ${error.message}`);
	}
	
	// Test 5: Local Economic Data API
	console.log('\n🏠 Testing Local Economic Data API...');
	try {
		const response = await fetch('http://localhost:5175/api/fetchEconomicData');
		if (response.ok) {
			const data = await response.json();
			console.log('✅ Local API: Working');
			results.apis.push({ name: 'Local', status: 'working', data: data.success });
		} else {
			throw new Error(`HTTP ${response.status}`);
		}
	} catch (error) {
		console.log(`❌ Local API: ${error.message}`);
		results.errors.push(`Local API: ${error.message}`);
	}
	
	// Summary
	console.log('\n📋 ERROR DIAGNOSIS SUMMARY');
	console.log('=' .repeat(60));
	
	const workingAPIs = results.apis.filter(api => api.status === 'working').length;
	const totalAPIs = results.apis.length + results.errors.length;
	
	console.log(`📊 Working APIs: ${workingAPIs}/${totalAPIs}`);
	console.log(`❌ Errors Found: ${results.errors.length}`);
	
	if (results.errors.length > 0) {
		console.log('\n🔧 ERRORS TO FIX:');
		results.errors.forEach((error, index) => {
			console.log(`   ${index + 1}. ${error}`);
		});
	} else {
		console.log('\n🎉 NO ERRORS FOUND! All APIs are working correctly.');
	}
	
	// API Details
	console.log('\n📊 API STATUS DETAILS:');
	results.apis.forEach(api => {
		console.log(`   ✅ ${api.name}: ${api.data}`);
	});
	
	return results;
}

// Run the diagnosis
if (typeof window !== 'undefined') {
	// Browser environment
	testAPIEndpoints().then(results => {
		console.log('\n✅ Error diagnosis completed!');
	});
} else {
	// Node environment
	console.log('Run this script in the browser console for full API testing.');
}

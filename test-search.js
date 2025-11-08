const axios = require('axios');

async function testSearch() {
    try {
        console.log('Testing search API...');

        // Test the search endpoint directly
        const response = await axios.get('http://localhost:5000/api/search?q=los');

        console.log('Search API Response Status:', response.status);
        console.log('Total Results:', response.data.totalResults || 'N/A');
        console.log('Ministries found:', response.data.ministries?.length || 0);
        console.log('Parishes found:', response.data.parishes?.length || 0);

        // Show some sample parishes
        if (response.data.parishes && response.data.parishes.length > 0) {
            console.log('\nSample parishes found:');
            response.data.parishes.slice(0, 3).forEach(parish => {
                console.log(`- ${parish.name} (${parish.city}, ${parish.state})`);
            });
        }

        console.log('\n✅ Search API is working correctly!');

    } catch (error) {
        console.error('❌ Search API failed:');
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testSearch();
// Test script for API endpoints
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing Police Search API\n');
  console.log('=' .repeat(50));

  try {
    // 1. Health Check
    console.log('\n1️⃣ Testing Health Endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);

    // 2. Register a test user
    console.log('\n2️⃣ Registering Test User...');
    let token;
    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, {
        username: 'testuser',
        password: 'test123',
        name: 'Test User'
      });
      token = registerResponse.data.token;
      console.log('✅ User registered:', registerResponse.data.user.username);
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
        console.log('ℹ️  User already exists, trying to login...');
        // Try login instead
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          username: 'testuser',
          password: 'test123'
        });
        token = loginResponse.data.token;
        console.log('✅ Login successful:', loginResponse.data.user.username);
      } else {
        throw error;
      }
    }

    // 3. Test People Search (Name)
    console.log('\n3️⃣ Testing People Search (Name)...');
    try {
      const nameSearchResponse = await axios.post(
        `${API_URL}/search/people`,
        { query: 'test', searchType: 'name' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`✅ Name Search Results: ${nameSearchResponse.data.total} records found`);
      if (nameSearchResponse.data.results.length > 0) {
        console.log('   Sample result:', JSON.stringify(nameSearchResponse.data.results[0], null, 2).substring(0, 200) + '...');
      }
    } catch (error) {
      console.log('⚠️  Name search:', error.response?.data?.message || error.message);
    }

    // 4. Test People Search (Phone)
    console.log('\n4️⃣ Testing People Search (Phone)...');
    try {
      const phoneSearchResponse = await axios.post(
        `${API_URL}/search/people`,
        { query: '012', searchType: 'phone' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`✅ Phone Search Results: ${phoneSearchResponse.data.total} records found`);
      if (phoneSearchResponse.data.results.length > 0) {
        console.log('   Sample result:', JSON.stringify(phoneSearchResponse.data.results[0], null, 2).substring(0, 200) + '...');
      }
    } catch (error) {
      console.log('⚠️  Phone search:', error.response?.data?.message || error.message);
    }

    // 5. Test Vehicle Search
    console.log('\n5️⃣ Testing Vehicle Search...');
    try {
      const vehicleSearchResponse = await axios.post(
        `${API_URL}/search/vehicles`,
        { query: 'ABC' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`✅ Vehicle Search Results: ${vehicleSearchResponse.data.total} records found`);
      if (vehicleSearchResponse.data.results.length > 0) {
        console.log('   Sample result:', JSON.stringify(vehicleSearchResponse.data.results[0], null, 2).substring(0, 200) + '...');
      }
    } catch (error) {
      console.log('⚠️  Vehicle search:', error.response?.data?.message || error.message);
    }

    // 6. Database Info
    console.log('\n6️⃣ Getting Database Info...');
    try {
      const dbInfoResponse = await axios.get(
        `${API_URL}/db/info`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✅ Database Info:');
      console.log('   Current DB:', dbInfoResponse.data.currentDatabase || 'None');
      console.log('   Available Tables:', dbInfoResponse.data.tables.length);
      if (dbInfoResponse.data.tables.length > 0) {
        console.log('   Sample tables:', dbInfoResponse.data.tables.slice(0, 5).join(', '));
      }
    } catch (error) {
      console.log('⚠️  Database info:', error.response?.data?.message || error.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ All API tests completed!');
    console.log('\n📱 Next Steps:');
    console.log('   1. Make sure the backend server is running: npm start');
    console.log('   2. Update mobile app API URL in services/api.js');
    console.log('   3. Test the mobile app with Expo Go');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

testAPI();

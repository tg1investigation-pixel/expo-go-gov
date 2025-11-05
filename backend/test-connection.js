// Quick test script for database connection
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'AH',
      password: '12Secure',
      port: 3306
    });

    console.log('✅ Successfully connected to MySQL!');
    
    // List databases
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('\n📊 Available databases:');
    databases.forEach(db => {
      console.log(`   - ${Object.values(db)[0]}`);
    });

    // Get current database
    const [dbResult] = await connection.query('SELECT DATABASE() as db');
    console.log(`\n📍 Current database: ${dbResult[0].db || 'None'}`);

    await connection.end();
    console.log('\n✅ Connection test completed successfully!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nPlease check:');
    console.error('  1. MySQL server is running');
    console.error('  2. Credentials are correct');
    console.error('  3. User has proper permissions');
    process.exit(1);
  }
}

testConnection();

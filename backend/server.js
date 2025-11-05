const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool (no default database - will use specific DB per query)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'AH',
  password: process.env.DB_PASSWORD || '12Secure',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: false
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
    
    // Try to get database name or list databases
    const [databases] = await pool.query('SHOW DATABASES');
    console.log('📊 Available databases:', databases.map(db => Object.values(db)[0]));
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Please check your database credentials and ensure MySQL is running.');
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTHENTICATION ====================

// Simple user creation endpoint (for testing - remove in production)
app.post('/api/auth/register', async (req, res) => {
  let connection;
  try {
    const { username, password, name } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get connection and use investigation_db
    connection = await pool.getConnection();
    await connection.query('USE investigation_db');
    
    // Create users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'investigator',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert user - check if name column exists first
    try {
      const [columns] = await connection.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'investigation_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'name'"
      );
      
      let [result];
      if (columns.length > 0) {
        // Name column exists
        [result] = await connection.query(
          'INSERT INTO users (username, password_hash, name) VALUES (?, ?, ?)',
          [username, hashedPassword, name || username]
        );
      } else {
        // Name column doesn't exist, insert without it
        [result] = await connection.query(
          'INSERT INTO users (username, password_hash) VALUES (?, ?)',
          [username, hashedPassword]
        );
      }

      const token = jwt.sign(
        { userId: result.insertId, username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: result.insertId,
          username,
          name: name || username,
          role: 'investigator'
        },
        note: columns.length > 0 ? 'User created with name field' : 'User created (name field not available in table)'
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Username already exists' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed: ' + error.message });
  } finally {
    if (connection) connection.release();
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  let connection;
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Get connection and use investigation_db
    connection = await pool.getConnection();
    await connection.query('USE investigation_db');
    
    // Create users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'investigator',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Find user
    const [users] = await connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      // For testing: create a default user if none exists
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await connection.query(
        'INSERT INTO users (username, password_hash, name) VALUES (?, ?, ?)',
        [username, hashedPassword, username]
      );

      const token = jwt.sign(
        { userId: result.insertId, username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: result.insertId,
          username,
          name: username,
          role: 'investigator'
        }
      });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name || user.username,
        role: user.role || 'investigator'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed: ' + error.message });
  } finally {
    if (connection) connection.release();
  }
});

// ==================== SEARCH ENDPOINTS ====================

// People Search
app.post('/api/search/people', authenticateToken, async (req, res) => {
  try {
    const { query, searchType } = req.body;

    if (!query || !searchType) {
      return res.status(400).json({ message: 'Query and searchType required' });
    }

    const results = [];
    const searchPattern = `%${query.trim()}%`;

    // Get all databases
    const [databases] = await pool.query('SHOW DATABASES');
    const dbNames = databases
      .map(db => Object.values(db)[0])
      .filter(db => !db.startsWith('information_schema') && 
                    !db.startsWith('mysql') && 
                    !db.startsWith('performance_schema') &&
                    !db.startsWith('sys'));
    
    // Search across all databases
    for (const dbRow of dbNames) {
      const dbName = Object.values(dbRow)[0];
      
      try {
        // Get all tables in this database
        const [tables] = await pool.query(
          `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
           WHERE TABLE_SCHEMA = ?`,
          [dbName]
        );

        for (const tableRow of tables) {
          const tableName = tableRow.TABLE_NAME;
          
          // Skip users table
          if (tableName === 'users') continue;

          try {
            // Get column names for this table
            const [columns] = await pool.query(
              `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
              [dbName, tableName]
            );

        const columnNames = columns.map(col => col.COLUMN_NAME);
        let sqlQuery = '';
        let params = [];

        if (searchType === 'phone') {
          // Check if phone columns exist
          const phoneColumns = ['DIAL', 'DIAL2', 'DIAL3', 'DIAL4']
            .filter(col => columnNames.includes(col));
          
          if (phoneColumns.length === 0) continue;

          // Build WHERE clause for phone search
          const conditions = phoneColumns.map(col => `\`${col}\` LIKE ?`).join(' OR ');
          sqlQuery = `SELECT *, ? as table_name FROM \`${tableName}\` WHERE ${conditions}`;
          params = [tableName, ...phoneColumns.map(() => searchPattern)];
        } else if (searchType === 'name') {
          // Check if NAME column exists
          if (!columnNames.includes('NAME')) continue;

          sqlQuery = `SELECT *, ? as table_name FROM \`${tableName}\` WHERE \`NAME\` LIKE ? COLLATE utf8mb4_general_ci`;
          params = [tableName, searchPattern];
        }

            if (sqlQuery) {
              // Execute query with database context
              const connection = await pool.getConnection();
              await connection.query(`USE \`${dbName}\``);
              const [rows] = await connection.query(sqlQuery, params);
              connection.release();
              // Convert to plain objects and add table_name and database_name
              const processedRows = rows.map(row => ({
                ...row,
                table_name: tableName,
                database_name: dbName
              }));
              results.push(...processedRows);
            }
          } catch (tableError) {
            console.error(`Error searching table ${dbName}.${tableName}:`, tableError.message);
            continue;
          }
        }
      } catch (dbError) {
        console.error(`Error accessing database ${dbName}:`, dbError.message);
        continue;
      }
    }

    res.json({
      results,
      total: results.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed. Please try again.' });
  }
});

// Vehicle Search
app.post('/api/search/vehicles', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query required' });
    }

    const results = [];
    const searchPattern = `%${query.trim()}%`;

    // Get current database name
    const [dbResult] = await pool.query('SELECT DATABASE() as db');
    const dbName = dbResult[0].db || process.env.DB_NAME || 'police_db';

    // Get all table names
    const [tables] = await pool.query('SHOW TABLES');

    // Define potential vehicle-related columns
    const vehicleColumns = ['PLATE_NUMBER', 'PLATE', 'VIN', 'VEHICLE_ID', 
                           'LICENSE_PLATE', 'REGISTRATION', 'CAR_PLATE'];

    // Search across all databases
    for (const dbRow of dbNames) {
      const dbName = Object.values(dbRow)[0];
      
      try {
        // Get all tables in this database
        const [tables] = await pool.query(
          `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
           WHERE TABLE_SCHEMA = ?`,
          [dbName]
        );

        for (const tableRow of tables) {
          const tableName = tableRow.TABLE_NAME;
          
          // Skip users table
          if (tableName === 'users') continue;

          try {
            // Get column names
            const [columns] = await pool.query(
              `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
              [dbName, tableName]
            );

        const columnNames = columns.map(col => col.COLUMN_NAME);
        
        // Find matching vehicle columns
        const matchingColumns = vehicleColumns.filter(col => 
          columnNames.includes(col)
        );

        if (matchingColumns.length === 0) continue;

        // Build search query
        const conditions = matchingColumns.map(col => 
          `\`${col}\` LIKE ? COLLATE utf8mb4_general_ci`
        ).join(' OR ');

            const sqlQuery = `SELECT *, ? as table_name FROM \`${tableName}\` WHERE ${conditions}`;
            const params = [tableName, ...matchingColumns.map(() => searchPattern)];

            // Execute query with database context
            const connection = await pool.getConnection();
            await connection.query(`USE \`${dbName}\``);
            const [rows] = await connection.query(sqlQuery, params);
            connection.release();
            
            const processedRows = rows.map(row => ({
              ...row,
              table_name: tableName,
              database_name: dbName
            }));
            results.push(...processedRows);
          } catch (tableError) {
            console.error(`Error searching table ${dbName}.${tableName}:`, tableError.message);
            continue;
          }
        }
      } catch (dbError) {
        console.error(`Error accessing database ${dbName}:`, dbError.message);
        continue;
      }
    }

    res.json({
      results,
      total: results.length
    });

  } catch (error) {
    console.error('Vehicle search error:', error);
    res.status(500).json({ message: 'Vehicle search failed. Please try again.' });
  }
});

// Record Details
app.get('/api/records/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, table } = req.query;

    if (!table) {
      return res.status(400).json({ message: 'Table name required' });
    }

    const [rows] = await pool.query(
      `SELECT * FROM \`${table}\` WHERE id = ? OR _id = ?`,
      [id, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get record error:', error);
    res.status(500).json({ message: 'Failed to load record details.' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    // Test query without specifying database
    await connection.query('SELECT 1');
    connection.release();
    res.json({ status: 'ok', message: 'Database connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Database info endpoint (for testing)
app.get('/api/db/info', authenticateToken, async (req, res) => {
  try {
    const [databases] = await pool.query('SHOW DATABASES');
    const [tables] = await pool.query('SHOW TABLES');
    const [dbResult] = await pool.query('SELECT DATABASE() as db');
    
    res.json({
      currentDatabase: dbResult[0].db,
      databases: databases.map(db => Object.values(db)[0]),
      tables: tables.map(table => Object.values(table)[0])
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  await testConnection();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down server...');
  await pool.end();
  process.exit(0);
});

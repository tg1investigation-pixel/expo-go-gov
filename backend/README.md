# Police Search Backend API

Backend server for the Police Search Engine mobile app.

## Database Configuration

The server uses the following MySQL credentials:
- Host: localhost
- User: AH
- Password: 12Secure
- Port: 3306

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   Edit `.env` file if needed (defaults are already set)

3. **Start the server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user (for testing)

### Search
- `POST /api/search/people` - Search people by name or phone
- `POST /api/search/vehicles` - Search vehicles

### Utility
- `GET /api/health` - Health check
- `GET /api/db/info` - Database information (requires auth)

## Testing

### 1. Test Database Connection
```bash
curl http://localhost:3000/api/health
```

### 2. Register a Test User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","name":"Admin User"}'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 4. Test Search (with token from login)
```bash
curl -X POST http://localhost:3000/api/search/people \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"query":"John","searchType":"name"}'
```

## Mobile App Configuration

Update `services/api.js` in the mobile app:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_COMPUTER_IP:3000/api'  // Use your computer's IP for physical device
  : 'https://your-production-api.com/api';
```

Replace `YOUR_COMPUTER_IP` with your computer's local IP address (e.g., `192.168.1.100`).

# 📱 How to Run the Police Search Engine Project

Complete step-by-step guide to run the mobile app and backend server.

---

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ Node.js installed (v14 or higher) - [Download](https://nodejs.org/)
- ✅ MySQL server running
- ✅ Expo Go app on your phone - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- ✅ Your phone and computer on the **same Wi-Fi network**

---

## 🚀 Step-by-Step Instructions

### Step 1: Install Backend Dependencies

1. Open Command Prompt or PowerShell
2. Navigate to the backend folder:
   ```bash
   cd D:\PoliceSearchApp\backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   Wait for installation to complete (should take 1-2 minutes)

---

### Step 2: Start the Backend Server

1. In the same terminal, start the server:
   ```bash
   npm start
   ```

2. **You should see:**
   ```
   🚀 Server running on http://localhost:3000
   📡 API endpoints available at http://localhost:3000/api
   ✅ Database connected successfully!
   📊 Available databases: archive_db, criminal_investigation_db, investigation_db
   ```

3. **Keep this terminal window open** - the server must stay running!

4. **Test the backend** (optional):
   - Open a new browser tab
   - Go to: `http://localhost:3000/api/health`
   - Should show: `{"status":"ok","message":"Database connected"}`

---

### Step 3: Install Mobile App Dependencies

1. Open a **new** Command Prompt or PowerShell window
2. Navigate to the project root:
   ```bash
   cd D:\PoliceSearchApp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   Wait for installation to complete (should take 2-3 minutes)

---

### Step 4: Start the Mobile App (Expo)

1. In the same terminal, start Expo:
   ```bash
   npm start
   ```
   Or:
   ```bash
   expo start
   ```

2. **You should see:**
   - Metro bundler starting
   - A QR code displayed in the terminal
   - Options to press:
     - `a` - Open on Android emulator
     - `i` - Open on iOS simulator
     - `r` - Reload app
     - `m` - Toggle menu

3. **Keep this terminal window open too!**

---

### Step 5: Connect from Your Phone

#### Option A: Using Expo Go App (Recommended)

1. **On your phone:**
   - Open the **Expo Go** app
   - Tap **"Scan QR Code"**
   - Scan the QR code from the terminal

#### Option B: Using Camera (iOS only)

1. **On your iPhone:**
   - Open the **Camera** app
   - Point it at the QR code in the terminal
   - Tap the notification that appears

2. **The app will load** on your phone (this may take 30-60 seconds the first time)

---

### Step 6: Test the Application

1. **Login Screen:**
   - Enter any username (e.g., `admin`)
   - Enter any password (e.g., `admin123`)
   - Tap **"Sign In"**
   - First login will automatically create the user

2. **Home Screen:**
   - You'll see two options:
     - **People Search** - Search by name or phone
     - **Vehicle Search** - Search by plate number

3. **Try a Search:**
   - Tap **"People Search"**
   - Choose **"Name"** or **"Phone Number"**
   - Enter a search query
   - Tap **"Search"**
   - Results will appear if matches are found

---

## 🔧 Troubleshooting

### Backend Server Issues

**Problem: "Cannot connect to database"**
- ✅ Check MySQL is running
- ✅ Verify credentials in `backend/.env` file
- ✅ Test connection: `node backend/test-connection.js`

**Problem: "Port 3000 already in use"**
- ✅ Close other applications using port 3000
- ✅ Or change port in `backend/server.js` and `backend/.env`

**Problem: "Module not found"**
- ✅ Run `npm install` again in the backend folder
- ✅ Delete `node_modules` and `package-lock.json`, then reinstall

---

### Mobile App Issues

**Problem: "Unable to connect to server"**
- ✅ Ensure backend server is running (Step 2)
- ✅ Check phone and computer are on same Wi-Fi
- ✅ Verify IP address in `services/api.js` is correct: `10.100.145.100`
- ✅ Test in phone browser: `http://10.100.145.100:3000/api/health`

**Problem: "Network request failed"**
- ✅ Check Windows Firewall allows port 3000
- ✅ Try: `New-NetFirewallRule -DisplayName "Node.js Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow`
- ✅ Restart both servers

**Problem: "Expo Go can't connect"**
- ✅ Ensure phone and computer are on same network
- ✅ Try typing the connection URL manually in Expo Go
- ✅ Check Expo terminal shows your IP address

**Problem: "QR code not scanning"**
- ✅ Make sure Expo Go app is up to date
- ✅ Try manually entering connection URL in Expo Go
- ✅ Ensure good lighting when scanning

---

### Windows Firewall Configuration

If you can't connect from your phone, allow port 3000:

**Using PowerShell (Run as Administrator):**
```powershell
New-NetFirewallRule -DisplayName "Node.js Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

**Or using Windows Firewall GUI:**
1. Open Windows Defender Firewall
2. Click "Advanced Settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" → Enter port: `3000` → Next
6. Select "Allow the connection" → Next
7. Check all profiles → Next
8. Name: "Node.js Backend" → Finish

---

## 📝 Quick Reference Commands

### Backend Server
```bash
cd D:\PoliceSearchApp\backend
npm install          # First time only
npm start            # Start server
```

### Mobile App
```bash
cd D:\PoliceSearchApp
npm install          # First time only
npm start            # Start Expo
```

### Stop Servers
- Press `Ctrl + C` in each terminal window
- Or close the terminal windows

---

## ✅ Verification Checklist

Before testing, verify:

- [ ] MySQL server is running
- [ ] Backend dependencies installed (`backend/node_modules` exists)
- [ ] Mobile app dependencies installed (`node_modules` exists)
- [ ] Backend server shows "Database connected successfully"
- [ ] Expo shows QR code
- [ ] Phone and computer on same Wi-Fi network
- [ ] IP address configured correctly (`10.100.145.100`)
- [ ] Windows Firewall allows port 3000

---

## 🎯 Typical Workflow

1. **Start Backend** (Terminal 1):
   ```bash
   cd D:\PoliceSearchApp\backend
   npm start
   ```

2. **Start Mobile App** (Terminal 2):
   ```bash
   cd D:\PoliceSearchApp
   npm start
   ```

3. **Scan QR code** with Expo Go on your phone

4. **Test the app** - Login and search

5. **Stop servers** when done:
   - Press `Ctrl + C` in both terminals

---

## 📞 Need Help?

- Check the PowerShell/terminal windows for error messages
- Verify all prerequisites are installed
- Ensure MySQL credentials are correct
- Test backend health: `http://localhost:3000/api/health`
- Test from phone: `http://10.100.145.100:3000/api/health`

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Backend terminal shows: "Database connected successfully"  
✅ Expo terminal shows: QR code and "Metro waiting on..."  
✅ Phone connects and app loads  
✅ Login screen appears  
✅ You can search and see results  

**Happy coding!** 🚀

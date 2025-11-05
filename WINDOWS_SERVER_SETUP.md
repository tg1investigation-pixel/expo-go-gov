# 🖥️ Windows Server Setup Guide

## Compatibility

✅ **Windows Server 2012 R2** and later  
✅ **Windows Server 2016**  
✅ **Windows Server 2019**  
✅ **Windows Server 2022**

---

## 📋 Prerequisites

### 1. Node.js Installation

1. Download Node.js LTS version from: https://nodejs.org/
2. Choose **Windows Installer (.msi)** for 64-bit
3. Run the installer
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

### 2. MySQL Server

- Ensure MySQL Server is installed and running
- Verify connection with credentials:
  - Host: localhost
  - User: AH
  - Password: 12Secure
  - Port: 3306

### 3. Windows Features

Enable required Windows features:
```powershell
# Run PowerShell as Administrator
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All -All
```

---

## 🚀 Quick Start (Windows Server)

### Option 1: Using Batch Scripts (Easiest)

#### Start Backend Server:
```cmd
cd D:\PoliceSearchApp\backend
start-server.bat
```

#### Start Mobile App:
```cmd
cd D:\PoliceSearchApp
start-app.bat
```

### Option 2: Using PowerShell

#### Start Backend Server:
```powershell
cd D:\PoliceSearchApp\backend
npm install
npm start
```

#### Start Mobile App:
```powershell
cd D:\PoliceSearchApp
npm install
npm start
```

---

## 🔧 Windows Server Configuration

### 1. Firewall Configuration

Allow port 3000 for backend API:

```powershell
# Run PowerShell as Administrator
New-NetFirewallRule -DisplayName "Police Search Backend" `
    -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### 2. Environment Variables

Set system environment variables (optional):

```powershell
# Run PowerShell as Administrator
[System.Environment]::SetEnvironmentVariable("NODE_ENV", "production", "Machine")
```

### 3. Path Configuration

Ensure Node.js is in system PATH:

```powershell
# Check if Node.js is in PATH
$env:PATH -split ';' | Select-String "Node"

# If not found, add it manually:
# System Properties → Advanced → Environment Variables → System Variables → Path
# Add: C:\Program Files\nodejs\
```

---

## 🛠️ Install as Windows Service

### Method 1: Using NSSM (Recommended)

1. **Download NSSM:**
   - Download from: https://nssm.cc/download
   - Extract to `D:\PoliceSearchApp\backend\`

2. **Install Service:**
   ```powershell
   cd D:\PoliceSearchApp\backend
   .\install-service.ps1
   ```

3. **Start Service:**
   ```powershell
   Start-Service -Name PoliceSearchBackend
   ```

4. **Check Status:**
   ```powershell
   Get-Service -Name PoliceSearchBackend
   ```

### Method 2: Using Task Scheduler

1. Open **Task Scheduler**
2. Create Basic Task
3. Name: "Police Search Backend"
4. Trigger: "When the computer starts"
5. Action: "Start a program"
6. Program: `C:\Program Files\nodejs\node.exe`
7. Arguments: `D:\PoliceSearchApp\backend\server.js`
8. Start in: `D:\PoliceSearchApp\backend`

---

## 📝 Windows Server-Specific Notes

### Path Handling

- All paths use Windows format (backslashes)
- Batch scripts handle path conversion automatically
- PowerShell scripts use `Join-Path` for cross-platform compatibility

### File Permissions

Ensure the application has read/write permissions:
```powershell
# Grant permissions to application folder
icacls "D:\PoliceSearchApp" /grant "IIS_IUSRS:(OI)(CI)F" /T
```

### Service Account

For production, create a dedicated service account:
```powershell
# Create service account (run as Administrator)
New-LocalUser -Name "PoliceSearchService" -Description "Police Search Engine Service Account" -Password (ConvertTo-SecureString "SecurePassword123!" -AsPlainText -Force)
```

### Logging

Configure Windows Event Log:
```powershell
# Create custom event log source
New-EventLog -LogName Application -Source "PoliceSearchBackend"
```

---

## 🔒 Security Configuration

### 1. User Account Control (UAC)

For service installation, UAC may need adjustment:
- Control Panel → User Accounts → Change User Account Control settings
- Adjust slider as needed for your security policy

### 2. Antivirus Exclusions

Add exclusions for:
- `D:\PoliceSearchApp\`
- Node.js installation directory
- Port 3000

### 3. Network Configuration

Configure static IP if needed:
```powershell
# Get current IP configuration
Get-NetIPAddress

# Set static IP (adjust as needed)
New-NetIPAddress -InterfaceIndex 1 -IPAddress "10.100.145.100" -PrefixLength 24 -DefaultGateway "10.100.145.1"
```

---

## 🐛 Troubleshooting

### Issue: "Node.js not found"

**Solution:**
```powershell
# Check if Node.js is installed
where.exe node

# If not found, add to PATH:
$env:PATH += ";C:\Program Files\nodejs"
```

### Issue: "Port 3000 already in use"

**Solution:**
```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess

# Kill the process
Stop-Process -Id <PID> -Force
```

### Issue: "Firewall blocking connections"

**Solution:**
```powershell
# Check firewall rules
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Police*"}

# Add rule if missing
New-NetFirewallRule -DisplayName "Police Search Backend" `
    -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### Issue: "Service won't start"

**Solution:**
```powershell
# Check service status
Get-Service -Name PoliceSearchBackend

# View service logs
Get-EventLog -LogName Application -Source "PoliceSearchBackend" -Newest 10

# Check service configuration
sc.exe qc PoliceSearchBackend
```

---

## 📊 Performance Optimization

### 1. Increase Node.js Memory

For large databases:
```cmd
set NODE_OPTIONS=--max-old-space-size=4096
```

### 2. Configure MySQL Connection Pool

Edit `backend/server.js`:
```javascript
const pool = mysql.createPool({
  connectionLimit: 20,  // Increase for server
  // ... other config
});
```

### 3. Enable Windows Performance Monitoring

```powershell
# Enable performance counters
logman create counter "PoliceSearchPerf" -c "\Processor(_Total)\% Processor Time" "\Memory\Available MBytes" -o "C:\PerfLogs\PoliceSearch.etl" -f bin -v mmddhhmm
```

---

## 🔄 Automatic Startup

### Add to Startup Folder

1. Press `Win + R`
2. Type: `shell:startup`
3. Create shortcut to `start-server.bat`

### Add to Registry

```powershell
# Run as Administrator
$regPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
Set-ItemProperty -Path $regPath -Name "PoliceSearchBackend" -Value "D:\PoliceSearchApp\backend\start-server.bat"
```

---

## ✅ Verification Checklist

- [ ] Node.js installed and in PATH
- [ ] MySQL server running
- [ ] Firewall rule for port 3000 configured
- [ ] Backend server starts successfully
- [ ] Mobile app connects to backend
- [ ] Service installed (if using service mode)
- [ ] Logs are being written
- [ ] Network connectivity verified

---

## 📞 Support

For Windows Server-specific issues:
- Check Windows Event Viewer
- Review application logs
- Verify service account permissions
- Check firewall and network settings

**Your project is now Windows Server compatible!** 🖥️✅

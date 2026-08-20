# 🔧 Dompet Tenang Service Troubleshooting Guide

**Last Updated:** December 31, 2025  
**Status:** Production Ready  

---

## 📋 Table of Contents

1. [Common Issues & Solutions](#common-issues--solutions)
2. [Port Conflicts](#port-conflicts)
3. [Service Startup Failures](#service-startup-failures)
4. [Database Connection Issues](#database-connection-issues)
5. [Network & Firewall](#network--firewall)
6. [Using the Service Monitor](#using-the-service-monitor)
7. [Emergency Procedures](#emergency-procedures)
8. [Prevention & Best Practices](#prevention--best-practices)

---

## ❌ Common Issues & Solutions

### Issue 1: "localhost refused to connect"

**Symptoms:**
- Browser shows "ERR_CONNECTION_REFUSED"
- Can't reach http://localhost:5173 or http://localhost:3000

**Root Causes:**
1. Services are not running
2. Ports are blocked by firewall
3. Different applications using same ports

**Solutions (in order):**

```powershell
# 1. Check if services are running
netstat -ano | findstr "3000|5173"

# 2. Verify using task manager
tasklist | findstr "node"

# 3. Check firewall
Get-NetFirewallProfile | Select Name, Enabled

# 4. If no output, services crashed - restart them
cd D:\Dompet Tenang\apps\api
npm run dev

# 5. In another terminal, start frontend
cd D:\Dompet Tenang\apps\web
npm run dev
```

**Expected Output:**
```
Backend: 🚀 Dompet Tenang API Server - Running on: http://localhost:3000
Frontend: ➜ Local: http://localhost:5173/
```

---

### Issue 2: "Port Already in Use" (EADDRINUSE)

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

```powershell
# 1. Find process using the port
netstat -ano | findstr "3000"
# Output example: TCP [::]:3000 [::]:* LISTEN 12345

# 2. Kill that process (use PID from above)
taskkill /PID 12345 /F

# 3. Alternative: Kill all Node processes
taskkill /F /IM node.exe /T

# 4. Verify port is free
netstat -ano | findstr "3000"
# No output = port is free

# 5. Restart service
npm run dev
```

---

### Issue 3: Service Crashes Immediately

**Symptoms:**
- npm run dev starts then stops
- Exit code 1 after startup

**Check for:**

```powershell
# 1. Environment variables
cd D:\Dompet Tenang\apps\api
dir .env  # Should exist

# 2. Database connection
# Check if PostgreSQL is running
Get-Service | findstr "postgres"

# 3. Dependencies installed
npm list
npm install  # Reinstall if needed

# 4. Check logs for specific errors
npm run dev 2>&1 | Tee-Object error.log
```

**Common Causes:**
| Cause | Solution |
|-------|----------|
| Missing .env file | Copy from .env.example or create new |
| PostgreSQL not running | Start PostgreSQL service |
| Node modules corrupt | Delete node_modules, run npm install |
| Port conflict | Kill conflicting process (see Issue 2) |
| Insufficient permissions | Run terminal as Administrator |

---

## 🔌 Port Conflicts

### Check Port Usage

```powershell
# Windows - Check all ports
netstat -ano | findstr LISTEN

# Check specific ports
netstat -ano | findstr "3000"  # Backend
netstat -ano | findstr "5173"  # Frontend
netstat -ano | findstr "5432"  # PostgreSQL
```

### Free Blocked Ports

```powershell
# Method 1: Kill by port number
$port = 3000
$process = Get-NetTCPConnection -LocalPort $port | Select-Object OwningProcess
Stop-Process -Id $process.OwningProcess -Force

# Method 2: Kill all Node processes
Get-Process -Name node | Stop-Process -Force

# Method 3: Using taskkill (most reliable)
taskkill /F /IM node.exe /T
taskkill /F /IM npm.cmd /T

# Verify ports are free
Start-Sleep -Seconds 2
netstat -ano | findstr "3000"  # Should be empty
```

### Use Alternative Ports

If ports are always occupied, use different ports:

```powershell
# Backend on different port
cd D:\Dompet Tenang\apps\api
$env:PORT = 3001
npm run dev

# Frontend on different port  
cd D:\Dompet Tenang\apps\web
$env:VITE_API_URL = "http://localhost:3001"
npm run dev -- --port 5174
```

---

## 🚀 Service Startup Failures

### Backend Startup Issues

```powershell
# 1. Check configuration
cd D:\Dompet Tenang\apps\api
cat .env

# 2. Verify dependencies
npm list
npm install  # If list shows errors

# 3. Test database connection
node -e "require('dotenv').config(); const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$queryRaw\`SELECT 1\`.then(() => console.log('DB OK')).catch(e => console.log('DB ERROR: ' + e.message));"

# 4. Check TypeScript compilation
npx tsc --noEmit

# 5. Run in debug mode
npm run dev -- --verbose
```

### Frontend Startup Issues

```powershell
# 1. Clear cache and reinstall
cd D:\Dompet Tenang\apps\web
rm -r node_modules package-lock.json
npm install

# 2. Clear Vite cache
rm -r .vite

# 3. Check configuration
cat vite.config.ts

# 4. Verify environment
cat .env.local  # Check API URL

# 5. Try with explicit host
npm run dev -- --host
```

---

## 🗄️ Database Connection Issues

### Check PostgreSQL Status

```powershell
# Is PostgreSQL running?
Get-Service | findstr -i postgres

# If not, start it
Start-Service PostgreSQL

# Test connection
psql -U postgres -c "SELECT 1"

# Check if Dompet Tenang database exists
psql -U postgres -l | findstr Dompet Tenang

# Verify connection string in .env
cat D:\Dompet Tenang\apps\api\.env | findstr DATABASE_URL
```

### Reset Database

```powershell
cd D:\Dompet Tenang\apps\api

# 1. Reset Prisma database (WARNING: Deletes all data)
npx prisma migrate reset --force

# 2. Or manually reset
psql -U postgres -c "DROP DATABASE IF EXISTS Dompet Tenang;"
psql -U postgres -c "CREATE DATABASE Dompet Tenang;"

# 3. Re-run migrations
npx prisma migrate deploy

# 4. Seed data
npx prisma db seed
```

---

## 🌐 Network & Firewall

### Check Firewall Rules

```powershell
# List firewall rules for Node
Get-NetFirewallApplicationFilter | findstr node

# Enable Node through firewall
New-NetFirewallRule -DisplayName "Node.js" -Program "C:\Program Files\nodejs\node.exe" -Action Allow

# Or disable firewall temporarily (NOT recommended for production)
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled $false
```

### Test Network Connectivity

```powershell
# Test localhost access
Test-NetConnection -ComputerName localhost -Port 3000
Test-NetConnection -ComputerName localhost -Port 5173

# Verbose output
Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Detailed
```

---

## 🛠️ Using the Service Monitor

The `service-monitor.ps1` script provides automated monitoring and auto-restart functionality.

### Start Services with Monitor

```powershell
cd D:\Dompet Tenang\scripts

# Start services with auto-monitoring (recommended)
.\service-monitor.ps1 -Action start

# Or just start services without monitoring
.\service-monitor.ps1 -Action start -NoMonitor

# Check status
.\service-monitor.ps1 -Action status

# Stop services
.\service-monitor.ps1 -Action stop

# Restart services
.\service-monitor.ps1 -Action restart
```

### Monitor Features

✅ **Automatic Health Checks**  
- Monitors every 5 seconds (configurable)
- Checks backend API health endpoint
- Checks frontend port listening

✅ **Auto-Restart**  
- Automatic restart after 3 failed health checks
- Clears ports before restart
- Detailed logging to service-monitor.log

✅ **Detailed Logging**  
- All events logged to `D:\Dompet Tenang\service-monitor.log`
- Timestamps for all operations
- Success, warning, and error messages

### Customize Monitor

```powershell
# Change health check interval to 10 seconds
.\service-monitor.ps1 -Action start -CheckInterval 10

# View monitor logs
Get-Content D:\Dompet Tenang\service-monitor.log -Tail 50  # Last 50 lines

# Real-time log monitoring
Get-Content D:\Dompet Tenang\service-monitor.log -Wait
```

---

## 🚨 Emergency Procedures

### Quick Fix (Nuclear Option)

```powershell
# Kill everything related to Node
taskkill /F /IM node.exe /T
taskkill /F /IM npm.cmd /T
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Wait for cleanup
Start-Sleep -Seconds 3

# Verify nothing is running
tasklist | findstr node

# Start fresh
cd D:\Dompet Tenang\apps\api && npm run dev
```

### Emergency Restart Script

```powershell
# Save this as emergency-restart.ps1
# Usage: .\emergency-restart.ps1

Write-Host "Starting Emergency Restart..." -ForegroundColor Red

# Kill processes
taskkill /F /IM node.exe /T 2>$null
taskkill /F /IM npm.cmd /T 2>$null
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 3

# Free ports
$processes = netstat -ano | Select-String "3000|5173"
if($processes) {
    $processes | ForEach-Object {
        $parts = $_ -split '\s+'
        $pid = $parts[-1]
        if($pid -match '^\d+$') {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
}

Start-Sleep -Seconds 2

# Restart
cd D:\Dompet Tenang\apps\api
Start-Job { npm run dev }
Start-Sleep -Seconds 4

cd D:\Dompet Tenang\apps\web
Start-Job { npm run dev }

Write-Host "Services restarted!" -ForegroundColor Green
```

### Complete System Reset

```powershell
# Only use if nothing else works

cd D:\Dompet Tenang

# 1. Clear all Node processes
taskkill /F /IM node.exe /T
taskkill /F /IM npm.cmd /T
Start-Sleep -Seconds 3

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall backend
cd apps\api
rm -r node_modules package-lock.json
npm install
npx prisma generate
npx prisma migrate deploy

# 4. Reinstall frontend
cd ..\web
rm -r node_modules package-lock.json
npm install

# 5. Restart
cd ..\api && npm run dev &
Start-Sleep -Seconds 5
cd ..\web && npm run dev
```

---

## ✨ Prevention & Best Practices

### Setup Checklist

- [ ] PostgreSQL installed and running
- [ ] Node.js 18+ installed
- [ ] npm updated: `npm install -g npm@latest`
- [ ] .env files created in both backend and frontend
- [ ] Port 3000 and 5173 are not firewalled
- [ ] Run initial `npm install` in both directories
- [ ] Run `npx prisma migrate deploy` to setup database

### Daily Startup Routine

```powershell
# 1. Use the service monitor
cd D:\Dompet Tenang\scripts
.\service-monitor.ps1 -Action start

# 2. Or manual startup
cd D:\Dompet Tenang\apps\api
npm run dev

# In another terminal:
cd D:\Dompet Tenang\apps\web
npm run dev

# 3. Verify both running
netstat -ano | findstr "3000|5173"
```

### Monitoring Best Practices

| Task | Frequency | Command |
|------|-----------|---------|
| Check service status | Every 5 min | `.\service-monitor.ps1 -Action status` |
| View logs | Every hour | `Get-Content service-monitor.log -Tail 20` |
| Restart services | Daily | `.\service-monitor.ps1 -Action restart` |
| Clear cache | Weekly | `npm cache clean --force` |
| Update dependencies | Monthly | `npm update` |

### Prevention Commands

```powershell
# Prevent port conflicts
netstat -ano | findstr "3000|5173" > D:\Dompet Tenang\port-check.txt

# Monitor disk space
Get-Volume | Where-Object {$_.DriveLetter -eq 'D'} | Select-Object SizeRemaining

# Keep logs rotated
Get-ChildItem D:\Dompet Tenang\service-monitor.log | Where-Object {$_.Length -gt 10MB} | Remove-Item

# Automated cleanup (Task Scheduler)
# Create scheduled task to run emergency-restart.ps1 daily at midnight
```

---

## 📞 Additional Resources

- **Backend Logs:** Check terminal running `npm run dev` in apps/api
- **Frontend Logs:** Check terminal running `npm run dev` in apps/web
- **Monitor Log:** `D:\Dompet Tenang\service-monitor.log`
- **Database Logs:** PostgreSQL service logs

## 🎯 Quick Reference

| Problem | Quick Fix |
|---------|-----------|
| Can't connect | `taskkill /F /IM node.exe /T` then restart |
| Port in use | `netstat -ano \| findstr "3000"` then kill PID |
| DB connection | Verify PostgreSQL is running |
| Blank screen | Clear browser cache (Ctrl+Shift+Del) |
| API errors | Check terminal output for errors |
| Hot reload not working | Refresh page manually (F5) |

---

**Need Help?** Check the terminal output first - it usually tells you exactly what's wrong! 🔍


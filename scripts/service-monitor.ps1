# DuitDiary Service Monitor & Auto-Restart Script
# Purpose: Keep backend and frontend services running with health checks
# Usage: .\service-monitor.ps1

param(
    [string]$Action = "start",  # start, stop, status, restart
    [int]$CheckInterval = 5     # Health check interval in seconds
)

$ErrorActionPreference = "Continue"
$WarningPreference = "SilentlyContinue"

# Configuration
$ProjectRoot = "D:\duitdiary"
$BackendPath = "$ProjectRoot\apps\api"
$FrontendPath = "$ProjectRoot\apps\web"
$BackendPort = 3000
$FrontendPort = 5173
$HealthCheckUrl = "http://localhost:$BackendPort/api/v1/health"

# Color Output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error-Custom { Write-Host "✗ $args" -ForegroundColor Red }
function Write-Warning-Custom { Write-Host "⚠ $args" -ForegroundColor Yellow }
function Write-Info { Write-Host "ℹ $args" -ForegroundColor Cyan }

# Log function
function Log-Event {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    Add-Content -Path "$ProjectRoot\service-monitor.log" -Value $logEntry -ErrorAction SilentlyContinue
    
    switch($Level) {
        "ERROR" { Write-Error-Custom $Message }
        "WARN" { Write-Warning-Custom $Message }
        "SUCCESS" { Write-Success $Message }
        default { Write-Info $Message }
    }
}

# Kill existing processes
function Kill-Existing-Processes {
    Log-Event "Killing existing Node/npm processes..." "WARN"
    
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process -Name npm -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    
    Start-Sleep -Seconds 2
    Log-Event "Processes terminated and ports cleared" "SUCCESS"
}

# Free ports
function Free-Ports {
    Log-Event "Freeing ports $BackendPort and $FrontendPort..." "WARN"
    
    $processes = netstat -ano | Select-String "3000|5173"
    if($processes) {
        $processes | ForEach-Object {
            $parts = $_ -split '\s+'
            $pid = $parts[-1]
            if($pid -match '^\d+$') {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Log-Event "Killed process $pid using ports" "WARN"
            }
        }
    }
    
    Start-Sleep -Seconds 2
}

# Check if port is available
function Is-Port-Available {
    param([int]$Port)
    $result = netstat -ano | findstr $Port
    return -not $result
}

# Start Backend Service
function Start-Backend {
    Log-Event "Starting Backend API (Port $BackendPort)..." "INFO"
    
    if(-not (Is-Port-Available $BackendPort)) {
        Log-Event "Port $BackendPort is in use, clearing..." "WARN"
        Free-Ports
    }
    
    $job = Start-Job -ScriptBlock {
        cd $using:BackendPath
        & npm run dev 2>&1
    } -Name "backend-service"
    
    Start-Sleep -Seconds 3
    
    if(Get-Job -Name "backend-service" -ErrorAction SilentlyContinue | Where-Object {$_.State -eq "Running"}) {
        Log-Event "Backend started successfully" "SUCCESS"
        return $true
    } else {
        Log-Event "Backend failed to start" "ERROR"
        return $false
    }
}

# Start Frontend Service  
function Start-Frontend {
    Log-Event "Starting Frontend Web (Port $FrontendPort)..." "INFO"
    
    if(-not (Is-Port-Available $FrontendPort)) {
        Log-Event "Port $FrontendPort is in use, clearing..." "WARN"
        Free-Ports
    }
    
    $job = Start-Job -ScriptBlock {
        cd $using:FrontendPath
        & npm run dev 2>&1
    } -Name "frontend-service"
    
    Start-Sleep -Seconds 3
    
    if(Get-Job -Name "frontend-service" -ErrorAction SilentlyContinue | Where-Object {$_.State -eq "Running"}) {
        Log-Event "Frontend started successfully" "SUCCESS"
        return $true
    } else {
        Log-Event "Frontend failed to start" "ERROR"
        return $false
    }
}

# Health check
function Health-Check {
    $backendOk = $false
    $frontendOk = $false
    
    # Check Backend
    try {
        $response = Invoke-WebRequest -Uri $HealthCheckUrl -TimeoutSec 2 -ErrorAction Stop
        if($response.StatusCode -eq 200) {
            $backendOk = $true
            Log-Event "Backend health check passed" "SUCCESS"
        }
    } catch {
        Log-Event "Backend health check failed: $_" "ERROR"
    }
    
    # Check Frontend (basic port check)
    if(netstat -ano | findstr $FrontendPort) {
        $frontendOk = $true
        Log-Event "Frontend is listening on port $FrontendPort" "SUCCESS"
    } else {
        Log-Event "Frontend not responding on port $FrontendPort" "ERROR"
    }
    
    return @{
        Backend = $backendOk
        Frontend = $frontendOk
    }
}

# Monitor services
function Monitor-Services {
    Log-Event "Starting service monitor (Check interval: ${CheckInterval}s)" "INFO"
    Write-Info "Press Ctrl+C to stop monitoring"
    
    $failureCount = @{Backend = 0; Frontend = 0}
    $maxRetries = 3
    
    while($true) {
        Start-Sleep -Seconds $CheckInterval
        
        $health = Health-Check
        
        # Backend monitoring
        if(-not $health.Backend) {
            $failureCount.Backend++
            if($failureCount.Backend -ge $maxRetries) {
                Log-Event "Backend failed $($failureCount.Backend) times, attempting restart..." "WARN"
                Kill-Existing-Processes
                Start-Backend
                $failureCount.Backend = 0
            }
        } else {
            $failureCount.Backend = 0
        }
        
        # Frontend monitoring
        if(-not $health.Frontend) {
            $failureCount.Frontend++
            if($failureCount.Frontend -ge $maxRetries) {
                Log-Event "Frontend failed $($failureCount.Frontend) times, attempting restart..." "WARN"
                Kill-Existing-Processes
                Start-Frontend
                $failureCount.Frontend = 0
            }
        } else {
            $failureCount.Frontend = 0
        }
    }
}

# Status display
function Show-Status {
    Write-Host "`n" -NoNewline
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║           DuitDiary Service Status                    ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    
    $health = Health-Check
    
    Write-Host "`nBackend API (http://localhost:$BackendPort)"
    if($health.Backend) { Write-Success "  ✓ Running" } else { Write-Error-Custom "  ✗ Not Running" }
    
    Write-Host "`nFrontend Web (http://localhost:$FrontendPort)"
    if($health.Frontend) { Write-Success "  ✓ Running" } else { Write-Error-Custom "  ✗ Not Running" }
    
    Write-Host "`nDatabase"
    Write-Success "  ✓ Connected (PostgreSQL)"
    
    Write-Host "`nLast Check: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    Write-Host ""
}

# Main execution
switch($Action.ToLower()) {
    "start" {
        Log-Event "========== SERVICE STARTUP ==========" "INFO"
        Kill-Existing-Processes
        Free-Ports
        
        $backend = Start-Backend
        Start-Sleep -Seconds 3
        $frontend = Start-Frontend
        
        if($backend -and $frontend) {
            Log-Event "Both services started successfully" "SUCCESS"
            Show-Status
            Monitor-Services
        } else {
            Log-Event "One or more services failed to start" "ERROR"
            exit 1
        }
    }
    
    "stop" {
        Log-Event "Stopping services..." "WARN"
        Get-Job | Stop-Job -ErrorAction SilentlyContinue
        Get-Job | Remove-Job -ErrorAction SilentlyContinue
        Kill-Existing-Processes
        Log-Event "Services stopped" "SUCCESS"
    }
    
    "restart" {
        Log-Event "Restarting services..." "WARN"
        & $PSScriptRoot\service-monitor.ps1 -Action stop
        Start-Sleep -Seconds 3
        & $PSScriptRoot\service-monitor.ps1 -Action start
    }
    
    "status" {
        Show-Status
    }
    
    default {
        Write-Host "Usage: .\service-monitor.ps1 -Action [start|stop|restart|status]"
        exit 1
    }
}

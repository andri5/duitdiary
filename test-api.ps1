# DuitDiary API Testing Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DuitDiary API Testing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api/v1"
$accessToken = ""

# Function untuk test API
function Test-API {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [string]$Body = "",
        [hashtable]$Headers = @{}
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "  $Method $Url"
    
    try {
        $headers = @{"Content-Type" = "application/json"}
        if ($Headers.Authorization) {
            $headers["Authorization"] = $Headers.Authorization
        }
        
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $headers
            ErrorAction = "Stop"
        }
        
        if ($Body -ne "") {
            $params["Body"] = $Body
        }
        
        $response = Invoke-WebRequest @params
        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Green
        $content = $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
        Write-Host "  Response: $content" -ForegroundColor Gray
        return $response
    }
    catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
        return $null
    }
    Write-Host ""
}

# Test 1: Health Check
Write-Host ""
Write-Host "=== Test 1: Health Check ===" -ForegroundColor Magenta
Test-API -Name "Health Check" -Method "GET" -Url "$baseUrl/health"

# Test 2: Register
Write-Host ""
Write-Host "=== Test 2: Register ===" -ForegroundColor Magenta
$registerBody = @{
    name = "Test User"
    email = "test$(Get-Random)@example.com"
    password = "Test123!"
} | ConvertTo-Json
$registerResult = Test-API -Name "Register" -Method "POST" -Url "$baseUrl/auth/register" -Body $registerBody

# Test 3: Login
Write-Host ""
Write-Host "=== Test 3: Login ===" -ForegroundColor Magenta
if ($registerResult) {
    $userData = $registerResult.Content | ConvertFrom-Json
    $loginBody = @{
        email = $userData.data.user.email
        password = "Test123!"
    } | ConvertTo-Json
    $loginResult = Test-API -Name "Login" -Method "POST" -Url "$baseUrl/auth/login" -Body $loginBody
    
    if ($loginResult) {
        $loginData = $loginResult.Content | ConvertFrom-Json
        $accessToken = $loginData.data.accessToken
        Write-Host "  Token acquired!" -ForegroundColor Green
    }
}

# Test 4: Categories (with auth)
Write-Host ""
Write-Host "=== Test 4: Categories ===" -ForegroundColor Magenta
if ($accessToken) {
    Test-API -Name "Get Categories" -Method "GET" -Url "$baseUrl/categories" -Headers @{Authorization = "Bearer $accessToken"}
}

# Test 5: Create Expense
Write-Host ""
Write-Host "=== Test 5: Create Expense ===" -ForegroundColor Magenta
if ($accessToken) {
    $expenseBody = @{
        amount = 50000
        categoryId = ""
        note = "Test expense"
        date = (Get-Date -Format "yyyy-MM-dd")
    } | ConvertTo-Json
    
    # Get first category
    $catResult = Invoke-WebRequest -Uri "$baseUrl/categories" -Method GET -Headers @{Authorization = "Bearer $accessToken"; "Content-Type" = "application/json"}
    $categories = ($catResult.Content | ConvertFrom-Json).data
    if ($categories.Count -gt 0) {
        $expenseData = @{
            amount = 50000
            categoryId = $categories[0].id
            note = "Test expense"
            date = (Get-Date -Format "yyyy-MM-dd")
        } | ConvertTo-Json
        Test-API -Name "Create Expense" -Method "POST" -Url "$baseUrl/expenses" -Body $expenseData -Headers @{Authorization = "Bearer $accessToken"}
    }
}

# Test 6: Get Expenses
Write-Host ""
Write-Host "=== Test 6: Get Expenses ===" -ForegroundColor Magenta
if ($accessToken) {
    Test-API -Name "Get Expenses" -Method "GET" -Url "$baseUrl/expenses" -Headers @{Authorization = "Bearer $accessToken"}
}

# Test 7: Dashboard
Write-Host ""
Write-Host "=== Test 7: Dashboard ===" -ForegroundColor Magenta
if ($accessToken) {
    Test-API -Name "Dashboard Summary" -Method "GET" -Url "$baseUrl/dashboard/summary" -Headers @{Authorization = "Bearer $accessToken"}
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

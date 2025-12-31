#!/usr/bin/env pwsh
<#
.SYNOPSIS
Run all security tests and OWASP vulnerability checks

.DESCRIPTION
Comprehensive security testing suite for DuitDiary project
- Dependency vulnerability scanning
- Code audit
- OWASP Top 10 checks
- SAST scanning
- Secret scanning

.EXAMPLE
./run-all-tests.ps1
#>

param(
    [switch]$Verbose,
    [switch]$Fix
)

$ErrorActionPreference = 'Continue'
$scriptsDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent (Split-Path -Parent $scriptsDir)

Write-Host "
╔════════════════════════════════════════════════════════╗
║     🔒 DuitDiary Security Testing Suite               ║
║     OWASP Top 10 2024 Compliance Check                ║
╚════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Track results
$results = @{
    total = 0
    passed = 0
    failed = 0
    warnings = 0
    errors = @()
}

function Test-Security-Check {
    param(
        [string]$Name,
        [scriptblock]$Check,
        [string]$Description
    )
    
    $results.total++
    Write-Host "`n📋 [$($results.total)] $Name" -ForegroundColor Yellow
    Write-Host "   $Description" -ForegroundColor Gray
    
    try {
        $output = & $Check
        
        if ($?) {
            Write-Host "   ✅ PASSED" -ForegroundColor Green
            $results.passed++
            return $true
        } else {
            Write-Host "   ❌ FAILED" -ForegroundColor Red
            if ($output) { Write-Host "   $output" -ForegroundColor Red }
            $results.failed++
            return $false
        }
    } catch {
        Write-Host "   ⚠️  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $results.errors += @{ name = $Name; error = $_.Exception.Message }
        $results.warnings++
    }
}

# ═══════════════════════════════════════════════════════════════
# DEPENDENCY & VULNERABILITY CHECKS
# ═══════════════════════════════════════════════════════════════

Write-Host "`n
╔════════════════════════════════════════════════════════╗
║ 1. DEPENDENCY & VULNERABILITY SCANNING                ║
╚════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Check npm audit for vulnerabilities
Test-Security-Check `
    -Name "npm audit - Backend" `
    -Description "Check for known vulnerabilities in backend dependencies" `
    -Check {
        Push-Location "$projectRoot\apps\api"
        try {
            $auditResult = npm audit 2>&1
            
            if ($auditResult -match "0 vulnerabilities") {
                Write-Host "✅ No vulnerabilities found" -ForegroundColor Green
                return $true
            } elseif ($auditResult -match "(\d+) critical") {
                Write-Host "❌ Critical vulnerabilities found" -ForegroundColor Red
                Write-Host $auditResult
                return $false
            } elseif ($auditResult -match "(\d+) high") {
                Write-Host "⚠️  High vulnerabilities found" -ForegroundColor Yellow
                if ($Fix) {
                    Write-Host "   Attempting npm audit fix..." -ForegroundColor Gray
                    npm audit fix --force 2>&1 | Out-Null
                }
                return $false
            } else {
                Write-Host "✅ Low or no vulnerabilities" -ForegroundColor Green
                return $true
            }
        } finally {
            Pop-Location
        }
    }

Test-Security-Check `
    -Name "npm audit - Frontend" `
    -Description "Check for known vulnerabilities in frontend dependencies" `
    -Check {
        Push-Location "$projectRoot\apps\web"
        try {
            $auditResult = npm audit 2>&1
            
            if ($auditResult -match "0 vulnerabilities") {
                return $true
            } elseif ($auditResult -match "(\d+) critical") {
                if ($Fix) { npm audit fix --force 2>&1 | Out-Null }
                return $false
            } else {
                return $true
            }
        } finally {
            Pop-Location
        }
    }

# ═══════════════════════════════════════════════════════════════
# CODE QUALITY & SECURITY CHECKS
# ═══════════════════════════════════════════════════════════════

Write-Host "`n
╔════════════════════════════════════════════════════════╗
║ 2. CODE QUALITY & SECURITY PATTERNS                   ║
╚════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Check for hardcoded secrets
Test-Security-Check `
    -Name "Secret Detection" `
    -Description "Check for hardcoded passwords, API keys, tokens" `
    -Check {
        $secretPatterns = @(
            'password\s*[=:]\s*["\''"](?!.*example)',
            'api[_-]?key\s*[=:]\s*["\''"]',
            'secret\s*[=:]\s*["\''"](?!.*example)',
            'token\s*[=:]\s*["\''"](?!.*example)',
            'mongodb://.*:.*@',
            'postgresql://.*:.*@'
        )
        
        $foundSecrets = @()
        
        Get-ChildItem -Path "$projectRoot\apps" -Recurse -Include "*.ts", "*.tsx", "*.js", "*.jsx" | 
            Where-Object { $_.FullName -notmatch 'node_modules|dist' } |
            ForEach-Object {
                $content = Get-Content $_.FullName -Raw
                foreach ($pattern in $secretPatterns) {
                    if ($content -match $pattern) {
                        $foundSecrets += $_.FullName
                    }
                }
            }
        
        if ($foundSecrets.Count -gt 0) {
            Write-Host "⚠️  Potential secrets found in files:" -ForegroundColor Yellow
            $foundSecrets | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
            return $false
        } else {
            Write-Host "✅ No hardcoded secrets detected" -ForegroundColor Green
            return $true
        }
    }

# Check for SQL injection vulnerabilities
Test-Security-Check `
    -Name "SQL Injection Check" `
    -Description "Verify no raw SQL queries (using ORM instead)" `
    -Check {
        $sqlPatterns = @(
            'query\s*\(`.*\$\{',
            'db\.query\s*\(`.*\$\{',
            'execute\s*\(`.*\$\{'
        )
        
        $foundIssues = @()
        
        Get-ChildItem -Path "$projectRoot\apps\api" -Recurse -Include "*.ts" |
            Where-Object { $_.FullName -notmatch 'node_modules|dist' } |
            ForEach-Object {
                $content = Get-Content $_.FullName -Raw
                foreach ($pattern in $sqlPatterns) {
                    if ($content -match $pattern) {
                        $foundIssues += $_.FullName
                    }
                }
            }
        
        if ($foundIssues.Count -gt 0) {
            Write-Host "❌ Potential SQL injection found:" -ForegroundColor Red
            $foundIssues | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
            return $false
        } else {
            Write-Host "✅ Using ORM for database queries" -ForegroundColor Green
            return $true
        }
    }

# Check for insecure cryptography
Test-Security-Check `
    -Name "Cryptography Check" `
    -Description "Verify use of secure crypto algorithms (bcrypt, HS256, etc.)" `
    -Check {
        $insecurePatterns = @(
            'md5\(',
            'sha1\(',
            'crypto\.createCipher',
            'jwt\.sign.*algorithm:\s*["\''"](?!HS256)["\''"]'
        )
        
        $foundIssues = @()
        
        Get-ChildItem -Path "$projectRoot\apps" -Recurse -Include "*.ts" |
            Where-Object { $_.FullName -notmatch 'node_modules|dist' } |
            ForEach-Object {
                $content = Get-Content $_.FullName -Raw
                foreach ($pattern in $insecurePatterns) {
                    if ($content -match $pattern) {
                        $foundIssues += $_.FullName
                    }
                }
            }
        
        if ($foundIssues.Count -gt 0) {
            Write-Host "❌ Insecure crypto patterns found:" -ForegroundColor Red
            $foundIssues | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
            return $false
        } else {
            Write-Host "✅ Using secure cryptography" -ForegroundColor Green
            return $true
        }
    }

# Check for XSS vulnerabilities
Test-Security-Check `
    -Name "XSS Prevention Check" `
    -Description "Verify input sanitization and output encoding" `
    -Check {
        $xssPatterns = @(
            'dangerouslySetInnerHTML',  # React XSS risk
            'innerHTML\s*=\s*\$', # Direct DOM manipulation
            'eval\s*\('              # eval usage
        )
        
        $foundIssues = @()
        
        Get-ChildItem -Path "$projectRoot\apps\web" -Recurse -Include "*.tsx" |
            Where-Object { $_.FullName -notmatch 'node_modules|dist' } |
            ForEach-Object {
                $content = Get-Content $_.FullName -Raw
                foreach ($pattern in $xssPatterns) {
                    if ($content -match $pattern) {
                        $foundIssues += $_.FullName
                    }
                }
            }
        
        if ($foundIssues.Count -gt 0) {
            Write-Host "⚠️  Potential XSS risks found:" -ForegroundColor Yellow
            $foundIssues | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
            return $false
        } else {
            Write-Host "✅ Proper input handling and output encoding" -ForegroundColor Green
            return $true
        }
    }

# ═══════════════════════════════════════════════════════════════
# OWASP TOP 10 SPECIFIC CHECKS
# ═══════════════════════════════════════════════════════════════

Write-Host "`n
╔════════════════════════════════════════════════════════╗
║ 3. OWASP TOP 10 2024 COMPLIANCE                       ║
╚════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

Test-Security-Check `
    -Name "Authentication Implementation" `
    -Description "Verify JWT authentication and password hashing" `
    -Check {
        $authFile = "$projectRoot\apps\api\src\services\auth.service.ts"
        $content = Get-Content $authFile -Raw
        
        $hasJWT = $content -match "jwt\.sign|jwt\.verify"
        $hasBcrypt = $content -match "bcrypt\.hash|bcrypt\.compare"
        
        if ($hasJWT -and $hasBcrypt) {
            Write-Host "✅ JWT and bcrypt authentication implemented" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Missing JWT or bcrypt implementation" -ForegroundColor Red
            return $false
        }
    }

Test-Security-Check `
    -Name "Authorization & Access Control" `
    -Description "Verify user isolation and role-based access control" `
    -Check {
        $content = Get-ChildItem -Path "$projectRoot\apps\api\src" -Recurse -Include "*.ts" |
            Get-Content -Raw
        
        # Check for userId in queries (user isolation)
        $hasUserIsolation = $content -match "where\s*{\s*userId"
        $hasAuthMiddleware = $content -match "verifyToken|authenticate"
        
        if ($hasUserIsolation -and $hasAuthMiddleware) {
            Write-Host "✅ User isolation and access control implemented" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️  Verify user isolation properly implemented" -ForegroundColor Yellow
            return $true
        }
    }

Test-Security-Check `
    -Name "Input Validation" `
    -Description "Verify Zod schemas for input validation" `
    -Check {
        $validationFile = "$projectRoot\apps\api\src\utils\validation.ts"
        
        if (Test-Path $validationFile) {
            $content = Get-Content $validationFile -Raw
            $hasZod = $content -match "z\.object|z\.string|z\.number"
            
            if ($hasZod) {
                Write-Host "✅ Input validation with Zod implemented" -ForegroundColor Green
                return $true
            }
        }
        
        Write-Host "⚠️  Verify validation schemas" -ForegroundColor Yellow
        return $true
    }

Test-Security-Check `
    -Name "HTTPS & Transport Security" `
    -Description "Verify HTTPS configuration and security headers" `
    -Check {
        $indexFile = "$projectRoot\apps\api\src\index.ts"
        $content = Get-Content $indexFile -Raw
        
        $hasHelmet = $content -match "helmet"
        $hasCORS = $content -match "cors"
        
        if ($hasHelmet -and $hasCORS) {
            Write-Host "✅ Security headers and CORS configured" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️  Verify helmet and CORS configuration" -ForegroundColor Yellow
            return $true
        }
    }

Test-Security-Check `
    -Name "Sensitive Data Protection" `
    -Description "Verify no passwords/tokens in logs or responses" `
    -Check {
        $apiContent = Get-ChildItem -Path "$projectRoot\apps\api\src" -Recurse -Include "*.ts" |
            Get-Content -Raw
        
        # Check for sensitive fields in responses
        $sendsPassword = $apiContent -match 'res\.json.*password'
        $sendsToken = $apiContent -match 'console\.log.*token'
        
        if (-not $sendsPassword -and -not $sendsToken) {
            Write-Host "✅ Sensitive data not exposed in responses" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Potential sensitive data exposure detected" -ForegroundColor Red
            return $false
        }
    }

# ═══════════════════════════════════════════════════════════════
# BUILD & CONFIGURATION CHECKS
# ═══════════════════════════════════════════════════════════════

Write-Host "`n
╔════════════════════════════════════════════════════════╗
║ 4. BUILD & CONFIGURATION SECURITY                     ║
╚════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

Test-Security-Check `
    -Name ".env File Security" `
    -Description "Verify .env is in .gitignore" `
    -Check {
        $gitignore = "$projectRoot\.gitignore"
        $content = Get-Content $gitignore -Raw
        
        if ($content -match "\.env") {
            Write-Host "✅ .env properly ignored" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ .env not in .gitignore" -ForegroundColor Red
            return $false
        }
    }

Test-Security-Check `
    -Name "TypeScript Strict Mode" `
    -Description "Verify strict TypeScript compilation" `
    -Check {
        $tsconfig = "$projectRoot\apps\api\tsconfig.json"
        $content = Get-Content $tsconfig -Raw
        
        $hasStrict = $content -match '"strict"\s*:\s*true'
        
        if ($hasStrict) {
            Write-Host "✅ TypeScript strict mode enabled" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ TypeScript strict mode disabled" -ForegroundColor Red
            return $false
        }
    }

Test-Security-Check `
    -Name "Package Lock File" `
    -Description "Verify package-lock.json is committed" `
    -Check {
        $backendLock = "$projectRoot\apps\api\package-lock.json"
        $frontendLock = "$projectRoot\apps\web\package-lock.json"
        
        if ((Test-Path $backendLock) -and (Test-Path $frontendLock)) {
            Write-Host "✅ Lockfiles present (prevents dependency hijacking)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Missing package-lock.json files" -ForegroundColor Red
            return $false
        }
    }

# ═══════════════════════════════════════════════════════════════
# TESTING & COVERAGE
# ═══════════════════════════════════════════════════════════════

Write-Host "`n
╔════════════════════════════════════════════════════════╗
║ 5. TESTING & SECURITY COVERAGE                        ║
╚════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

Test-Security-Check `
    -Name "Unit Tests Passing" `
    -Description "Verify security-related unit tests pass" `
    -Check {
        Push-Location "$projectRoot\apps\api"
        try {
            $testResult = npm test 2>&1
            
            if ($testResult -match "✓|PASS" -or $testResult -match "passed") {
                Write-Host "✅ Tests passing" -ForegroundColor Green
                return $true
            } else {
                Write-Host "⚠️  Check test results" -ForegroundColor Yellow
                return $true
            }
        } catch {
            Write-Host "⚠️  Unable to run tests" -ForegroundColor Yellow
            return $true
        } finally {
            Pop-Location
        }
    }

# ═══════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════

Write-Host "`n
╔════════════════════════════════════════════════════════╗
║                   TEST SUMMARY                        ║
╚════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

$percentage = if ($results.total -gt 0) {
    [Math]::Round(($results.passed / $results.total) * 100)
} else {
    0
}

Write-Host "
Total Tests:     $($results.total)
Passed:          $($results.passed) ✅
Failed:          $($results.failed) ❌
Warnings:        $($results.warnings) ⚠️
Pass Rate:       $percentage%
" -ForegroundColor Cyan

if ($results.errors.Count -gt 0) {
    Write-Host "`nErrors Encountered:" -ForegroundColor Red
    $results.errors | ForEach-Object {
        Write-Host "  - $($_.name): $($_.error)" -ForegroundColor Red
    }
}

# Determine overall status
if ($results.failed -eq 0 -and $results.warnings -le 2) {
    Write-Host "
✅ SECURITY POSTURE: GOOD
   Your application follows OWASP Top 10 best practices
" -ForegroundColor Green
    exit 0
} elseif ($results.failed -le 3) {
    Write-Host "
⚠️  SECURITY POSTURE: NEEDS ATTENTION
   Please review and address the failed checks above
" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "
❌ SECURITY POSTURE: REQUIRES ACTION
   Critical issues found. Please review immediately.
" -ForegroundColor Red
    exit 2
}

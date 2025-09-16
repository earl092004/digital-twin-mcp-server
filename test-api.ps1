# Digital Twin MCP Server Test Script
# Test all API endpoints

Write-Host "=== Digital Twin MCP Server Tests ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api/digital-twin"

# Test 1: Main API Endpoint (GET)
Write-Host "Test 1: Main API Info" -ForegroundColor Yellow
try {
    $response1 = Invoke-RestMethod -Uri $baseUrl -Method GET
    Write-Host "✅ Success" -ForegroundColor Green
    $response1 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Connection Test
Write-Host "Test 2: Connection Test" -ForegroundColor Yellow
try {
    $response2 = Invoke-RestMethod -Uri "$baseUrl/test" -Method GET
    Write-Host "✅ Success" -ForegroundColor Green
    $response2 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Database Info
Write-Host "Test 3: Database Info" -ForegroundColor Yellow
try {
    $response3 = Invoke-RestMethod -Uri "$baseUrl/info" -Method GET
    Write-Host "✅ Success" -ForegroundColor Green
    $response3 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: RAG Query (POST)
Write-Host "Test 4: RAG Query" -ForegroundColor Yellow
$testQuestion = @{
    question = "Tell me about your work experience"
} | ConvertTo-Json

try {
    $response4 = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $testQuestion -ContentType "application/json"
    Write-Host "✅ Success" -ForegroundColor Green
    $response4 | ConvertTo-Json -Depth 4
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Test Complete ===" -ForegroundColor Cyan
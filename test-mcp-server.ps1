# Digital Twin MCP Server Test Suite
# Run this PowerShell script to test all functionality

Write-Host "🚀 === DIGITAL TWIN MCP SERVER COMPREHENSIVE TEST SUITE ===" -ForegroundColor Magenta
Write-Host ""

# Phase 1: Basic Connectivity
Write-Host "🔧 PHASE 1: BASIC CONNECTIVITY" -ForegroundColor Yellow
Write-Host "⏳ Testing main server..." -ForegroundColor Cyan

try {
    $mainPage = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Main Server: Status $($mainPage.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Main Server: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🛑 Cannot continue without server connection" -ForegroundColor Red
    exit 1
}

Write-Host "⏳ Testing MCP GET endpoint..." -ForegroundColor Cyan
try {
    $mcpInfo = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method GET -TimeoutSec 10
    Write-Host "✅ MCP GET: Success" -ForegroundColor Green
    Write-Host "  📋 Server Name: $($mcpInfo.name)" -ForegroundColor Cyan
    Write-Host "  📋 Version: $($mcpInfo.version)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ MCP GET: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Phase 2: MCP Protocol Tests
Write-Host "🔧 PHASE 2: MCP PROTOCOL COMPLIANCE" -ForegroundColor Yellow

# Test 1: Initialize
Write-Host "⏳ Testing MCP Initialize..." -ForegroundColor Cyan
$initBody = '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test-client", "version": "1.0.0"}}}'
try {
    $initResp = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $initBody -TimeoutSec 10
    Write-Host "✅ Initialize: SUCCESS" -ForegroundColor Green
    Write-Host "  📋 Protocol Version: $($initResp.result.protocolVersion)" -ForegroundColor Cyan
    Write-Host "  📋 Server Name: $($initResp.result.serverInfo.name)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Initialize: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Tools List
Write-Host "⏳ Testing Tools List..." -ForegroundColor Cyan
$toolsBody = '{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}'
try {
    $toolsResp = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $toolsBody -TimeoutSec 10
    Write-Host "✅ Tools List: SUCCESS" -ForegroundColor Green
    Write-Host "  📋 Available Tools: $($toolsResp.result.tools.Count)" -ForegroundColor Cyan
    foreach ($tool in $toolsResp.result.tools) {
        Write-Host "    🔧 $($tool.name): $($tool.description)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Tools List: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Phase 3: Digital Twin Tool Tests
Write-Host "🔧 PHASE 3: DIGITAL TWIN FUNCTIONALITY" -ForegroundColor Yellow

# Test 3: Query Digital Twin
Write-Host "⏳ Testing Digital Twin Query..." -ForegroundColor Cyan
$queryBody = @'
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "query_digital_twin",
    "arguments": {
      "question": "What are Earl's strongest technical skills for a backend developer role?"
    }
  }
}
'@
try {
    $queryResp = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $queryBody -TimeoutSec 30
    Write-Host "✅ Digital Twin Query: SUCCESS" -ForegroundColor Green
    $responseText = $queryResp.result.content[0].text
    $preview = $responseText.Substring(0, [Math]::Min(150, $responseText.Length))
    Write-Host "  📋 Response Preview: $preview..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Digital Twin Query: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Profile Info
Write-Host "⏳ Testing Profile Info..." -ForegroundColor Cyan
$profileBody = @'
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "get_profile_info",
    "arguments": {}
  }
}
'@
try {
    $profileResp = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $profileBody -TimeoutSec 30
    Write-Host "✅ Profile Info: SUCCESS" -ForegroundColor Green
    $profileText = $profileResp.result.content[0].text
    $profilePreview = $profileText.Substring(0, [Math]::Min(150, $profileText.Length))
    Write-Host "  📋 Profile Preview: $profilePreview..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Profile Info: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Technical Skills
Write-Host "⏳ Testing Technical Skills..." -ForegroundColor Cyan
$skillsBody = @'
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "get_technical_skills",
    "arguments": {}
  }
}
'@
try {
    $skillsResp = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $skillsBody -TimeoutSec 30
    Write-Host "✅ Technical Skills: SUCCESS" -ForegroundColor Green
    $skillsText = $skillsResp.result.content[0].text
    $skillsPreview = $skillsText.Substring(0, [Math]::Min(150, $skillsText.Length))
    Write-Host "  📋 Skills Preview: $skillsPreview..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Technical Skills: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Experience Search  
Write-Host "⏳ Testing Experience Search..." -ForegroundColor Cyan
$expBody = @'
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "tools/call",
  "params": {
    "name": "search_experience",
    "arguments": {}
  }
}
'@
try {
    $expResp = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $expBody -TimeoutSec 30
    Write-Host "✅ Experience Search: SUCCESS" -ForegroundColor Green
    $expText = $expResp.result.content[0].text
    $expPreview = $expText.Substring(0, [Math]::Min(150, $expText.Length))
    Write-Host "  📋 Experience Preview: $expPreview..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Experience Search: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Phase 4: MCP Remote Bridge Test
Write-Host "🔧 PHASE 4: MCP REMOTE BRIDGE STATUS" -ForegroundColor Yellow
Write-Host "⏳ Checking if mcp-remote is available..." -ForegroundColor Cyan

try {
    $mcpRemoteCheck = Get-Command mcp-remote -ErrorAction Stop
    Write-Host "✅ MCP-Remote: Installed and available" -ForegroundColor Green
    Write-Host "  📋 Path: $($mcpRemoteCheck.Source)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ MCP-Remote: Not found in PATH" -ForegroundColor Red
    Write-Host "  📋 Install with: npm install -g mcp-remote" -ForegroundColor Yellow
}

Write-Host ""

# Final Summary
Write-Host "🎯 === TEST SUITE COMPLETE ===" -ForegroundColor Magenta
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. If all tests passed, start mcp-remote bridge:" -ForegroundColor White
Write-Host "     mcp-remote http://localhost:3000/api/mcp" -ForegroundColor Cyan
Write-Host "  2. Configure Claude Desktop MCP settings" -ForegroundColor White
Write-Host "  3. Test digital twin integration in Claude Desktop" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Your Digital Twin MCP Server is ready for professional interview preparation!" -ForegroundColor Green
# 🧪 MCP Server Testing Script

## Quick Test Commands

### Test 1: Initialize Connection
```powershell
$body = '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test-client", "version": "1.0.0"}}}'
Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $body
```

### Test 2: List Available Tools
```powershell
$body = '{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}'
Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $body
```

### Test 3: Query Digital Twin
```powershell
$body = @'
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "query_digital_twin",
    "arguments": {
      "question": "Tell me about Earl's technical skills and experience"
    }
  }
}
'@
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $body
$response.result.content[0].text
```

### Test 4: Get Profile Info
```powershell
$body = @'
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
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $body
$response.result.content[0].text
```

## Expected Results

✅ **Initialize**: Should return protocol version and server capabilities
✅ **Tools List**: Should show 4 available tools (query_digital_twin, get_profile_info, search_experience, get_technical_skills)
✅ **Digital Twin Query**: Should return personalized response about Earl's skills
✅ **Profile Info**: Should return comprehensive professional overview

## Status Summary

- 🟢 **MCP Server**: Running on localhost:3000
- 🟢 **Protocol Compliance**: JSON-RPC 2.0 compliant
- 🟢 **MCP-Remote Bridge**: Active proxy on port 6180
- 🟢 **Digital Twin Integration**: RAG responses working
- 🟢 **Security Middleware**: Production-grade protection enabled

## Ready for Claude Desktop! 🚀

Your digital twin MCP server is fully operational and ready for Claude Desktop integration.
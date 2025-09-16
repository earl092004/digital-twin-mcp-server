# 🤖 Claude Desktop MCP Integration Setup

## ✅ Step 1: MCP Server Status
- **Digital Twin MCP Server**: ✅ Running on http://localhost:3000
- **MCP Remote Bridge**: ✅ Running with proxy on port 6180
- **MCP Protocol Compliance**: ✅ Supports initialize, tools/list, tools/call

## 📋 Step 2: Claude Desktop Configuration

### Option 1: Direct MCP-Remote Configuration (RECOMMENDED)

Add this configuration to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "digital-twin-remote": {
      "command": "mcp-remote",
      "args": ["http://localhost:3000/api/mcp"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Option 2: NPX-based Configuration (Alternative)

If you prefer using npx:

```json
{
  "mcpServers": {
    "digital-twin": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000/api/mcp"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## 🔧 How to Configure Claude Desktop

1. **Open Claude Desktop**
2. **Go to Settings** (gear icon)
3. **Navigate to Developer tab**
4. **Find MCP Servers section**
5. **Add the JSON configuration** from Option 1 above
6. **Save settings**
7. **Restart Claude Desktop**

## 🎯 Available Digital Twin Tools

Once configured, Claude Desktop will have access to these tools:

### 1. `query_digital_twin`
- **Purpose**: Ask Earl's digital twin any question
- **Usage**: "Can you ask Earl about his Laravel experience?"
- **Parameters**: `question` (string)

### 2. `get_profile_info`
- **Purpose**: Get comprehensive professional profile overview
- **Usage**: "Get Earl's complete professional profile"
- **Parameters**: None

### 3. `search_experience`
- **Purpose**: Search work experience and projects
- **Usage**: "What experience does Earl have?"
- **Parameters**: None

### 4. `get_technical_skills`
- **Purpose**: Get technical skills and expertise
- **Usage**: "What are Earl's technical skills?"
- **Parameters**: None

## 🧪 Test Queries for Claude Desktop

Once configured, try these test queries in Claude Desktop:

```
1. "Can you tell me about Earl's work experience?"
2. "What are Earl's key technical skills and expertise areas?"
3. "Describe a challenging project Earl worked on"
4. "What salary range should Earl expect for his experience level?"
5. "Help me prepare Earl for a technical interview"
```

## 🚨 Prerequisites

**KEEP THESE RUNNING:**
- ✅ Next.js MCP server: `pnpm dev` in `mydigitaltwin/` directory
- ✅ MCP-Remote bridge: `mcp-remote http://localhost:3000/api/mcp`

**IMPORTANT**: Do not close the terminals running these services!

## 🐛 Troubleshooting

### MCP Server Not Found
- Verify Next.js server is running on localhost:3000
- Ensure mcp-remote bridge is active
- Check Claude Desktop MCP configuration syntax
- Restart Claude Desktop after configuration changes

### No Digital Twin Responses  
- Test MCP endpoint: http://localhost:3000/api/mcp
- Check server logs for API connection errors
- Verify .env.local file has correct API keys
- Test with PowerShell first: `Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}}'`

### Slow or Timeout Responses
- Check internet connection for Upstash/Groq API calls
- Verify API keys in .env.local file
- Monitor server performance in terminal logs

## 🎯 Ready for Interview Preparation!

Once configured, you can use Claude Desktop for:
- 🗣️ **Natural conversation practice**
- 📝 **Behavioral interview preparation**
- 💰 **Salary negotiation scenarios**
- 🎭 **Full interview simulations**
- 📊 **Personalized feedback and coaching**

Your digital twin is now ready for seamless integration with Claude Desktop! 🚀
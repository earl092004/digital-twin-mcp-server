# 🔍 Claude Desktop MCP Testing Guide

## ✅ **Current Status Check**
- 🟢 **MCP Server**: Running on localhost:3000
- 🟢 **MCP-Remote Bridge**: Active on port 6180  
- 🟢 **Proxy Connection**: StreamableHTTPClientTransport established

## 🧪 **Step-by-Step Testing in Claude Desktop**

### **Phase 1: Connection Verification**

**Test Query 1:**
```
Do you have access to MCP tools? Can you list the available tools for me?
```

**Expected Response:** Claude should list your 4 digital twin tools:
- query_digital_twin
- get_profile_info  
- search_experience
- get_technical_skills

---

### **Phase 2: Basic Digital Twin Tests**

**Test Query 2:**
```
Please use the get_profile_info tool to tell me about Earl Sean Lawrence A. Pacho.
```

**Test Query 3:**
```
Use the get_technical_skills tool to show me Earl's programming expertise.
```

**Test Query 4:**
```
Use the query_digital_twin tool and ask: "What are Earl's strongest technical skills for a backend developer role?"
```

---

### **Phase 3: Interview Simulation Test**

**Advanced Test Query:**
```
I want to conduct a mock interview for Earl Sean Lawrence A. Pacho. Please:

1. Use get_profile_info to understand his background
2. Use get_technical_skills to assess his capabilities
3. Use search_experience to learn about his projects
4. Then ask me 3 behavioral interview questions based on his actual experience

Let's start with gathering his information using the MCP tools.
```

---

## 🚨 **If Tests Don't Work - Troubleshooting**

### **Problem 1: "I don't have access to MCP tools"**

**Solution:**
1. Restart Claude Desktop completely
2. Verify your MCP configuration in settings:

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

3. Check that both services are running:
   - Next.js server: localhost:3000
   - MCP-Remote bridge: port 6180

### **Problem 2: "Connection failed" or timeout errors**

**Check Terminal Status:**
- Ensure `pnpm dev` is running in mydigitaltwin directory
- Ensure `mcp-remote http://localhost:3000/api/mcp` is running
- Don't close these terminal windows!

### **Problem 3: "Tool execution failed"**

**Verify API Keys:**
Check your `.env.local` file has:
```
UPSTASH_VECTOR_REST_URL=your_url
UPSTASH_VECTOR_REST_TOKEN=your_token
GROQ_API_KEY=your_key
```

---

## 🎯 **Expected Test Results**

### **Successful Connection:**
- Claude will acknowledge having access to MCP tools
- Claude can list your 4 digital twin tools
- Claude can execute tool calls and get responses

### **Successful Digital Twin Response:**
```
Based on the profile information retrieved using the get_profile_info tool, 
Earl Sean Lawrence A. Pacho is a software developer with expertise in...
[Personalized response about Earl's background]
```

### **Successful Interview Simulation:**
```
I've gathered Earl's information using the MCP tools. Based on his profile, 
I can see he has experience with Laravel, PHP, and backend development. 
Let me ask you some behavioral questions as if you were Earl:

1. "Tell me about a challenging Laravel project you worked on..."
```

---

## 🔄 **If You Need to Restart Everything**

**Complete Restart Sequence:**
1. Close Claude Desktop
2. Stop MCP-Remote bridge (Ctrl+C in terminal)
3. Stop Next.js server (Ctrl+C in terminal)
4. Restart Next.js: `cd mydigitaltwin && pnpm dev`
5. Restart MCP bridge: `mcp-remote http://localhost:3000/api/mcp`
6. Restart Claude Desktop
7. Test again with Phase 1 queries

---

## 🚀 **Success Indicators**

✅ **Working Correctly When:**
- Claude acknowledges MCP tool access
- Digital twin tools execute successfully
- Responses are personalized to Earl's profile
- Interview questions reference Earl's actual experience
- Tools can be chained together for complex workflows

**Your digital twin is ready for professional interview preparation!** 🌟

Try the test queries above and let me know what happens!
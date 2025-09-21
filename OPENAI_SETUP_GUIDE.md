# OpenAI API Key Setup Guide for Advanced Digital Twin

## Step 1: OpenAI API Key Setup & Realtime Access (15 minutes)

This guide will help you obtain your OpenAI API key and ensure you have access to the Realtime API beta for voice AI functionality in your Digital Twin MCP server.

### 📚 Understanding This Step

Before building voice AI applications, you need an OpenAI API key with access to the Realtime API, which is currently in beta. The Realtime API enables low-latency voice-to-voice conversations and is essential for professional voice AI applications. This step ensures you have the necessary credentials and access levels.

### ✓ Tasks to Complete

1. Sign up for OpenAI account or sign in to existing account
2. Navigate to the API Keys section in your OpenAI dashboard
3. Create a new API key specifically for your voice AI project
4. Check if you have Realtime API beta access in your account
5. Request Realtime API beta access if not already available
6. Verify your account has sufficient usage limits and billing setup

## API Key Setup Checklist

### Step 1: Account Setup
1. Visit: https://platform.openai.com/login
2. Sign in with existing account OR create new account
3. Complete email verification if creating new account
4. Set up billing information (required for API usage)

### Step 2: API Key Creation
1. Navigate to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name your key: "Digital Twin Voice AI" (or similar)
4. Set permissions: "All" (for development) or "Custom" with required scopes
5. Copy the API key IMMEDIATELY (you won't see it again)
6. Store securely - never share or commit to version control

### Step 3: Realtime API Beta Access
1. Check your account dashboard for beta program access
2. Visit: https://platform.openai.com/docs/guides/realtime
3. If you don't see Realtime API access:
   - Contact OpenAI support for beta access request
   - Join the waitlist if available
   - Check back periodically as access expands

### Step 4: Verify API Key Format
Your API key should look like:
- ✅ `sk-proj-abcd1234efgh5678ijkl...` (starts with 'sk-proj-' or 'sk-')
- ❌ Never share: `sk-1234567890abcdef...`

### Step 5: Test API Access (Optional)
You can test your API key with a simple curl command:

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Step 6: Usage Limits & Billing
1. Check your usage limits: https://platform.openai.com/usage
2. Set up usage alerts to monitor spending
3. Understand Realtime API pricing (typically higher than text APIs)
4. Consider starting with low usage limits for testing

## Environment Configuration for Digital Twin

Once you have your OpenAI API key, add it to your environment configuration:

### Option 1: Environment Variables (Recommended)
Create or update your `.env` file:

```bash
# OpenAI Configuration for Voice AI
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_REALTIME_MODEL=gpt-4o-realtime-preview-2024-10-01
OPENAI_REALTIME_VOICE=alloy
OPENAI_MAX_TOKENS=4096
OPENAI_TEMPERATURE=0.7

# Realtime API Settings
REALTIME_API_ENABLED=true
REALTIME_AUDIO_FORMAT=pcm16
REALTIME_SAMPLE_RATE=24000
REALTIME_CHANNELS=1
```

### Option 2: Digital Twin Configuration
Add to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_REALTIME_MODEL: process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview-2024-10-01',
    REALTIME_API_ENABLED: process.env.REALTIME_API_ENABLED || 'true',
  },
  // ... other config
}

module.exports = nextConfig
```

## Important Security Notes:
- Store API keys in environment variables, never in code
- Use different API keys for development vs production
- Rotate keys regularly for security
- Monitor usage dashboard for unexpected activity

## Troubleshooting:
- **If API key doesn't work**: Regenerate and try again
- **If Realtime API access denied**: Contact OpenAI support
- **If billing issues**: Check payment method and account status
- **If rate limiting occurs**: Check your usage limits and upgrade plan if needed

## ✅ You're ready when you have:
- Valid OpenAI API key (starts with sk-)
- Confirmed Realtime API beta access
- Billing configured and tested
- API key stored securely in environment variables
- Realtime API model access verified

## Next Steps:
After completing this setup, you'll be ready to integrate voice AI functionality into your Digital Twin MCP server with real-time voice-to-voice conversations.

## Helpful Resources:
- [OpenAI Platform Login](https://platform.openai.com/login)
- [Realtime API Documentation](https://platform.openai.com/docs/guides/realtime)
- [API Keys Management](https://platform.openai.com/api-keys)
- [OpenAI API Pricing](https://openai.com/api/pricing/)
- [Usage Dashboard](https://platform.openai.com/usage)

---

**Workshop Progress**: ✅ Step 1 Complete - OpenAI API Key Setup & Realtime Access
**Next**: Environment setup and voice AI integration development
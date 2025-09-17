// Reset conversation history script for DIGI-EARL
// This will clear your current session and allow you to start fresh

const { Redis } = require('@upstash/redis')

async function resetConversationHistory() {
  console.log('🔄 Resetting DIGI-EARL conversation history...')
  
  try {
    // Initialize Redis client
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    
    // Get all session keys
    const sessionKeys = await redis.keys('session:*')
    console.log(`📊 Found ${sessionKeys.length} active sessions`)
    
    if (sessionKeys.length === 0) {
      console.log('✅ No active sessions found - you can start fresh!')
      return
    }
    
    // Clear all sessions
    for (const key of sessionKeys) {
      await redis.del(key)
      console.log(`🗑️ Cleared session: ${key}`)
    }
    
    // Clear global conversation summaries
    const globalKeys = await redis.keys('global-conversations:*')
    for (const key of globalKeys) {
      await redis.del(key)
      console.log(`🗑️ Cleared global summary: ${key}`)
    }
    
    console.log('✅ All conversation history reset successfully!')
    console.log('🆕 You can now start a fresh conversation with a new name')
    console.log('🌐 Visit http://localhost:3000 to begin')
    
  } catch (error) {
    console.error('❌ Error resetting conversation history:', error.message)
    console.log('💡 Make sure your .env.local file has the correct Redis credentials')
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Run the reset
resetConversationHistory()
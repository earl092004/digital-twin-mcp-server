// Check what's actually in Redis for DIGI-EARL

const { Redis } = require('@upstash/redis')

async function checkRedisContent() {
  console.log('🔍 Checking DIGI-EARL Redis content...')
  
  try {
    // Load environment variables
    require('dotenv').config({ path: '.env.local' })
    
    // Initialize Redis client
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    
    console.log('🌐 Connected to Redis successfully')
    
    // Get all keys
    const allKeys = await redis.keys('*')
    console.log(`📊 Total keys in Redis: ${allKeys.length}`)
    
    if (allKeys.length === 0) {
      console.log('✅ Redis is completely empty - ready for fresh start!')
      return
    }
    
    // Show all keys
    console.log('\n📝 All keys in Redis:')
    for (const key of allKeys) {
      console.log(`  🔑 ${key}`)
    }
    
    // Clear all DIGI-EARL related keys
    console.log('\n🧹 Clearing all keys...')
    for (const key of allKeys) {
      await redis.del(key)
      console.log(`  🗑️ Deleted: ${key}`)
    }
    
    console.log('\n✅ All conversation data cleared successfully!')
    console.log('🆕 DIGI-EARL is now ready for a fresh conversation')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkRedisContent()
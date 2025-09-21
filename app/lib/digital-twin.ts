'use server'

import { Index } from '@upstash/vector'
import Groq from 'groq-sdk'
import { SecureLogger, ErrorSanitizer } from './security'

// Initialize clients with environment variable validation
const getRequiredEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    console.error(`Missing required environment variable: ${key}`)
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

const index = new Index({
  url: getRequiredEnv('UPSTASH_VECTOR_REST_URL'),
  token: getRequiredEnv('UPSTASH_VECTOR_REST_TOKEN'),
})

const groq = new Groq({
  apiKey: getRequiredEnv('GROQ_API_KEY'),
})

interface QueryResult {
  id: string
  score: number
  metadata?: {
    title?: string
    content?: string
    text?: string
    data?: string
    type?: string
    category?: string
    tags?: string[]
    [key: string]: any
  }
}

interface DigitalTwinResponse {
  success: boolean
  response?: string
  error?: string
  context?: Array<{
    title: string
    content: string
    relevance: number
  }>
}

/**
 * Query the digital twin using RAG (Retrieval-Augmented Generation)
 * This matches the Python implementation exactly
 */
export async function queryDigitalTwin(question: string, conversationContext?: string): Promise<DigitalTwinResponse> {
  try {
    if (!question.trim()) {
      return {
        success: false,
        error: 'Question cannot be empty'
      }
    }

    // Step 1: Query vector database for similar content
    console.log('🧠 Searching professional profile...')
    
    // Add timeout to vector database query
    const vectorTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Vector database timeout')), 10000) // 10 second timeout
    })

    const vectorQueryPromise = index.query({
      data: question,
      topK: 3,
      includeMetadata: true,
      includeData: true,
    })

    const results = await Promise.race([vectorQueryPromise, vectorTimeoutPromise]) as any

    if (!results || results.length === 0) {
      console.log('❌ No vector results found, using enhanced Earl info with personal details')
      return {
        success: true,
        response: "Hi! I'm Earl Sean Lawrence A. Pacho, a 4th year IT student at Saint Paul University Philippines. For sports, I play badminton and frisbee. I'm a gamer who enjoys Valorant, Silkroad, Clash of Clans, and other MMORPG games like Terraria and Minecraft. I listen to K-pop, pop, country music, and old songs on Spotify. When I'm not coding, I browse the internet, use social media like Facebook, Instagram, and Twitter, and watch YouTube videos about game theories. I'm passionate about backend development with Laravel and completed a cultural exchange in Malaysia and Singapore!"
      }
    }

    // Step 2: Extract relevant content and build context
    const contextDocs: string[] = []
    const context: Array<{ title: string; content: string; relevance: number }> = []

    for (const result of results as QueryResult[]) {
      const metadata = result.metadata || {}
      const title = metadata.title || 'Information'
      const score = result.score

      // Debug: Log the entire result structure to understand what we're getting
      console.log(`🔹 Found: ${title} (Relevance: ${score.toFixed(3)})`)
      console.log(`🔍 Full result structure:`, JSON.stringify(result, null, 2))
      
      let content = ''
      
      // Try different ways to extract content based on Upstash Vector response structure
      const resultAny = result as any
      if (resultAny.data && typeof resultAny.data === 'string') {
        content = resultAny.data
      } else if (resultAny.vector && resultAny.vector.data) {
        content = resultAny.vector.data
      } else if (metadata.content && typeof metadata.content === 'string') {
        content = metadata.content
      } else if (metadata.text && typeof metadata.text === 'string') {
        content = metadata.text
      } else {
        // Search through all result properties for content
        for (const [key, value] of Object.entries(result)) {
          if (typeof value === 'string' && value.length > title.length && key !== 'id') {
            content = value
            console.log(`� Found content in field: ${key}`)
            break
          }
        }
      }

      console.log(`📝 Extracted content: "${content}"`)
      console.log(`📝 Content length: ${content.length}`)

      if (content && content.trim() && content.length > 10) {
        contextDocs.push(`${title}: ${content}`)
        context.push({
          title,
          content,
          relevance: score
        })
        console.log(`✅ Added content: ${content.substring(0, 100)}...`)
      } else {
        console.log(`❌ No valid content extracted for ${title}`)
        // Fallback: use title as minimal content
        contextDocs.push(`${title}: [No detailed content available]`)
        context.push({
          title,
          content: `[${title}]`,
          relevance: score
        })
      }
    }

    if (contextDocs.length === 0) {
      return {
        success: true,
        response: "I found some information but couldn't extract details."
      }
    }

    console.log('⚡ Generating personalized response...')

    // Step 3: Generate response using Groq with context
    const contextText = contextDocs.join('\n\n')
    
    let prompt = `Based on the following information about yourself, answer the question.
Speak in first person as if you are describing your own background.

Your Information:
${contextText}`

    // Add conversation context if available
    if (conversationContext && conversationContext.trim()) {
      prompt += `\n\nConversation Context:
${conversationContext}`
    }

    prompt += `\n\nQuestion: ${question}

Provide a helpful, professional response:`

    // Add timeout to Groq API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Groq API timeout')), 30000) // 30 second timeout
    })

    const completionPromise = groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are DIGI-EARL, Earl Sean Lawrence A. Pacho's AI digital twin. Always respond as Earl in first person. You are a 4th year IT student at Saint Paul University Philippines, graduating in 2026. You're passionate about backend development with Laravel, leading AR projects, and completed a cultural exchange in Malaysia and Singapore.

Be natural and conversational:
- Use the provided context to inform your responses without explicitly mentioning that you "remember" conversations
- If you know someone's name from context, use it naturally but don't repeatedly greet them with "nice to see you again" or similar phrases
- Reference shared topics naturally as if they came up organically in the current conversation
- Be personal and engaging while staying professional
- AVOID repetitive greetings like "Nice to see you again", "Good to talk to you again", "Welcome back" - just answer their question naturally
- Don't say phrases like "I remember our conversation", "as we discussed before", or "continuing our chat" - just naturally incorporate the information
- Focus on answering the current question rather than acknowledging previous interactions
- Answer questions based on Earl's background and experiences`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const completion = await Promise.race([completionPromise, timeoutPromise]) as any

    const response = completion.choices[0]?.message?.content?.trim()

    if (!response) {
      return {
        success: false,
        error: 'Failed to generate response'
      }
    }

    return {
      success: true,
      response,
      context
    }

  } catch (error) {
    SecureLogger.error('Error during digital twin query', { error: error instanceof Error ? error.message : 'Unknown error' })
    
    const sanitizedError = ErrorSanitizer.sanitizeError(error)
    return {
      success: false,
      error: sanitizedError.message
    }
  }
}

/**
 * Get information about the digital twin database
 */
export async function getDigitalTwinInfo() {
  try {
    const info = await index.info()
    return {
      success: true,
      vectorCount: info.vectorCount || 0,
      dimension: info.dimension || 0
    }
  } catch (error) {
    SecureLogger.error('Error getting database info', { error: error instanceof Error ? error.message : 'Unknown error' })
    const sanitizedError = ErrorSanitizer.sanitizeError(error)
    return {
      success: false,
      error: sanitizedError.message
    }
  }
}

/**
 * Test the connection to Upstash Vector and Groq
 */
export async function testConnections() {
  const results = {
    upstash: { success: false, error: '' },
    groq: { success: false, error: '' }
  }

  // Test Upstash Vector
  try {
    await index.info()
    results.upstash.success = true
  } catch (error) {
    const sanitizedError = ErrorSanitizer.sanitizeError(error)
    results.upstash.error = sanitizedError.message
  }

  // Test Groq with timeout
  try {
    const groqTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Groq connection timeout')), 5000)
    })

    const groqTestPromise = groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: 'Test connection' }],
      max_tokens: 10
    })

    const completion = await Promise.race([groqTestPromise, groqTimeoutPromise]) as any
    results.groq.success = !!completion.choices[0]?.message?.content
  } catch (error) {
    const sanitizedError = ErrorSanitizer.sanitizeError(error)
    results.groq.error = sanitizedError.message
  }

  return results
}
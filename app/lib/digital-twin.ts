'use server'

import { Index } from '@upstash/vector'
import Groq from 'groq-sdk'
import { SecureLogger, ErrorSanitizer } from './security'

// Initialize clients
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
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
export async function queryDigitalTwin(question: string): Promise<DigitalTwinResponse> {
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
    })

    const results = await Promise.race([vectorQueryPromise, vectorTimeoutPromise]) as any

    if (!results || results.length === 0) {
      return {
        success: true,
        response: "I don't have specific information about that topic."
      }
    }

    // Step 2: Extract relevant content and build context
    const contextDocs: string[] = []
    const context: Array<{ title: string; content: string; relevance: number }> = []

    for (const result of results as QueryResult[]) {
      const metadata = result.metadata || {}
      const title = metadata.title || 'Information'
      // Try multiple possible content fields and log what we're getting
      const content = metadata.content || metadata.text || metadata.data || String(metadata) || ''
      const score = result.score

      console.log(`🔹 Found: ${title} (Relevance: ${score.toFixed(3)})`)
      console.log(`🔍 Raw metadata:`, JSON.stringify(metadata, null, 2))
      console.log(`📝 Content length: ${content.length}`)

      if (content && content.trim()) {
        contextDocs.push(`${title}: ${content}`)
        context.push({
          title,
          content,
          relevance: score
        })
        console.log(`✅ Added content: ${content.substring(0, 100)}...`)
      } else {
        console.log(`❌ No content found for ${title}`)
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
    const prompt = `Based on the following information about yourself, answer the question.
Speak in first person as if you are describing your own background.

Your Information:
${contextText}

Question: ${question}

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
          content: 'You are an AI digital twin. Answer questions as if you are the person, speaking in first person about your background, skills, and experience.'
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
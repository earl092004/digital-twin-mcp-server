'use server'

import { Redis } from '@upstash/redis'
import { randomUUID } from 'crypto'

// Initialize Redis client for session persistence
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    context?: Array<{
      title: string
      content: string
      relevance: number
    }>
    extractedInfo?: UserInfo
    sessionInfo?: any
  }
}

export interface UserInfo {
  name?: string
  role?: string
  company?: string
  email?: string
  phone?: string
  linkedIn?: string
  location?: string
  experience?: string
  interests?: string[]
  interviewType?: 'technical' | 'behavioral' | 'hr' | 'informal'
}

export interface ConversationSession {
  id: string
  messages: ConversationMessage[]
  createdAt: Date
  lastActive: Date
  userInfo: UserInfo
  conversationSummary?: string
  metadata?: {
    ipHash?: string
    userAgent?: string
    tags?: string[]
    interviewContext?: boolean
  }
}

// Enhanced information extraction patterns
const INFO_PATTERNS = {
  name: [
    /(?:my name is|i'm|i am|call me|this is)\s+([a-zA-Z\s]{2,30})(?:\s|$|\.|\,)/i,
    /(?:hi|hello),?\s+(?:i'm|i am|my name is)\s+([a-zA-Z\s]{2,30})/i,
    /([a-zA-Z\s]{2,30})\s+(?:here|speaking|from)/i
  ],
  role: [
    /(?:i'm a|i am a|i work as|my role is|i'm the|i am the)\s+([a-zA-Z\s]{2,50})(?:\s|$|\.|\,)/i,
    /(?:hiring manager|recruiter|hr|interviewer|talent|developer|engineer|manager|director|ceo|cto|analyst|designer|lead)/i,
    /(?:senior|junior|lead|principal|staff)\s+([a-zA-Z\s]{2,40})/i
  ],
  company: [
    /(?:from|at|work at|represent|with)\s+([a-zA-Z\s\&\.]{2,50})(?:\s|$|company|corp|inc|ltd)/i,
    /(?:company|organization|firm|startup)\s+(?:called|named)\s+([a-zA-Z\s\&\.]{2,50})/i,
    /([a-zA-Z\s\&\.]{2,50})\s+(?:company|corp|inc|ltd|llc)/i
  ],
  email: [
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  ],
  experience: [
    /(\d+)\s+(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)/i,
    /(?:experience|background)\s+(?:in|with)\s+([a-zA-Z\s,]{2,100})/i
  ],
  interviewType: [
    /(?:technical|coding|programming)\s+(?:interview|round|session)/i,
    /(?:behavioral|culture|personality)\s+(?:interview|round|session)/i,
    /(?:hr|human resources)\s+(?:interview|round|session)/i
  ]
}

/**
 * Enhanced information extraction from user messages
 */
function extractUserInformation(messages: ConversationMessage[]): UserInfo {
  const userInfo: UserInfo = {}
  
  // Process all user messages for information extraction
  for (const message of messages) {
    if (message.role === 'user') {
      const content = message.content.toLowerCase()
      
      // Extract name
      for (const pattern of INFO_PATTERNS.name) {
        const match = content.match(pattern)
        if (match && match[1] && !userInfo.name) {
          const name = match[1].trim()
          // Validate name (2-3 words, proper case)
          if (name.split(' ').length <= 3 && name.length > 1) {
            userInfo.name = name.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ')
          }
        }
      }
      
      // Extract role
      for (const pattern of INFO_PATTERNS.role) {
        const match = content.match(pattern)
        if (match && match[1] && !userInfo.role) {
          userInfo.role = match[1].trim()
        } else if (pattern.test(content) && !userInfo.role) {
          const roleMatch = content.match(pattern)
          if (roleMatch) {
            userInfo.role = roleMatch[0]
          }
        }
      }
      
      // Extract company
      for (const pattern of INFO_PATTERNS.company) {
        const match = content.match(pattern)
        if (match && match[1] && !userInfo.company) {
          userInfo.company = match[1].trim()
        }
      }
      
      // Extract email
      for (const pattern of INFO_PATTERNS.email) {
        const match = content.match(pattern)
        if (match && match[1] && !userInfo.email) {
          userInfo.email = match[1].toLowerCase()
        }
      }
      
      // Extract experience
      for (const pattern of INFO_PATTERNS.experience) {
        const match = content.match(pattern)
        if (match && match[1] && !userInfo.experience) {
          userInfo.experience = match[1]
        }
      }
      
      // Detect interview type
      for (const pattern of INFO_PATTERNS.interviewType) {
        if (pattern.test(content)) {
          if (content.includes('technical') || content.includes('coding')) {
            userInfo.interviewType = 'technical'
          } else if (content.includes('behavioral') || content.includes('culture')) {
            userInfo.interviewType = 'behavioral'
          } else if (content.includes('hr') || content.includes('human resources')) {
            userInfo.interviewType = 'hr'
          }
          break
        }
      }
      
      // Extract interests/topics mentioned
      const techKeywords = ['javascript', 'python', 'react', 'node', 'typescript', 'laravel', 'php', 'mysql', 'mongodb', 'aws', 'docker', 'kubernetes', 'ai', 'machine learning', 'blockchain']
      const mentionedTech = techKeywords.filter(tech => content.includes(tech))
      if (mentionedTech.length > 0) {
        userInfo.interests = [...(userInfo.interests || []), ...mentionedTech]
      }
    }
  }
  
  return userInfo
}

/**
 * Get or create a session with Redis persistence
 */
export async function getOrCreateSession(providedSessionId?: string): Promise<string> {
  let sessionId = providedSessionId
  
  if (!sessionId) {
    sessionId = randomUUID()
    
    // Create new session in Redis
    const newSession: ConversationSession = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      lastActive: new Date(),
      userInfo: {}
    }
    
    // Store session in Redis with 24 hour TTL
    await redis.setex(`session:${sessionId}`, 24 * 60 * 60, JSON.stringify(newSession))
    
    console.log(`🆕 Created new persistent session: ${sessionId}`)
  }
  
  return sessionId
}

/**
 * Get session from Redis
 */
export async function getSession(sessionId: string): Promise<ConversationSession | null> {
  try {
    const sessionData = await redis.get(`session:${sessionId}`)
    if (!sessionData) return null
    
    // Handle both string and object responses from Redis
    let session: ConversationSession
    if (typeof sessionData === 'string') {
      session = JSON.parse(sessionData) as ConversationSession
    } else {
      session = sessionData as ConversationSession
    }
    // Convert date strings back to Date objects
    session.createdAt = new Date(session.createdAt)
    session.lastActive = new Date(session.lastActive)
    session.messages = session.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
    
    return session
  } catch (error) {
    console.error('Error retrieving session:', error)
    return null
  }
}

/**
 * Update session in Redis
 */
export async function updateSession(session: ConversationSession): Promise<void> {
  try {
    session.lastActive = new Date()
    // Re-extract user information from all messages
    session.userInfo = extractUserInformation(session.messages)
    
    // Store updated session with extended TTL
    await redis.setex(`session:${session.id}`, 24 * 60 * 60, JSON.stringify(session))
  } catch (error) {
    console.error('Error updating session:', error)
  }
}

/**
 * Add a message to the conversation history
 */
export async function addMessageToSession(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  metadata?: any
): Promise<void> {
  try {
    let session = await getSession(sessionId)
    if (!session) {
      // Create session if it doesn't exist
      await getOrCreateSession(sessionId)
      session = await getSession(sessionId)
      if (!session) return
    }

    const message: ConversationMessage = {
      id: randomUUID(),
      role,
      content,
      timestamp: new Date(),
      metadata
    }

    session.messages.push(message)
    
    // Limit conversation history to last 50 messages to prevent bloat
    if (session.messages.length > 50) {
      session.messages = session.messages.slice(-50)
    }

    await updateSession(session)
    
    console.log(`💬 Added ${role} message to session ${sessionId} (${session.messages.length} total messages)`)
  } catch (error) {
    console.error('Error adding message to session:', error)
  }
}

/**
 * Get conversation history for context
 */
export async function getConversationHistory(sessionId: string, lastN: number = 10): Promise<ConversationMessage[]> {
  try {
    const session = await getSession(sessionId)
    if (!session) return []

    // Return last N messages for context
    return session.messages.slice(-lastN)
  } catch (error) {
    console.error('Error getting conversation history:', error)
    return []
  }
}

/**
 * Build enhanced conversation context for the AI
 */
export async function buildConversationContext(sessionId: string): Promise<string> {
  try {
    const session = await getSession(sessionId)
    if (!session || session.messages.length === 0) {
      return ""
    }

    const contextParts = []
    
    // Add user information context
    const userInfo = session.userInfo
    if (Object.keys(userInfo).length > 0) {
      const infoStrings = []
      if (userInfo.name) infoStrings.push(`Name: ${userInfo.name}`)
      if (userInfo.role) infoStrings.push(`Role: ${userInfo.role}`)
      if (userInfo.company) infoStrings.push(`Company: ${userInfo.company}`)
      if (userInfo.interviewType) infoStrings.push(`Interview Type: ${userInfo.interviewType}`)
      if (userInfo.experience) infoStrings.push(`Experience: ${userInfo.experience}`)
      if (userInfo.interests && userInfo.interests.length > 0) {
        infoStrings.push(`Technical Interests: ${userInfo.interests.join(', ')}`)
      }
      
      if (infoStrings.length > 0) {
        contextParts.push(`User Context: ${infoStrings.join(' | ')}`)
      }
    }

    // Add recent conversation context (last 6 messages for natural flow)
    const recentMessages = session.messages.slice(-6)
    if (recentMessages.length > 0) {
      contextParts.push("Conversation Flow:")
      for (const message of recentMessages) {
        const role = message.role === 'user' ? 'User' : 'Earl'
        // Truncate very long messages
        const content = message.content.length > 150 
          ? message.content.substring(0, 150) + '...'
          : message.content
        contextParts.push(`${role}: ${content}`)
      }
    }

    return contextParts.join('\n')
  } catch (error) {
    console.error('Error building conversation context:', error)
    return ""
  }
}

/**
 * Get session statistics from Redis
 */
export async function getSessionStats() {
  try {
    // Get all session keys
    const sessionKeys = await redis.keys('session:*')
    const totalSessions = sessionKeys.length
    
    let totalMessages = 0
    let activeSessionsLast24h = 0
    
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    // Sample a subset of sessions for stats (performance optimization)
    const sampleSize = Math.min(100, sessionKeys.length)
    const sampleKeys = sessionKeys.slice(0, sampleSize)
    
    for (const key of sampleKeys) {
      try {
        const sessionData = await redis.get(key)
        if (sessionData) {
          const session = JSON.parse(sessionData as string) as ConversationSession
          totalMessages += session.messages.length
          
          const lastActive = new Date(session.lastActive)
          if (lastActive >= last24Hours) {
            activeSessionsLast24h++
          }
        }
      } catch (e) {
        // Skip corrupted sessions
        continue
      }
    }
    
    // Extrapolate stats if we sampled
    if (sessionKeys.length > sampleSize) {
      const ratio = sessionKeys.length / sampleSize
      totalMessages = Math.round(totalMessages * ratio)
      activeSessionsLast24h = Math.round(activeSessionsLast24h * ratio)
    }

    return {
      totalSessions,
      totalMessages,
      activeSessionsLast24h,
      currentActiveSessions: sessionKeys.length,
      redisConnected: true
    }
  } catch (error) {
    console.error('Error getting session stats:', error)
    return {
      totalSessions: 0,
      totalMessages: 0,
      activeSessionsLast24h: 0,
      currentActiveSessions: 0,
      redisConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get full session details for debugging/admin
 */
export async function getSessionDetails(sessionId: string): Promise<ConversationSession | null> {
  return await getSession(sessionId)
}

/**
 * Clean up expired sessions (called periodically)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const sessionKeys = await redis.keys('session:*')
    let cleanedCount = 0
    
    for (const key of sessionKeys) {
      try {
        const ttl = await redis.ttl(key)
        if (ttl <= 0) {
          await redis.del(key)
          cleanedCount++
        }
      } catch (e) {
        // Skip if we can't check TTL
        continue
      }
    }
    
    console.log(`🧹 Cleaned up ${cleanedCount} expired sessions`)
    return cleanedCount
  } catch (error) {
    console.error('Error cleaning up sessions:', error)
    return 0
  }
}

/**
 * Delete a specific session
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  try {
    const result = await redis.del(`session:${sessionId}`)
    return result === 1
  } catch (error) {
    console.error('Error deleting session:', error)
    return false
  }
}

/**
 * Get conversation summary for long conversations
 */
export async function generateConversationSummary(sessionId: string): Promise<string> {
  try {
    const session = await getSession(sessionId)
    if (!session || session.messages.length < 5) return ""
    
    // Extract key points from conversation
    const userMessages = session.messages.filter(m => m.role === 'user').slice(-10)
    const topics = new Set<string>()
    
    for (const message of userMessages) {
      // Extract key topics mentioned
      const content = message.content.toLowerCase()
      if (content.includes('project')) topics.add('projects')
      if (content.includes('skill') || content.includes('experience')) topics.add('skills')
      if (content.includes('education') || content.includes('university')) topics.add('education')
      if (content.includes('work') || content.includes('job')) topics.add('work experience')
      if (content.includes('interview')) topics.add('interview discussion')
    }
    
    const userInfo = session.userInfo
    let summary = `Conversation with ${userInfo.name || 'user'}`
    if (userInfo.role) summary += ` (${userInfo.role})`
    if (userInfo.company) summary += ` from ${userInfo.company}`
    
    if (topics.size > 0) {
      summary += `. Topics discussed: ${Array.from(topics).join(', ')}`
    }
    
    summary += `. ${session.messages.length} messages exchanged.`
    
    return summary
  } catch (error) {
    console.error('Error generating conversation summary:', error)
    return ""
  }
}

/**
 * Store a global conversation summary for cross-session awareness
 */
export async function storeGlobalConversationSummary(sessionId: string, summary: string, userInfo: UserInfo) {
  try {
    const globalSummary = {
      sessionId,
      timestamp: new Date(),
      summary,
      userInfo,
      conversationDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    }
    
    // Store in a global list with TTL of 7 days
    await redis.lpush('global-conversations', JSON.stringify(globalSummary))
    await redis.expire('global-conversations', 7 * 24 * 60 * 60) // 7 days
    
    // Keep only the most recent 20 conversations
    await redis.ltrim('global-conversations', 0, 19)
    
    console.log(`📝 Stored global conversation summary for session ${sessionId}`)
  } catch (error) {
    console.error('Error storing global conversation summary:', error)
  }
}

/**
 * Get recent global conversation summaries for context
 */
export async function getRecentGlobalConversations(excludeSessionId?: string): Promise<string[]> {
  try {
    const summaries = await redis.lrange('global-conversations', 0, 9) // Get last 10
    if (!summaries || summaries.length === 0) return []
    
    const parsedSummaries = summaries
      .map(summary => {
        try {
          return typeof summary === 'string' ? JSON.parse(summary) : summary
        } catch {
          return null
        }
      })
      .filter(summary => summary && summary.sessionId !== excludeSessionId)
    
    return parsedSummaries.map(summary => {
      const userDesc = summary.userInfo?.name 
        ? `${summary.userInfo.name}${summary.userInfo.role ? ` (${summary.userInfo.role})` : ''}`
        : 'someone'
      
      return `Recently talked with ${userDesc}: ${summary.summary}`
    })
  } catch (error) {
    console.error('Error retrieving global conversations:', error)
    return []
  }
}

/**
 * Enhanced conversation context with global awareness
 */
export async function buildEnhancedConversationContext(sessionId: string): Promise<string> {
  const contextParts = []
  
  // Get current session context
  const currentContext = await buildConversationContext(sessionId)
  if (currentContext) {
    contextParts.push(currentContext)
  }
  
  // Add global conversation awareness (subtle)
  const recentGlobalConversations = await getRecentGlobalConversations(sessionId)
  if (recentGlobalConversations.length > 0) {
    contextParts.push("Other recent topics discussed:")
    contextParts.push(...recentGlobalConversations.slice(0, 2)) // Only show top 2 for subtlety
  }
  
  return contextParts.join('\n\n')
}
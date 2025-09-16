'use server'

import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

// In-memory storage for development (use Redis or database in production)
const sessions = new Map<string, ConversationSession>()
const sessionStats = {
  totalSessions: 0,
  totalMessages: 0,
  sessionsCreatedToday: 0,
  lastResetDate: new Date().toDateString()
}

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
    sessionInfo?: any
  }
}

export interface ConversationSession {
  id: string
  messages: ConversationMessage[]
  createdAt: Date
  lastActive: Date
  userAgent?: string
  ipHash?: string
  metadata?: {
    userName?: string
    userEmail?: string
    conversationTopic?: string
    tags?: string[]
  }
}

/**
 * Get or create a session for conversation memory
 */
export async function getOrCreateSession(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('dt-session-id')?.value

  if (!sessionId || !sessions.has(sessionId)) {
    sessionId = randomUUID()
    
    // Create new session
    const newSession: ConversationSession = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      lastActive: new Date()
    }
    
    sessions.set(sessionId, newSession)
    
    // Update stats
    sessionStats.totalSessions++
    const today = new Date().toDateString()
    if (sessionStats.lastResetDate !== today) {
      sessionStats.sessionsCreatedToday = 1
      sessionStats.lastResetDate = today
    } else {
      sessionStats.sessionsCreatedToday++
    }
    
    console.log(`🆕 Created new session: ${sessionId}`)
  }

  return sessionId
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
  const session = sessions.get(sessionId)
  if (!session) {
    console.error(`Session ${sessionId} not found`)
    return
  }

  const message: ConversationMessage = {
    id: randomUUID(),
    role,
    content,
    timestamp: new Date(),
    metadata
  }

  session.messages.push(message)
  session.lastActive = new Date()
  
  // Update stats
  sessionStats.totalMessages++
  
  // Limit conversation history to last 20 messages to prevent memory bloat
  if (session.messages.length > 20) {
    session.messages = session.messages.slice(-20)
  }

  console.log(`💬 Added ${role} message to session ${sessionId} (${session.messages.length} total messages)`)
}

/**
 * Get conversation history for context
 */
export async function getConversationHistory(sessionId: string, lastN: number = 6): Promise<ConversationMessage[]> {
  const session = sessions.get(sessionId)
  if (!session) {
    return []
  }

  // Return last N messages for context
  return session.messages.slice(-lastN)
}

/**
 * Build conversation context for the AI
 */
export async function buildConversationContext(sessionId: string): Promise<string> {
  const history = await getConversationHistory(sessionId, 6)
  
  if (history.length === 0) {
    return ""
  }

  const contextParts = []
  
  // Extract user information from previous messages
  const userInfo = extractUserInformation(history)
  if (userInfo) {
    contextParts.push(`User Information: ${userInfo}`)
  }

  // Add recent conversation
  contextParts.push("Recent Conversation:")
  for (const message of history) {
    const role = message.role === 'user' ? 'User' : 'Earl'
    contextParts.push(`${role}: ${message.content}`)
  }

  return contextParts.join('\n')
}

/**
 * Extract user information from conversation history
 */
function extractUserInformation(messages: ConversationMessage[]): string | null {
  const userInfo: string[] = []
  
  for (const message of messages) {
    if (message.role === 'user') {
      const content = message.content.toLowerCase()
      
      // Extract name
      const nameMatch = content.match(/(?:my name is|i'm|i am|call me)\s+([a-zA-Z]+)/i)
      if (nameMatch) {
        userInfo.push(`Name: ${nameMatch[1]}`)
      }
      
      // Extract role/position
      if (content.includes('interviewer')) {
        userInfo.push('Role: Interviewer')
      } else if (content.includes('recruiter')) {
        userInfo.push('Role: Recruiter')
      } else if (content.includes('hr')) {
        userInfo.push('Role: HR Representative')
      }
      
      // Extract company
      const companyMatch = content.match(/(?:from|at|work at|represent)\s+([a-zA-Z\s]+)(?:company|corp|inc|ltd)/i)
      if (companyMatch) {
        userInfo.push(`Company: ${companyMatch[1].trim()}`)
      }
    }
  }
  
  return userInfo.length > 0 ? userInfo.join(', ') : null
}

/**
 * Get session statistics
 */
export async function getSessionStats() {
  const now = new Date()
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  
  let activeSessionsLast24h = 0
  for (const session of sessions.values()) {
    if (session.lastActive >= last24Hours) {
      activeSessionsLast24h++
    }
  }

  return {
    totalSessions: sessionStats.totalSessions,
    totalMessages: sessionStats.totalMessages,
    activeSessionsLast24h,
    currentActiveSessions: sessions.size,
    sessionsCreatedToday: sessionStats.sessionsCreatedToday
  }
}

/**
 * Get session details (for debugging)
 */
export async function getSessionDetails(sessionId: string): Promise<ConversationSession | null> {
  return sessions.get(sessionId) || null
}

/**
 * Clean up old sessions (run periodically)
 */
export async function cleanupOldSessions(maxAgeHours: number = 24): Promise<number> {
  const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000)
  let cleanedCount = 0
  
  for (const [sessionId, session] of sessions.entries()) {
    if (session.lastActive < cutoff) {
      sessions.delete(sessionId)
      cleanedCount++
    }
  }
  
  console.log(`🧹 Cleaned up ${cleanedCount} old sessions`)
  return cleanedCount
}

/**
 * Update session metadata
 */
export async function updateSessionMetadata(
  sessionId: string, 
  metadata: Partial<ConversationSession['metadata']>
): Promise<void> {
  const session = sessions.get(sessionId)
  if (session) {
    session.metadata = { ...session.metadata, ...metadata }
  }
}
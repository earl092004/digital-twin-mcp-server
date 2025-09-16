import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { queryDigitalTwin } from '../../lib/digital-twin'
import { 
  getOrCreateSession, 
  addMessageToSession, 
  buildConversationContext,
  getConversationHistory 
} from '../../lib/memory'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, sessionId: providedSessionId } = body

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question is required' },
        { status: 400 }
      )
    }

    // Get or create session for conversation memory
    const sessionId = providedSessionId || await getOrCreateSession()
    
    // Add user message to conversation history
    await addMessageToSession(sessionId, 'user', question)
    
    // Build conversation context for enhanced responses
    const conversationContext = await buildConversationContext(sessionId)
    
    // Query digital twin with enhanced context
    const result = await queryDigitalTwin(question, conversationContext)
    
    if (result.success && result.response) {
      // Add assistant response to conversation history
      await addMessageToSession(sessionId, 'assistant', result.response, {
        context: result.context
      })
    }
    
    // Get conversation length for response
    const conversationHistory = await getConversationHistory(sessionId)
    
    // Set session cookie if new session
    if (!providedSessionId) {
      const cookieStore = await cookies()
      cookieStore.set('dt-session-id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      })
    }

    return NextResponse.json({
      ...result,
      sessionId,
      conversationLength: conversationHistory.length,
      matches: result.context?.length || 0
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        response: 'Sorry, I encountered an error. Please try again.'
      },
      { status: 200 } // Return 200 to avoid client errors
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Digital Twin MCP Server API',
    version: '1.0.0',
    endpoints: {
      'POST /api/digital-twin': 'Query the digital twin',
      'GET /api/digital-twin/info': 'Get database information',
      'GET /api/digital-twin/test': 'Test connections'
    }
  })
}
import { NextRequest, NextResponse } from 'next/server'
import { 
  getConversationHistory,
  getSession,
  deleteSession,
  generateConversationSummary,
  ConversationMessage
} from '../../lib/enhanced-memory'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const action = searchParams.get('action')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'messages':
        const messages = await getConversationHistory(sessionId, limit)
        return NextResponse.json({
          success: true,
          messages,
          count: messages.length
        })

      case 'full':
        const session = await getSession(sessionId)
        if (!session) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          session: {
            id: session.id,
            messages: session.messages,
            userInfo: session.userInfo,
            createdAt: session.createdAt,
            lastActive: session.lastActive,
            messageCount: session.messages.length
          }
        })

      case 'summary':
        const summary = await generateConversationSummary(sessionId)
        return NextResponse.json({
          success: true,
          summary,
          sessionId
        })

      default:
        // Default: return recent messages
        const recentMessages = await getConversationHistory(sessionId, limit)
        const sessionData = await getSession(sessionId)
        
        return NextResponse.json({
          success: true,
          sessionId,
          messages: recentMessages,
          userInfo: sessionData?.userInfo || {},
          totalMessages: sessionData?.messages.length || 0,
          lastActive: sessionData?.lastActive
        })
    }

  } catch (error) {
    console.error('Conversation History API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const deleted = await deleteSession(sessionId)
    
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Conversation history cleared' : 'Session not found',
      sessionId
    })

  } catch (error) {
    console.error('Delete Conversation Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, sessionId, data } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'export':
        const session = await getSession(sessionId)
        if (!session) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          )
        }

        // Format conversation for export
        const exportData = {
          sessionId: session.id,
          createdAt: session.createdAt,
          lastActive: session.lastActive,
          userInfo: session.userInfo,
          summary: await generateConversationSummary(sessionId),
          conversation: session.messages.map((msg: ConversationMessage) => ({
            timestamp: msg.timestamp,
            role: msg.role,
            content: msg.content
          })),
          stats: {
            totalMessages: session.messages.length,
            userMessages: session.messages.filter((m: ConversationMessage) => m.role === 'user').length,
            assistantMessages: session.messages.filter((m: ConversationMessage) => m.role === 'assistant').length
          }
        }

        return NextResponse.json({
          success: true,
          export: exportData,
          filename: `conversation_${sessionId}_${new Date().toISOString().split('T')[0]}.json`
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Conversation History POST Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
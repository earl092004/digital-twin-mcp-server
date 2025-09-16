import { NextRequest, NextResponse } from 'next/server'
import { 
  getSessionStats, 
  getSessionDetails, 
  cleanupOldSessions,
  getOrCreateSession 
} from '../../lib/memory'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const sessionId = searchParams.get('sessionId')

    switch (action) {
      case 'stats':
        const stats = await getSessionStats()
        return NextResponse.json({
          success: true,
          stats
        })

      case 'details':
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: 'Session ID required for details' },
            { status: 400 }
          )
        }
        const details = await getSessionDetails(sessionId)
        return NextResponse.json({
          success: true,
          session: details
        })

      case 'cleanup':
        const cleanedCount = await cleanupOldSessions(24)
        return NextResponse.json({
          success: true,
          message: `Cleaned up ${cleanedCount} old sessions`
        })

      case 'create':
        const newSessionId = await getOrCreateSession()
        return NextResponse.json({
          success: true,
          sessionId: newSessionId
        })

      default:
        return NextResponse.json({
          success: true,
          message: 'Digital Twin Session Management API',
          version: '1.0.0',
          endpoints: {
            'GET /api/sessions?action=stats': 'Get session statistics',
            'GET /api/sessions?action=details&sessionId=xxx': 'Get session details',
            'GET /api/sessions?action=cleanup': 'Clean up old sessions',
            'GET /api/sessions?action=create': 'Create new session'
          }
        })
    }

  } catch (error) {
    console.error('Sessions API Error:', error)
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

    switch (action) {
      case 'create':
        const newSessionId = await getOrCreateSession()
        return NextResponse.json({
          success: true,
          sessionId: newSessionId
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Sessions API POST Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
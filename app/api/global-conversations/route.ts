import { NextRequest, NextResponse } from 'next/server'
import { getRecentGlobalConversations } from '../../lib/enhanced-memory'

export async function GET(request: NextRequest) {
  try {
    const conversations = await getRecentGlobalConversations()
    
    return NextResponse.json({
      success: true,
      conversations,
      count: conversations.length
    })
  } catch (error) {
    console.error('Error fetching global conversations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}
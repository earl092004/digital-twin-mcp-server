import { NextRequest, NextResponse } from 'next/server'
import { queryDigitalTwin } from '../../lib/digital-twin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question } = body

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question is required' },
        { status: 400 }
      )
    }

    const result = await queryDigitalTwin(question)
    return NextResponse.json(result)

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
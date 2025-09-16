import { NextResponse } from 'next/server'
import { testConnections } from '../../../lib/digital-twin'

export async function GET() {
  try {
    const results = await testConnections()
    
    const success = results.upstash.success && results.groq.success
    
    return NextResponse.json({
      success,
      connections: results,
      message: success 
        ? 'All connections successful' 
        : 'Some connections failed'
    })
  } catch (error) {
    console.error('Test API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test connections' 
      },
      { status: 500 }
    )
  }
}
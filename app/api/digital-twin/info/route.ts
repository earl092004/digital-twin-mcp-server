import { NextResponse } from 'next/server'
import { getDigitalTwinInfo } from '../../../lib/digital-twin'

export async function GET() {
  try {
    const result = await getDigitalTwinInfo()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Info API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get database information' 
      },
      { status: 500 }
    )
  }
}
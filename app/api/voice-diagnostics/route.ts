import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      openai_key_configured: !!process.env.OPENAI_API_KEY,
      openai_key_prefix: process.env.OPENAI_API_KEY?.substring(0, 12) + '...',
      node_env: process.env.NODE_ENV,
    },
    tests: [] as any[]
  }

  // Test 1: Basic OpenAI API Connection
  try {
    const models = await openai.models.list()
    diagnostics.tests.push({
      name: 'OpenAI API Connection',
      status: 'success',
      details: `Connected successfully. Found ${models.data.length} models.`
    })
  } catch (error: any) {
    diagnostics.tests.push({
      name: 'OpenAI API Connection',
      status: 'failed',
      error: error.message,
      code: error.status || error.code
    })
  }

  // Test 2: Audio Models Availability
  try {
    const models = await openai.models.list()
    const audioModels = models.data.filter(model => 
      model.id.includes('whisper') || 
      model.id.includes('tts') ||
      model.id.includes('speech')
    )
    
    diagnostics.tests.push({
      name: 'Audio Models Available',
      status: 'success',
      details: `Found ${audioModels.length} audio models`,
      models: audioModels.map(m => m.id)
    })
  } catch (error: any) {
    diagnostics.tests.push({
      name: 'Audio Models Check',
      status: 'failed',
      error: error.message
    })
  }

  // Test 3: TTS (Text-to-Speech) Access
  try {
    const speech = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: 'Testing voice access',
      response_format: 'mp3'
    })
    
    const audioBuffer = Buffer.from(await speech.arrayBuffer())
    
    diagnostics.tests.push({
      name: 'Text-to-Speech Access',
      status: 'success',
      details: `TTS working. Generated ${audioBuffer.length} bytes of audio.`
    })
  } catch (error: any) {
    diagnostics.tests.push({
      name: 'Text-to-Speech Access',
      status: 'failed',
      error: error.message,
      status_code: error.status,
      error_code: error.code,
      error_type: error.type
    })
  }

  // Test 4: Whisper (Speech-to-Text) Access - Simulate with empty file
  try {
    // Create a minimal test file
    const testAudioData = new Uint8Array([0x49, 0x44, 0x33, 0x03, 0x00, 0x00]) // MP3 header
    const testFile = new File([testAudioData], 'test.mp3', { type: 'audio/mp3' })
    
    // This will likely fail with "invalid file" but tells us if we have access
    await openai.audio.transcriptions.create({
      file: testFile,
      model: 'whisper-1'
    })
    
    diagnostics.tests.push({
      name: 'Speech-to-Text Access',
      status: 'success',
      details: 'Whisper API accessible'
    })
  } catch (error: any) {
    // If error is about invalid file format, that's actually good - means we have access
    if (error.message?.includes('invalid') || error.message?.includes('format')) {
      diagnostics.tests.push({
        name: 'Speech-to-Text Access',
        status: 'success',
        details: 'Whisper API accessible (invalid file format expected)'
      })
    } else {
      diagnostics.tests.push({
        name: 'Speech-to-Text Access',
        status: 'failed',
        error: error.message,
        status_code: error.status,
        error_code: error.code,
        error_type: error.type
      })
    }
  }

  // Test 5: Rate Limiting Check
  const rateLimitInfo = {
    current_time: new Date().toISOString(),
    suggestion: 'If you see 429 errors, wait 60 seconds between voice requests'
  }
  
  diagnostics.tests.push({
    name: 'Rate Limiting Info',
    status: 'info',
    details: rateLimitInfo
  })

  // Summary
  const successfulTests = diagnostics.tests.filter((t: any) => t.status === 'success').length
  const totalTests = diagnostics.tests.filter((t: any) => t.status !== 'info').length
  
  diagnostics.summary = {
    successful_tests: successfulTests,
    total_tests: totalTests,
    overall_status: successfulTests === totalTests ? 'healthy' : 'issues_detected',
    recommendation: successfulTests === totalTests 
      ? 'Voice chat should work. Try again with a single voice message.'
      : 'Issues detected. Check failed tests above.'
  }

  return NextResponse.json(diagnostics, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { test_type } = await request.json()
    
    if (test_type === 'voice_full_test') {
      // Create a proper test audio file for full voice pipeline test
      const testText = "Hello, this is a test of the voice system."
      
      // Generate speech
      const speech = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'onyx',
        input: testText,
        response_format: 'mp3'
      })
      
      const audioBuffer = Buffer.from(await speech.arrayBuffer())
      const audioFile = new File([audioBuffer], 'test.mp3', { type: 'audio/mp3' })
      
      // Transcribe it back
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1'
      })
      
      // Generate AI response
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are DIGI-EARL. Respond briefly to confirm the voice test worked.' },
          { role: 'user', content: transcription.text }
        ],
        max_tokens: 50
      })
      
      return NextResponse.json({
        test: 'Full Voice Pipeline',
        status: 'success',
        original_text: testText,
        transcribed_text: transcription.text,
        ai_response: completion.choices[0].message.content,
        audio_size: audioBuffer.length
      })
    }
    
    return NextResponse.json({ error: 'Unknown test type' }, { status: 400 })
    
  } catch (error: any) {
    return NextResponse.json({
      test: 'Full Voice Pipeline',
      status: 'failed',
      error: error.message,
      status_code: error.status,
      error_code: error.code,
      error_type: error.type
    }, { status: 500 })
  }
}
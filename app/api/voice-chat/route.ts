import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const action = formData.get('action') as string
    
    if (action === 'process_voice') {
      const audioFile = formData.get('audio') as File
      
      if (!audioFile) {
        return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
      }

      // Check if we have OpenAI API available
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ 
          error: 'OpenAI API key not configured',
          details: 'Voice processing requires OpenAI API access. Please configure your API key.'
        }, { status: 503 })
      }

      try {
        // Step 1: Transcribe audio using OpenAI Whisper
        const transcription = await openai.audio.transcriptions.create({
          file: audioFile,
          model: 'whisper-1',
          language: 'en'
        })

        const userMessage = transcription.text
        console.log('Transcribed message:', userMessage)

        // Step 2: Get AI response using chat completion
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are DIGI-EARL, Earl Sean Lawrence A. Pacho's AI digital twin. You are having a voice conversation, so respond naturally and conversationally. Keep responses concise but engaging (2-3 sentences max for voice). 

Earl's Profile:
- 4th year IT student at Saint Paul University Philippines (graduating 2026)
- Passionate about backend development with Laravel
- Leading AR Campus Navigation project using Unity and C#
- Completed cultural exchange in Malaysia and Singapore
- Skills: Web development, AI integration, project management, AR/VR development
- Based in Manila, Philippines
- Innovative, detail-oriented, collaborative team player

Respond as if you ARE Earl, speaking in first person about your experiences, skills, and projects. Keep the tone professional but friendly and conversational since this is a voice chat.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })

        const aiResponse = completion.choices[0].message.content || "I'm sorry, I didn't catch that. Could you please repeat?"

        // Step 3: Convert AI response to speech using OpenAI TTS
        const speech = await openai.audio.speech.create({
          model: 'tts-1',
          voice: 'onyx', // Professional male voice
          input: aiResponse,
          response_format: 'mp3'
        })

        // Convert response to base64
        const audioBuffer = Buffer.from(await speech.arrayBuffer())
        const audioBase64 = audioBuffer.toString('base64')

        return NextResponse.json({
          success: true,
          transcription: userMessage,
          response: aiResponse,
          audioResponse: audioBase64
        })

      } catch (openaiError: any) {
        console.error('OpenAI API error:', openaiError)
        
        // Handle specific OpenAI errors
        if (openaiError.status === 429) {
          return NextResponse.json({ 
            error: 'API quota exceeded',
            details: 'OpenAI API quota has been exceeded. Voice features are temporarily unavailable. Please use text chat instead.',
            fallback: true
          }, { status: 429 })
        }
        
        if (openaiError.status === 401) {
          return NextResponse.json({ 
            error: 'API authentication failed',
            details: 'OpenAI API key is invalid. Please check your configuration.',
            fallback: true
          }, { status: 401 })
        }

        // For other OpenAI errors, provide fallback
        return NextResponse.json({ 
          error: 'Voice processing temporarily unavailable',
          details: `OpenAI API error: ${openaiError.message || 'Unknown error'}. Please try text chat instead.`,
          fallback: true
        }, { status: 503 })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Voice chat API error:', error)
    return NextResponse.json({ 
      error: 'Failed to process voice input',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'Digital Twin Voice Chat',
    description: 'Simple voice chat API using OpenAI Whisper and TTS',
    features: [
      'Voice-to-text transcription',
      'AI response generation',
      'Text-to-speech conversion',
      'DIGI-EARL personality'
    ],
    status: 'ready'
  })
}
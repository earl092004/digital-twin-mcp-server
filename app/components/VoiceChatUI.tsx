'use client'

import { useState, useEffect, useRef } from 'react'

interface VoiceChatUIProps {
  onClose?: () => void
  className?: string
}

export default function VoiceChatUI({ onClose, className = '' }: VoiceChatUIProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant'
    text: string
    timestamp: Date
  }>>([])
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Initialize voice chat (simple mode without WebSocket)
  useEffect(() => {
    const initializeVoiceChat = async () => {
      try {
        // Test if we can access the voice API
        const response = await fetch('/api/voice-chat', {
          method: 'GET'
        })
        
        if (response.ok) {
          setIsConnected(true)
          console.log('Voice chat API ready')
        } else {
          setIsConnected(false)
          console.log('Voice chat API not available, using fallback')
        }
      } catch (error) {
        console.error('Voice chat API test failed:', error)
        setIsConnected(true) // Still allow recording
      }
    }

    initializeVoiceChat()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      streamRef.current = stream

      // Setup audio analysis for visual feedback
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' })
        
        // Send audio to voice chat API
        await processAudioWithAPI(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Start audio level monitoring
      startAudioLevelMonitoring()

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setAudioLevel(0)
      
      // Add user message placeholder
      setConversation(prev => [...prev, {
        type: 'user',
        text: 'Voice message sent...',
        timestamp: new Date()
      }])
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  const startAudioLevelMonitoring = () => {
    if (!analyserRef.current) return

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateAudioLevel = () => {
      if (!isRecording) return

      analyser.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
      setAudioLevel(average / 255) // Normalize to 0-1

      requestAnimationFrame(updateAudioLevel)
    }

    updateAudioLevel()
  }

  const processAudioWithAPI = async (audioBlob: Blob) => {
    try {
      setIsPlaying(true)
      
      // Create FormData to send audio file
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('action', 'process_voice')
      
      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Handle specific error cases gracefully without throwing
        let errorMessage = 'Sorry, I had trouble processing your voice message.'
        
        if (response.status === 429) {
          errorMessage = '🚫 Voice chat is temporarily unavailable due to API quota limits. Text chat is still working perfectly!'
        } else if (response.status === 401) {
          errorMessage = '🔑 Voice authentication issue. Please use text chat instead.'
        } else if (response.status === 503) {
          errorMessage = '⚠️ Voice services are temporarily unavailable. Text chat is ready to use!'
        } else if (errorData.details) {
          errorMessage = `⚠️ ${errorData.details}`
        }
        
        // Add user message placeholder and error response directly
        setConversation(prev => [...prev, 
          {
            type: 'user',
            text: 'Voice message sent...',
            timestamp: new Date()
          },
          {
            type: 'assistant',
            text: errorMessage,
            timestamp: new Date()
          }
        ])
        
        setIsPlaying(false)
        return // Exit gracefully without throwing
      }
      
      const result = await response.json()
      
      // Add user message to conversation
      if (result.transcription) {
        setConversation(prev => [...prev, {
          type: 'user',
          text: result.transcription,
          timestamp: new Date()
        }])
      }
      
      // Add AI response to conversation
      if (result.response) {
        setConversation(prev => [...prev, {
          type: 'assistant',
          text: result.response,
          timestamp: new Date()
        }])
      }
      
      // Play AI audio response if available
      if (result.audioResponse) {
        await playAudioResponse(result.audioResponse)
      } else {
        setIsPlaying(false)
      }
      
    } catch (error) {
      console.error('Error processing audio:', error)
      setIsPlaying(false)
      
      // Handle unexpected errors (network issues, etc.)
      const errorMessage = '� Connection issue. Please check your internet and try again, or use text chat.'
      
      // Add error message for unexpected errors
      setConversation(prev => [...prev, {
        type: 'assistant',
        text: errorMessage,
        timestamp: new Date()
      }])
    }
  }

  const playAudioResponse = async (base64Audio: string) => {
    try {
      // Convert base64 to blob
      const audioData = atob(base64Audio)
      const audioArray = new Uint8Array(audioData.length)
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i)
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' })
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }
      
      await audio.play()
    } catch (error) {
      console.error('Error playing audio response:', error)
      setIsPlaying(false)
    }
  }

  return (
    <div className={`flex flex-col h-full bg-gradient-to-br from-gray-900 to-black text-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Voice Chat with DIGI-EARL
            </h2>
            <p className="text-sm text-gray-400">
              {isConnected ? 'Connected • Ready to chat' : 'Connecting...'}
            </p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {conversation.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center opacity-50">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-lg mb-2">Voice Chat with DIGI-EARL</p>
            <p className="text-sm mb-4">Press and hold the microphone to speak</p>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 max-w-sm mx-auto">
              <p className="text-orange-300 text-xs">
                ⚠️ <strong>Note:</strong> Voice features require OpenAI API quota. If voice chat fails, text chat is always available!
              </p>
            </div>
          </div>
        ) : (
          conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <p className="text-sm sm:text-base">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}

        {isPlaying && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-3 rounded-2xl flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm text-gray-300">DIGI-EARL is speaking...</span>
            </div>
          </div>
        )}

        {/* Helpful notice if there have been voice errors */}
        {conversation.some(msg => msg.text.includes('temporarily unavailable') || msg.text.includes('quota')) && (
          <div className="flex justify-center my-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-sm">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-300 font-medium text-sm">Tip</span>
              </div>
              <p className="text-blue-200 text-xs">
                Text chat is fully functional with all the same AI capabilities! 
                <button
                  onClick={() => {
                    if (onClose) onClose()
                    setTimeout(() => {
                      const textChatButton = document.querySelector('[data-text-chat]') as HTMLButtonElement
                      if (textChatButton) textChatButton.click()
                    }, 100)
                  }}
                  className="text-blue-400 hover:text-blue-300 underline ml-1"
                >
                  Try it now →
                </button>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Voice Controls */}
      <div className="p-4 sm:p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="flex flex-col items-center space-y-4">
          
          {/* Audio Level Indicator */}
          {isRecording && (
            <div className="w-full max-w-xs">
              <div className="flex justify-center mb-2">
                <span className="text-sm text-purple-300">Recording...</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${audioLevel * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Record Button */}
          <div className="relative">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={!isConnected}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25 animate-pulse'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25'
              }`}
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              
              {/* Ripple effect when recording */}
              {isRecording && (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></div>
                  <div className="absolute inset-2 rounded-full bg-red-400 animate-ping opacity-30" style={{animationDelay: '0.5s'}}></div>
                </>
              )}
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-1">
              {isRecording ? 'Release to send' : 'Hold to speak'}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              {isConnected ? 'Voice AI ready' : 'Connecting to voice service...'}
            </p>
            
            {/* Switch to Text Chat Button */}
            <button
              onClick={() => {
                if (onClose) onClose()
                // The parent component will handle opening text chat
                setTimeout(() => {
                  const textChatButton = document.querySelector('[data-text-chat]') as HTMLButtonElement
                  if (textChatButton) textChatButton.click()
                }, 100)
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline transition-colors"
            >
              Switch to Text Chat →
            </button>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
            <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
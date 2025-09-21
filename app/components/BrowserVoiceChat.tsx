'use client'

import { useState, useEffect, useRef } from 'react'

// Add custom styles for sliders
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #1e293b;
  }
  
  .slider::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #1e293b;
  }
`

interface BrowserVoiceChatProps {
  onClose?: () => void
  className?: string
}

export default function BrowserVoiceChat({ onClose, className = '' }: BrowserVoiceChatProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant'
    text: string
    timestamp: Date
  }>>([])
  const [browserSupport, setBrowserSupport] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.9,
    pitch: 0.8,
    volume: 1
  })
  
  const recognitionRef = useRef<any>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)

  // Check browser support for Web Speech API
  useEffect(() => {
    const hasWebSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    const hasSpeechSynthesis = 'speechSynthesis' in window
    
    setBrowserSupport(hasWebSpeech && hasSpeechSynthesis)
    
    if (hasWebSpeech) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        console.log('Speech recognized:', transcript)
        
        // Add user message to conversation
        setConversation(prev => [...prev, {
          type: 'user',
          text: transcript,
          timestamp: new Date()
        }])
        
        // Get AI response
        getAIResponse(transcript)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        setConversation(prev => [...prev, {
          type: 'assistant',
          text: `Speech recognition error: ${event.error}. Please try again or use text chat.`,
          timestamp: new Date()
        }])
      }
    }
    
    if (hasSpeechSynthesis) {
      speechSynthesisRef.current = window.speechSynthesis
      
      // Load available voices
      const loadVoices = () => {
        const voices = speechSynthesisRef.current?.getVoices() || []
        setAvailableVoices(voices)
        
        // Auto-select a good default voice (prefer English, then male voices)
        if (!selectedVoice && voices.length > 0) {
          // Try to find a good male English voice
          const preferredVoice = voices.find(voice => 
            voice.lang.startsWith('en') && (
              voice.name.toLowerCase().includes('male') ||
              voice.name.toLowerCase().includes('david') ||
              voice.name.toLowerCase().includes('alex') ||
              voice.name.toLowerCase().includes('daniel')
            )
          ) || voices.find(voice => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('guy')) ||
             voices.find(voice => voice.lang.startsWith('en')) ||
             voices[0]
             
          setSelectedVoice(preferredVoice)
        }
      }
      
      // Load voices immediately and also on voiceschanged event
      loadVoices()
      speechSynthesisRef.current.onvoiceschanged = loadVoices
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && browserSupport) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const getAIResponse = async (userMessage: string) => {
    try {
      setIsSpeaking(true)
      
      // Use the existing text chat API
      const response = await fetch('/api/digital-twin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }
      
      const result = await response.json()
      const aiResponse = result.response || 'I apologize, but I could not generate a response.'
      
      // Add AI response to conversation
      setConversation(prev => [...prev, {
        type: 'assistant',
        text: aiResponse,
        timestamp: new Date()
      }])
      
      // Speak the response using browser TTS
      speakText(aiResponse)
      
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage = 'Sorry, I had trouble processing your message. Please try again.'
      
      setConversation(prev => [...prev, {
        type: 'assistant',
        text: errorMessage,
        timestamp: new Date()
      }])
      
      speakText(errorMessage)
    }
  }

  const speakText = (text: string) => {
    if (speechSynthesisRef.current) {
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Use selected voice or fallback
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
      
      // Apply voice settings
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch
      utterance.volume = voiceSettings.volume
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      speechSynthesisRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  if (!browserSupport) {
    return (
      <div className={`flex flex-col h-full bg-gradient-to-br from-gray-900 to-black text-white ${className}`}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-red-400">Browser Voice Chat Not Supported</h2>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <p className="text-gray-300 mb-4">
              Your browser doesn't support the Web Speech API required for voice chat.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please use a modern browser like Chrome, Edge, or Safari, or use the text chat instead.
            </p>
            <button
              onClick={() => {
                if (onClose) onClose()
                setTimeout(() => {
                  const textChatButton = document.querySelector('[data-text-chat]') as HTMLButtonElement
                  if (textChatButton) textChatButton.click()
                }, 100)
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-full font-semibold transition-all duration-300"
            >
              Switch to Text Chat
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{sliderStyles}</style>
      <div className={`flex flex-col h-full bg-gradient-to-br from-gray-900 to-black text-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
              Browser Voice Chat
            </h2>
            <p className="text-sm text-gray-400">
              Uses your browser's built-in speech features
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Voice Settings Button */}
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            title="Voice Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
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
      </div>

      {/* Voice Settings Panel */}
      {showVoiceSettings && (
        <div className="bg-gray-800/90 border-b border-gray-700/50 p-4">
          <div className="space-y-4">
            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Voice ({availableVoices.length} available)
              </label>
              <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = availableVoices.find(v => v.name === e.target.value)
                  setSelectedVoice(voice || null)
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
              {selectedVoice && (
                <p className="text-xs text-gray-400 mt-1">
                  Selected: {selectedVoice.name} • {selectedVoice.lang}
                </p>
              )}
            </div>

            {/* Voice Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Speech Rate */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Speed: {voiceSettings.rate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.rate}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Pitch */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Pitch: {voiceSettings.pitch.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={voiceSettings.pitch}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Volume */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Volume: {Math.round(voiceSettings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.volume}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Test Voice Button */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => speakText("Hello! This is how I sound with the current voice settings.")}
                disabled={isSpeaking}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isSpeaking ? 'Testing...' : 'Test Voice'}
              </button>
              
              {/* Quick Presets */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setVoiceSettings({ rate: 0.8, pitch: 0.7, volume: 1 })}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
                >
                  Deep
                </button>
                <button
                  onClick={() => setVoiceSettings({ rate: 0.9, pitch: 0.8, volume: 1 })}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
                >
                  Normal
                </button>
                <button
                  onClick={() => setVoiceSettings({ rate: 1.2, pitch: 1.2, volume: 1 })}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
                >
                  Bright
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {conversation.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center opacity-50">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-lg mb-2">Browser Voice Chat with DIGI-EARL</p>
            <p className="text-sm mb-4">Click the microphone to start talking</p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 max-w-sm mx-auto">
              <p className="text-green-300 text-xs">
                ✅ <strong>Free Alternative:</strong> Uses your browser's speech recognition and synthesis - no API limits!
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
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
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

        {isSpeaking && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-3 rounded-2xl flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm text-gray-300">DIGI-EARL is speaking...</span>
              <button
                onClick={stopSpeaking}
                className="text-red-400 hover:text-red-300 ml-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Voice Controls */}
      <div className="p-4 sm:p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="flex flex-col items-center space-y-4">
          
          {/* Voice Button */}
          <div className="relative">
            <button
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              disabled={isSpeaking}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25 animate-pulse'
                  : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 shadow-lg shadow-green-500/25'
              }`}
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              
              {/* Ripple effect when listening */}
              {isListening && (
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
              {isListening ? 'Listening... Release to stop' : isSpeaking ? 'DIGI-EARL is responding...' : 'Hold to speak'}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              Browser-based voice chat • No API limits
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-green-400">Browser Speech API Ready</span>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import { ConversationMessage, UserInfo } from '../lib/enhanced-memory'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isLoading?: boolean
}

interface ChatUIProps {
  sessionId?: string
  onSessionUpdate?: (sessionId: string) => void
  className?: string
}

export default function ChatUI({ sessionId, onSessionUpdate, className = '' }: ChatUIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null)
  const [userInfo, setUserInfo] = useState<UserInfo>({})
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize session on component mount - restore previous session or create new one
  useEffect(() => {
    if (!isInitialized) {
      initializeSession()
    }
  }, [isInitialized])

  // Note: We don't load conversation history to keep UI fresh
  // But the session ID is available for API context

  const initializeSession = async () => {
    try {
      // Check for existing session for background context (but don't restore UI)
      const savedSessionId = localStorage.getItem('digi-earl-session-id')
      console.log('🔍 Session context check:', { savedSessionId, sessionId })
      
      if (savedSessionId && !sessionId) {
        console.log('📱 Found previous session ID in localStorage:', savedSessionId)
        
        // Validate that the session actually exists in Redis
        try {
          const validateResponse = await fetch(`/api/sessions?action=validate&sessionId=${savedSessionId}`)
          const validateData = await validateResponse.json()
          
          if (validateData.success && validateData.exists) {
            console.log('✅ Session validated in Redis - using for memory context')
            setCurrentSessionId(savedSessionId)
            onSessionUpdate?.(savedSessionId)
            console.log('✨ Fresh chat with validated conversation memory context')
          } else {
            console.log('❌ Session not found in Redis - clearing localStorage and starting fresh')
            localStorage.removeItem('digi-earl-session-id')
            console.log('🆕 Completely fresh start after session cleanup')
          }
        } catch (validateError) {
          console.log('⚠️ Error validating session - starting fresh:', validateError)
          localStorage.removeItem('digi-earl-session-id')
        }
      } else if (!savedSessionId) {
        console.log('ℹ️ No previous session found - completely fresh start')
      } else if (sessionId) {
        console.log('ℹ️ Using provided sessionId')
      }
      
      setIsInitialized(true)
    } catch (error) {
      console.error('Error initializing session:', error)
      setIsInitialized(true)
    }
  }

  const loadConversationHistory = async () => {
    if (!currentSessionId) return

    try {
      const response = await fetch(`/api/conversations?sessionId=${currentSessionId}&limit=50`)
      const data = await response.json()
      
      if (data.success) {
        const historyMessages = data.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        }))
        
        setMessages(historyMessages)
        setUserInfo(data.userInfo || {})
      }
    } catch (error) {
      console.error('Error loading conversation history:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Add loading indicator
    const loadingMessage: ChatMessage = {
      id: 'loading',
      role: 'assistant',
      content: 'Thinking...',
      timestamp: new Date(),
      isLoading: true
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      const response = await fetch('/api/digital-twin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: userMessage.content,
          sessionId: currentSessionId
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update session ID if this is a new conversation
        if (!currentSessionId && data.sessionId) {
          console.log('💾 Saving new session to localStorage:', data.sessionId)
          setCurrentSessionId(data.sessionId)
          onSessionUpdate?.(data.sessionId)
          // Save session ID to localStorage for cross-session continuity
          localStorage.setItem('digi-earl-session-id', data.sessionId)
        }

        // Remove loading message and add actual response
        setMessages(prev => prev.filter(msg => msg.id !== 'loading'))
        
        const assistantMessage: ChatMessage = {
          id: Date.now().toString() + '_response',
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, assistantMessage])

        // Update user info without reloading full history to prevent reset
        if (data.sessionId && data.userInfo) {
          setUserInfo(prev => ({ ...prev, ...data.userInfo }))
        }
      } else {
        // Handle error
        setMessages(prev => prev.filter(msg => msg.id !== 'loading'))
        const errorMessage: ChatMessage = {
          id: 'error_' + Date.now(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.filter(msg => msg.id !== 'loading'))
      const errorMessage: ChatMessage = {
        id: 'error_' + Date.now(),
        role: 'assistant',
        content: 'Network error. Please check your connection and try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearConversation = async () => {
    if (!currentSessionId) {
      setMessages([])
      return
    }

    try {
      const response = await fetch(`/api/conversations?sessionId=${currentSessionId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setMessages([])
        setUserInfo({})
        setCurrentSessionId(null)
        onSessionUpdate?.('')
        // Clear saved session from localStorage
        localStorage.removeItem('digi-earl-session-id')
      }
    } catch (error) {
      console.error('Error clearing conversation:', error)
    }
  }

  const exportConversation = async () => {
    if (!currentSessionId) return

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'export',
          sessionId: currentSessionId
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Download the conversation as JSON
        const blob = new Blob([JSON.stringify(data.export, null, 2)], {
          type: 'application/json'
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = data.filename
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting conversation:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp)
  }

  return (
    <div className={`flex flex-col h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {userInfo.name ? `Chat with ${userInfo.name}` : 'DIGI-EARL'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.role && userInfo.company 
                ? `${userInfo.role} at ${userInfo.company}`
                : messages.length > 0 
                  ? `${messages.length} messages`
                  : 'Start a conversation'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle conversation info"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          {currentSessionId && (
            <>
              <button
                onClick={exportConversation}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Export conversation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              
              <button
                onClick={clearConversation}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Clear conversation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Conversation Info Panel */}
      {isHistoryOpen && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="text-sm space-y-2">
            {userInfo.name && (
              <div><strong>Name:</strong> {userInfo.name}</div>
            )}
            {userInfo.role && (
              <div><strong>Role:</strong> {userInfo.role}</div>
            )}
            {userInfo.company && (
              <div><strong>Company:</strong> {userInfo.company}</div>
            )}
            {userInfo.interviewType && (
              <div><strong>Interview Type:</strong> {userInfo.interviewType}</div>
            )}
            {userInfo.interests && userInfo.interests.length > 0 && (
              <div><strong>Interests:</strong> {userInfo.interests.join(', ')}</div>
            )}
            {currentSessionId && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Session: {currentSessionId.substring(0, 8)}...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Start a conversation with DIGI-EARL
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Ask me about Earl's background, projects, skills, or anything else you'd like to know!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : message.isLoading
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 animate-pulse'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-2 opacity-70 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask DIGI-EARL anything about Earl's journey..."
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
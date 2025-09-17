'use client'

import { useState, useEffect } from 'react'
import ChatUI from './components/ChatUI'

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              DIGI-EARL
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setShowChat(true)}
                className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-purple-500/25 hover:scale-105 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium hidden xs:inline">Chat with DIGI-EARL</span>
                <span className="font-medium xs:hidden">Chat</span>
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center relative">
            {/* Glowing orb behind text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="mb-6 sm:mb-8">
                <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full text-xs sm:text-sm font-medium text-purple-300 border border-purple-500/20 backdrop-blur-sm">
                  🤖 Enhanced Memory System Active
                </span>
              </div>
              
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-tight px-2">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  DIGI-EARL
                </span>
              </h1>
              
              <div className="text-lg xs:text-xl sm:text-2xl md:text-4xl font-light mb-6 sm:mb-8 text-gray-300 px-2">
                <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  AI Digital Twin with Enhanced Memory
                </span>
              </div>
              
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
                <span className="text-cyan-400 font-medium">Persistent Memory</span> • 
                <span className="text-purple-400 font-medium"> Global Awareness</span> • 
                <span className="text-pink-400 font-medium"> Fresh UI Experience</span>
                <br className="hidden sm:block"/>
                Powered by Redis session storage, advanced user extraction, and cross-conversation memory. 
                Experience fresh conversations with continuous context awareness.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4">
                <button 
                  onClick={() => setShowChat(true)}
                  className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform w-full sm:w-auto"
                >
                  <span className="relative z-10">Start Conversation</span>
                  <svg className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => setShowContact(true)}
                  className="group px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-gray-600 hover:border-purple-400 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm w-full sm:w-auto"
                >
                  <svg className="inline-block mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-black to-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full text-xs sm:text-sm font-medium text-purple-300 border border-purple-500/20 backdrop-blur-sm mb-4 sm:mb-6">
                🧠 Memory Features
              </span>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 px-2">
                Enhanced{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Intelligence
                </span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-purple-500/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Persistent Memory
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Advanced Redis-based session storage with 24-hour TTL. Remembers conversations, 
                    user information, and context across page reloads while maintaining fresh UI experience.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-cyan-500/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                    Global Awareness
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Cross-session conversation awareness enables natural references to previous interactions. 
                    Automatically generates summaries and maintains global context across all conversations.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-pink-500/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                    Smart Extraction
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Advanced regex-based user information extraction automatically identifies and stores 
                    names, companies, roles, and context for personalized, intelligent responses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Modal with Memory */}
      {showChat && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden"
          onClick={() => setShowChat(false)}
        >
          {/* Fixed Modal Container */}
          <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <div 
              className="relative w-full max-w-4xl h-[95vh] sm:h-[90vh] bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Fixed Position */}
              <button
                onClick={() => setShowChat(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg bg-gray-900/80 backdrop-blur-sm"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Chat UI - Scrollable Content */}
              <div className="h-full overflow-hidden">
                <ChatUI 
                  onSessionUpdate={(sessionId) => {
                    console.log('Session updated:', sessionId)
                  }}
                  className="h-full rounded-xl sm:rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-enhanced flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-3xl max-w-md w-full mx-4 overflow-hidden shadow-2xl border border-purple-500/20">
            
            {/* Close Button */}
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-6 right-6 z-50 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-full p-2 transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-center">
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2">DIGI-EARL</h3>
                <p className="text-blue-100/90 text-base">Enhanced Memory System</p>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              <div className="text-center">
                <h4 className="text-xl font-bold text-white mb-4">Ready to Experience Enhanced AI?</h4>
                <p className="text-gray-400 mb-6">
                  Start a conversation and experience persistent memory, global awareness, and intelligent responses.
                </p>
                <button 
                  onClick={() => {
                    setShowContact(false)
                    setShowChat(true)
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Start Chatting Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
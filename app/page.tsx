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

      {/* Footer */}
      <footer className="relative bg-gradient-to-b from-gray-900/50 to-black border-t border-gray-800/50">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-pink-900/10"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
              
              {/* Brand Section */}
              <div className="lg:col-span-1 text-center lg:text-left">
                <div className="mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                    DIGI-EARL
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-md mx-auto lg:mx-0">
                    Your intelligent digital twin with enhanced memory capabilities. Bridging the gap between AI and human-like conversation.
                  </p>
                </div>
                
                {/* Catchphrase */}
                <div className="mb-6">
                  <p className="text-lg sm:text-xl font-medium bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent italic">
                    "Where Memory Meets Intelligence"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Powered by Advanced AI • Built with ❤️ in the Philippines
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="lg:col-span-1 text-center lg:text-left">
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-6 flex items-center justify-center lg:justify-start">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Get in Touch
                </h4>
                
                <div className="space-y-4">
                  {/* Phone Numbers */}
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="text-sm text-gray-300">
                      <div>+63 917 234 5678</div>
                      <div className="text-xs text-gray-500">Primary</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <svg className="w-4 h-4 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="text-sm text-gray-300">
                      <div>+63 926 789 1234</div>
                      <div className="text-xs text-gray-500">Business</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <div className="text-sm text-gray-300">
                      <div>earl@digiearl.ai</div>
                      <div className="text-xs text-gray-500">Official</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="lg:col-span-1 text-center lg:text-left">
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-6 flex items-center justify-center lg:justify-start">
                  <svg className="w-5 h-5 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Connect With Me
                </h4>
                
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6">
                  {/* GitHub */}
                  <a 
                    href="https://github.com/earl092004"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-3 social-icon tooltip"
                    data-tooltip="GitHub"
                  >
                    <svg className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <div className="absolute inset-0 bg-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>

                  {/* Facebook */}
                  <a 
                    href="https://facebook.com/earl.developer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-3 social-icon tooltip"
                    data-tooltip="Facebook"
                  >
                    <svg className="w-6 h-6 text-white group-hover:text-blue-100 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <div className="absolute inset-0 bg-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>

                  {/* LinkedIn */}
                  <a 
                    href="https://linkedin.com/in/earl-developer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-3 social-icon tooltip"
                    data-tooltip="LinkedIn"
                  >
                    <svg className="w-6 h-6 text-white group-hover:text-blue-100 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <div className="absolute inset-0 bg-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>

                  {/* Gmail */}
                  <a 
                    href="mailto:earl@digiearl.ai"
                    className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-3 social-icon tooltip"
                    data-tooltip="Email"
                  >
                    <svg className="w-6 h-6 text-white group-hover:text-red-100 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h1.909L12 11.64l8.455-7.819h1.909c.904 0 1.636.732 1.636 1.636z"/>
                    </svg>
                    <div className="absolute inset-0 bg-red-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                </div>

                {/* Additional Info */}
                <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                  <p>🌏 Manila, Philippines</p>
                  <p>⚡ Available 24/7 via AI</p>
                  <p>🚀 Always innovating</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

            {/* Bottom Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-4 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-500">
                <p>© 2024 DIGI-EARL. Crafted with passion and code.</p>
                <p className="text-xs text-gray-600 mt-1">Enhanced Memory System • Next.js 15 • Powered by Upstash & Groq</p>
              </div>
              
              <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                <a href="#" className="hover:text-purple-400 transition-colors duration-300">Privacy</a>
                <span className="text-gray-700">•</span>
                <a href="#" className="hover:text-purple-400 transition-colors duration-300">Terms</a>
                <span className="text-gray-700">•</span>
                <a href="#" className="hover:text-purple-400 transition-colors duration-300">Support</a>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute bottom-4 right-4 opacity-20">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute bottom-8 left-8 opacity-20">
              <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
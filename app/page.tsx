'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    {
      role: 'assistant',
      content: "Hey there! 👋 I'm Earl Sean Lawrence A. Pacho, your AI Digital Twin. I'm an IT student pursuing a Bachelor of Science in Information Technology at Saint Paul University Philippines, expected to graduate in 2026.\n\nI'm currently leading a team developing an AR Campus Navigation app using Unity and ARKit with LiDAR technology. I'm passionate about backend development, AR/VR applications, and emerging technologies. I participated in an immersion program at OMEGA School, Singapore, focusing on AI, Web 3.0, and digital transformation.\n\nI'm actively seeking internship or entry-level opportunities to apply my skills in backend development and innovative tech projects!"
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return

    const userMessage = chatMessage.trim()
    setChatMessage('')
    setIsLoading(true)

    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      const response = await fetch('/api/digital-twin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage })
      })

      const data = await response.json()
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: data.success ? data.response : 'Sorry, I encountered an error. Please try again.' 
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

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
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              DIGI-EARL
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#projects" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 relative group">
                Projects
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <button onClick={() => setShowContact(true)} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowChat(true)}
                className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
              >
                <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium">Ask AI</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center relative">
            {/* Glowing orb behind text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full text-sm font-medium text-purple-300 border border-purple-500/20 backdrop-blur-sm">
                  👋 Welcome to my Digital Twin
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Earl Sean
                </span>
              </h1>
              
              <div className="text-2xl md:text-4xl font-light mb-8 text-gray-300">
                <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  IT Student & AR Developer
                </span>
              </div>
              
              <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
                <span className="text-cyan-400 font-medium">Backend Developer</span> • 
                <span className="text-purple-400 font-medium"> AR/VR Enthusiast</span> • 
                <span className="text-pink-400 font-medium"> Team Leader</span>
                <br className="hidden md:block"/>
                Currently pursuing BS Information Technology at Saint Paul University Philippines, 
                leading AR projects, and building innovative solutions with Laravel, Unity, and modern technologies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 transform">
                  <span className="relative z-10">Hire Me</span>
                  <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => setShowChat(true)}
                  className="group px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-600 hover:border-purple-400 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <svg className="inline-block mr-2 w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat with AI
                </button>
              </div>
              
              {/* Scroll indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-gradient-to-b from-purple-400 to-transparent rounded-full animate-bounce mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="relative py-32 bg-gradient-to-b from-black to-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full text-sm font-medium text-purple-300 border border-purple-500/20 backdrop-blur-sm mb-6">
                🚀 About Me
              </span>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Crafting Digital{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Transforming ideas into powerful, scalable solutions through innovative technology and AI-driven approaches
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-purple-500/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Enterprise Experience
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    IT student with hands-on experience in backend development, AR applications, and team leadership. 
                    Currently working on innovative AR campus navigation using Unity and LiDAR technology.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">Laravel</span>
                    <span className="px-3 py-1 bg-pink-600/20 text-pink-300 rounded-full text-sm">Unity</span>
                    <span className="px-3 py-1 bg-cyan-600/20 text-cyan-300 rounded-full text-sm">MySQL</span>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-cyan-500/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                    Academic Excellence
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Pursuing BS Information Technology at Saint Paul University Philippines (Expected 2026). 
                    Participated in international immersion program at OMEGA School, Singapore.
                  </p>
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Graduation Progress</span>
                      <span className="text-sm font-medium text-cyan-300">2026</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full w-[75%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-black/50 backdrop-blur-sm border border-gray-800 hover:border-pink-500/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                    AI Innovation
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Exploring cutting-edge technologies in AI, Web 3.0, and AR/VR development. 
                    Passionate about creating innovative solutions and contributing to tech advancement.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-pink-600/20 text-pink-300 rounded-full text-sm">AR/VR</span>
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">Web 3.0</span>
                    <span className="px-3 py-1 bg-indigo-600/20 text-indigo-300 rounded-full text-sm">AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-t border-gray-800">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">2026</div>
                <div className="text-gray-400">Expected Graduation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">5+</div>
                <div className="text-gray-400">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">3</div>
                <div className="text-gray-400">Team Members Led</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">AR</div>
                <div className="text-gray-400">Campus Navigation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 pointer-events-none"></div>
            
            {/* Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Digital Twin Assistant
                  </h3>
                  <p className="text-sm text-gray-400">Ask me anything about my professional journey</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="relative flex-1 p-6 overflow-y-auto">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">Welcome to My Digital Twin!</h4>
                  <p className="text-gray-400 mb-6 max-w-md">
                    I'm here to answer questions about my professional background, technical skills, projects, and career journey.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                    <button
                      onClick={() => setChatMessage("What are your main technical skills?")}
                      className="text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all hover:border-purple-500/50"
                    >
                      <span className="text-purple-400 text-sm">💻 Ask about</span>
                      <p className="text-white text-sm">Technical Skills</p>
                    </button>
                    <button
                      onClick={() => setChatMessage("Tell me about your work experience")}
                      className="text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all hover:border-pink-500/50"
                    >
                      <span className="text-pink-400 text-sm">🚀 Ask about</span>
                      <p className="text-white text-sm">Work Experience</p>
                    </button>
                    <button
                      onClick={() => setChatMessage("What projects have you worked on?")}
                      className="text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all hover:border-cyan-500/50"
                    >
                      <span className="text-cyan-400 text-sm">📁 Ask about</span>
                      <p className="text-white text-sm">Projects & Portfolio</p>
                    </button>
                    <button
                      onClick={() => setChatMessage("What are your career goals?")}
                      className="text-left p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all hover:border-yellow-500/50"
                    >
                      <span className="text-yellow-400 text-sm">🎯 Ask about</span>
                      <p className="text-white text-sm">Career Goals</p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {chatHistory.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${message.role === 'user' ? 'ml-8' : 'mr-8'}`}>
                        <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            message.role === 'user' 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                              : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                          }`}>
                            {message.role === 'user' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div className={`p-4 rounded-2xl backdrop-blur-sm ${
                            message.role === 'user' 
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                              : 'bg-gray-800/70 text-gray-100 border border-gray-700/50'
                          }`}>
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start mr-8">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="bg-gray-800/70 border border-gray-700/50 p-4 rounded-2xl">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Input Section */}
            <div className="relative p-6 border-t border-gray-700/50 backdrop-blur-sm">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about my skills, experience, projects, or career goals..."
                    className="w-full bg-gray-800/70 border border-gray-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-gray-800 transition-all pr-16"
                    disabled={isLoading}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !chatMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-xl transition-all duration-300 font-medium disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 disabled:hover:scale-100"
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
              <p className="text-xs text-gray-500 mt-3 text-center">
                🤖 Powered by AI • Information based on professional profile
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Contact Button */}
      <button
        onClick={() => setShowContact(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 group"
        title="Contact Me"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          💬
        </span>
      </button>

      {/* Professional Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl border border-purple-500/20">
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-2xl font-bold text-white mb-2">🤝 Let's Connect!</h3>
              <p className="text-blue-100">Ready to discuss opportunities? Let's get in touch!</p>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-300 text-center mb-6">
                Choose your preferred way to reach out:
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://facebook.com/earl.pacho.5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-all duration-300 text-center hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                  title="Connect on Facebook"
                >
                  <div className="text-2xl mb-2">📘</div>
                  <div className="font-medium">Facebook</div>
                </a>
                
                <a
                  href="https://instagram.com/earl.pacho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-xl transition-all duration-300 text-center hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                  title="Follow on Instagram"
                >
                  <div className="text-2xl mb-2">📷</div>
                  <div className="font-medium">Instagram</div>
                </a>
                
                <a
                  href="https://linkedin.com/in/earl-pacho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-xl transition-all duration-300 text-center hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                  title="Connect professionally"
                >
                  <div className="text-2xl mb-2">💼</div>
                  <div className="font-medium">LinkedIn</div>
                </a>
                
                <a
                  href="https://github.com/earl092004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gray-800 hover:bg-gray-900 text-white p-4 rounded-xl transition-all duration-300 text-center hover:shadow-lg hover:shadow-gray-500/25 transform hover:scale-105"
                  title="View my code"
                >
                  <div className="text-2xl mb-2">💻</div>
                  <div className="font-medium">GitHub</div>
                </a>
                
                <a
                  href="mailto:pachoearlsean@gmail.com"
                  className="group bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl transition-all duration-300 text-center hover:shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                  title="Send me an email"
                >
                  <div className="text-2xl mb-2">✉️</div>
                  <div className="font-medium">Email</div>
                </a>
                
                <a
                  href="tel:+639123456789"
                  className="group bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition-all duration-300 text-center hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
                  title="Call me"
                >
                  <div className="text-2xl mb-2">📞</div>
                  <div className="font-medium">Phone</div>
                </a>
              </div>
              
              <div className="mt-6 p-4 bg-slate-800 rounded-xl text-center">
                <p className="text-sm text-gray-400">
                  💡 <strong className="text-white">Looking for opportunities!</strong><br/>
                  Open to internships, entry-level positions, and collaborations
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'

export default function TestPage() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testQuery = async () => {
    if (!question.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/digital-twin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      })

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      setResponse({ success: false, error: 'Failed to fetch response' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          DIGI-EARL RAG Test Interface
        </h1>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Test RAG Query</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ask a question about the professional profile:
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-gray-400"
                rows={3}
                placeholder="e.g., Tell me about your work experience..."
              />
            </div>
            
            <button
              onClick={testQuery}
              disabled={loading || !question.trim()}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {loading ? 'Processing...' : 'Send Query'}
            </button>
          </div>
        </div>

        {response && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Response</h2>
            
            <div className="space-y-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  response.success ? 'bg-green-500 text-green-100' : 'bg-red-500 text-red-100'
                }`}>
                  {response.success ? 'Success' : 'Error'}
                </span>
              </div>

              {response.success && response.response && (
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">AI Response:</h3>
                  <div className="bg-slate-900 p-4 rounded-lg text-gray-100">
                    {response.response}
                  </div>
                </div>
              )}

              {response.context && response.context.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Retrieved Context:</h3>
                  <div className="space-y-2">
                    {response.context.map((item: any, index: number) => (
                      <div key={index} className="bg-slate-900 p-3 rounded-lg">
                        <div className="font-medium text-purple-300">{item.title}</div>
                        <div className="text-sm text-gray-400 mb-2">Relevance: {item.relevance.toFixed(3)}</div>
                        <div className="text-sm text-gray-200">{item.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {response.error && (
                <div>
                  <h3 className="text-lg font-medium text-red-300 mb-2">Error:</h3>
                  <div className="bg-red-900/50 p-4 rounded-lg text-red-100">
                    {response.error}
                  </div>
                </div>
              )}

              <details className="text-sm">
                <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                  View Raw Response
                </summary>
                <pre className="mt-2 bg-slate-900 p-4 rounded-lg text-gray-300 overflow-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <a 
            href="/"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            ← Back to Main Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
import { NextRequest, NextResponse } from 'next/server'
import { queryDigitalTwin } from '../../lib/digital-twin'
import { SecurityMiddleware, InputValidator, SecureLogger, ErrorSanitizer } from '../../lib/security'

interface MCPRequest {
  jsonrpc: string
  method: string
  params?: any
  id: string | number
}

interface MCPResponse {
  jsonrpc: string
  result?: any
  error?: {
    code: number
    message: string
    data?: any
  }
  id: string | number
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Security checks
    const rateLimitCheck = SecurityMiddleware.checkRateLimit(request)
    if (!rateLimitCheck.allowed) {
      const headers = SecurityMiddleware.getRateLimitHeaders(request)
      return NextResponse.json({
        jsonrpc: '2.0',
        error: rateLimitCheck.error,
        id: null
      }, { status: 429, headers })
    }

    const requestValidation = SecurityMiddleware.validateRequest(request)
    if (!requestValidation.valid) {
      return NextResponse.json({
        jsonrpc: '2.0',
        error: requestValidation.error,
        id: null
      }, { status: 400 })
    }

    const body: MCPRequest = await request.json()
    
    // Validate JSON-RPC 2.0 format
    if (body.jsonrpc !== '2.0' || !body.method || body.id === undefined) {
      return NextResponse.json({
        jsonrpc: '2.0',
        error: {
          code: -32602,
          message: 'Invalid Request'
        },
        id: body.id || null
      })
    }

    let result: any

    switch (body.method) {
      case 'initialize':
        result = {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
            resources: {}
          },
          serverInfo: {
            name: 'Digital Twin RAG MCP Server',
            version: '1.0.0'
          }
        }
        break

      case 'tools/list':
        result = {
          tools: [
            {
              name: 'query_digital_twin',
              description: 'Query Earl Sean Lawrence A. Pacho\'s digital twin for personalized responses',
              inputSchema: {
                type: 'object',
                properties: {
                  question: {
                    type: 'string',
                    description: 'The question to ask Earl\'s digital twin'
                  }
                },
                required: ['question']
              }
            },
            {
              name: 'get_profile_info',
              description: 'Get comprehensive overview of Earl\'s professional profile',
              inputSchema: {
                type: 'object',
                properties: {},
                required: []
              }
            },
            {
              name: 'search_experience',
              description: 'Search Earl\'s work experience and projects',
              inputSchema: {
                type: 'object',
                properties: {},
                required: []
              }
            },
            {
              name: 'get_technical_skills',
              description: 'Get Earl\'s technical skills and expertise',
              inputSchema: {
                type: 'object',
                properties: {},
                required: []
              }
            }
          ]
        }
        break

      case 'tools/call':
        if (!body.params || !body.params.name) {
          return NextResponse.json({
            jsonrpc: '2.0',
            error: {
              code: -32602,
              message: 'Invalid params: name required'
            },
            id: body.id
          })
        }

        const toolName = body.params.name
        const toolArgs = body.params.arguments || {}

        switch (toolName) {
          case 'query_digital_twin':
            if (!toolArgs.question) {
              return NextResponse.json({
                jsonrpc: '2.0',
                error: {
                  code: -32602,
                  message: 'Invalid arguments: question required'
                },
                id: body.id
              })
            }

            // Validate and sanitize input
            const questionValidation = InputValidator.validateQuestion(toolArgs.question)
            if (!questionValidation.isValid) {
              return NextResponse.json({
                jsonrpc: '2.0',
                error: {
                  code: -32602,
                  message: `Invalid question: ${questionValidation.error}`
                },
                id: body.id
              })
            }

            try {
              SecureLogger.info('Processing digital twin query', { method: 'query_digital_twin', questionLength: questionValidation.sanitized?.length })
              const response = await queryDigitalTwin(questionValidation.sanitized!)
              result = {
                content: [
                  {
                    type: 'text',
                    text: response.response
                  }
                ]
              }
            } catch (error) {
              const sanitizedError = ErrorSanitizer.sanitizeError(error)
              SecureLogger.error('Error in query_digital_twin', { error: sanitizedError.message })
              return NextResponse.json({
                jsonrpc: '2.0',
                error: sanitizedError,
                id: body.id
              })
            }
            break

          case 'get_profile_info':
            try {
              SecureLogger.info('Processing profile info request', { method: 'get_profile_info' })
              const profileResponse = await queryDigitalTwin('Give me a comprehensive overview of Earl Sean Lawrence A. Pacho\'s professional profile, education, and current projects.')
              result = {
                content: [
                  {
                    type: 'text',
                    text: profileResponse.response
                  }
                ]
              }
            } catch (error) {
              const sanitizedError = ErrorSanitizer.sanitizeError(error)
              SecureLogger.error('Error in get_profile_info', { error: sanitizedError.message })
              return NextResponse.json({
                jsonrpc: '2.0',
                error: sanitizedError,
                id: body.id
              })
            }
            break

          case 'search_experience':
            try {
              SecureLogger.info('Processing experience search request', { method: 'search_experience' })
              const experienceResponse = await queryDigitalTwin('What work experience, projects, and leadership roles does Earl have?')
              result = {
                content: [
                  {
                    type: 'text',
                    text: experienceResponse.response
                  }
                ]
              }
            } catch (error) {
              const sanitizedError = ErrorSanitizer.sanitizeError(error)
              SecureLogger.error('Error in search_experience', { error: sanitizedError.message })
              return NextResponse.json({
                jsonrpc: '2.0',
                error: sanitizedError,
                id: body.id
              })
            }
            break

          case 'get_technical_skills':
            try {
              SecureLogger.info('Processing technical skills request', { method: 'get_technical_skills' })
              const skillsResponse = await queryDigitalTwin('What are Earl\'s technical skills, programming languages, and technologies he works with?')
              result = {
                content: [
                  {
                    type: 'text',
                    text: skillsResponse.response
                  }
                ]
              }
            } catch (error) {
              const sanitizedError = ErrorSanitizer.sanitizeError(error)
              SecureLogger.error('Error in get_technical_skills', { error: sanitizedError.message })
              return NextResponse.json({
                jsonrpc: '2.0',
                error: sanitizedError,
                id: body.id
              })
            }
            break

          default:
            return NextResponse.json({
              jsonrpc: '2.0',
              error: {
                code: -32601,
                message: `Tool not found: ${toolName}`
              },
              id: body.id
            })
        }
        break

      case 'ping':
        result = { status: 'pong', timestamp: new Date().toISOString() }
        break



      default:
        return NextResponse.json({
          jsonrpc: '2.0',
          error: {
            code: -32601,
            message: 'Method not found'
          },
          id: body.id
        })
    }

    const response: MCPResponse = {
      jsonrpc: '2.0',
      result,
      id: body.id
    }

    const duration = Date.now() - startTime
    SecureLogger.info('MCP request completed', { method: body.method, duration, id: body.id })

    const headers = SecurityMiddleware.getRateLimitHeaders(request)
    return NextResponse.json(response, { headers })

  } catch (error) {
    const duration = Date.now() - startTime
    const sanitizedError = ErrorSanitizer.sanitizeError(error)
    SecureLogger.error('MCP API Error', { error: sanitizedError.message, duration })
    
    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: -32700,
        message: 'Parse error'
      },
      id: null
    }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'Digital Twin RAG MCP Server',
    version: '1.0.0',
    description: 'RAG-powered digital twin for Earl Sean Lawrence A. Pacho',
    endpoints: {
      POST: 'JSON-RPC 2.0 MCP requests',
      GET: 'Server information'
    },
    methods: [
      'ping',
      'capabilities', 
      'query_digital_twin',
      'get_profile_info',
      'search_experience',
      'get_technical_skills'
    ]
  })
}
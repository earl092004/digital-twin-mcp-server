import { NextRequest } from 'next/server'

/**
 * Rate limiting using in-memory store (for production, use Redis)
 */
class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map()
  private readonly maxRequests: number = 100 // requests per window
  private readonly windowMs: number = 15 * 60 * 1000 // 15 minutes

  public isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(identifier)

    if (!userRequests || now > userRequests.resetTime) {
      // Reset or initialize
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      })
      return false
    }

    if (userRequests.count >= this.maxRequests) {
      return true
    }

    userRequests.count++
    return false
  }

  public getRemainingRequests(identifier: string): number {
    const userRequests = this.requests.get(identifier)
    if (!userRequests || Date.now() > userRequests.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - userRequests.count)
  }

  public getResetTime(identifier: string): number {
    const userRequests = this.requests.get(identifier)
    return userRequests?.resetTime || Date.now() + this.windowMs
  }

  // Cleanup old entries
  public cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter()

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000)
}

/**
 * Input validation and sanitization
 */
export class InputValidator {
  private static readonly MAX_QUESTION_LENGTH = 2000
  private static readonly MIN_QUESTION_LENGTH = 1
  private static readonly DANGEROUS_PATTERNS = [
    /(<script|javascript:|data:)/i,
    /(union\s+select|drop\s+table|delete\s+from)/i,
    /(\${|<%|\{\{)/,
    /(exec\s*\(|eval\s*\(|system\s*\()/i
  ]

  public static validateQuestion(question: string): { isValid: boolean; error?: string; sanitized?: string } {
    if (!question || typeof question !== 'string') {
      return { isValid: false, error: 'Question must be a non-empty string' }
    }

    const trimmed = question.trim()

    if (trimmed.length < this.MIN_QUESTION_LENGTH) {
      return { isValid: false, error: 'Question cannot be empty' }
    }

    if (trimmed.length > this.MAX_QUESTION_LENGTH) {
      return { isValid: false, error: `Question too long (max ${this.MAX_QUESTION_LENGTH} characters)` }
    }

    // Check for dangerous patterns
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(trimmed)) {
        return { isValid: false, error: 'Question contains potentially dangerous content' }
      }
    }

    // Basic sanitization - remove/escape potentially harmful characters
    const sanitized = trimmed
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
      .slice(0, this.MAX_QUESTION_LENGTH) // Ensure length limit

    return { isValid: true, sanitized }
  }

  public static validatePayloadSize(request: NextRequest): boolean {
    const contentLength = request.headers.get('content-length')
    if (contentLength) {
      const size = parseInt(contentLength, 10)
      return size <= 50 * 1024 // 50KB limit
    }
    return true // If no content-length header, let it through (Next.js will handle)
  }
}

/**
 * Security middleware for MCP endpoints
 */
export class SecurityMiddleware {
  public static checkRateLimit(request: NextRequest): { allowed: boolean; error?: any } {
    const identifier = this.getClientIdentifier(request)
    
    if (rateLimiter.isRateLimited(identifier)) {
      return {
        allowed: false,
        error: {
          code: -32000,
          message: 'Rate limit exceeded',
          data: {
            retryAfter: Math.ceil((rateLimiter.getResetTime(identifier) - Date.now()) / 1000),
            remaining: 0
          }
        }
      }
    }

    return { allowed: true }
  }

  public static validateRequest(request: NextRequest): { valid: boolean; error?: any } {
    // Check payload size
    if (!InputValidator.validatePayloadSize(request)) {
      return {
        valid: false,
        error: {
          code: -32600,
          message: 'Invalid Request',
          data: 'Payload too large'
        }
      }
    }

    return { valid: true }
  }

  private static getClientIdentifier(request: NextRequest): string {
    // In production, you might want to use a more sophisticated identifier
    // For now, use IP address from various possible headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')
    
    return forwarded?.split(',')[0]?.trim() || 
           realIp || 
           cfConnectingIp || 
           'unknown'
  }

  public static getRateLimitHeaders(request: NextRequest): Record<string, string> {
    const identifier = this.getClientIdentifier(request)
    const remaining = rateLimiter.getRemainingRequests(identifier)
    const resetTime = rateLimiter.getResetTime(identifier)

    return {
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString()
    }
  }
}

/**
 * Error sanitization - remove sensitive information from errors
 */
export class ErrorSanitizer {
  private static readonly SENSITIVE_PATTERNS = [
    /api[_-]?key/i,
    /token/i,
    /password/i,
    /secret/i,
    /credential/i
  ]

  public static sanitizeError(error: any): { code: number; message: string; data?: any } {
    if (!error) {
      return { code: -32603, message: 'Internal error' }
    }

    let message = 'Internal error'
    let data: any = undefined

    if (error instanceof Error) {
      message = error.message
      
      // Check if error message contains sensitive information
      for (const pattern of this.SENSITIVE_PATTERNS) {
        if (pattern.test(message)) {
          message = 'Internal configuration error'
          break
        }
      }
    } else if (typeof error === 'string') {
      message = error
    }

    // In development, include more details
    if (process.env.NODE_ENV === 'development' && error.stack) {
      data = { stack: error.stack }
    }

    return {
      code: -32603,
      message,
      data
    }
  }
}

/**
 * Secure logger that doesn't log sensitive information
 */
export class SecureLogger {
  private static readonly REDACT_PATTERNS = [
    /(api[_-]?key["\s]*[:=]["\s]*)[^"\s,}]+/gi,
    /(token["\s]*[:=]["\s]*)[^"\s,}]+/gi,
    /(password["\s]*[:=]["\s]*)[^"\s,}]+/gi
  ]

  public static log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    const timestamp = new Date().toISOString()
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`

    if (data) {
      let serializedData = JSON.stringify(data, null, 2)
      
      // Redact sensitive information
      for (const pattern of this.REDACT_PATTERNS) {
        serializedData = serializedData.replace(pattern, '$1[REDACTED]')
      }
      
      logMessage += `\nData: ${serializedData}`
    }

    console.log(logMessage)
  }

  public static info(message: string, data?: any): void {
    this.log('info', message, data)
  }

  public static warn(message: string, data?: any): void {
    this.log('warn', message, data)
  }

  public static error(message: string, data?: any): void {
    this.log('error', message, data)
  }
}
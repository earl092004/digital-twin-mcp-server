import { NextResponse } from 'next/server'
import { getDigitalTwinInfo, testConnections } from '../../lib/digital-twin'
import { SecureLogger } from '../../lib/security'

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: {
      status: 'up' | 'down'
      responseTime?: number
      vectorCount?: number
      error?: string
    }
    ai: {
      status: 'up' | 'down'
      responseTime?: number
      error?: string
    }
    memory: {
      usage: number
      limit: number
      percentage: number
    }
  }
}

export async function GET() {
  const startTime = Date.now()
  const timestamp = new Date().toISOString()
  
  try {
    // Initialize health check response
    const healthCheck: HealthCheckResponse = {
      status: 'healthy',
      timestamp,
      version: '1.0.0',
      uptime: process.uptime(),
      checks: {
        database: { status: 'down' },
        ai: { status: 'down' },
        memory: {
          usage: 0,
          limit: 0,
          percentage: 0
        }
      }
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage()
    const memoryLimit = 512 * 1024 * 1024 // 512MB limit (adjust as needed)
    const memoryPercentage = (memoryUsage.heapUsed / memoryLimit) * 100

    healthCheck.checks.memory = {
      usage: memoryUsage.heapUsed,
      limit: memoryLimit,
      percentage: Math.round(memoryPercentage * 100) / 100
    }

    // Test database connection
    const dbStartTime = Date.now()
    try {
      const dbInfo = await getDigitalTwinInfo()
      const dbResponseTime = Date.now() - dbStartTime
      
      if (dbInfo.success) {
        healthCheck.checks.database = {
          status: 'up',
          responseTime: dbResponseTime,
          vectorCount: dbInfo.vectorCount
        }
      } else {
        healthCheck.checks.database = {
          status: 'down',
          responseTime: dbResponseTime,
          error: 'Database connection failed'
        }
        healthCheck.status = 'degraded'
      }
    } catch (error) {
      const dbResponseTime = Date.now() - dbStartTime
      healthCheck.checks.database = {
        status: 'down',
        responseTime: dbResponseTime,
        error: 'Database timeout or error'
      }
      healthCheck.status = 'degraded'
    }

    // Test AI service connection
    const aiStartTime = Date.now()
    try {
      const connections = await testConnections()
      const aiResponseTime = Date.now() - aiStartTime
      
      if (connections.groq.success) {
        healthCheck.checks.ai = {
          status: 'up',
          responseTime: aiResponseTime
        }
      } else {
        healthCheck.checks.ai = {
          status: 'down',
          responseTime: aiResponseTime,
          error: connections.groq.error || 'AI service connection failed'
        }
        healthCheck.status = 'degraded'
      }
    } catch (error) {
      const aiResponseTime = Date.now() - aiStartTime
      healthCheck.checks.ai = {
        status: 'down',
        responseTime: aiResponseTime,
        error: 'AI service timeout or error'
      }
      healthCheck.status = 'degraded'
    }

    // Determine overall status
    const allDown = healthCheck.checks.database.status === 'down' && healthCheck.checks.ai.status === 'down'
    const criticalMemory = memoryPercentage > 90

    if (allDown || criticalMemory) {
      healthCheck.status = 'unhealthy'
    } else if (healthCheck.checks.database.status === 'down' || healthCheck.checks.ai.status === 'down') {
      healthCheck.status = 'degraded'
    }

    const totalResponseTime = Date.now() - startTime
    SecureLogger.info('Health check completed', { 
      status: healthCheck.status, 
      duration: totalResponseTime,
      dbStatus: healthCheck.checks.database.status,
      aiStatus: healthCheck.checks.ai.status,
      memoryPercentage: memoryPercentage
    })

    // Set appropriate HTTP status
    let httpStatus = 200
    if (healthCheck.status === 'degraded') {
      httpStatus = 200 // Still operational
    } else if (healthCheck.status === 'unhealthy') {
      httpStatus = 503 // Service unavailable
    }

    return NextResponse.json(healthCheck, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    const totalResponseTime = Date.now() - startTime
    SecureLogger.error('Health check failed', { error: error instanceof Error ? error.message : 'Unknown error', duration: totalResponseTime })
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp,
      version: '1.0.0',
      uptime: process.uptime(),
      error: 'Health check failed',
      checks: {
        database: { status: 'down', error: 'Health check failed' },
        ai: { status: 'down', error: 'Health check failed' },
        memory: { usage: 0, limit: 0, percentage: 0 }
      }
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}
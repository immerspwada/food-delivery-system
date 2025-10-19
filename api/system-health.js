// Vercel Serverless Function - System Health Check API
// This function handles /api/system-health endpoint

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Only GET method is allowed'
    });
  }

  const startTime = Date.now();
  const healthChecks = {
    api: { status: 'healthy', message: 'API is running' },
    database: { status: 'unknown', message: 'Not checked' },
    environment: { status: 'unknown', message: 'Not checked' }
  };

  try {
    // Check database connection
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id')
        .limit(1);
      
      if (error) {
        healthChecks.database = {
          status: 'unhealthy',
          message: `Database error: ${error.message}`
        };
      } else {
        healthChecks.database = {
          status: 'healthy',
          message: 'Database connection successful'
        };
      }
    } catch (dbError) {
      healthChecks.database = {
        status: 'unhealthy',
        message: `Database connection failed: ${dbError.message}`
      };
    }

    // Check environment variables
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      healthChecks.environment = {
        status: 'unhealthy',
        message: `Missing environment variables: ${missingEnvVars.join(', ')}`
      };
    } else {
      healthChecks.environment = {
        status: 'healthy',
        message: 'All required environment variables are set'
      };
    }

    // Determine overall status
    const allStatuses = Object.values(healthChecks).map(check => check.status);
    let overallStatus = 'healthy';
    
    if (allStatuses.includes('unhealthy')) {
      overallStatus = 'unhealthy';
    } else if (allStatuses.includes('degraded')) {
      overallStatus = 'degraded';
    }

    const responseTime = Date.now() - startTime;

    const response = {
      success: true,
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: '2.0.0',
      checks: healthChecks
    };

    // Set appropriate HTTP status code
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;

    return res.status(statusCode).json(response);

  } catch (error) {
    console.error('Health check error:', error);
    
    return res.status(500).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
      version: '2.0.0',
      error: 'Internal server error during health check',
      message: error.message
    });
  }
}
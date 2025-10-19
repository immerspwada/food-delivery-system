// Vercel Serverless Function - System Health Check API
// This function handles /api/system/health endpoint

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  const checks = {
    api: { status: 'ok', message: 'API is running' },
    database: { status: 'unknown', message: 'Checking database connection...' },
    environment: { status: 'unknown', message: 'Checking environment variables...' }
  };

  try {
    // Check database connection
    const { data, error } = await supabase
      .from('restaurants')
      .select('id')
      .limit(1);

    if (error) {
      checks.database = {
        status: 'error',
        message: `Database connection failed: ${error.message}`
      };
    } else {
      checks.database = {
        status: 'ok',
        message: 'Database connection successful'
      };
    }

    // Check environment variables
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
      checks.environment = {
        status: 'warning',
        message: `Missing environment variables: ${missingEnvVars.join(', ')}`
      };
    } else {
      checks.environment = {
        status: 'ok',
        message: 'All required environment variables are set'
      };
    }

    // Determine overall status
    const hasErrors = Object.values(checks).some(check => check.status === 'error');
    const hasWarnings = Object.values(checks).some(check => check.status === 'warning');

    let overallStatus = 'healthy';
    if (hasErrors) {
      overallStatus = 'unhealthy';
    } else if (hasWarnings) {
      overallStatus = 'degraded';
    }

    const responseTime = Date.now() - startTime;

    res.status(overallStatus === 'unhealthy' ? 503 : 200).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
      environment: process.env.VERCEL_ENV || 'development',
      checks,
      uptime: process.uptime ? `${Math.floor(process.uptime())}s` : 'unknown'
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    checks.database = {
      status: 'error',
      message: `Health check failed: ${error.message}`
    };

    const responseTime = Date.now() - startTime;

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
      environment: process.env.VERCEL_ENV || 'development',
      checks,
      uptime: process.uptime ? `${Math.floor(process.uptime())}s` : 'unknown',
      error: error.message
    });
  }
}
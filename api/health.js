// Vercel Serverless Function - Health Check
// This function will be deployed to /api/health

module.exports = function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET method
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Health check response
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    region: process.env.VERCEL_REGION || 'unknown',
    services: {
      supabase: process.env.SUPABASE_URL ? 'configured' : 'not configured',
      vercel: 'active'
    }
  };

  res.status(200).json(healthData);
}

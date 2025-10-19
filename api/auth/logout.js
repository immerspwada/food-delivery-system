// Vercel Serverless Function - Auth Logout API
// This function handles /api/auth/logout endpoint

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For JWT-based auth, logout is handled client-side by removing the token
    // This endpoint can be used for logging purposes or token blacklisting in the future
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
// Vercel Serverless Function - Auth Refresh API
// This function handles /api/auth/refresh endpoint

import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const userId = decoded.userId;

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        role,
        is_active,
        created_at,
        updated_at,
        last_login,
        login_count,
        user_profiles (
          first_name,
          last_name,
          phone,
          date_of_birth,
          dietary_restrictions,
          notification_preferences,
          emergency_contact_name,
          emergency_contact_phone,
          loyalty_points,
          created_at,
          updated_at
        ),
        user_addresses (
          id,
          address_line_1,
          address_line_2,
          city,
          state,
          postal_code,
          country,
          latitude,
          longitude,
          is_default,
          address_type,
          label,
          created_at,
          updated_at
        )
      `)
      .eq('id', userId)
      .single();

    if (userError || !user || !user.is_active) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Get order statistics
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, status')
      .eq('user_id', userId);

    const orderStats = {
      totalOrders: orders?.length || 0,
      totalSpent: orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
      completedOrders: orders?.filter(order => order.status === 'delivered').length || 0
    };

    // Generate new access token
    const newToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { 
        userId: user.id,
        type: 'refresh'
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Format user data
    const enhancedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
      login_count: user.login_count,
      profile: user.user_profiles?.[0] || null,
      addresses: user.user_addresses || [],
      defaultAddress: user.user_addresses?.find(addr => addr.is_default) || null,
      loyaltyPoints: user.user_profiles?.[0]?.loyalty_points || 0,
      orderStats
    };

    return res.status(200).json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken,
      user: enhancedUser,
      message: 'Token refreshed successfully'
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
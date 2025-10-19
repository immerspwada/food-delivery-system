// Vercel Serverless Function - Auth Login API
// This function handles /api/auth/login endpoint

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
    const { email, password, phone } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone is required' });
    }

    // Find user by email or phone
    let query = supabase
      .from('users')
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          phone,
          date_of_birth,
          loyalty_points,
          total_orders,
          total_spent,
          completed_orders,
          created_at,
          updated_at
        ),
        addresses:user_addresses (
          id,
          label,
          address_line_1,
          address_line_2,
          city,
          state,
          postal_code,
          country,
          latitude,
          longitude,
          is_default,
          created_at
        )
      `)
      .eq('is_active', true);

    if (email) {
      query = query.eq('email', email.toLowerCase());
    } else {
      query = query.eq('phone', phone);
    }

    const { data: users, error: fetchError } = await query;

    if (fetchError) {
      console.error('Database error:', fetchError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update login statistics
    const loginCount = (user.login_count || 0) + 1;
    await supabase
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        login_count: loginCount
      })
      .eq('id', user.id);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Format user data
    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLogin: new Date().toISOString(),
      loginCount: loginCount,
      profile: user.profiles?.[0] || null,
      addresses: user.addresses || [],
      defaultAddress: user.addresses?.find(addr => addr.is_default) || null,
      loyaltyPoints: user.profiles?.[0]?.loyalty_points || 0,
      orderStats: {
        totalOrders: user.profiles?.[0]?.total_orders || 0,
        totalSpent: user.profiles?.[0]?.total_spent || 0,
        completedOrders: user.profiles?.[0]?.completed_orders || 0
      }
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
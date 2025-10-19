// Vercel Serverless Function - Auth Register API
// This function handles /api/auth/register endpoint

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = async function handler(req, res) {
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
    const { email, password, phone, firstName, lastName } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id, email, phone')
      .or(`email.eq.${email.toLowerCase()},phone.eq.${phone || ''}`);

    if (checkError) {
      console.error('Database check error:', checkError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingUsers && existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      if (existingUser.email === email.toLowerCase()) {
        return res.status(409).json({ error: 'Email already registered' });
      }
      if (phone && existingUser.phone === phone) {
        return res.status(409).json({ error: 'Phone number already registered' });
      }
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        phone: phone || null,
        password_hash: passwordHash,
        role: 'customer',
        is_active: true,
        created_at: new Date().toISOString(),
        login_count: 1,
        last_login: new Date().toISOString()
      })
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: newUser.id,
        first_name: firstName || '',
        last_name: lastName || '',
        phone: phone || null,
        loyalty_points: 0,
        total_orders: 0,
        total_spent: 0,
        completed_orders: 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Continue without profile for now
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Format user data
    const userData = {
      id: newUser.id,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      isActive: newUser.is_active,
      createdAt: newUser.created_at,
      updatedAt: newUser.updated_at,
      lastLogin: newUser.last_login,
      loginCount: newUser.login_count,
      profile: profile || null,
      addresses: [],
      defaultAddress: null,
      loyaltyPoints: 0,
      orderStats: {
        totalOrders: 0,
        totalSpent: 0,
        completedOrders: 0
      }
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Registration API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
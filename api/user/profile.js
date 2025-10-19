// Vercel Serverless Function - User Profile API
// This function handles /api/user/profile endpoint

const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Verify authentication
    const user = verifyToken(req);
    const userId = user.userId;

    if (req.method === 'GET') {
      // Get user profile
      const { data: userData, error } = await supabase
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
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }

      if (!userData) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Format user data
      const enhancedUser = {
        id: userData.id,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        isActive: userData.is_active,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
        lastLogin: userData.last_login,
        loginCount: userData.login_count,
        profile: userData.profiles?.[0] || null,
        addresses: userData.addresses || [],
        defaultAddress: userData.addresses?.find(addr => addr.is_default) || null,
        loyaltyPoints: userData.profiles?.[0]?.loyalty_points || 0,
        orderStats: {
          totalOrders: userData.profiles?.[0]?.total_orders || 0,
          totalSpent: userData.profiles?.[0]?.total_spent || 0,
          completedOrders: userData.profiles?.[0]?.completed_orders || 0
        }
      };

      return res.status(200).json({
        success: true,
        user: enhancedUser
      });

    } else if (req.method === 'PUT') {
      // Update user profile
      const { firstName, lastName, phone, dateOfBirth, email } = req.body;

      // Update user table if email or phone changed
      if (email || phone) {
        const userUpdates = {};
        if (email) userUpdates.email = email.toLowerCase();
        if (phone) userUpdates.phone = phone;

        const { error: userUpdateError } = await supabase
          .from('users')
          .update(userUpdates)
          .eq('id', userId);

        if (userUpdateError) {
          console.error('User update error:', userUpdateError);
          return res.status(500).json({ error: 'Failed to update user' });
        }
      }

      // Update or create profile
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        date_of_birth: dateOfBirth,
        updated_at: new Date().toISOString()
      };

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      let profileError;
      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', userId);
        profileError = error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            ...profileData,
            loyalty_points: 0,
            total_orders: 0,
            total_spent: 0,
            completed_orders: 0,
            created_at: new Date().toISOString()
          });
        profileError = error;
      }

      if (profileError) {
        console.error('Profile update error:', profileError);
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      // Fetch updated user data
      const { data: updatedUser, error: fetchError } = await supabase
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
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Updated profile fetch error:', fetchError);
        return res.status(500).json({ error: 'Failed to fetch updated profile' });
      }

      // Format updated user data
      const enhancedUser = {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isActive: updatedUser.is_active,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at,
        lastLogin: updatedUser.last_login,
        loginCount: updatedUser.login_count,
        profile: updatedUser.profiles?.[0] || null,
        addresses: updatedUser.addresses || [],
        defaultAddress: updatedUser.addresses?.find(addr => addr.is_default) || null,
        loyaltyPoints: updatedUser.profiles?.[0]?.loyalty_points || 0,
        orderStats: {
          totalOrders: updatedUser.profiles?.[0]?.total_orders || 0,
          totalSpent: updatedUser.profiles?.[0]?.total_spent || 0,
          completedOrders: updatedUser.profiles?.[0]?.completed_orders || 0
        }
      };

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: enhancedUser
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Profile API error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
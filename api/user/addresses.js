// Vercel Serverless Function - Auth Addresses API
// This function handles /api/auth/addresses endpoint

const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId;

    if (req.method === 'GET') {
      // Get user addresses
      const { data: addresses, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ error: 'Failed to fetch addresses' });
      }

      return res.status(200).json({
        success: true,
        addresses: addresses || [],
        message: 'Addresses retrieved successfully'
      });

    } else if (req.method === 'POST') {
      // Create new address
      const addressData = req.body;

      if (!addressData.label || !addressData.address_line1) {
        return res.status(400).json({ error: 'Label and address line 1 are required' });
      }

      // If this is set as default, unset other default addresses
      if (addressData.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { data: address, error } = await supabase
        .from('user_addresses')
        .insert({
          user_id: userId,
          label: addressData.label,
          address_line1: addressData.address_line1,
          address_line2: addressData.address_line2 || null,
          district: addressData.district || null,
          province: addressData.province || null,
          postal_code: addressData.postal_code || null,
          latitude: addressData.latitude || null,
          longitude: addressData.longitude || null,
          phone: addressData.phone || null,
          recipient_name: addressData.recipient_name || null,
          is_default: addressData.is_default || false,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Create address error:', error);
        return res.status(400).json({ error: 'Failed to create address' });
      }

      return res.status(201).json({
        success: true,
        address,
        message: 'Address created successfully'
      });

    } else if (req.method === 'PUT') {
      // Update existing address
      const { id } = req.query;
      const addressData = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Address ID is required' });
      }

      // If this is set as default, unset other default addresses
      if (addressData.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', userId)
          .neq('id', id);
      }

      const { data: address, error } = await supabase
        .from('user_addresses')
        .update({
          label: addressData.label,
          address_line1: addressData.address_line1,
          address_line2: addressData.address_line2,
          district: addressData.district,
          province: addressData.province,
          postal_code: addressData.postal_code,
          latitude: addressData.latitude,
          longitude: addressData.longitude,
          phone: addressData.phone,
          recipient_name: addressData.recipient_name,
          is_default: addressData.is_default,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update address error:', error);
        return res.status(400).json({ error: 'Failed to update address' });
      }

      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }

      return res.status(200).json({
        success: true,
        address,
        message: 'Address updated successfully'
      });

    } else if (req.method === 'DELETE') {
      // Delete address
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Address ID is required' });
      }

      const { data: address, error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Delete address error:', error);
        return res.status(400).json({ error: 'Failed to delete address' });
      }

      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Address deleted successfully'
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Addresses API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
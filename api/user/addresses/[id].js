// Vercel Serverless Function - Auth Address by ID API
// This function handles /api/auth/addresses/[id] endpoint

import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
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
    const { id: addressId } = req.query;

    if (!addressId) {
      return res.status(400).json({ error: 'Address ID is required' });
    }

    // Verify address belongs to user
    const { data: existingAddress, error: checkError } = await supabase
      .from('user_addresses')
      .select('id, user_id')
      .eq('id', addressId)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    if (req.method === 'GET') {
      // Get specific address
      const { data: address, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('id', addressId)
        .eq('user_id', userId)
        .single();

      if (error || !address) {
        return res.status(404).json({ error: 'Address not found' });
      }

      return res.status(200).json({
        success: true,
        address,
        message: 'Address retrieved successfully'
      });

    } else if (req.method === 'PUT') {
      // Update address
      const addressData = req.body;

      // If this is set as default, unset other default addresses
      if (addressData.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', userId)
          .neq('id', addressId);
      }

      const { data: address, error } = await supabase
        .from('user_addresses')
        .update({
          ...addressData,
          updated_at: new Date().toISOString()
        })
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: 'Failed to update address' });
      }

      return res.status(200).json({
        success: true,
        address,
        message: 'Address updated successfully'
      });

    } else if (req.method === 'DELETE') {
      // Delete address
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId);

      if (error) {
        return res.status(400).json({ error: 'Failed to delete address' });
      }

      return res.status(200).json({
        success: true,
        message: 'Address deleted successfully'
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Address API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
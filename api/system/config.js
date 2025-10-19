// Vercel Serverless Function - System Configuration API
// This function handles /api/system/config endpoint

import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token and check admin role
function verifyAdminToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      throw new Error('Admin access required');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid token or insufficient permissions');
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get system configuration (public settings only)
      const { data: config, error } = await supabase
        .from('system_config')
        .select('*')
        .eq('is_public', true);

      if (error) {
        console.error('Config fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch configuration' });
      }

      // Transform array to object for easier access
      const configObj = {};
      config?.forEach(item => {
        configObj[item.key] = {
          value: item.value,
          description: item.description,
          updated_at: item.updated_at
        };
      });

      res.status(200).json({
        success: true,
        data: configObj
      });

    } else if (req.method === 'PUT') {
      // Update system configuration (admin only)
      const admin = verifyAdminToken(req);
      
      const { key, value, description } = req.body;

      if (!key || value === undefined) {
        return res.status(400).json({ error: 'Key and value are required' });
      }

      // Check if config exists
      const { data: existingConfig, error: fetchError } = await supabase
        .from('system_config')
        .select('*')
        .eq('key', key)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Config fetch error:', fetchError);
        return res.status(500).json({ error: 'Failed to fetch existing configuration' });
      }

      let result;
      if (existingConfig) {
        // Update existing config
        const { data, error } = await supabase
          .from('system_config')
          .update({
            value: value,
            description: description || existingConfig.description,
            updated_at: new Date().toISOString(),
            updated_by: admin.userId
          })
          .eq('key', key)
          .select()
          .single();

        result = { data, error };
      } else {
        // Create new config
        const { data, error } = await supabase
          .from('system_config')
          .insert({
            key,
            value,
            description: description || '',
            is_public: true,
            created_by: admin.userId,
            updated_by: admin.userId
          })
          .select()
          .single();

        result = { data, error };
      }

      if (result.error) {
        console.error('Config update error:', result.error);
        return res.status(500).json({ error: 'Failed to update configuration' });
      }

      res.status(200).json({
        success: true,
        data: result.data,
        message: existingConfig ? 'Configuration updated successfully' : 'Configuration created successfully'
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('System config API error:', error);
    if (error.message === 'No token provided' || 
        error.message === 'Invalid token or insufficient permissions' ||
        error.message === 'Admin access required') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
// Vercel Serverless Function - Order History API
// This function handles /api/order/history endpoint

import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const user = verifyToken(req);
    
    const { 
      status,
      start_date,
      end_date,
      restaurant_id,
      page = 1,
      limit = 20,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (
            id,
            name,
            price,
            image_url
          )
        ),
        restaurants (
          id,
          name,
          image_url,
          phone
        )
      `);

    // Filter by user - check both user_id and customer_phone
    if (user.userId) {
      query = query.eq('user_id', user.userId);
    } else if (user.phone) {
      query = query.eq('customer_phone', user.phone);
    } else {
      return res.status(400).json({ error: 'User identification required' });
    }

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by date range
    if (start_date) {
      query = query.gte('created_at', start_date);
    }
    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    // Filter by restaurant
    if (restaurant_id) {
      query = query.eq('restaurant_id', restaurant_id);
    }

    // Sorting
    const ascending = sort_order === 'asc';
    switch (sort_by) {
      case 'created_at':
        query = query.order('created_at', { ascending });
        break;
      case 'total_amount':
        query = query.order('total_amount', { ascending });
        break;
      case 'status':
        query = query.order('status', { ascending }).order('created_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: orders, error } = await query;

    if (error) {
      console.error('Order history fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch order history' });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('orders')
      .select('id', { count: 'exact', head: true });

    if (user.userId) {
      countQuery = countQuery.eq('user_id', user.userId);
    } else if (user.phone) {
      countQuery = countQuery.eq('customer_phone', user.phone);
    }

    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    if (start_date) {
      countQuery = countQuery.gte('created_at', start_date);
    }
    if (end_date) {
      countQuery = countQuery.lte('created_at', end_date);
    }
    if (restaurant_id) {
      countQuery = countQuery.eq('restaurant_id', restaurant_id);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Order count error:', countError);
    }

    // Calculate summary statistics
    const totalOrders = orders?.length || 0;
    const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Group orders by status
    const statusCounts = {};
    orders?.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        orders: orders || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / parseInt(limit))
        },
        summary: {
          totalOrders: count || 0,
          totalSpent,
          avgOrderValue,
          statusCounts
        }
      }
    });

  } catch (error) {
    console.error('Order history API error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
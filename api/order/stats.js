// Vercel Serverless Function - Order Statistics API
// This function handles /api/order/stats endpoint

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
      period = '30d', // 7d, 30d, 90d, 1y, all
      start_date,
      end_date
    } = req.query;

    // Calculate date range based on period
    let dateFilter = {};
    const now = new Date();
    
    if (start_date && end_date) {
      dateFilter.start = start_date;
      dateFilter.end = end_date;
    } else {
      switch (period) {
        case '7d':
          dateFilter.start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case '30d':
          dateFilter.start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case '90d':
          dateFilter.start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case '1y':
          dateFilter.start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
          break;
        case 'all':
          // No date filter
          break;
        default:
          dateFilter.start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      }
      dateFilter.end = now.toISOString();
    }

    // Build base query for user's orders
    let baseQuery = supabase.from('orders');

    // Filter by user - check both user_id and customer_phone
    if (user.userId) {
      baseQuery = baseQuery.eq('user_id', user.userId);
    } else if (user.phone) {
      baseQuery = baseQuery.eq('customer_phone', user.phone);
    } else {
      return res.status(400).json({ error: 'User identification required' });
    }

    // Apply date filter
    if (dateFilter.start) {
      baseQuery = baseQuery.gte('created_at', dateFilter.start);
    }
    if (dateFilter.end) {
      baseQuery = baseQuery.lte('created_at', dateFilter.end);
    }

    // Get all orders for the period
    const { data: orders, error: ordersError } = await baseQuery
      .select(`
        id,
        total_amount,
        status,
        created_at,
        restaurant_id,
        restaurants (
          id,
          name
        )
      `);

    if (ordersError) {
      console.error('Orders fetch error:', ordersError);
      return res.status(500).json({ error: 'Failed to fetch order statistics' });
    }

    // Calculate basic statistics
    const totalOrders = orders?.length || 0;
    const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Count orders by status
    const statusCounts = {};
    orders?.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    // Count orders by restaurant
    const restaurantCounts = {};
    const restaurantSpending = {};
    orders?.forEach(order => {
      const restaurantName = order.restaurants?.name || 'Unknown';
      restaurantCounts[restaurantName] = (restaurantCounts[restaurantName] || 0) + 1;
      restaurantSpending[restaurantName] = (restaurantSpending[restaurantName] || 0) + (order.total_amount || 0);
    });

    // Calculate monthly trends (if period allows)
    const monthlyTrends = {};
    if (period !== '7d') {
      orders?.forEach(order => {
        const month = new Date(order.created_at).toISOString().substring(0, 7); // YYYY-MM
        if (!monthlyTrends[month]) {
          monthlyTrends[month] = {
            orders: 0,
            spending: 0
          };
        }
        monthlyTrends[month].orders += 1;
        monthlyTrends[month].spending += order.total_amount || 0;
      });
    }

    // Get recent orders (last 5)
    let recentOrdersQuery = supabase
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
          image_url
        )
      `);

    // Apply same user filter
    if (user.userId) {
      recentOrdersQuery = recentOrdersQuery.eq('user_id', user.userId);
    } else if (user.phone) {
      recentOrdersQuery = recentOrdersQuery.eq('customer_phone', user.phone);
    }

    const { data: recentOrders, error: recentError } = await recentOrdersQuery
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('Recent orders fetch error:', recentError);
    }

    res.status(200).json({
      success: true,
      data: {
        period: period,
        dateRange: dateFilter,
        summary: {
          totalOrders,
          totalSpent,
          avgOrderValue,
          statusCounts,
          restaurantCounts,
          restaurantSpending
        },
        trends: {
          monthly: monthlyTrends
        },
        recentOrders: recentOrders || []
      }
    });

  } catch (error) {
    console.error('Order stats API error:', error);
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
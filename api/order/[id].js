// Vercel Serverless Function - Single Order API
// This function handles /api/order/[id] endpoint

import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token (optional for some operations)
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    switch (req.method) {
      case 'GET':
        await handleGet(req, res, id);
        break;
      case 'PUT':
      case 'PATCH':
        await handleUpdate(req, res, id);
        break;
      case 'DELETE':
        await handleDelete(req, res, id);
        break;
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Order API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

// GET /api/order/[id] - Get single order
async function handleGet(req, res, id) {
  const user = verifyToken(req);
  
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
        phone,
        address
      )
    `)
    .eq('id', id);

  // If user is authenticated, filter by user access
  if (user) {
    query = query.or(`user_id.eq.${user.userId},customer_phone.eq.${user.phone || ''}`);
  }

  const { data: order, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Order not found' });
    }
    throw error;
  }

  res.status(200).json({
    success: true,
    data: order
  });
}

// PUT/PATCH /api/order/[id] - Update order
async function handleUpdate(req, res, id) {
  const user = verifyToken(req);
  const updates = req.body;
  
  // Remove fields that shouldn't be updated
  delete updates.id;
  delete updates.created_at;
  delete updates.user_id;
  delete updates.customer_phone;

  // Add updated timestamp
  updates.updated_at = new Date().toISOString();

  // Build query with access control
  let query = supabase
    .from('orders')
    .update(updates)
    .eq('id', id);

  // If user is authenticated, ensure they can only update their own orders
  if (user) {
    query = query.or(`user_id.eq.${user.userId},customer_phone.eq.${user.phone || ''}`);
  }

  const { data, error } = await query
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
    `)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Order not found or access denied' });
    }
    throw error;
  }

  res.status(200).json({
    success: true,
    data: data,
    message: 'Order updated successfully'
  });
}

// DELETE /api/order/[id] - Cancel order
async function handleDelete(req, res, id) {
  const user = verifyToken(req);
  
  // First check if order exists and can be cancelled
  let checkQuery = supabase
    .from('orders')
    .select('id, status, created_at')
    .eq('id', id);

  if (user) {
    checkQuery = checkQuery.or(`user_id.eq.${user.userId},customer_phone.eq.${user.phone || ''}`);
  }

  const { data: existingOrder, error: checkError } = await checkQuery.single();

  if (checkError || !existingOrder) {
    return res.status(404).json({ error: 'Order not found or access denied' });
  }

  // Check if order can be cancelled
  const nonCancellableStatuses = ['delivered', 'cancelled'];
  if (nonCancellableStatuses.includes(existingOrder.status)) {
    return res.status(400).json({ 
      error: `Cannot cancel order with status: ${existingOrder.status}` 
    });
  }

  // Update order status to cancelled
  let updateQuery = supabase
    .from('orders')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (user) {
    updateQuery = updateQuery.or(`user_id.eq.${user.userId},customer_phone.eq.${user.phone || ''}`);
  }

  const { data, error } = await updateQuery
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
    `)
    .single();

  if (error) {
    throw error;
  }

  res.status(200).json({
    success: true,
    data: data,
    message: 'Order cancelled successfully'
  });
}
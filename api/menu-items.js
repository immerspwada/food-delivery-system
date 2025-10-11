// Vercel Serverless Function - Menu Items API
// This function will be deployed to /api/menu-items

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
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
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      case 'PUT':
        await handlePut(req, res);
        break;
      case 'DELETE':
        await handleDelete(req, res);
        break;
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Menu Items API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

// GET /api/menu-items - Get menu items
async function handleGet(req, res) {
  const { categoryId, restaurantId, search, available } = req.query;

  let query = supabase
    .from('menu_items')
    .select(`
      *,
      categories (
        id,
        name,
        description
      ),
      restaurants (
        id,
        name
      )
    `);

  // Filter by category if provided
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  // Filter by restaurant if provided
  if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId);
  }

  // Filter by availability if provided
  if (available !== undefined) {
    query = query.eq('is_available', available === 'true');
  } else {
    // Default to available items only
    query = query.eq('is_available', true);
  }

  // Search by name if provided
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  query = query.order('name');

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  res.status(200).json(data || []);
}

// POST /api/menu-items - Create new menu item (Admin only)
async function handlePost(req, res) {
  const {
    name,
    description,
    price,
    image_url,
    category_id,
    restaurant_id,
    is_available = true,
    ingredients = [],
    allergens = [],
    nutritional_info = {},
    preparation_time
  } = req.body;

  // Validate required fields
  if (!name || !price || !category_id || !restaurant_id) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['name', 'price', 'category_id', 'restaurant_id']
    });
  }

  const { data, error } = await supabase
    .from('menu_items')
    .insert([{
      name,
      description,
      price,
      image_url,
      category_id,
      restaurant_id,
      is_available,
      ingredients,
      allergens,
      nutritional_info,
      preparation_time
    }])
    .select(`
      *,
      categories (
        id,
        name,
        description
      ),
      restaurants (
        id,
        name
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  res.status(201).json(data);
}

// PUT /api/menu-items - Update menu item (Admin only)
async function handlePut(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Menu item ID is required' });
  }

  const updates = req.body;
  delete updates.id; // Don't allow ID updates
  delete updates.created_at; // Don't allow created_at updates

  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      categories (
        id,
        name,
        description
      ),
      restaurants (
        id,
        name
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  res.status(200).json(data);
}

// DELETE /api/menu-items - Delete menu item (Admin only)
async function handleDelete(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Menu item ID is required' });
  }

  // Soft delete by setting is_available to false
  const { data, error } = await supabase
    .from('menu_items')
    .update({ is_available: false })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  res.status(200).json({ message: 'Menu item deleted successfully' });
}

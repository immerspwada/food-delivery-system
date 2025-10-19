// Vercel Serverless Function - Single Restaurant API
// This function handles /api/restaurant/[id] endpoint

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Restaurant ID is required' });
    }

    switch (req.method) {
      case 'GET':
        await handleGet(req, res, id);
        break;
      case 'PUT':
        await handlePut(req, res, id);
        break;
      case 'DELETE':
        await handleDelete(req, res, id);
        break;
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Restaurant API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

// GET /api/restaurant/[id] - Get single restaurant with menu
async function handleGet(req, res, id) {
  const { include_menu = 'true' } = req.query;

  let query = supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .eq('is_active', true);

  const { data: restaurant, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    throw error;
  }

  let restaurantData = restaurant;

  // Include menu items if requested
  if (include_menu === 'true') {
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .eq('restaurant_id', id)
      .eq('is_available', true)
      .order('category_id')
      .order('name');

    if (menuError) {
      console.error('Menu fetch error:', menuError);
    } else {
      // Group menu items by category
      const menuByCategory = {};
      menuItems?.forEach(item => {
        const categoryName = item.categories?.name || 'Other';
        if (!menuByCategory[categoryName]) {
          menuByCategory[categoryName] = {
            category: item.categories,
            items: []
          };
        }
        menuByCategory[categoryName].items.push(item);
      });

      restaurantData = {
        ...restaurant,
        menu: menuByCategory,
        totalMenuItems: menuItems?.length || 0
      };
    }
  }

  res.status(200).json({
    success: true,
    data: restaurantData
  });
}

// PUT /api/restaurant/[id] - Update restaurant (Admin only)
async function handlePut(req, res, id) {
  // TODO: Add admin authentication middleware
  
  const updates = req.body;
  delete updates.id; // Don't allow ID updates
  delete updates.created_at; // Don't allow created_at updates

  const { data, error } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  res.status(200).json({
    success: true,
    data: data,
    message: 'Restaurant updated successfully'
  });
}

// DELETE /api/restaurant/[id] - Soft delete restaurant (Admin only)
async function handleDelete(req, res, id) {
  // TODO: Add admin authentication middleware
  
  const { data, error } = await supabase
    .from('restaurants')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Restaurant deleted successfully'
  });
}
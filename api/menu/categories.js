// Vercel Serverless Function - Menu Categories API
// This function handles /api/menu/categories endpoint

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
    console.error('Categories API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

// GET /api/menu/categories - Get all categories
async function handleGet(req, res) {
  const { restaurant_id, include_items = 'false' } = req.query;

  let query = supabase
    .from('categories')
    .select('*')
    .order('name');

  // Filter by restaurant if provided
  if (restaurant_id) {
    query = query.eq('restaurant_id', restaurant_id);
  }

  const { data: categories, error } = await query;

  if (error) {
    throw error;
  }

  let categoriesData = categories || [];

  // Include menu items count if requested
  if (include_items === 'true') {
    categoriesData = await Promise.all(
      categories.map(async (category) => {
        const { data: items, error: itemsError } = await supabase
          .from('menu_items')
          .select('id')
          .eq('category_id', category.id)
          .eq('is_available', true);

        if (itemsError) {
          console.error('Items count error:', itemsError);
          return { ...category, itemsCount: 0 };
        }

        return { ...category, itemsCount: items?.length || 0 };
      })
    );
  }

  res.status(200).json({
    success: true,
    data: categoriesData
  });
}

// POST /api/menu/categories - Create new category (Admin only)
async function handlePost(req, res) {
  // TODO: Add admin authentication middleware
  
  const { name, description, restaurant_id } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name,
      description: description || null,
      restaurant_id: restaurant_id || null,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  res.status(201).json({
    success: true,
    data: data,
    message: 'Category created successfully'
  });
}

// PUT /api/menu/categories - Update category (Admin only)
async function handlePut(req, res) {
  // TODO: Add admin authentication middleware
  
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  const updates = req.body;
  delete updates.id; // Don't allow ID updates
  delete updates.created_at; // Don't allow created_at updates

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    return res.status(404).json({ error: 'Category not found' });
  }

  res.status(200).json({
    success: true,
    data: data,
    message: 'Category updated successfully'
  });
}

// DELETE /api/menu/categories - Delete category (Admin only)
async function handleDelete(req, res) {
  // TODO: Add admin authentication middleware
  
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  // Check if category has menu items
  const { data: items, error: itemsError } = await supabase
    .from('menu_items')
    .select('id')
    .eq('category_id', id)
    .limit(1);

  if (itemsError) {
    throw itemsError;
  }

  if (items && items.length > 0) {
    return res.status(400).json({ 
      error: 'Cannot delete category with existing menu items' 
    });
  }

  const { data, error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    return res.status(404).json({ error: 'Category not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
}
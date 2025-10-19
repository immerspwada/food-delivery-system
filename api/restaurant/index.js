// Vercel Serverless Function - Restaurants API
// This function will be deployed to /api/restaurants

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

// GET /api/restaurants - Get all restaurants
async function handleGet(req, res) {
  const { tag, search } = req.query;

  let query = supabase
    .from('restaurants')
    .select('*')
    .eq('is_active', true)
    .order('name');

  // Filter by tag if provided
  if (tag && tag !== 'all') {
    query = query.contains('tags', [tag]);
  }

  // Search by name if provided
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  res.status(200).json(data || []);
}

// POST /api/restaurants - Create new restaurant (Admin only)
async function handlePost(req, res) {
  const {
    name,
    description,
    image_url,
    cover_image_url,
    rating = 4.5,
    review_count = 0,
    delivery_time,
    delivery_fee,
    minimum_order,
    address,
    phone,
    is_open = true,
    tags = []
  } = req.body;

  // Validate required fields
  if (!name || !description) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['name', 'description']
    });
  }

  const { data, error } = await supabase
    .from('restaurants')
    .insert([{
      name,
      description,
      image_url,
      cover_image_url,
      rating,
      review_count,
      delivery_time,
      delivery_fee,
      minimum_order,
      address,
      phone,
      is_open,
      tags,
      is_active: true
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  res.status(201).json(data);
}

// PUT /api/restaurants - Update restaurant (Admin only)
async function handlePut(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Restaurant ID is required' });
  }

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

  res.status(200).json(data);
}

// DELETE /api/restaurants - Delete restaurant (Admin only)
async function handleDelete(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Restaurant ID is required' });
  }

  // Soft delete by setting is_active to false
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

  res.status(200).json({ message: 'Restaurant deleted successfully' });
}

// Vercel Serverless Function - Restaurant Menu API
// This function handles /api/menu/[restaurantId] endpoint

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
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
    const { restaurantId } = req.query;
    const { 
      category_id,
      search,
      dietary_restrictions,
      min_price,
      max_price,
      is_available = 'true',
      sort_by = 'category_id',
      sort_order = 'asc'
    } = req.query;

    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID is required' });
    }

    // Verify restaurant exists and is active
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, name, is_active')
      .eq('id', restaurantId)
      .eq('is_active', true)
      .single();

    if (restaurantError || !restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    let query = supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .eq('restaurant_id', restaurantId);

    // Filter by availability
    if (is_available === 'true') {
      query = query.eq('is_available', true);
    }

    // Filter by category
    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    // Search by name or description
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Filter by dietary restrictions
    if (dietary_restrictions) {
      const restrictions = dietary_restrictions.split(',');
      restrictions.forEach(restriction => {
        query = query.contains('dietary_info', [restriction]);
      });
    }

    // Filter by price range
    if (min_price) {
      query = query.gte('price', parseFloat(min_price));
    }
    if (max_price) {
      query = query.lte('price', parseFloat(max_price));
    }

    // Sorting
    const ascending = sort_order === 'asc';
    switch (sort_by) {
      case 'name':
        query = query.order('name', { ascending });
        break;
      case 'price':
        query = query.order('price', { ascending });
        break;
      case 'category_id':
        query = query.order('category_id', { ascending }).order('name', { ascending: true });
        break;
      default:
        query = query.order('category_id', { ascending: true }).order('name', { ascending: true });
    }

    const { data: menuItems, error } = await query;

    if (error) {
      console.error('Menu items fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch menu items' });
    }

    // Group menu items by category
    const menuByCategory = {};
    const categories = new Set();

    menuItems?.forEach(item => {
      const categoryId = item.category_id;
      const categoryName = item.categories?.name || 'Other';
      
      categories.add(JSON.stringify({
        id: categoryId,
        name: categoryName,
        description: item.categories?.description
      }));

      if (!menuByCategory[categoryName]) {
        menuByCategory[categoryName] = {
          category: item.categories,
          items: []
        };
      }
      menuByCategory[categoryName].items.push(item);
    });

    // Convert categories set back to array
    const categoriesList = Array.from(categories).map(cat => JSON.parse(cat));

    res.status(200).json({
      success: true,
      data: {
        restaurant: restaurant,
        categories: categoriesList,
        menuByCategory: menuByCategory,
        totalItems: menuItems?.length || 0
      }
    });

  } catch (error) {
    console.error('Restaurant Menu API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
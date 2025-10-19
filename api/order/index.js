// Vercel Serverless Function - Orders API
// This function will be deployed to /api/orders

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS');
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
      case 'PATCH':
        await handleUpdate(req, res);
        break;
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Orders API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}

// GET /api/orders - Get orders
async function handleGet(req, res) {
  const { id, customer_phone, status, limit = '50', offset = '0' } = req.query;

  // Get single order by ID
  if (id) {
    const { data, error } = await supabase
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
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(data);
  }

  // Get multiple orders with filters
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
        image_url
      )
    `)
    .order('created_at', { ascending: false })
    .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  // Filter by customer phone if provided
  if (customer_phone) {
    query = query.eq('customer_phone', customer_phone);
  }

  // Filter by status if provided
  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  res.status(200).json(data || []);
}

// POST /api/orders - Create new order
async function handlePost(req, res) {
  const {
    customer_name,
    customer_phone,
    customer_email,
    delivery_address,
    restaurant_id,
    items, // Array of { menu_item_id, quantity, special_instructions?, unit_price }
    notes,
    payment_method = 'cash_on_delivery'
  } = req.body;

  // Validate required fields
  if (!customer_name || !customer_phone || !delivery_address || !restaurant_id || !items || items.length === 0) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['customer_name', 'customer_phone', 'delivery_address', 'restaurant_id', 'items']
    });
  }

  // Calculate total amount
  let total_amount = 0;
  const orderItems = [];

  for (const item of items) {
    const { data: menuItem, error: menuError } = await supabase
      .from('menu_items')
      .select('price, name')
      .eq('id', item.menu_item_id)
      .single();

    if (menuError || !menuItem) {
      return res.status(400).json({ error: `Invalid menu item: ${item.menu_item_id}` });
    }

    const itemTotal = menuItem.price * item.quantity;
    total_amount += itemTotal;

    orderItems.push({
      menu_item_id: item.menu_item_id,
      menu_item_name: menuItem.name,
      quantity: item.quantity,
      unit_price: menuItem.price,
      total_price: itemTotal,
      special_instructions: item.special_instructions
    });
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      restaurant_id,
      total_amount,
      notes,
      payment_method,
      status: 'pending'
    }])
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  // Create order items
  const orderItemsWithOrderId = orderItems.map(item => ({
    ...item,
    order_id: order.id
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsWithOrderId);

  if (itemsError) {
    // Cleanup: delete the order if items creation failed
    await supabase.from('orders').delete().eq('id', order.id);
    throw itemsError;
  }

  // Return complete order with items
  const { data: completeOrder, error: fetchError } = await supabase
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
    `)
    .eq('id', order.id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  res.status(201).json(completeOrder);
}

// PUT/PATCH /api/orders - Update order (mainly for status updates)
async function handleUpdate(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const updates = req.body;
  delete updates.id; // Don't allow ID updates
  delete updates.created_at; // Don't allow created_at updates
  delete updates.total_amount; // Don't allow total amount updates

  // Add updated timestamp
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
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

  if (!data) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.status(200).json(data);
}

// MCP (Material Control Plan) API Endpoints
// Handles inventory management, supplier management, and cost analysis

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, query } = req;
  const { action, id } = query;

  try {
    switch (method) {
      case 'GET':
        return await handleGet(req, res, action, id);
      case 'POST':
        return await handlePost(req, res, action);
      case 'PUT':
        return await handlePut(req, res, action, id);
      case 'DELETE':
        return await handleDelete(req, res, action, id);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('MCP API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// GET handlers
async function handleGet(req, res, action, id) {
  switch (action) {
    case 'materials':
      return await getMaterials(req, res, id);
    case 'suppliers':
      return await getSuppliers(req, res, id);
    case 'purchase-orders':
      return await getPurchaseOrders(req, res, id);
    case 'stock-movements':
      return await getStockMovements(req, res, id);
    case 'alerts':
      return await getAlerts(req, res);
    case 'cost-analysis':
      return await getCostAnalysis(req, res, id);
    case 'dashboard':
      return await getDashboard(req, res);
    case 'low-stock':
      return await getLowStockItems(req, res);
    case 'inventory-report':
      return await getInventoryReport(req, res);
    default:
      return res.status(400).json({ error: 'Invalid action' });
  }
}

// POST handlers
async function handlePost(req, res, action) {
  switch (action) {
    case 'materials':
      return await createMaterial(req, res);
    case 'suppliers':
      return await createSupplier(req, res);
    case 'purchase-orders':
      return await createPurchaseOrder(req, res);
    case 'stock-movement':
      return await createStockMovement(req, res);
    case 'check-alerts':
      return await checkAndCreateAlerts(req, res);
    default:
      return res.status(400).json({ error: 'Invalid action' });
  }
}

// PUT handlers
async function handlePut(req, res, action, id) {
  switch (action) {
    case 'materials':
      return await updateMaterial(req, res, id);
    case 'suppliers':
      return await updateSupplier(req, res, id);
    case 'purchase-orders':
      return await updatePurchaseOrder(req, res, id);
    case 'alerts':
      return await updateAlert(req, res, id);
    default:
      return res.status(400).json({ error: 'Invalid action' });
  }
}

// DELETE handlers
async function handleDelete(req, res, action, id) {
  switch (action) {
    case 'materials':
      return await deleteMaterial(req, res, id);
    case 'suppliers':
      return await deleteSupplier(req, res, id);
    case 'alerts':
      return await deleteAlert(req, res, id);
    default:
      return res.status(400).json({ error: 'Invalid action' });
  }
}

// Materials functions
async function getMaterials(req, res, id) {
  if (id) {
    const { data, error } = await supabase
      .from('materials')
      .select(`
        *,
        category:material_categories(name),
        supplier:suppliers(name, contact_person)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return res.json(data);
  }

  const { data, error } = await supabase
    .from('materials')
    .select(`
      *,
      category:material_categories(name),
      supplier:suppliers(name, contact_person)
    `)
    .order('name');
  
  if (error) throw error;
  return res.json(data);
}

async function createMaterial(req, res) {
  const { data, error } = await supabase
    .from('materials')
    .insert(req.body)
    .select()
    .single();
  
  if (error) throw error;
  return res.status(201).json(data);
}

async function updateMaterial(req, res, id) {
  const { data, error } = await supabase
    .from('materials')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return res.json(data);
}

async function deleteMaterial(req, res, id) {
  const { error } = await supabase
    .from('materials')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return res.json({ message: 'Material deleted successfully' });
}

// Suppliers functions
async function getSuppliers(req, res, id) {
  if (id) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return res.json(data);
  }

  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return res.json(data);
}

async function createSupplier(req, res) {
  const { data, error } = await supabase
    .from('suppliers')
    .insert(req.body)
    .select()
    .single();
  
  if (error) throw error;
  return res.status(201).json(data);
}

async function updateSupplier(req, res, id) {
  const { data, error } = await supabase
    .from('suppliers')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return res.json(data);
}

// Purchase Orders functions
async function getPurchaseOrders(req, res, id) {
  if (id) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        supplier:suppliers(name, contact_person),
        items:purchase_order_items(
          *,
          material:materials(name, unit_of_measure)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return res.json(data);
  }

  const { data, error } = await supabase
    .from('purchase_orders')
    .select(`
      *,
      supplier:suppliers(name, contact_person)
    `)
    .order('order_date', { ascending: false });
  
  if (error) throw error;
  return res.json(data);
}

async function createPurchaseOrder(req, res) {
  const { items, ...orderData } = req.body;
  
  // Create purchase order
  const { data: order, error: orderError } = await supabase
    .from('purchase_orders')
    .insert(orderData)
    .select()
    .single();
  
  if (orderError) throw orderError;

  // Create purchase order items
  if (items && items.length > 0) {
    const itemsWithOrderId = items.map(item => ({
      ...item,
      purchase_order_id: order.id
    }));

    const { error: itemsError } = await supabase
      .from('purchase_order_items')
      .insert(itemsWithOrderId);
    
    if (itemsError) throw itemsError;
  }

  return res.status(201).json(order);
}

// Stock Movements functions
async function getStockMovements(req, res, id) {
  const { material_id, limit = 50 } = req.query;
  
  let query = supabase
    .from('stock_movements')
    .select(`
      *,
      material:materials(name, unit_of_measure)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (material_id) {
    query = query.eq('material_id', material_id);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return res.json(data);
}

async function createStockMovement(req, res) {
  const { data, error } = await supabase
    .from('stock_movements')
    .insert(req.body)
    .select()
    .single();
  
  if (error) throw error;
  return res.status(201).json(data);
}

// Alerts functions
async function getAlerts(req, res) {
  const { status = 'active' } = req.query;
  
  const { data, error } = await supabase
    .from('mcp_alerts')
    .select(`
      *,
      material:materials(name),
      supplier:suppliers(name)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return res.json(data);
}

async function updateAlert(req, res, id) {
  const { data, error } = await supabase
    .from('mcp_alerts')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return res.json(data);
}

// Dashboard functions
async function getDashboard(req, res) {
  // Get summary statistics
  const [
    materialsCount,
    suppliersCount,
    lowStockCount,
    activeAlertsCount,
    totalInventoryValue
  ] = await Promise.all([
    supabase.from('materials').select('id', { count: 'exact' }),
    supabase.from('suppliers').select('id', { count: 'exact' }).eq('status', 'active'),
    supabase.from('materials').select('id', { count: 'exact' }).lt('current_stock', 'reorder_point'),
    supabase.from('mcp_alerts').select('id', { count: 'exact' }).eq('status', 'active'),
    supabase.from('materials').select('current_stock, unit_cost')
  ]);

  // Calculate total inventory value
  let inventoryValue = 0;
  if (totalInventoryValue.data) {
    inventoryValue = totalInventoryValue.data.reduce((sum, item) => {
      return sum + (item.current_stock * item.unit_cost);
    }, 0);
  }

  const dashboard = {
    materials_count: materialsCount.count || 0,
    suppliers_count: suppliersCount.count || 0,
    low_stock_count: lowStockCount.count || 0,
    active_alerts_count: activeAlertsCount.count || 0,
    total_inventory_value: inventoryValue
  };

  return res.json(dashboard);
}

// Low stock items
async function getLowStockItems(req, res) {
  const { data, error } = await supabase
    .from('materials')
    .select(`
      *,
      category:material_categories(name),
      supplier:suppliers(name)
    `)
    .lt('current_stock', 'reorder_point')
    .eq('status', 'active')
    .order('current_stock');
  
  if (error) throw error;
  return res.json(data);
}

// Cost Analysis
async function getCostAnalysis(req, res, id) {
  if (id) {
    const { data, error } = await supabase
      .from('cost_analysis')
      .select('*')
      .eq('menu_item_id', id)
      .order('analysis_date', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    return res.json(data);
  }

  const { data, error } = await supabase
    .from('cost_analysis')
    .select('*')
    .order('analysis_date', { ascending: false });
  
  if (error) throw error;
  return res.json(data);
}

// Inventory Report
async function getInventoryReport(req, res) {
  const { data, error } = await supabase
    .from('materials')
    .select(`
      id,
      name,
      sku,
      current_stock,
      unit_cost,
      minimum_stock,
      reorder_point,
      unit_of_measure,
      category:material_categories(name),
      supplier:suppliers(name)
    `)
    .eq('status', 'active')
    .order('name');
  
  if (error) throw error;

  // Add calculated fields
  const reportData = data.map(item => ({
    ...item,
    stock_value: item.current_stock * item.unit_cost,
    stock_status: item.current_stock <= item.minimum_stock ? 'critical' :
                  item.current_stock <= item.reorder_point ? 'low' : 'normal'
  }));

  return res.json(reportData);
}

// Check and create alerts
async function checkAndCreateAlerts(req, res) {
  try {
    // Call the stored procedure to check low stock
    const { error } = await supabase.rpc('check_low_stock_alerts');
    
    if (error) throw error;
    
    return res.json({ message: 'Alerts checked and created successfully' });
  } catch (error) {
    console.error('Error checking alerts:', error);
    return res.status(500).json({ error: 'Failed to check alerts' });
  }
}
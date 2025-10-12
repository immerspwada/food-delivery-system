const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Environment validation
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

// JWT Secret (in production, use a secure random string)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    console.warn('⚠️ Running in development mode without proper environment variables');
  }
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://your-domain.com", "https://your-domain.netlify.app", "https://your-domain.vercel.app"]
      : ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://your-domain.com", "https://your-domain.netlify.app", "https://your-domain.vercel.app"]
    : ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin role check middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  if (process.env.NODE_ENV === 'production') {
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: supabase ? 'connected' : 'disconnected',
      socketio: io ? 'active' : 'inactive'
    }
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes

// Get all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching restaurants:', error);
      return res.status(500).json({ error: 'Failed to fetch restaurants' });
    }

    res.json(restaurants);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single restaurant by ID
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', req.params.id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching restaurant:', error);
      return res.status(500).json({ error: 'Failed to fetch restaurant' });
    }

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('❌ Order creation error:', error);
    console.error('Request body:', req.body);
    res.status(500).json({ error: error.message });
  }
});

// Get all menu items
app.get('/api/menu-items', async (req, res) => {
  try {
    const { categoryId } = req.query;
    let query = supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('is_available', true);
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single menu item
app.get('/api/menu-items/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { customer_name, customer_phone, customer_address, delivery_address, items, notes } = req.body;
    
    // Get user_id from JWT token if available
    let user_id = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        user_id = decoded.userId;
      } catch (error) {
        // Token is invalid, but we'll still allow the order (guest order)
        console.log('Invalid token for order creation:', error.message);
      }
    }
    
    // Calculate total amount
    const total_amount = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    
    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_name,
        customer_phone,
        delivery_address: delivery_address || customer_address,
        total_amount,
        notes,
        status: 'pending',
        user_id
      }])
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Create order items
    const orderItems = items.map(item => ({
      order_id: orderData.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
      special_instructions: item.special_instructions
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    // Get complete order data
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (name, image_url)
        )
      `)
      .eq('id', orderData.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Emit new order to admin panel
    io.emit('newOrder', completeOrder);
    
    res.status(201).json(completeOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders (Admin or User's own orders)
app.get('/api/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    // Check if user is authenticated
    let user_id = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        user_id = decoded.userId;
      } catch (error) {
        // Invalid token, return empty orders
        return res.json({
          orders: [],
          total: 0,
          page: parseInt(page),
          totalPages: 0
        });
      }
    } else {
      // No token, return empty orders
      return res.json({
        orders: [],
        total: 0,
        page: parseInt(page),
        totalPages: 0
      });
    }
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (name, image_url)
        )
      `, { count: 'exact' });
    
    // Filter by user_id for regular users
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    res.json({
      orders: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (name, image_url)
        )
      `)
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Emit status update to clients
    io.emit('orderStatusUpdate', { orderId: req.params.id, status });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication endpoints
// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validate required fields
    if (!email || !password || !name || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash: passwordHash,
        name,
        phone,
        role: 'customer'
      }])
      .select('id, email, name, phone, role, created_at')
      .single();

    if (error) throw error;

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, name, phone, role, is_active')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user profile (protected route)
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, phone, role, created_at, last_login')
      .eq('id', req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile (protected route)
app.patch('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.userId)
      .select('id, email, name, phone, role, created_at, last_login')
      .single();

    if (error) throw error;

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin Routes

// Create category
app.post('/api/admin/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([req.body])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update category
app.patch('/api/admin/categories/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...req.body, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete category
app.delete('/api/admin/categories/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create menu item
app.post('/api/admin/menu-items', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([req.body])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update menu item
app.patch('/api/admin/menu-items/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ ...req.body, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete menu item
app.delete('/api/admin/menu-items/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sales statistics
// Get all orders (Admin only)
app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (name, image_url)
        )
      `, { count: 'exact' });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    res.json({
      orders: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const { from, to } = req.query;
    let query = supabase.from('orders').select('*');
    
    if (from) query = query.gte('created_at', from);
    if (to) query = query.lte('created_at', to);
    
    const { data: orders, error } = await query;
    if (error) throw error;
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      totalOrders,
      totalRevenue,
      avgOrderValue,
      statusCounts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin user management endpoints
// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('users')
      .select('id, email, name, phone, role, is_active, created_at, last_login', { count: 'exact' });

    // Add search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: users, error, count } = await query;
    if (error) throw error;

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user details (admin only)
app.get('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, phone, role, is_active, email_verified, created_at, last_login, updated_at')
      .eq('id', req.params.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's order statistics
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')
      .eq('user_id', req.params.id);

    if (ordersError) {
      console.error('Orders fetch error:', ordersError);
    }

    const orderStats = {
      totalOrders: orders?.length || 0,
      totalSpent: orders?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0,
      recentOrders: orders?.slice(0, 5) || []
    };

    res.json({
      user,
      orderStats
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user status (admin only)
app.patch('/api/admin/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ error: 'is_active must be a boolean value' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({ is_active })
      .eq('id', req.params.id)
      .select('id, email, name, phone, role, is_active')
      .single();

    if (error) throw error;

    res.json({
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

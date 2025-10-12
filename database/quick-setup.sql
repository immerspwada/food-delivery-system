-- Quick Setup for Food Delivery System
-- Run this in Supabase SQL Editor

-- Create custom types
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed', 
  'preparing',
  'ready',
  'delivering',
  'delivered',
  'cancelled'
);

CREATE TYPE payment_method AS ENUM (
  'cash_on_delivery',
  'credit_card',
  'debit_card',
  'digital_wallet',
  'bank_transfer'
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 4.5,
  delivery_time VARCHAR(50),
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  minimum_order DECIMAL(10,2) DEFAULT 0,
  address TEXT,
  phone VARCHAR(20),
  is_open BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(100),
  delivery_address TEXT NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE RESTRICT,
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  payment_method payment_method DEFAULT 'cash_on_delivery',
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert sample data
INSERT INTO categories (name, description, image_url) VALUES
('Pizza', 'Delicious pizzas with various toppings', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'),
('Burgers', 'Juicy burgers with fresh ingredients', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),
('Thai Food', 'Authentic Thai cuisine', 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400'),
('Desserts', 'Sweet treats and desserts', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400');

INSERT INTO restaurants (name, description, image_url, rating, delivery_time, delivery_fee, minimum_order, address, phone) VALUES
('Pizza Palace', 'Best pizza in town with fresh ingredients', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 4.5, '25-35 min', 30.00, 150.00, '123 Main St, Bangkok', '02-123-4567'),
('Burger House', 'Gourmet burgers made to order', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', 4.3, '20-30 min', 25.00, 100.00, '456 Food Ave, Bangkok', '02-234-5678'),
('Thai Delight', 'Authentic Thai flavors', 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400', 4.7, '30-40 min', 35.00, 200.00, '789 Spice Rd, Bangkok', '02-345-6789');

-- Get restaurant IDs for menu items
DO $$
DECLARE
    pizza_palace_id UUID;
    burger_house_id UUID;
    thai_delight_id UUID;
    pizza_cat_id UUID;
    burger_cat_id UUID;
    thai_cat_id UUID;
    dessert_cat_id UUID;
BEGIN
    SELECT id INTO pizza_palace_id FROM restaurants WHERE name = 'Pizza Palace';
    SELECT id INTO burger_house_id FROM restaurants WHERE name = 'Burger House';
    SELECT id INTO thai_delight_id FROM restaurants WHERE name = 'Thai Delight';
    SELECT id INTO pizza_cat_id FROM categories WHERE name = 'Pizza';
    SELECT id INTO burger_cat_id FROM categories WHERE name = 'Burgers';
    SELECT id INTO thai_cat_id FROM categories WHERE name = 'Thai Food';
    SELECT id INTO dessert_cat_id FROM categories WHERE name = 'Desserts';

    -- Pizza Palace menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (pizza_palace_id, pizza_cat_id, 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 280.00, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400'),
    (pizza_palace_id, pizza_cat_id, 'Pepperoni Pizza', 'Spicy pepperoni with mozzarella cheese', 320.00, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400'),
    (pizza_palace_id, pizza_cat_id, 'Hawaiian Pizza', 'Ham and pineapple with mozzarella', 350.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400');

    -- Burger House menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (burger_house_id, burger_cat_id, 'Classic Beef Burger', 'Juicy beef patty with lettuce, tomato, and special sauce', 180.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),
    (burger_house_id, burger_cat_id, 'Chicken Burger', 'Grilled chicken breast with avocado and mayo', 160.00, 'https://images.unsplash.com/photo-1606755962773-d324e2d53352?w=400'),
    (burger_house_id, burger_cat_id, 'Veggie Burger', 'Plant-based patty with fresh vegetables', 140.00, 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=400');

    -- Thai Delight menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (thai_delight_id, thai_cat_id, 'Pad Thai', 'Stir-fried rice noodles with shrimp and peanuts', 120.00, 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400'),
    (thai_delight_id, thai_cat_id, 'Green Curry', 'Spicy green curry with chicken and vegetables', 140.00, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400'),
    (thai_delight_id, thai_cat_id, 'Tom Yum Soup', 'Spicy and sour soup with shrimp', 100.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400');
END $$;
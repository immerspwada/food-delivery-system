-- Complete Mock Data for Food Delivery System
-- ข้อมูลจำลองครบถ้วนสำหรับระบบสั่งอาหาร
-- Run this in Supabase SQL Editor

-- Create custom types (if not exists)
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
      'pending',
      'confirmed', 
      'preparing',
      'ready',
      'delivering',
      'delivered',
      'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM (
      'cash_on_delivery',
      'credit_card',
      'debit_card',
      'digital_wallet',
      'bank_transfer'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

-- Clear existing data
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE menu_items CASCADE;
TRUNCATE TABLE restaurants CASCADE;
TRUNCATE TABLE categories CASCADE;

-- Insert Categories (หมวดหมู่อาหาร)
INSERT INTO categories (name, description, image_url) VALUES
('Pizza', 'พิซซ่าหลากหลายรสชาติ', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'),
('Burgers', 'เบอร์เกอร์สไตล์ต่างๆ', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),
('Thai Food', 'อาหารไทยต้นตำรับ', 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400'),
('Japanese', 'อาหารญี่ปุ่นแท้', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'),
('Korean', 'อาหารเกาหลีเผ็ดร้อน', 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400'),
('Chinese', 'อาหารจีนรสเข้มข้น', 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400'),
('Italian', 'อาหารอิตาเลียนคลาสสิก', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400'),
('Desserts', 'ของหวานและเครื่องดื่ม', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'),
('Healthy', 'อาหารเพื่อสุขภาพ', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'),
('Street Food', 'อาหารข้างทาง', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400');

-- Insert Restaurants (ร้านอาหาร)
INSERT INTO restaurants (name, description, image_url, rating, delivery_time, delivery_fee, minimum_order, address, phone) VALUES
-- Pizza Restaurants
('Pizza Palace', 'พิซซ่าสไตล์อิตาเลียนแท้ ด้วยส่วนผสมคุณภาพสูง', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 4.5, '25-35 min', 30.00, 150.00, '123 ถนนสุขุมวิท กรุงเทพฯ', '02-123-4567'),
('Napoli Pizza', 'พิซซ่าเตาอิฐแบบดั้งเดิม', 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400', 4.7, '30-40 min', 35.00, 200.00, '456 ถนนสีลม กรุงเทพฯ', '02-234-5678'),

-- Burger Restaurants  
('Burger House', 'เบอร์เกอร์กูร์เมต์สั่งทำตามสั่ง', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', 4.3, '20-30 min', 25.00, 100.00, '789 ถนนพระราม 4 กรุงเทพฯ', '02-345-6789'),
('American Diner', 'เบอร์เกอร์สไตล์อเมริกัน', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400', 4.4, '25-35 min', 30.00, 120.00, '321 ถนนรัชดาภิเษก กรุงเทพฯ', '02-456-7890'),

-- Thai Restaurants
('Thai Delight', 'อาหารไทยรสชาติต้นตำรับ', 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400', 4.7, '30-40 min', 35.00, 200.00, '654 ถนนเพชรบุรี กรุงเทพฯ', '02-567-8901'),
('Krua Thai', 'ครัวไทยโบราณ รสชาติดั้งเดิม', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 4.6, '25-35 min', 30.00, 150.00, '987 ถนนลาดพร้าว กรุงเทพฯ', '02-678-9012'),

-- Japanese Restaurants
('Sakura Sushi', 'ซูชิและซาชิมิสดใหม่', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', 4.8, '35-45 min', 40.00, 300.00, '147 ถนนทองหล่อ กรุงเทพฯ', '02-789-0123'),
('Ramen Ichiban', 'ราเมนแท้จากญี่ปุ่น', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 4.5, '25-35 min', 35.00, 180.00, '258 ถนนเอกมัย กรุงเทพฯ', '02-890-1234'),

-- Korean Restaurants
('Seoul Kitchen', 'อาหารเกาหลีเผ็ดร้อน', 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400', 4.6, '30-40 min', 35.00, 200.00, '369 ถนนอโศก กรุงเทพฯ', '02-901-2345'),
('K-BBQ House', 'บาร์บีคิวเกาหลีแท้', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', 4.4, '35-45 min', 40.00, 250.00, '741 ถนนพญาไท กรุงเทพฯ', '02-012-3456'),

-- Chinese Restaurants
('Golden Dragon', 'อาหารจีนกวางตุ้ง', 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400', 4.5, '25-35 min', 30.00, 180.00, '852 ถนนเยาวราช กรุงเทพฯ', '02-123-4567'),
('Dim Sum Palace', 'ติ่มซำและอาหารจีนหลากหลาย', 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400', 4.7, '30-40 min', 35.00, 200.00, '963 ถนนห้วยขวาง กรุงเทพฯ', '02-234-5678'),

-- Italian Restaurants
('Bella Italia', 'อาหารอิตาเลียนคลาสสิก', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400', 4.6, '30-40 min', 35.00, 220.00, '159 ถนนวิทยุ กรุงเทพฯ', '02-345-6789'),

-- Healthy Food
('Green Garden', 'อาหารเพื่อสุขภาพและเจ', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', 4.4, '20-30 min', 25.00, 120.00, '357 ถนนสาทร กรุงเทพฯ', '02-456-7890'),

-- Street Food
('Street Food Corner', 'อาหารข้างทางรสเด็ด', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', 4.3, '15-25 min', 20.00, 80.00, '468 ถนนข้าวสาร กรุงเทพฯ', '02-567-8901'),

-- Dessert Shop
('Sweet Dreams', 'ของหวานและเครื่องดื่ม', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', 4.5, '20-30 min', 25.00, 100.00, '579 ถนนชิดลม กรุงเทพฯ', '02-678-9012');

-- Insert Menu Items (เมนูอาหาร)
DO $$
DECLARE
    -- Restaurant IDs
    pizza_palace_id UUID;
    napoli_pizza_id UUID;
    burger_house_id UUID;
    american_diner_id UUID;
    thai_delight_id UUID;
    krua_thai_id UUID;
    sakura_sushi_id UUID;
    ramen_ichiban_id UUID;
    seoul_kitchen_id UUID;
    kbbq_house_id UUID;
    golden_dragon_id UUID;
    dim_sum_palace_id UUID;
    bella_italia_id UUID;
    green_garden_id UUID;
    street_food_id UUID;
    sweet_dreams_id UUID;
    
    -- Category IDs
    pizza_cat_id UUID;
    burger_cat_id UUID;
    thai_cat_id UUID;
    japanese_cat_id UUID;
    korean_cat_id UUID;
    chinese_cat_id UUID;
    italian_cat_id UUID;
    dessert_cat_id UUID;
    healthy_cat_id UUID;
    street_cat_id UUID;
BEGIN
    -- Get restaurant IDs
    SELECT id INTO pizza_palace_id FROM restaurants WHERE name = 'Pizza Palace';
    SELECT id INTO napoli_pizza_id FROM restaurants WHERE name = 'Napoli Pizza';
    SELECT id INTO burger_house_id FROM restaurants WHERE name = 'Burger House';
    SELECT id INTO american_diner_id FROM restaurants WHERE name = 'American Diner';
    SELECT id INTO thai_delight_id FROM restaurants WHERE name = 'Thai Delight';
    SELECT id INTO krua_thai_id FROM restaurants WHERE name = 'Krua Thai';
    SELECT id INTO sakura_sushi_id FROM restaurants WHERE name = 'Sakura Sushi';
    SELECT id INTO ramen_ichiban_id FROM restaurants WHERE name = 'Ramen Ichiban';
    SELECT id INTO seoul_kitchen_id FROM restaurants WHERE name = 'Seoul Kitchen';
    SELECT id INTO kbbq_house_id FROM restaurants WHERE name = 'K-BBQ House';
    SELECT id INTO golden_dragon_id FROM restaurants WHERE name = 'Golden Dragon';
    SELECT id INTO dim_sum_palace_id FROM restaurants WHERE name = 'Dim Sum Palace';
    SELECT id INTO bella_italia_id FROM restaurants WHERE name = 'Bella Italia';
    SELECT id INTO green_garden_id FROM restaurants WHERE name = 'Green Garden';
    SELECT id INTO street_food_id FROM restaurants WHERE name = 'Street Food Corner';
    SELECT id INTO sweet_dreams_id FROM restaurants WHERE name = 'Sweet Dreams';
    
    -- Get category IDs
    SELECT id INTO pizza_cat_id FROM categories WHERE name = 'Pizza';
    SELECT id INTO burger_cat_id FROM categories WHERE name = 'Burgers';
    SELECT id INTO thai_cat_id FROM categories WHERE name = 'Thai Food';
    SELECT id INTO japanese_cat_id FROM categories WHERE name = 'Japanese';
    SELECT id INTO korean_cat_id FROM categories WHERE name = 'Korean';
    SELECT id INTO chinese_cat_id FROM categories WHERE name = 'Chinese';
    SELECT id INTO italian_cat_id FROM categories WHERE name = 'Italian';
    SELECT id INTO dessert_cat_id FROM categories WHERE name = 'Desserts';
    SELECT id INTO healthy_cat_id FROM categories WHERE name = 'Healthy';
    SELECT id INTO street_cat_id FROM categories WHERE name = 'Street Food';

    -- Pizza Palace menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (pizza_palace_id, pizza_cat_id, 'Margherita Pizza', 'พิซซ่าคลาสสิกซอสมะเขือเทศ มอซซาเรลลา และใบโหระพา', 280.00, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400'),
    (pizza_palace_id, pizza_cat_id, 'Pepperoni Pizza', 'เปปเปอโรนี่เผ็ดร้อนกับชีสมอซซาเรลลา', 320.00, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400'),
    (pizza_palace_id, pizza_cat_id, 'Hawaiian Pizza', 'แฮมและสับปะรดกับชีสมอซซาเรลลา', 350.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'),
    (pizza_palace_id, pizza_cat_id, 'Quattro Stagioni', 'พิซซ่า 4 ฤดูกาล แฮม เห็ด มะกอก อาร์ติโช้ค', 380.00, 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400');

    -- Napoli Pizza menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (napoli_pizza_id, pizza_cat_id, 'Napoletana Pizza', 'พิซซ่าแบบนาโปลีแท้ เตาอิฐ', 320.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'),
    (napoli_pizza_id, pizza_cat_id, 'Diavola Pizza', 'พิซซ่าเผ็ดซาลามี่และพริกแดง', 340.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'),
    (napoli_pizza_id, pizza_cat_id, 'Capricciosa Pizza', 'แฮม เห็ด อาร์ติโช้ค มะกอก', 360.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400');

    -- Burger House menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (burger_house_id, burger_cat_id, 'Classic Beef Burger', 'เนื้อวัวชั้นดีกับผักสดและซอสพิเศษ', 180.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),
    (burger_house_id, burger_cat_id, 'Chicken Burger', 'ไก่ย่างกับอะโวคาโดและมายองเนส', 160.00, 'https://images.unsplash.com/photo-1606755962773-d324e2d53352?w=400'),
    (burger_house_id, burger_cat_id, 'Veggie Burger', 'แพตตี้จากพืชกับผักสด', 140.00, 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=400'),
    (burger_house_id, burger_cat_id, 'BBQ Bacon Burger', 'เนื้อวัวกับเบคอนและซอสบาร์บีคิว', 220.00, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400');

    -- American Diner menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (american_diner_id, burger_cat_id, 'Double Cheeseburger', 'เนื้อ 2 ชั้นกับชีส 2 ชั้น', 250.00, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400'),
    (american_diner_id, burger_cat_id, 'Fish Burger', 'ปลาทอดกรอบกับซอสทาร์ทาร์', 190.00, 'https://images.unsplash.com/photo-1606755962773-d324e2d53352?w=400'),
    (american_diner_id, burger_cat_id, 'Mushroom Swiss Burger', 'เห็ดย่างกับชีสสวิส', 200.00, 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=400');

    -- Thai Delight menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (thai_delight_id, thai_cat_id, 'Pad Thai', 'ผัดไทยกุ้งสดกับถั่วลิสงคั่ว', 120.00, 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400'),
    (thai_delight_id, thai_cat_id, 'Green Curry', 'แกงเขียวหวานไก่กับผักรวม', 140.00, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400'),
    (thai_delight_id, thai_cat_id, 'Tom Yum Soup', 'ต้มยำกุ้งเผ็ดร้อน', 100.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'),
    (thai_delight_id, thai_cat_id, 'Massaman Curry', 'แกงมัสมั่นเนื้อนุ่ม', 160.00, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400'),
    (thai_delight_id, thai_cat_id, 'Som Tam', 'ส้มตำไทยรสจัดจ้าน', 80.00, 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400');

    -- Krua Thai menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (krua_thai_id, thai_cat_id, 'Pad Krapow', 'ผัดกะเพราหมูสับไข่ดาว', 90.00, 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400'),
    (krua_thai_id, thai_cat_id, 'Larb Moo', 'ลาบหมูอีสานแซ่บ', 110.00, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400'),
    (krua_thai_id, thai_cat_id, 'Khao Pad', 'ข้าวผัดปูใส่ไข่', 120.00, 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400');

    -- Sakura Sushi menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (sakura_sushi_id, japanese_cat_id, 'Salmon Sashimi', 'ซาชิมิแซลมอนสดจากนอร์เวย์', 280.00, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'),
    (sakura_sushi_id, japanese_cat_id, 'Tuna Sushi Set', 'ซูชิทูน่าเซ็ต 8 ชิ้น', 320.00, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'),
    (sakura_sushi_id, japanese_cat_id, 'California Roll', 'แคลิฟอร์เนียโรลกับปูอัด', 180.00, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'),
    (sakura_sushi_id, japanese_cat_id, 'Chirashi Bowl', 'ข้าวหน้าปลาดิบรวม', 350.00, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400');

    -- Ramen Ichiban menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (ramen_ichiban_id, japanese_cat_id, 'Tonkotsu Ramen', 'ราเมนน้ำซุปกระดูกหมู', 180.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'),
    (ramen_ichiban_id, japanese_cat_id, 'Miso Ramen', 'ราเมนมิโซะรสเข้มข้น', 170.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'),
    (ramen_ichiban_id, japanese_cat_id, 'Shoyu Ramen', 'ราเมนซีอิ๊วใสรสชาติดั้งเดิม', 160.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'),
    (ramen_ichiban_id, japanese_cat_id, 'Gyoza', 'เกี๊ยวซ่าญี่ปุ่น 6 ชิ้น', 120.00, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400');

    -- Seoul Kitchen menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (seoul_kitchen_id, korean_cat_id, 'Kimchi Jjigae', 'ซุปกิมจิเผ็ดร้อน', 150.00, 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400'),
    (seoul_kitchen_id, korean_cat_id, 'Bulgogi', 'เนื้อย่างเกาหลีหวานหอม', 220.00, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400'),
    (seoul_kitchen_id, korean_cat_id, 'Bibimbap', 'ข้าวยำเกาหลีกับผักรวม', 180.00, 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400'),
    (seoul_kitchen_id, korean_cat_id, 'Korean Fried Chicken', 'ไก่ทอดเกาหลีซอสเผ็ด', 200.00, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400');

    -- K-BBQ House menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (kbbq_house_id, korean_cat_id, 'Galbi BBQ', 'ซี่โครงหมูย่างเกาหลี', 280.00, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400'),
    (kbbq_house_id, korean_cat_id, 'Samgyeopsal', 'หมูสามชั้นย่าง', 250.00, 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400'),
    (kbbq_house_id, korean_cat_id, 'Japchae', 'ขนมจีนเกาหลีผัดผัก', 160.00, 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400');

    -- Golden Dragon menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (golden_dragon_id, chinese_cat_id, 'Sweet and Sour Pork', 'หมูเปรี้ยวหวานกวางตุ้ง', 180.00, 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400'),
    (golden_dragon_id, chinese_cat_id, 'Kung Pao Chicken', 'ไก่ผัดเม็ดมะม่วงหิมพานต์', 170.00, 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400'),
    (golden_dragon_id, chinese_cat_id, 'Mapo Tofu', 'เต้าหู้ผัดซอสเผ็ด', 140.00, 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400'),
    (golden_dragon_id, chinese_cat_id, 'Fried Rice', 'ข้าวผัดจีนแฮมไข่', 120.00, 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400');

    -- Dim Sum Palace menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (dim_sum_palace_id, chinese_cat_id, 'Har Gow', 'ฮะเก๋ากุ้งใส 4 ชิ้น', 120.00, 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400'),
    (dim_sum_palace_id, chinese_cat_id, 'Siu Mai', 'ซิวไม๋หมูกุ้ง 4 ชิ้น', 110.00, 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400'),
    (dim_sum_palace_id, chinese_cat_id, 'Char Siu Bao', 'ซาลาเปาหมูแดง 3 ชิ้น', 100.00, 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400'),
    (dim_sum_palace_id, chinese_cat_id, 'Cheung Fun', 'ขนมจีบกุ้งห่อผ้าไหม', 130.00, 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400');

    -- Bella Italia menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (bella_italia_id, italian_cat_id, 'Spaghetti Carbonara', 'สปาเก็ตตี้คาร์โบนาร่าครีมเข้มข้น', 220.00, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400'),
    (bella_italia_id, italian_cat_id, 'Fettuccine Alfredo', 'เฟตตูชินี่อัลเฟรโดซอสขาว', 200.00, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400'),
    (bella_italia_id, italian_cat_id, 'Lasagna', 'ลาซานญ่าเนื้อและชีส', 280.00, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400'),
    (bella_italia_id, italian_cat_id, 'Risotto Mushroom', 'ริซอตโต้เห็ดรวม', 250.00, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400');

    -- Green Garden menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (green_garden_id, healthy_cat_id, 'Quinoa Salad', 'สลัดควินัวกับผักใบเขียว', 150.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'),
    (green_garden_id, healthy_cat_id, 'Avocado Toast', 'ขนมปังอะโวคาโดกับเมล็ดเชีย', 120.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'),
    (green_garden_id, healthy_cat_id, 'Smoothie Bowl', 'โบลสมูทตี้ผลไม้รวม', 140.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'),
    (green_garden_id, healthy_cat_id, 'Grilled Salmon', 'แซลมอนย่างกับผักสตีม', 280.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400');

    -- Street Food Corner menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (street_food_id, street_cat_id, 'Mango Sticky Rice', 'ข้าวเหนียวมะม่วงหวานหอม', 60.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'),
    (street_food_id, street_cat_id, 'Grilled Pork Skewer', 'หมูปิ้งไผ่ 5 ไม้', 80.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'),
    (street_food_id, street_cat_id, 'Thai Pancake', 'โรตีกล้วยหอมน้ำผึ้ง', 50.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'),
    (street_food_id, street_cat_id, 'Boat Noodles', 'ก้วยเตี๋ยวเรือน้ำใส', 70.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400');

    -- Sweet Dreams menu
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES
    (sweet_dreams_id, dessert_cat_id, 'Chocolate Lava Cake', 'เค้กช็อกโกแลตไหลเยิ้ม', 120.00, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'),
    (sweet_dreams_id, dessert_cat_id, 'Tiramisu', 'ทิรามิสุอิตาเลียนแท้', 140.00, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'),
    (sweet_dreams_id, dessert_cat_id, 'Ice Cream Sundae', 'ไอศกรีมซันเดย์ผลไม้รวม', 100.00, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'),
    (sweet_dreams_id, dessert_cat_id, 'Thai Tea Frappe', 'ชาไทยปั่นเย็น', 80.00, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'),
    (sweet_dreams_id, dessert_cat_id, 'Mango Cheesecake', 'ชีสเค้กมะม่วง', 130.00, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400');

END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_is_active ON restaurants(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Summary
SELECT 
    'สร้างข้อมูลจำลองเสร็จสิ้น!' as message,
    (SELECT COUNT(*) FROM restaurants) as total_restaurants,
    (SELECT COUNT(*) FROM categories) as total_categories,
    (SELECT COUNT(*) FROM menu_items) as total_menu_items;
-- Sample Data for Food Delivery System
-- Run this AFTER running supabase-schema.sql
-- This will populate your database with sample data for testing

-- Insert Categories
INSERT INTO categories (name, description, image_url) VALUES
('อาหารไทย', 'อาหารไทยต้นตำรับ รสชาติเข้มข้น', 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400'),
('คาเฟ่', 'เครื่องดื่มและของหวาน', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'),
('ก๋วยเตี๋ยว', 'ก๋วยเตี๋ยวทุกประเภท', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'),
('ข้าวราด', 'ข้าวราดแกงและอาหารจานเดียว', 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=400'),
('ของหวาน', 'ขนมไทยและขนมตะวันตก', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
('อาหารจีน', 'อาหารจีนและติ่มซำ', 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400'),
('อาหารญี่ปุ่น', 'ซูชิ ราเมน และอาหารญี่ปุ่น', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'),
('อาหารฝรั่ง', 'อาหารตะวันตกและฟาสต์ฟู้ด', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400');

-- Insert Restaurants
INSERT INTO restaurants (name, description, image_url, cover_image_url, rating, review_count, delivery_time, delivery_fee, minimum_order, address, phone, tags) VALUES

-- Thai Restaurants
('ครัวแม่สมหวัง', 'อาหารไทยต้นตำรับ รสชาติเข้มข้น เหมือนที่บ้าน', 
 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
 4.8, 1250, '25-35 นาที', 15, 150, 
 '123 หมู่ 5 ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240', 
 '02-123-4567', ARRAY['อาหารไทย', 'ราคาประหยัด']),

('เจ้อร่อยแซ่บ', 'อาหารอีสานแท้ๆ เผ็ดร้อนตามสั่ง', 
 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
 4.6, 890, '30-40 นาที', 20, 120, 
 '456 ซอยลาดพร้าว 15 แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900', 
 '02-234-5678', ARRAY['อาหารไทย', 'อาหารอีสาน']),

-- Cafe
('Sweet Corner Café', 'คาเฟ่สไตล์มินิมอล กาแฟหอมกรุ่น ขนมหวานน่ารัก', 
 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
 4.7, 650, '15-25 นาที', 25, 80, 
 '789 ถนนสุขุมวิท 33 แขวงคลองเตย เขตวัฒนา กรุงเทพฯ 10110', 
 '02-345-6789', ARRAY['คาเฟ่', 'ของหวาน']),

('Urban Coffee House', 'กาแฟดริปคุณภาพพรีเมียม บรรยากาศสบายๆ', 
 'https://images.unsplash.com/photo-1501472312651-726eedff4f5d?w=400',
 'https://images.unsplash.com/photo-1501472312651-726eedff4f5d?w=800',
 4.5, 420, '10-20 นาที', 30, 60, 
 '321 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400', 
 '02-456-7890', ARRAY['คาเฟ่']),

-- Noodles
('ก๋วยเตี๋ยวลุงโจ้', 'ก๋วยเตี๋ยวรสเด็ด ต้มยำแซ่บๆ', 
 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
 4.4, 780, '20-30 นาที', 0, 50, 
 '159 ถนนพระรามที่ 4 แขวงมหาพรุธารม เขตบางรัก กรุงเทพฯ 10500', 
 '02-567-8901', ARRAY['ก๋วยเตี๋ยว', 'ราคาประหยัด']),

-- Japanese
('Sakura Sushi', 'ซูชิสดใหม่ จากเชฟชาวญี่ปุ่น', 
 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
 4.9, 1100, '35-45 นาที', 40, 300, 
 '88 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500', 
 '02-678-9012', ARRAY['อาหารญี่ปุ่น']),

-- Western
('Burger Kingdom', 'เบอร์เกอร์ชั้นเยี่ยม เฟรนช์ฟรายส์กรอบ', 
 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
 4.3, 560, '25-35 นาที', 35, 180, 
 '246 ถนนเพชรบุรี แขวงมักกะสัน เขตราชเทวี กรุงเทพฯ 10400', 
 '02-789-0123', ARRAY['อาหารฝรั่ง']),

-- Chinese
('Golden Dragon', 'อาหารจีนแท้ ติ่มซำอร่อย', 
 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400',
 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800',
 4.6, 890, '30-40 นาที', 25, 200, 
 '135 ถนนเยาวราช แขวงสัมพันธวงศ์ เขตสัมพันธวงศ์ กรุงเทพฯ 10100', 
 '02-890-1234', ARRAY['อาหารจีน']);

-- Get restaurant IDs for menu items (using the first few restaurants)
DO $$
DECLARE
    thai_restaurant_id UUID;
    cafe_restaurant_id UUID;
    noodle_restaurant_id UUID;
    japanese_restaurant_id UUID;
    thai_category_id UUID;
    cafe_category_id UUID;
    noodle_category_id UUID;
    japanese_category_id UUID;
BEGIN
    -- Get restaurant IDs
    SELECT id INTO thai_restaurant_id FROM restaurants WHERE name = 'ครัวแม่สมหวัง';
    SELECT id INTO cafe_restaurant_id FROM restaurants WHERE name = 'Sweet Corner Café';
    SELECT id INTO noodle_restaurant_id FROM restaurants WHERE name = 'ก๋วยเตี๋ยวลุงโจ้';
    SELECT id INTO japanese_restaurant_id FROM restaurants WHERE name = 'Sakura Sushi';
    
    -- Get category IDs
    SELECT id INTO thai_category_id FROM categories WHERE name = 'อาหารไทย';
    SELECT id INTO cafe_category_id FROM categories WHERE name = 'คาเฟ่';
    SELECT id INTO noodle_category_id FROM categories WHERE name = 'ก๋วยเตี๋ยว';
    SELECT id INTO japanese_category_id FROM categories WHERE name = 'อาหารญี่ปุ่น';

    -- Insert menu items for Thai restaurant
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, ingredients, preparation_time) VALUES
    (thai_restaurant_id, thai_category_id, 'ข้าวผัดกุ้ง', 'ข้าวผัดกุ้งสด เนื้อกุ้งเต็มคำ', 120.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', ARRAY['ข้าว', 'กุ้ง', 'ไข่', 'หัวหอม'], 15),
    (thai_restaurant_id, thai_category_id, 'ต้มยำกุ้ง', 'ต้มยำกุ้งน้ำข้น รสจัดจ้าน', 150.00, 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400', ARRAY['กุ้ง', 'เห็ด', 'ข่า', 'ตะไคร้'], 20),
    (thai_restaurant_id, thai_category_id, 'แกงเขียวหวานไก่', 'แกงเขียวหวานไก่ใส่มะเขือ', 140.00, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', ARRAY['ไก่', 'มะเขือ', 'พริกแกงเขียวหวาน'], 25),
    (thai_restaurant_id, thai_category_id, 'ผัดไทย', 'ผัดไท หอมหวาน รสชาติต้นตำรับ', 100.00, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400', ARRAY['เส้นหมี่', 'กุ้ง', 'เต้าหู้', 'ถั่วงอก'], 12),
    (thai_restaurant_id, thai_category_id, 'ส้มตำไทย', 'ส้มตำไทยรสจัดจ้าน เผ็ดร้อน', 80.00, 'https://images.unsplash.com/photo-1594007162692-76d03e5936ce?w=400', ARRAY['มะละกอดิบ', 'มะเขือเทศ', 'ถั่วฝักยาว'], 10);

    -- Insert menu items for cafe
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, preparation_time) VALUES
    (cafe_restaurant_id, cafe_category_id, 'เค้กช็อกโกแลต', 'เค้กช็อกโกแลตเข้มข้น หอมหวาน', 180.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 5),
    (cafe_restaurant_id, cafe_category_id, 'กาแฟลาเต้', 'ลาเต้หอมกรุ่น นมฟองนุ่ม', 80.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 8),
    (cafe_restaurant_id, cafe_category_id, 'คาปูชิโน่', 'คาปูชิโน่คลาสสิค หอมกาแฟ', 85.00, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', 8),
    (cafe_restaurant_id, cafe_category_id, 'ชีสเค้ก', 'ชีสเค้กนิวยอร์ก เนียนนุ่ม', 160.00, 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400', 3),
    (cafe_restaurant_id, cafe_category_id, 'มอคค่า', 'มอคค่าหอมหวาน ช็อกโกแลตเข้มข้น', 90.00, 'https://images.unsplash.com/photo-1607260550778-aa5d52d1872e?w=400', 10);

    -- Insert menu items for noodle shop
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, preparation_time) VALUES
    (noodle_restaurant_id, noodle_category_id, 'ก๋วยเตี๋ยวหมูแดง', 'ก๋วยเตี๋ยวหมูแดง น้ำใส', 50.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 12),
    (noodle_restaurant_id, noodle_category_id, 'ก๋วยเตี๋ยวต้มยำ', 'ก๋วยเตี๋ยวต้มยำ เผ็ดร้อน', 60.00, 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400', 15),
    (noodle_restaurant_id, noodle_category_id, 'ลูกชิ้นพิเศษ', 'ลูกชิ้นผสม หลากหลายชนิด', 70.00, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400', 10),
    (noodle_restaurant_id, noodle_category_id, 'เกาเหลาหมู', 'เกาเหลาหมูน้ำใส รสชาติเข้มข้น', 45.00, 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400', 8);

    -- Insert menu items for Japanese restaurant
    INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, preparation_time) VALUES
    (japanese_restaurant_id, japanese_category_id, 'ซูชิแซลมอน', 'ซูชิแซลมอนสด นำเข้าจากญี่ปุ่น', 280.00, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', 15),
    (japanese_restaurant_id, japanese_category_id, 'ซาชิมิชุด', 'ซาชิมิหลากหลายชนิด สดใหม่', 450.00, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400', 20),
    (japanese_restaurant_id, japanese_category_id, 'ราเมนหมูชาชู', 'ราเมนน้ำใส หมูชาชูนุ่ม', 320.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 25),
    (japanese_restaurant_id, japanese_category_id, 'เทมปุระผสม', 'เทมปุระกุ้งและผัก กรอบอร่อย', 250.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400', 18),
    (japanese_restaurant_id, japanese_category_id, 'ข้าวหน้าปลาไหล', 'ข้าวหน้าปลาไหลย่าง หวานหอม', 380.00, 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=400', 22);

END $$;

-- Insert some sample orders
DO $$
DECLARE
    thai_restaurant_id UUID;
    pad_thai_id UUID;
    tom_yum_id UUID;
    sample_order_id UUID;
BEGIN
    -- Get IDs
    SELECT id INTO thai_restaurant_id FROM restaurants WHERE name = 'ครัวแม่สมหวัง';
    SELECT id INTO pad_thai_id FROM menu_items WHERE name = 'ผัดไทย' LIMIT 1;
    SELECT id INTO tom_yum_id FROM menu_items WHERE name = 'ต้มยำกุ้ง' LIMIT 1;

    -- Insert sample order
    INSERT INTO orders (customer_name, customer_phone, delivery_address, restaurant_id, total_amount, status) 
    VALUES ('นายสมชาย ใจดี', '081-234-5678', '123/45 ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240', thai_restaurant_id, 250.00, 'delivered')
    RETURNING id INTO sample_order_id;

    -- Insert order items
    INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, total_price) VALUES
    (sample_order_id, pad_thai_id, 'ผัดไทย', 1, 100.00, 100.00),
    (sample_order_id, tom_yum_id, 'ต้มยำกุ้ง', 1, 150.00, 150.00);

END $$;

-- Insert sample promotions
INSERT INTO promotions (title, description, code, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, valid_from, valid_until) VALUES
('ส่วนลด 50% สำหรับสมาชิกใหม่', 'รับส่วนลดสูงสุด 100 บาท สำหรับออเดอร์แรก', 'NEWUSER50', 'percentage', 50.00, 150.00, 100.00, 1000, NOW(), NOW() + INTERVAL '30 days'),
('ส่งฟรี ไม่มีขั้นต่ำ', 'ฟรีค่าจัดส่งทุกออเดอร์ วันนี้เท่านั้น', 'FREEDELIVERY', 'fixed_amount', 35.00, 0.00, 35.00, 500, NOW(), NOW() + INTERVAL '1 day'),
('ลด 20% เมื่อสั่งครบ 300', 'รับส่วนลด 20% เมื่อสั่งอาหารครบ 300 บาท', 'SAVE20', 'percentage', 20.00, 300.00, 60.00, 200, NOW(), NOW() + INTERVAL '7 days');

-- Update restaurant popularity scores
UPDATE menu_items SET popularity_score = 
  CASE 
    WHEN name LIKE '%ผัดไทย%' THEN 95
    WHEN name LIKE '%ต้มยำ%' THEN 90
    WHEN name LIKE '%ข้าวผัด%' THEN 85
    WHEN name LIKE '%กาแฟ%' THEN 80
    WHEN name LIKE '%ซูชิ%' THEN 75
    ELSE 50
  END;

-- Add some reviews
DO $$
DECLARE
    sample_order_id UUID;
    thai_restaurant_id UUID;
BEGIN
    SELECT o.id, o.restaurant_id INTO sample_order_id, thai_restaurant_id 
    FROM orders o 
    WHERE o.customer_name = 'นายสมชาย ใจดี' 
    LIMIT 1;

    INSERT INTO reviews (order_id, restaurant_id, customer_name, rating, comment, is_verified) VALUES
    (sample_order_id, thai_restaurant_id, 'นายสมชาย ใจดี', 5, 'อร่อยมาก ผัดไทยรสชาติต้นตำรับ ต้มยำกุ้งเผ็ดร้อนดี จะสั่งอีก', true),
    (NULL, thai_restaurant_id, 'นางสาวมาลี สุขใจ', 4, 'รสชาติดี บริการเร็ว แต่เผ็ดไปนิดหน่อย', false),
    (NULL, thai_restaurant_id, 'นายวิชัย มั่นใจ', 5, 'ประทับใจทุกครั้งที่สั่ง คุณภาพคงที่', false);
END $$;

-- Create some useful views
CREATE OR REPLACE VIEW restaurant_stats AS
SELECT 
    r.id,
    r.name,
    r.rating,
    r.review_count,
    COUNT(DISTINCT mi.id) as menu_count,
    COUNT(DISTINCT o.id) as order_count,
    AVG(o.total_amount) as avg_order_value,
    COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as completed_orders
FROM restaurants r
LEFT JOIN menu_items mi ON r.id = mi.restaurant_id AND mi.is_available = true
LEFT JOIN orders o ON r.id = o.restaurant_id
WHERE r.is_active = true
GROUP BY r.id, r.name, r.rating, r.review_count;

CREATE OR REPLACE VIEW popular_menu_items AS
SELECT 
    mi.id,
    mi.name,
    mi.price,
    mi.image_url,
    r.name as restaurant_name,
    c.name as category_name,
    mi.popularity_score,
    COUNT(oi.id) as order_count
FROM menu_items mi
JOIN restaurants r ON mi.restaurant_id = r.id
JOIN categories c ON mi.category_id = c.id
LEFT JOIN order_items oi ON mi.id = oi.menu_item_id
WHERE mi.is_available = true AND r.is_active = true
GROUP BY mi.id, mi.name, mi.price, mi.image_url, r.name, c.name, mi.popularity_score
ORDER BY mi.popularity_score DESC, order_count DESC;

-- Insert success message
DO $$
BEGIN
    RAISE NOTICE 'Sample data inserted successfully!';
    RAISE NOTICE 'Restaurants: %', (SELECT COUNT(*) FROM restaurants);
    RAISE NOTICE 'Menu Items: %', (SELECT COUNT(*) FROM menu_items);
    RAISE NOTICE 'Categories: %', (SELECT COUNT(*) FROM categories);
    RAISE NOTICE 'Orders: %', (SELECT COUNT(*) FROM orders);
    RAISE NOTICE 'Promotions: %', (SELECT COUNT(*) FROM promotions);
END $$;

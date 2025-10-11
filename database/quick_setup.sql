-- Quick Setup สำหรับแก้ปัญหาโหลดเมนูไม่ได้
-- รันคำสั่งนี้ใน Supabase SQL Editor

-- 1. เพิ่มหมวดหมู่
INSERT INTO categories (name, description, image_url, is_active) VALUES
('อาหารจานหลัก', 'อาหารจานหลักรสชาติเข้มข้น', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', true),
('ของหวาน', 'ของหวานหลากหลายรสชาติ', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', true),
('เครื่องดื่ม', 'เครื่องดื่มสดชื่น', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', true),
('อาหารว่าง', 'อาหารว่างและขนมขบเคี้ยว', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400', true)
ON CONFLICT (name) DO NOTHING;

-- 2. เพิ่มเมนูอาหาร
INSERT INTO menu_items (category_id, name, description, price, image_url, is_available, preparation_time) 
SELECT 
    c.id,
    menu.name,
    menu.description,
    menu.price,
    menu.image_url,
    menu.is_available,
    menu.preparation_time
FROM categories c
CROSS JOIN (
    VALUES 
    -- อาหารจานหลัก
    ('อาหารจานหลัก', 'ข้าวผัดกุ้ง', 'ข้าวผัดกุ้งสดใส รสชาติกลมกล่อม', 89.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', true, 15),
    ('อาหารจานหลัก', 'ผัดไทยกุ้งสด', 'ผัดไทยกุ้งสด รสชาติต้นตำรับ', 95.00, 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400', true, 20),
    ('อาหารจานหลัก', 'ต้มยำกุ้ง', 'ต้มยำกุ้งต้นตำรับ รสเปรี้ยวจัดจ้าน', 120.00, 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400', true, 25),
    ('อาหารจานหลัก', 'แกงเขียวหวานไก่', 'แกงเขียวหวานไก่ รสชาติเข้มข้น', 99.00, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', true, 20),
    
    -- ของหวาน
    ('ของหวาน', 'มะม่วงข้าวเหนียว', 'มะม่วงสุกหวาน เสิร์ฟกับข้าวเหนียวหอม', 65.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', true, 10),
    ('ของหวาน', 'ไอศกรีมกะทิ', 'ไอศกรีมกะทิแท้ รสชาติหอมหวาน', 45.00, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400', true, 5),
    ('ของหวาน', 'ขนมครก', 'ขนมครกหอม หวาน มัน', 35.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', true, 15),
    
    -- เครื่องดื่ม
    ('เครื่องดื่ม', 'น้ำมะนาวโซดา', 'น้ำมะนาวโซดาสดชื่น', 35.00, 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400', true, 5),
    ('เครื่องดื่ม', 'ชาไทย', 'ชาไทยเข้มข้น หอมหวาน', 25.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400', true, 8),
    ('เครื่องดื่ม', 'กาแฟเย็น', 'กาแฟเย็นหอมกรุ่น', 45.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', true, 10),
    ('เครื่องดื่ม', 'น้ำส้มคั้นสด', 'น้ำส้มคั้นสด 100%', 40.00, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', true, 5),
    
    -- อาหารว่าง
    ('อาหารว่าง', 'ปอเปี๊ยะทอด', 'ปอเปี๊ยะทอดกรอบ เสิร์ฟกับซอส', 55.00, 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', true, 12),
    ('อาหารว่าง', 'กุ้งเท้มปุระ', 'กุ้งเท้มปุระกรอบนอกนุ่มใน', 85.00, 'https://images.unsplash.com/photo-1561058413-09e917cd5c2b?w=400', true, 15),
    ('อาหารว่าง', 'หมูปิ้ง', 'หมูปิ้งหอมๆ ย่างสุกกำลังดี', 75.00, 'https://images.unsplash.com/photo-1529692236671-f1f6cf0a4c15?w=400', true, 18)
) AS menu(category_name, name, description, price, image_url, is_available, preparation_time)
WHERE c.name = menu.category_name
ON CONFLICT (name) DO NOTHING;

-- 3. เพิ่มลูกค้าตัวอย่าง
INSERT INTO customers (name, phone, address) VALUES
('สมชาย ใจดี', '081-234-5678', '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110'),
('สมหญิง รักดี', '082-345-6789', '456 ถนนพหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900'),
('นายทดสอบ ระบบ', '083-456-7890', '789 ถนนรัตนาธิเบศร แขวงบางกระสอ เขตบางพลัด กรุงเทพฯ 10700')
ON CONFLICT (phone) DO NOTHING;

-- แสดงผลลัพธ์
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Menu Items' as table_name, COUNT(*) as count FROM menu_items
UNION ALL  
SELECT 'Customers' as table_name, COUNT(*) as count FROM customers;

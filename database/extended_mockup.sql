-- Extended mockup data for Food Delivery System
-- เพิ่มข้อมูลตัวอย่างมากขึ้น

-- เพิ่มหมวดหมู่เสริม
INSERT INTO categories (name, description, image_url, is_active) VALUES
('ข้าวหน้าเนื้อ', 'ข้าวหน้าเนื้อหลากหลายสไตล์', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', true),
('ก๋วยเตี๋ยว', 'ก๋วยเตี๋ยวน้ำใส น้ำข้น และแห้ง', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', true),
('ข้าวมันไก่', 'ข้าวมันไก่สไตล์ต่างๆ', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', true),
('ข้าวผัด', 'ข้าวผัดหลากหลายรสชาติ', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', true),
('ส้มตำ', 'ส้มตำและอาหารอีสาน', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', true),
('ผัดไทย', 'ผัดไทยรสชาติต้นตำรับ', 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400', true);

-- เพิ่มเมนูอาหารจำนวนมาก
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
    -- ข้าวหน้าเนื้อ
    ('ข้าวหน้าเนื้อ', 'ข้าวหน้าเนื้อทอดกระเทียม', 'เนื้อหมูทอดกระเทียมหอมๆ ราดข้าวสวย', 69.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', true, 15),
    ('ข้าวหน้าเนื้อ', 'ข้าวหน้าเนื้อผัดกะเพรา', 'เนื้อหมูผัดกะเพราเผ็ดร้อน', 75.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', true, 12),
    ('ข้าวหน้าเนื้อ', 'ข้าวหน้าเนื้อน้ำพริกเผา', 'เนื้อหมูผัดน้ำพริกเผาหวานมัน', 79.00, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', true, 15),
    
    -- ก๋วยเตี๋ยว
    ('ก๋วยเตี๋ยว', 'ก๋วยเตี๋ยวเนื้อตุ๋น', 'ก๋วยเตี๋ยวน้ำใสเนื้อตุ๋นนุ่ม', 55.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', true, 20),
    ('ก๋วยเตี๋ยว', 'ก๋วยเตี๋ยวต้มยำ', 'ก๋วยเตี๋ยวต้มยำเปรี้ยวเผ็ด', 49.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', true, 18),
    ('ก๋วยเตี๋ยว', 'ก๋วยเตี๋ยวหมูแดง', 'ก๋วยเตี๋ยวหมูแดงหวานมัน', 52.00, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', true, 15),
    
    -- ข้าวมันไก่
    ('ข้าวมันไก่', 'ข้าวมันไก่ไหหลำ', 'ข้าวมันไก่ไหหลำต้นตำรับ', 45.00, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', true, 15),
    ('ข้าวมันไก่', 'ข้าวมันไก่ทอด', 'ข้าวมันไก่ทอดกรอบนอกนุ่มใน', 50.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', true, 18),
    
    -- เพิ่มเครื่องดื่มใหม่
    ('เครื่องดื่ม', 'น้ำปั่นมะม่วง', 'น้ำปั่นมะม่วงสดชื่น', 50.00, 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400', true, 8),
    ('เครื่องดื่ม', 'น้ำปั่นสตรอเบอรี่', 'น้ำปั่นสตรอเบอรี่หวานเปรี้ยว', 55.00, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', true, 8),
    ('เครื่องดื่ม', 'ชาเย็น', 'ชาเย็นหวานมัน', 30.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400', true, 5),
    ('เครื่องดื่ม', 'กาแฟร้อน', 'กาแฟร้อนหอมกรุ่น', 35.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', true, 8),
    
    -- เพิ่มของหวานใหม่
    ('ของหวาน', 'ทับทิมกรอบ', 'ทับทิมกรอบน้ำแข็งใส', 40.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', true, 10),
    ('ของหวาน', 'โรตี', 'โรตีกรอบหวานมัน', 35.00, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400', true, 12),
    ('ของหวาน', 'ข้าวเหนียวมะม่วง', 'ข้าวเหนียวมะม่วงหวานหอม', 60.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', true, 8)
) AS menu(category_name, name, description, price, image_url, is_available, preparation_time)
WHERE c.name = menu.category_name;

-- เพิ่มลูกค้าตัวอย่างมากขึ้น
INSERT INTO customers (name, phone, address) VALUES
('วิทยา ขยัน', '084-567-8901', '321 ถนนพระราม 4 แขวงสีลม เขตบางรัก กรุงเทพฯ 10500'),
('ประชา ใจงาม', '085-678-9012', '654 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400'),
('สุดา รักงาน', '086-789-0123', '987 ถนนสาทรใต้ แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพฯ 10120'),
('มานพ ช่วยงาน', '087-890-1234', '147 ถนนเพชรบุรี แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400'),
('สมศรี มีใจ', '088-901-2345', '258 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900'),
('บุญชู ใจดี', '089-012-3456', '369 ถนนบางนา-ตราด แขวงบางนา เขตบางนา กรุงเทพฯ 10260');

-- สร้างออเดอร์ตัวอย่างมากขึ้น
DO $$
DECLARE
    customer_ids UUID[];
    menu_ids UUID[];
    order_uuid UUID;
    customer_uuid UUID;
    menu_uuid UUID;
    i INTEGER;
BEGIN
    -- ดึง customer IDs
    SELECT ARRAY(SELECT id FROM customers ORDER BY created_at DESC LIMIT 6) INTO customer_ids;
    -- ดึง menu IDs  
    SELECT ARRAY(SELECT id FROM menu_items ORDER BY RANDOM() LIMIT 20) INTO menu_ids;
    
    -- สร้างออเดอร์หลายรายการ
    FOR i IN 1..10 LOOP
        customer_uuid := customer_ids[1 + (i % array_length(customer_ids, 1))];
        
        -- สร้างออเดอร์
        INSERT INTO orders (
            customer_id, 
            customer_name, 
            customer_phone, 
            customer_address, 
            status, 
            total_amount, 
            notes,
            created_at
        ) 
        SELECT 
            customer_uuid,
            c.name,
            c.phone,
            c.address,
            CASE 
                WHEN i <= 2 THEN 'pending'
                WHEN i <= 4 THEN 'confirmed'
                WHEN i <= 6 THEN 'preparing'
                WHEN i <= 8 THEN 'ready'
                ELSE 'delivered'
            END,
            0, -- จะอัปเดตทีหลัง
            CASE 
                WHEN i % 3 = 0 THEN 'ไม่ใส่ผัก'
                WHEN i % 3 = 1 THEN 'เผ็ดน้อย'
                ELSE NULL
            END,
            NOW() - INTERVAL '1 day' * (i % 7) -- กระจายออเดอร์ใน 7 วันที่ผ่านมา
        FROM customers c WHERE c.id = customer_uuid
        RETURNING id INTO order_uuid;
        
        -- เพิ่มรายการอาหารในออเดอร์
        INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, total_price)
        SELECT 
            order_uuid,
            m.id,
            m.name,
            1 + (i % 3), -- จำนวน 1-3
            m.price,
            m.price * (1 + (i % 3))
        FROM menu_items m 
        WHERE m.id = menu_ids[1 + (i % array_length(menu_ids, 1))];
        
        -- อัปเดตยอดรวมของออเดอร์
        UPDATE orders 
        SET total_amount = (
            SELECT SUM(total_price) 
            FROM order_items 
            WHERE order_id = order_uuid
        )
        WHERE id = order_uuid;
    END LOOP;
END $$;

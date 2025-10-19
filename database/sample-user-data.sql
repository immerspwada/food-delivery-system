-- Sample User Profile Data for Testing
-- Run this after user-profile-schema.sql

-- Insert sample customers
INSERT INTO customers (
  id,
  first_name,
  last_name,
  email,
  phone,
  date_of_birth,
  gender,
  dietary_restrictions,
  allergies,
  emergency_contact_name,
  emergency_contact_phone,
  emergency_contact_relationship,
  email_notifications,
  sms_notifications,
  marketing_notifications,
  loyalty_points,
  loyalty_tier,
  total_orders,
  total_spent,
  is_verified
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'สมชาย',
  'ใจดี',
  'somchai@example.com',
  '0812345678',
  '1990-05-15',
  'male',
  ARRAY['vegetarian']::dietary_restriction[],
  ARRAY['peanuts'],
  'สมหญิง ใจดี',
  '0823456789',
  'spouse',
  true,
  true,
  false,
  1250,
  'silver',
  15,
  4500.00,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'สมหญิง',
  'รักสะอาด',
  'somying@example.com',
  '0898765432',
  '1995-08-22',
  'female',
  ARRAY['gluten_free', 'dairy_free']::dietary_restriction[],
  ARRAY['shellfish', 'eggs'],
  'สมชาย รักสะอาด',
  '0887654321',
  'spouse',
  true,
  false,
  true,
  750,
  'bronze',
  8,
  2100.00,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'นายทดสอบ',
  'ระบบ',
  'test@example.com',
  '0801234567',
  '1988-12-10',
  'male',
  ARRAY['halal']::dietary_restriction[],
  ARRAY[]::text[],
  'นางทดสอบ ระบบ',
  '0809876543',
  'spouse',
  false,
  true,
  false,
  5500,
  'gold',
  45,
  18750.00,
  true
);

-- Insert sample user addresses
INSERT INTO user_addresses (
  customer_id,
  label,
  address_line_1,
  address_line_2,
  city,
  state,
  postal_code,
  address_type,
  is_default,
  latitude,
  longitude,
  delivery_instructions,
  landmark
) VALUES 
-- Addresses for สมชาย
(
  '550e8400-e29b-41d4-a716-446655440001',
  'บ้าน',
  '123/45 ซอยสุขุมวิท 21',
  'แขวงคลองเตยเหนือ',
  'กรุงเทพมหานคร',
  'กรุงเทพมหานคร',
  '10110',
  'home',
  true,
  13.7563,
  100.5018,
  'กดกริ่งสีแดง อพาร์ตเมนต์ชั้น 3',
  'ใกล้ 7-Eleven'
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'ออฟฟิศ',
  '999 อาคารเอ็มไพร์ทาวเวอร์',
  'ชั้น 25 ห้อง 2501',
  'กรุงเทพมหานคร',
  'กรุงเทพมหานคร',
  '10330',
  'work',
  false,
  13.7200,
  100.5300,
  'ส่งที่แผนกต้อนรับชั้น 1',
  'ใกล้สถานี BTS ช่องนนทรี'
),

-- Addresses for สมหญิง
(
  '550e8400-e29b-41d4-a716-446655440002',
  'คอนโด',
  '456/78 คอนโดมิเนียมเดอะริเวอร์',
  'ชั้น 15 ห้อง 1502',
  'กรุงเทพมหานคร',
  'กรุงเทพมหานคร',
  '10120',
  'home',
  true,
  13.7400,
  100.5600,
  'ลิฟต์ขึ้นชั้น 15 เลี้ยวซ้าย',
  'ริมแม่น้ำเจ้าพระยา'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'บ้านแม่',
  '789 หมู่บ้านสวนสน',
  'ซอย 12',
  'นนทบุรี',
  'นนทบุรี',
  '11000',
  'other',
  false,
  13.8600,
  100.5100,
  'บ้านสีเหลือง หน้าบ้านมีต้นมะม่วง',
  'ใกล้วัดใหญ่'
),

-- Addresses for นายทดสอบ
(
  '550e8400-e29b-41d4-a716-446655440003',
  'บ้าน',
  '321 ซอยลาดพร้าว 101',
  'แขวงคลองจั่น',
  'กรุงเทพมหานคร',
  'กรุงเทพมหานคร',
  '10240',
  'home',
  true,
  13.7800,
  100.6000,
  'บ้านเลขที่ 321 ประตูสีน้ำเงิน',
  'ใกล้โรงเรียนวัดลาดพร้าว'
);

-- Insert sample loyalty points transactions
INSERT INTO loyalty_points_transactions (
  customer_id,
  transaction_type,
  points,
  description,
  order_id,
  expires_at
) VALUES 
-- Transactions for สมชาย
(
  '550e8400-e29b-41d4-a716-446655440001',
  'earned',
  100,
  'แต้มจากการสั่งอาหาร - ออเดอร์ #12345',
  NULL,
  '2025-01-15 23:59:59+07'
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'earned',
  50,
  'แต้มโบนัสสมาชิกใหม่',
  NULL,
  '2025-02-15 23:59:59+07'
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'redeemed',
  -200,
  'แลกส่วนลด 20 บาท',
  NULL,
  NULL
),

-- Transactions for สมหญิง
(
  '550e8400-e29b-41d4-a716-446655440002',
  'earned',
  75,
  'แต้มจากการสั่งอาหาร - ออเดอร์ #12346',
  NULL,
  '2025-01-20 23:59:59+07'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'bonus',
  100,
  'แต้มโบนัสวันเกิด',
  NULL,
  '2025-08-22 23:59:59+07'
),

-- Transactions for นายทดสอบ
(
  '550e8400-e29b-41d4-a716-446655440003',
  'earned',
  150,
  'แต้มจากการสั่งอาหาร - ออเดอร์ #12347',
  NULL,
  '2025-01-25 23:59:59+07'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'earned',
  200,
  'แต้มโบนัสสมาชิก Gold',
  NULL,
  '2025-03-01 23:59:59+07'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'redeemed',
  -500,
  'แลกส่วนลด 50 บาท',
  NULL,
  NULL
);

-- Insert sample user preferences
INSERT INTO user_preferences (
  customer_id,
  favorite_cuisines,
  spice_level,
  preferred_payment_method,
  language,
  currency,
  theme
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  ARRAY['thai', 'japanese', 'italian'],
  'medium',
  'credit_card',
  'th',
  'THB',
  'light'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  ARRAY['healthy', 'salad', 'western'],
  'mild',
  'digital_wallet',
  'th',
  'THB',
  'auto'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  ARRAY['halal', 'middle_eastern', 'thai'],
  'hot',
  'cash_on_delivery',
  'th',
  'THB',
  'dark'
);

-- Update default address references in user preferences
UPDATE user_preferences 
SET default_address_id = (
  SELECT id FROM user_addresses 
  WHERE customer_id = user_preferences.customer_id 
  AND is_default = true 
  LIMIT 1
);

-- Insert sample favorite menu items (assuming some menu items exist)
-- Note: This would need actual menu_item_ids from your menu_items table
-- INSERT INTO user_favorites (customer_id, menu_item_id) VALUES 
-- ('550e8400-e29b-41d4-a716-446655440001', 'menu-item-uuid-1'),
-- ('550e8400-e29b-41d4-a716-446655440001', 'menu-item-uuid-2'),
-- ('550e8400-e29b-41d4-a716-446655440002', 'menu-item-uuid-3');

-- Verify data insertion
SELECT 
  c.first_name,
  c.last_name,
  c.email,
  c.loyalty_points,
  c.loyalty_tier,
  COUNT(ua.id) as address_count,
  COUNT(lpt.id) as transaction_count
FROM customers c
LEFT JOIN user_addresses ua ON c.id = ua.customer_id
LEFT JOIN loyalty_points_transactions lpt ON c.id = lpt.customer_id
GROUP BY c.id, c.first_name, c.last_name, c.email, c.loyalty_points, c.loyalty_tier
ORDER BY c.first_name;
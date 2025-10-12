# 🗄️ Database Setup Guide สำหรับระบบสมาชิก

## 📋 ขั้นตอนการ Setup Database

### 1️⃣ เปิด Supabase SQL Editor
- ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
- เลือก Project ของคุณ
- คลิก **SQL Editor** ในเมนูซ้าย

### 2️⃣ รัน SQL Schema ใหม่
```sql
-- Copy ทั้งหมดจากไฟล์ database/complete-setup-with-auth.sql
-- และ Paste ใน SQL Editor แล้วกด RUN
```

**หรือ** ใช้ไฟล์ที่เตรียมไว้:
- เปิดไฟล์ `database/complete-setup-with-auth.sql`
- Copy ทั้งหมด
- Paste ใน Supabase SQL Editor
- กด **RUN**

### 3️⃣ ตรวจสอบ Tables ที่สร้างแล้ว
หลังจากรัน SQL แล้ว คุณจะมี Tables เหล่านี้:

#### 👥 Authentication Tables:
- ✅ `users` - ข้อมูลสมาชิก (email, password, name, phone, role)

#### 🍕 Food Delivery Tables:
- ✅ `categories` - หมวดหมู่อาหาร
- ✅ `restaurants` - ข้อมูลร้านอาหาร  
- ✅ `menu_items` - รายการอาหาร
- ✅ `orders` - คำสั่งซื้อ (มี user_id สำหรับสมาชิก)
- ✅ `order_items` - รายการอาหารในคำสั่งซื้อ

### 4️⃣ ข้อมูลทดสอบที่มีอยู่แล้ว

#### 👤 User Accounts (password: admin123):
- **Admin**: admin@fooddelivery.com
- **Customer 1**: customer1@example.com  
- **Customer 2**: customer2@example.com

#### 🏪 Sample Restaurants:
- Pizza Palace
- Burger House
- Thai Delight

#### 🍽️ Sample Menu Items:
- Pizza: Margherita, Pepperoni, Hawaiian
- Burgers: Classic Beef, Chicken, Veggie
- Thai Food: Pad Thai, Green Curry, Tom Yum

## 🔧 การเชื่อมต่อ Backend

### Environment Variables ที่ต้องตั้งค่า:
```bash
# ใน server/.env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
```

### ตรวจสอบการเชื่อมต่อ:
```bash
# ทดสอบ API endpoints
curl http://localhost:3001/api/restaurants
curl http://localhost:3001/api/menu-items
curl http://localhost:3001/api/orders
```

## 🧪 การทดสอบระบบ

### 1. ทดสอบ Authentication:
- ไปที่ `/register` สร้างบัญชีใหม่
- ไปที่ `/login` เข้าสู่ระบบ
- ตรวจสอบ JWT token ใน localStorage

### 2. ทดสอบการสั่งอาหาร:
- เลือกร้านและเมนู
- ไปที่ checkout (ข้อมูลจะถูกใส่อัตโนมัติถ้าล็อกอิน)
- สั่งซื้อและตรวจสอบ order ใน database

### 3. ทดสอบ Admin Panel:
- ล็อกอินด้วย admin@fooddelivery.com
- ไปที่ `/admin` ดู dashboard
- ตรวจสอบ User Management และ Order Management

## 🚨 หากมีปัญหา

### ปัญหาที่พบบ่อย:
1. **Tables ไม่ถูกสร้าง**: ตรวจสอบ SQL syntax และ permissions
2. **Connection Error**: ตรวจสอบ SUPABASE_URL และ SUPABASE_ANON_KEY
3. **Authentication ไม่ทำงาน**: ตรวจสอบ JWT_SECRET

### วิธีแก้ไข:
```sql
-- ลบ tables เก่าและสร้างใหม่ (ระวัง: จะลบข้อมูลทั้งหมด)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;

-- จากนั้นรัน complete-setup-with-auth.sql ใหม่
```

## ✅ เสร็จสิ้น!

หลังจาก setup เสร็จแล้ว ระบบจะพร้อมใช้งาน:
- 🔐 Authentication System
- 🛒 Food Ordering with User Tracking  
- 👥 User Management
- 📊 Admin Dashboard

**Happy Coding! 🚀**
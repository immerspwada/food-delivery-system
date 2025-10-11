# 🚨 แก้ไขปัญหาโหลดเมนูไม่ได้

## สาเหตุปัญหา
- Supabase API Key ไม่ถูกต้องหรือหมดอายุ
- Database ยังไม่มีข้อมูลเมนู

## วิธีแก้ไข (ขั้นตอนที่ 1-5)

### 1. ตรวจสอบ Supabase
- เข้า https://supabase.com/dashboard
- เลือกโปรเจ็กต์ `pos`
- ตรวจสอบว่าโปรเจ็กต์ยังใช้งานได้

### 2. คัดลอก API Keys ใหม่
```
Settings → API → Project API keys
- Project URL: https://xxx.supabase.co
- anon public: eyJhbG...
- service_role: eyJhbG... (เก็บเป็นความลับ)
```

### 3. แก้ไขไฟล์ server/.env
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=5000
NODE_ENV=development
```

### 4. สร้างข้อมูลเริ่มต้น
- ไปที่ Supabase SQL Editor
- รันโค้ดจากไฟล์ `database/quick_setup.sql`:

```sql
-- รันคำสั่งนี้ใน Supabase SQL Editor
INSERT INTO categories (name, description, image_url, is_active) VALUES
('อาหารจานหลัก', 'อาหารจานหลักรสชาติเข้มข้น', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', true),
('เครื่องดื่ม', 'เครื่องดื่มสดชื่น', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', true);

-- เพิ่มเมนูตัวอย่าง
INSERT INTO menu_items (category_id, name, description, price, image_url, is_available, preparation_time) 
SELECT c.id, 'ข้าวผัดกุ้ง', 'ข้าวผัดกุ้งสดใส รสชาติกลมกล่อม', 89.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', true, 15
FROM categories c WHERE c.name = 'อาหารจานหลัก';
```

### 5. รีสตาร์ทระบบ
```bash
# หยุด process เก่า
pkill -f node

# เริ่มใหม่
npm run dev
```

### 6. ทดสอบ
- เข้า http://localhost:3000
- ตรวจสอบว่าโหลดเมนูได้แล้ว

## หากยังไม่ได้
1. ตรวจสอบ Console ใน Browser (F12)
2. ตรวจสอบ Server logs
3. ทดสอบ API โดยตรง: `curl http://localhost:5000/api/categories`

## ไฟล์สำคัญ
- `server/.env` - Environment variables
- `database/quick_setup.sql` - SQL สำหรับสร้างข้อมูล
- `server/index.js` - Backend API

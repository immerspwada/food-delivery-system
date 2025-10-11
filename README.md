# Food Delivery System (FoodieDelivery)

ระบบ Food Delivery แบบครบวงจรพร้อมระบบหลังบ้านและหน้าบ้าน รองรับการสั่งอาหารและการจัดการออเดอร์แบบเรียลไทม์

## คุณสมบัติหลัก

### หน้าบ้าน (Customer Interface)
- 🏠 หน้าแรกพร้อม User Header และ Location Display
- 🔍 ระบบค้นหาแบบ Global Search (ร้าน + เมนู)
- 🎯 Quick Actions สำหรับฟีเจอร์สำคัญ (ซ่อนในโปรไฟล์)
- 🎊 Promotion Banners แสดงโปรโมชั่นพิเศษ
- 🔄 Recent Orders สำหรับสั่งซ้ำง่ายๆ
- 🏪 Restaurant List แบบ Modern Card Design
- 🛒 ระบบตะกร้าสินค้าและการชำระเงิน
- 📱 Order Tracking Detail แบบ Real-time
- 👤 Customer Profile พร้อมจัดการที่อยู่
- 💳 รองรับการชำระเงินปลายทาง

### หลังบ้าน (Admin Panel)
- 🔐 Password Protection พร้อม Rate Limiting
- 🎹 Secret Admin Access (keyboard shortcut)
- 📊 Dashboard แสดงสถิติการขาย
- 🏪 Restaurant Management (เพิ่ม/แก้ไข/ลบร้าน)
- 📋 Order Management จัดการออเดอร์
- 🧾 Order Status Manager แบบ Real-time
- 🍽️ Menu Management (เพิ่ม/แก้ไข/ลบเมนู)
- 📂 Category Management จัดการหมวดหมู่
- 📈 Sales Reports และสถิติการขาย
- 🔔 แจ้งเตือนออเดอร์ใหม่แบบเรียลไทม์

### เทคโนโลยีที่ใช้

#### Frontend
- React 18 + TypeScript
- TailwindCSS สำหรับ UI
- React Router สำหรับ Navigation
- Socket.io Client สำหรับ Real-time
- Axios สำหรับ API calls
- Lucide React สำหรับ Icons

#### Backend
- Node.js + Express.js
- Socket.io สำหรับ Real-time notifications
- Supabase (PostgreSQL) สำหรับฐานข้อมูล
- Multer สำหรับการอัปโหลดไฟล์

## การติดตั้งและใช้งาน

### ข้อกำหนดเบื้องต้น
- Node.js 18+ 
- npm หรือ yarn
- Supabase Account

### 1. ติดตั้ง Dependencies

```bash
# ติดตั้ง dependencies ทั้งหมด
npm run install-all

# หรือติดตั้งแยกแต่ละโฟลเดอร์
npm install                    # Root dependencies
cd server && npm install      # Server dependencies  
cd ../client && npm install --legacy-peer-deps  # Client dependencies
```

### 2. ตั้งค่า Supabase

1. สร้างโปรเจ็กต์ใหม่ใน [Supabase](https://supabase.com)
2. ไปที่ SQL Editor และรันไฟล์ `database/schema.sql`
3. รันไฟล์ `database/sample_data.sql` สำหรับข้อมูลตัวอย่าง

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `server/`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
NODE_ENV=development
```

สร้างไฟล์ `.env` ในโฟลเดอร์ `client/` (ถ้าต้องการ):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. รันระบบ

```bash
# รันทั้ง server และ client พร้อมกัน
npm run dev

# หรือรันแยก
npm run server  # รัน backend server
npm run client  # รัน frontend client
```

## การใช้งาน

### สำหรับลูกค้า
1. เข้าใช้งานที่ `http://localhost:3000`
2. เลือกเมนูอาหารจากหน้า "เมนูอาหาร"
3. เพิ่มอาหารลงตะกร้า
4. กรอกข้อมูลการจัดส่งและสั่งอาหาร
5. ติดตามสถานะออเดอร์ผ่านลิงก์ที่ได้รับ

### สำหรับผู้ดูแลระบบ
1. เข้าใช้งาน Admin Panel ที่ `http://localhost:3000/admin`
2. ดู Dashboard สำหรับภาพรวมการขาย
3. จัดการออเดอร์ในหน้า "Orders"
4. เพิ่ม/แก้ไขเมนูในหน้า "Menu Items"
5. จัดการหมวดหมู่ในหน้า "Categories"
6. ดูรายงานการขายในหน้า "Reports"

## โครงสร้างโปรเจ็กต์

```
food-delivery-system/
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── components/       # React components
│   │   │   └── admin/       # Admin panel components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts (Cart)
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── config/          # Configuration files
│   └── public/              # Static files
├── server/                   # Backend (Express.js)
│   ├── index.js            # Main server file
│   └── .env                # Environment variables
├── database/                # Database files
│   ├── schema.sql          # Database schema
│   └── sample_data.sql     # Sample data
└── README.md               # This file
```

## API Endpoints

### Public Endpoints
- `GET /api/categories` - ดึงหมวดหมู่ทั้งหมด
- `GET /api/menu-items` - ดึงเมนูอาหารทั้งหมด
- `GET /api/menu-items/:id` - ดึงเมนูอาหารตาม ID
- `POST /api/orders` - สร้างออเดอร์ใหม่
- `GET /api/orders/:id` - ดึงออเดอร์ตาม ID

### Admin Endpoints  
- `GET /api/orders` - ดึงออเดอร์ทั้งหมด (แบ่งหน้า)
- `PATCH /api/orders/:id/status` - อัปเดตสถานะออเดอร์
- `POST /api/admin/categories` - สร้างหมวดหมู่ใหม่
- `PATCH /api/admin/categories/:id` - แก้ไขหมวดหมู่
- `DELETE /api/admin/categories/:id` - ลบหมวดหมู่
- `POST /api/admin/menu-items` - สร้างเมนูใหม่
- `PATCH /api/admin/menu-items/:id` - แก้ไขเמนู
- `DELETE /api/admin/menu-items/:id` - ลบเมนู
- `GET /api/admin/stats` - ดึงสถิติการขาย

## Real-time Features

ระบบใช้ Socket.io สำหรับฟีเจอร์แบบเรียลไทม์:

- 🔔 แจ้งเตือนออเดอร์ใหม่ใน Admin Panel
- 📱 อัปเดตสถานะออเดอร์แบบเรียลไทม์
- 📊 อัปเดตสถิติใน Dashboard แบบทันที

## การ Deploy

### การ Deploy Backend
1. ปรับ environment variables สำหรับ production
2. Deploy ไปยัง platform เช่น Railway, Render, หรือ Heroku
3. ตั้งค่า CORS สำหรับ domain ของ frontend

### การ Deploy Frontend  
1. Build production version: `cd client && npm run build`
2. Deploy ไปยัง Netlify, Vercel, หรือ static hosting
3. ตั้งค่า environment variables สำหรับ API URL

## การพัฒนาต่อ

### ฟีเจอร์ที่สามารถเพิ่มได้
- 🚗 ระบบไรเดอร์และการติดตาม GPS
- 💳 ระบบชำระเงินออนไลน์ (Stripe, PayPal)
- 👤 ระบบสมาชิกและประวัติการสั่ง
- ⭐ ระบบรีวิวและให้คะแนน
- 📧 ระบบแจ้งเตือนทาง Email/SMS
- 🎯 ระบบโปรโมชั่นและคูปอง

### การปรับปรุงด้านเทคนิค
- 🔐 ระบบ Authentication และ Authorization
- 📱 Progressive Web App (PWA)
- 🧪 Unit Testing และ Integration Testing
- 📈 Monitoring และ Analytics
- 🗄️ Database Optimization และ Indexing

## การสนับสนุน

หากพบปัญหาหรือต้องการความช่วยเหลือ:
1. ตรวจสอบ Console ใน Browser สำหรับ error messages
2. ตรวจสอบ Server logs สำหรับ backend errors  
3. ตรวจสอบการเชื่อมต่อ Supabase
4. ตรวจสอบ environment variables

## License

MIT License - สามารถนำไปใช้และพัฒนาต่อได้อย่างเสรี

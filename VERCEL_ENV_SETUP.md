# Vercel + Supabase Deployment Guide

## 🎯 เป้าหมาย
Deploy Food Delivery System ไปยัง Vercel พร้อมเชื่อมต่อกับ Supabase

## 📋 ขั้นตอนการ Deploy

### 1. เตรียม Supabase Project

1. สร้าง Project ใหม่ใน [Supabase Dashboard](https://supabase.com/dashboard)
2. ไปที่ **SQL Editor** และรันไฟล์ `database/supabase-schema.sql`
3. รันไฟล์ `database/supabase-sample-data.sql` สำหรับข้อมูลตัวอย่าง
4. ไปที่ **Settings → API** เพื่อคัดลอก:
   - Project URL
   - Anon public key
   - Service role key (สำหรับ admin functions)

### 2. ตั้งค่า Environment Variables ใน Vercel

ไปที่ **Vercel Dashboard → Project → Settings → Environment Variables** และเพิ่มตัวแปรเหล่านี้:

#### Frontend Variables (REACT_APP_*)
```
REACT_APP_API_URL=/api
REACT_APP_USE_MOCK_API=false
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
REACT_APP_ADMIN_PASSWORD=your_super_secure_admin_password_2024
REACT_APP_NAME=Food Delivery System
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_NOTIFICATIONS=true
NODE_ENV=production
```

#### Backend Variables (สำหรับ Serverless Functions)
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NODE_ENV=production
```

### 3. Deploy ไปยัง Vercel

#### วิธีที่ 1: ผ่าน Vercel CLI
```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### วิธีที่ 2: ผ่าน GitHub Integration
1. เชื่อมต่อ GitHub repository กับ Vercel
2. Vercel จะ auto-deploy ทุกครั้งที่ push ไป main branch

### 4. ตรวจสอบการทำงาน

หลัง deploy สำเร็จ ให้ทดสอบ:

1. **หน้าแรก**: ตรวจสอบการโหลดร้านอาหาร
2. **การสั่งอาหาร**: ทดสอบเพิ่มสินค้าลงตะกร้า
3. **Admin Panel**: เข้า `/admin` ด้วยรหัสผ่านที่ตั้งไว้
4. **API Endpoints**: ตรวจสอบ `/api/health`

## 🔧 การแก้ไขปัญหาที่พบบ่อย

### Build Errors
```bash
# ถ้า build ล้มเหลว ลองรันใน local ก่อน
npm run build:prod

# ตรวจสอบ dependencies
npm run install-all
```

### Environment Variables ไม่ทำงาน
- ตรวจสอบว่าตัวแปรที่ขึ้นต้นด้วย `REACT_APP_` สำหรับ frontend
- ตัวแปรอื่นๆ สำหรับ serverless functions
- Redeploy หลังเปลี่ยน environment variables

### Database Connection Issues
- ตรวจสอบ Supabase URL และ Keys
- ตรวจสอบ RLS (Row Level Security) policies
- ตรวจสอบ CORS settings ใน Supabase

## 📱 Features ที่ใช้งานได้หลัง Deploy

✅ **Customer Features:**
- เรียกดูร้านอาหารและเมนู
- เพิ่มสินค้าลงตะกร้า
- สั่งอาหารและติดตามสถานะ
- ระบบค้นหาแบบ Global Search

✅ **Admin Features:**
- จัดการร้านอาหารและเมนู
- จัดการออเดอร์แบบ Real-time
- ดูสถิติการขายและรายงาน
- จัดการหมวดหมู่สินค้า

✅ **Real-time Features:**
- แจ้งเตือนออเดอร์ใหม่
- อัพเดทสถานะออเดอร์แบบ Real-time
- Socket.io integration

## 🚀 Next Steps

หลัง deploy สำเร็จแล้ว สามารถ:
1. ตั้งค่า Custom Domain
2. เพิ่ม Analytics และ Monitoring
3. ตั้งค่า CDN สำหรับรูปภาพ
4. เพิ่ม Payment Gateway
5. ตั้งค่า Email notifications

## 📞 Support

หากมีปัญหาในการ deploy สามารถตรวจสอบ:
- Vercel Deployment Logs
- Supabase Logs
- Browser Developer Console
- Network Tab สำหรับ API calls
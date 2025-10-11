# 🚀 คู่มือ Deploy Food Delivery + MCP System ไปยัง Vercel

## 📋 **ขั้นตอนการ Deploy (ทำตามลำดับ)**

### 1️⃣ **Login เข้า Vercel**
```bash
vercel login
```
- เปิดเบราว์เซอร์ไปที่ URL ที่แสดง
- ใส่โค้ดที่ให้มา
- รอจนกว่าจะ login สำเร็จ

### 2️⃣ **Deploy โปรเจกต์**
```bash
vercel --prod --yes
```

### 3️⃣ **ตั้งค่า Environment Variables ใน Vercel Dashboard**

#### **Frontend Variables (REACT_APP_*):**
```bash
REACT_APP_SUPABASE_URL=https://bsyernhbtlqwiilkiuig.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzeWVybmhidGxxd2lpbGtpdWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzI5ODM
REACT_APP_API_URL=https://your-vercel-domain.vercel.app/api
REACT_APP_SOCKET_URL=https://your-vercel-domain.vercel.app
REACT_APP_USE_MOCK_API=false
REACT_APP_ENABLE_ADMIN_PANEL=true
REACT_APP_ENABLE_MCP=true
REACT_APP_MCP_INVENTORY_TRACKING=true
REACT_APP_MCP_COST_TRACKING=true
REACT_APP_MCP_SUPPLIER_MANAGEMENT=true
```

#### **Backend Variables:**
```bash
SUPABASE_URL=https://bsyernhbtlqwiilkiuig.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzeWVybmhidGxxd2lpbGtpdWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzI5ODM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzeWVybmhidGxxd2lpbGtpdWlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDE3Mjk4MywiZXhwIjoyMDc1NzQ4OTgzfQ.pwh0PtN85_QuwtQGj9JXOZPQQ_ZLqbN5UJIAHuYJtcE
NODE_ENV=production
PORT=3001
JWT_SECRET=your-jwt-secret-key
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

#### **MCP System Variables:**
```bash
MCP_ENABLE_INVENTORY=true
MCP_ENABLE_MATERIAL_CONTROL=true
MCP_ENABLE_COST_ANALYSIS=true
MCP_ENABLE_SUPPLIER_INTEGRATION=true
MCP_LOW_STOCK_THRESHOLD=10
MCP_CRITICAL_STOCK_THRESHOLD=5
```

### 4️⃣ **ตั้งค่า Database ใน Supabase**

#### **รัน Schema:**
1. เปิด Supabase Dashboard
2. ไปที่ SQL Editor
3. รันไฟล์ `database/mcp-schema.sql`
4. รันไฟล์ `database/supabase-schema.sql` (ถ้ายังไม่ได้รัน)

#### **เพิ่มข้อมูลตัวอย่าง (ถ้าต้องการ):**
```sql
-- รันไฟล์ database/mcp-sample-data.sql
-- รันไฟล์ database/supabase-sample-data.sql
```

### 5️⃣ **ทดสอบระบบ**

#### **ทดสอบ Frontend:**
- เข้าถึงหน้าเว็บหลัก
- ทดสอบการ login/register
- ทดสอบการสั่งอาหาร

#### **ทดสอบ MCP System:**
- เข้าถึง `/admin` หรือ MCP Dashboard
- ทดสอบการจัดการ inventory
- ทดสอบการดู cost analysis

#### **ทดสอบ API:**
```bash
# ทดสอบ health check
curl https://your-vercel-domain.vercel.app/api/health

# ทดสอบ MCP API
curl https://your-vercel-domain.vercel.app/api/mcp/materials
```

## 🔧 **วิธีตั้งค่า Environment Variables ใน Vercel:**

### **ผ่าน Dashboard:**
1. ไปที่ Vercel Dashboard
2. เลือกโปรเจกต์
3. ไปที่ Settings → Environment Variables
4. เพิ่มตัวแปรทีละตัว

### **ผ่าน CLI:**
```bash
# ตัวอย่างการตั้งค่า
vercel env add REACT_APP_SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

## 🎯 **Features ที่พร้อมใช้งาน:**

### **🍕 Food Delivery System:**
- ✅ หน้าแสดงร้านอาหาร
- ✅ ระบบสั่งอาหาร
- ✅ ระบบจัดการคำสั่งซื้อ
- ✅ Admin Panel

### **📊 MCP (Material Control Plan) System:**
- ✅ Dashboard แสดงสถิติ inventory
- ✅ จัดการวัตถุดิบ (Materials)
- ✅ จัดการซัพพลายเออร์ (Suppliers)
- ✅ ติดตาม stock movements
- ✅ Cost analysis และ reporting
- ✅ Alert system สำหรับ low stock

### **🔐 Security Features:**
- ✅ Row Level Security (RLS)
- ✅ JWT Authentication
- ✅ Environment variables protection

## 🚨 **Troubleshooting:**

### **ปัญหาที่อาจเจอ:**

1. **Build Error:**
   ```bash
   npm run build:prod
   # ตรวจสอบ error และแก้ไข
   ```

2. **Environment Variables ไม่ทำงาน:**
   - ตรวจสอบชื่อตัวแปรให้ถูกต้อง
   - Redeploy หลังจากเพิ่ม env vars

3. **Database Connection Error:**
   - ตรวจสอบ Supabase credentials
   - ตรวจสอบว่ารัน schema แล้ว

4. **API Endpoints ไม่ทำงาน:**
   - ตรวจสอบ vercel.json configuration
   - ตรวจสอบ function timeout settings

## 📞 **การติดต่อและ Support:**

หากมีปัญหาในการ deploy สามารถ:
1. ตรวจสอบ Vercel deployment logs
2. ตรวจสอบ Supabase logs
3. ทดสอบ API endpoints ด้วย curl หรือ Postman

---

**🎉 ขอให้การ deploy สำเร็จ!** 

ระบบ Food Delivery + MCP พร้อมใช้งานแล้ว! 🚀
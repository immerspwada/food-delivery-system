# 🚀 คู่มือการพัฒนาระบบ Food Delivery

## 🎯 **วิธีการพัฒนาแบบไม่ต้องเชื่อมฐานข้อมูล**

### **เริ่มใช้งานระบบด้วย Mock Data**

```bash
# 1. ติดตั้ง dependencies เฉพาะ frontend
cd client
npm install --legacy-peer-deps

# 2. เริ่มระบบแบบ Mock API
npm run dev-mock

# หรือใช้จาก root directory
npm run dev-mock
```

### **🎭 Mock API System**

ระบบ Mock API จำลองการทำงานของฐานข้อมูลจริงแบบ 100% โดยมีฟีเจอร์:

#### **📊 ข้อมูล Mock ที่มี:**
- **6 หมวดหมู่อาหาร:** อาหารจานหลัก, ของหวาน, เครื่องดื่ม, อาหารว่าง, ก๋วยเตี๋ยว, ข้าวมันไก่
- **18+ เมนูอาหาร:** ครบทุกหมวดหมู่ พร้อมรูปภาพและรายละเอียด
- **3 ออเดอร์ตัวอย่าง:** สถานะต่างๆ กัน (pending, preparing, delivered)
- **ลูกค้าตัวอย่าง:** พร้อมข้อมูลที่อยู่และเบอร์ติดต่อ

#### **🔧 ฟีเจอร์ที่ทำงานได้:**
- ✅ **หน้าแรก:** แสดงหมวดหมู่และเมนูแนะนำ
- ✅ **เมนูอาหาร:** ค้นหา กรอง เพิ่มลงตะกร้า
- ✅ **ตะกร้าสินค้า:** จัดการรายการ ปรับจำนวน
- ✅ **ชำระเงิน:** กรอกข้อมูล สั่งอาหาร
- ✅ **ติดตามออเดอร์:** แสดงสถานะแบบเรียลไทม์
- ✅ **Admin Panel:** จัดการเมนู หมวดหมู่ ออเดอร์
- ✅ **Dashboard:** สถิติการขาย รายงาน

### **🛠️ Developer Tools**

เมื่อเปิดระบบแล้ว จะเห็นปุ่ม **เฟือง** ที่มุมล่างขวา สำหรับ:

#### **📱 การใช้งาน Dev Tools:**
1. **คลิกปุ่มเฟือง** ที่มุมล่างขวา
2. **Toggle Mock/Real API** - สลับระหว่าง Mock กับฐานข้อมูลจริง
3. **รีเซ็ต Mock Data** - กลับสู่ข้อมูลเริ่มต้น
4. **สร้าง Mock Orders** - เพิ่มออเดอร์ตัวอย่าง 10 รายการ

#### **🎲 การทดสอบระบบ:**
```bash
# เพิ่ม Mock Orders เพิ่มเติม
# ไปที่ Dev Tools → สร้าง Mock Orders

# รีเซ็ตข้อมูลเป็นค่าเริ่มต้น  
# ไปที่ Dev Tools → รีเซ็ต Mock Data
```

### **📁 โครงสร้างไฟล์ Mock System**

```
client/src/
├── data/
│   └── mockData.ts          # ข้อมูล Mock ทั้งหมด
├── services/
│   ├── mockApi.ts           # Mock API Services
│   └── api.ts               # API Service (รองรับทั้ง Mock และ Real)
└── components/
    └── DevTools.tsx         # เครื่องมือสำหรับ Developer
```

### **🔄 การพัฒนาแบบ Step by Step**

#### **ขั้นตอนที่ 1: พัฒนา UI/UX**
```bash
npm run dev-mock  # ใช้ Mock API
```
- พัฒนา Component ใหม่
- ทดสอบ User Interface  
- ปรับแต่ง Design และ UX

#### **ขั้นตอนที่ 2: ทดสอบ Logic**
- ใช้ Dev Tools เพิ่ม/ลบข้อมูล
- ทดสอบ Flow การสั่งอาหาร
- ตรวจสอบ State Management

#### **ขั้นตอนที่ 3: เชื่อมต่อฐานข้อมูลจริง**
```bash
# เปลี่ยนใน client/.env
REACT_APP_USE_MOCK_API=false

# หรือใช้ Dev Tools สลับเป็น Real API
```

### **⚙️ Environment Variables**

```env
# client/.env
REACT_APP_USE_MOCK_API=true          # ใช้ Mock API
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=your_url
REACT_APP_SUPABASE_ANON_KEY=your_key
```

### **🎨 การเพิ่มข้อมูล Mock**

#### **เพิ่มเมนูใหม่:**
```typescript
// ใน client/src/data/mockData.ts
export const mockMenuItems: MenuItem[] = [
  // เพิ่มเมนูใหม่ที่นี่
  {
    id: '19',
    category_id: '1',
    name: 'เมนูใหม่ของคุณ',
    description: 'รายละเอียดเมนู',
    price: 120,
    image_url: 'https://example.com/image.jpg',
    is_available: true,
    preparation_time: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
```

#### **เพิ่มหมวดหมู่ใหม่:**
```typescript
// ใน client/src/data/mockData.ts
export const mockCategories: Category[] = [
  // เพิ่มหมวดหมู่ใหม่ที่นี่
  {
    id: '7',
    name: 'หมวดหมู่ใหม่',
    description: 'คำอธิบาย',
    image_url: 'https://example.com/category.jpg',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
```

### **🔍 การ Debug และ Troubleshooting**

#### **เช็ค Console Logs:**
```javascript
// Mock API จะแสดง logs ใน Browser Console
// ดูที่ Developer Tools → Console

🎭 Mock API: Getting categories...
✅ API ทำงานปกติ - พบหมวดหมู่: 6 รายการ
```

#### **การตรวจสอบข้อมูล:**
```bash
# เปิด Browser Console (F12)
# ดูได้ว่า API ไหนถูกเรียกใช้

# ดู Network Tab เพื่อเช็คการเรียก API
# (จะไม่มี network calls จริงใน Mock mode)
```

### **🚀 ข้อดีของการพัฒนาแบบ Mock**

✅ **ไม่ต้องติดตั้ง Database**  
✅ **พัฒนาได้เร็วขึ้น**  
✅ **ทดสอบได้หลากหลาย Scenario**  
✅ **ไม่ต้องกังวลเรื่อง API Limit**  
✅ **ข้อมูลสม่ำเสมอ ไม่เปลี่ยนแปลง**  
✅ **สามารถ Demo ได้ทันที**  

### **🎯 เมื่อไหร่ควรเปลี่ยนเป็น Real API**

- เมื่อ UI/UX เสร็จสมบูรณ์แล้ว
- เมื่อต้องการทดสอบ Performance จริง
- เมื่อต้องการ Real-time Features  
- เมื่อพร้อม Deploy Production

### **📱 การใช้งานระบบ**

1. **ลูกค้า**: http://localhost:3000
   - เลือกเมนู → เพิ่มลงตะกร้า → สั่งอาหาร

2. **Admin**: http://localhost:3000/admin  
   - จัดการเมนู → ดูออเดอร์ → อัพเดตสถานะ

3. **Dev Tools**: คลิกปุ่มเฟืองมุมล่างขวา
   - สลับ API Mode → เพิ่มข้อมูลทดสอบ

---

🎉 **ตอนนี้คุณสามารถพัฒนาระบบได้อย่างเต็มที่โดยไม่ต้องกังวลเรื่องฐานข้อมูล!**

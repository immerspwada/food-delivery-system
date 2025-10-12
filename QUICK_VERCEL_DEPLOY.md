# 🚀 Quick Vercel Deployment Guide

## สถานะปัจจุบัน
- ✅ โค้ดพร้อม deploy แล้ว
- ✅ Push ไปยัง GitHub เรียบร้อยแล้ว
- ⚠️ CLI deployment ช้า → ใช้ GitHub Integration แทน

## วิธี Deploy ผ่าน GitHub Integration (แนะนำ)

### 1. ไปที่ Vercel Dashboard
🌐 https://vercel.com/new

### 2. Import Git Repository
- เลือก "Import Git Repository"
- เลือก repository: `immerspwada/food-delivery-system`
- กด "Import"

### 3. Configure Project
- **Project Name**: food-delivery-mcp-system
- **Framework Preset**: Create React App
- **Root Directory**: ./
- **Build Command**: npm run build:prod
- **Output Directory**: build
- **Install Command**: npm install

### 4. Environment Variables
ตั้งค่าตัวแปรต่อไปนี้:

**Frontend:**
```
REACT_APP_SUPABASE_URL=https://bsyernhbtlqwiilkiuig.supabase.co
REACT_APP_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
REACT_APP_ENABLE_MCP=true
REACT_APP_API_URL=https://[YOUR_APP_NAME].vercel.app/api
```

**Backend:**
```
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]
NODE_ENV=production
```

### 5. Deploy
กด "Deploy" และรอสักครู่

## หลัง Deploy เสร็จ
1. ตั้งค่า Environment Variables ใน Vercel Dashboard
2. รัน Database Schema ใน Supabase
3. ทดสอบระบบ

## URLs สำคัญ
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **GitHub Repo**: https://github.com/immerspwada/food-delivery-system


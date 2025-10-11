#!/bin/bash

# 🚀 Food Delivery + MCP System Auto Deploy Script
echo "🚀 เริ่มต้น Deploy Food Delivery + MCP System ไปยัง Vercel..."

# ตรวจสอบว่ามี Vercel CLI หรือไม่
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI ไม่พบ กำลังติดตั้ง..."
    npm install -g vercel
fi

# Build โปรเจกต์
echo "🔨 กำลัง Build โปรเจกต์..."
npm run build:prod

if [ $? -ne 0 ]; then
    echo "❌ Build ล้มเหลว กรุณาตรวจสอบ error"
    exit 1
fi

echo "✅ Build สำเร็จ!"
echo ""
echo "📋 ขั้นตอนการ Deploy:"
echo ""
echo "🔐 1. Login เข้า Vercel:"
echo "   vercel login"
echo "   (ไปที่ vercel.com/device และใส่โค้ดที่แสดง)"
echo ""
echo "🚀 2. Deploy โปรเจกต์:"
echo "   vercel --prod --yes"
echo ""
echo "⚙️ 3. ตั้งค่า Environment Variables ใน Vercel Dashboard:"
echo "   - REACT_APP_SUPABASE_URL=https://bsyernhbtlqwiilkiuig.supabase.co"
echo "   - REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo "   - SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo "   - NODE_ENV=production"
echo "   - REACT_APP_ENABLE_MCP=true"
echo ""
echo "🗄️ 4. รัน Database Schema ใน Supabase:"
echo "   - เปิด Supabase Dashboard"
echo "   - ไปที่ SQL Editor"
echo "   - รันไฟล์ database/mcp-schema.sql"
echo "   - รันไฟล์ database/supabase-schema.sql"
echo ""
echo "📖 ดูคู่มือเพิ่มเติมใน QUICK_DEPLOY_GUIDE.md"
echo ""
echo "🎯 หรือใช้ GitHub Integration:"
echo "   1. Push โค้ดไปยัง GitHub"
echo "   2. เชื่อมต่อ GitHub กับ Vercel"
echo "   3. ตั้งค่า Environment Variables"
echo ""
echo "🎉 ระบบพร้อม Deploy แล้ว!"
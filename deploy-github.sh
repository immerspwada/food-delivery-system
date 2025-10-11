#!/bin/bash

# 🚀 One-Click Deploy via GitHub Integration
echo "🚀 One-Click Deploy Food Delivery + MCP System via GitHub..."

# ตรวจสอบว่ามี git หรือไม่
if ! command -v git &> /dev/null; then
    echo "❌ Git ไม่พบ กรุณาติดตั้ง Git ก่อน"
    exit 1
fi

# Build โปรเจกต์
echo "🔨 กำลัง Build โปรเจกต์..."
npm run build:prod

if [ $? -ne 0 ]; then
    echo "❌ Build ล้มเหลว กรุณาตรวจสอบ error"
    exit 1
fi

# เพิ่มไฟล์ทั้งหมดเข้า git
echo "📦 กำลังเตรียมไฟล์สำหรับ GitHub..."
git add .

# Commit การเปลี่ยนแปลง
echo "💾 กำลัง Commit การเปลี่ยนแปลง..."
git commit -m "feat: Add MCP system and prepare for Vercel deployment

- Add Material Control Plan (MCP) system for inventory management
- Configure Supabase integration with credentials
- Set up environment variables for production
- Add deployment scripts and documentation
- Ready for Vercel deployment with GitHub integration"

# Push ไปยัง GitHub
echo "🚀 กำลัง Push ไปยัง GitHub..."
git push origin main || git push origin master

if [ $? -eq 0 ]; then
    echo "✅ Push ไปยัง GitHub สำเร็จ!"
    echo ""
    echo "🎯 ขั้นตอนถัดไป:"
    echo "1. ไปที่ https://vercel.com/new"
    echo "2. เลือก 'Import Git Repository'"
    echo "3. เลือก repository นี้"
    echo "4. ตั้งค่า Environment Variables:"
    echo ""
    echo "   Frontend Variables:"
    echo "   REACT_APP_SUPABASE_URL=https://bsyernhbtlqwiilkiuig.supabase.co"
    echo "   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzeWVybmhidGxxd2lpbGtpdWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzI5ODM"
    echo "   REACT_APP_ENABLE_MCP=true"
    echo "   REACT_APP_API_URL=https://your-vercel-domain.vercel.app/api"
    echo ""
    echo "   Backend Variables:"
    echo "   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzeWVybmhidGxxd2lpbGtpdWlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDE3Mjk4MywiZXhwIjoyMDc1NzQ4OTgzfQ.pwh0PtN85_QuwtQGj9JXOZPQQ_ZLqbN5UJIAHuYJtcE"
    echo "   NODE_ENV=production"
    echo ""
    echo "5. กด Deploy!"
    echo ""
    echo "📖 ดูคู่มือเพิ่มเติมใน QUICK_DEPLOY_GUIDE.md"
else
    echo "❌ Push ไปยัง GitHub ล้มเหลว"
    echo "🔍 กรุณาตรวจสอบ:"
    echo "   - ว่าได้ตั้งค่า Git remote origin แล้ว"
    echo "   - ว่ามีสิทธิ์ในการ push ไปยัง repository"
    echo "   - ลองรัน: git remote -v"
fi
# 🚀 Vercel + Supabase Deployment Guide

## 🎯 **ภาพรวม**
การ deploy Food Delivery System ด้วย **Vercel** (Frontend + Serverless API) + **Supabase** (Database + Auth + Storage)

## 📋 **Pre-Deployment Checklist**

### **✅ ขั้นตอนเตรียมการ**
- [ ] มี GitHub repository พร้อม push code แล้ว
- [ ] มี Vercel account (ฟรี)
- [ ] มี Supabase account (ฟรี)
- [ ] ติดตั้ง Vercel CLI (optional): `npm install -g vercel`

---

## 🗄️ **Step 1: Setup Supabase Database**

### **1.1 สร้าง Supabase Project**
1. ไป [supabase.com](https://supabase.com)
2. Sign in/Sign up
3. คลิก **"New project"**
4. เลือก Organization
5. ตั้งชื่อ Project: `food-delivery-system`
6. เลือก Region: **Singapore (Southeast Asia)**
7. ตั้ง Database Password (จำไว้!)
8. คลิก **"Create new project"**

### **1.2 Setup Database Schema**
1. รอ project สร้างเสร็จ (1-2 นาที)
2. ไปที่ **SQL Editor** (ซ้ายมือ)
3. คลิก **"New query"**
4. Copy-paste จาก `database/supabase-schema.sql`
5. คลิก **"Run"** ✅
6. ตรวจสอบว่าไม่มี error

### **1.3 Insert Sample Data**
1. สร้าง query ใหม่
2. Copy-paste จาก `database/supabase-sample-data.sql`  
3. คลิก **"Run"** ✅
4. ไปที่ **Table Editor** → ตรวจสอบว่ามีข้อมูลแล้ว

### **1.4 Get API Keys**
1. ไปที่ **Settings** → **API**
2. Copy **Project URL**
3. Copy **anon/public key**
4. Copy **service_role/secret key** (สำหรับ serverless functions)

---

## ⚡ **Step 2: Deploy to Vercel**

### **2.1 วิธีที่ 1: Deploy ผ่าน Web Interface (แนะนำ)**

#### **A. Connect Repository**
1. ไป [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. คลิก **"New Project"**
4. เลือก repository `wwdelive`
5. คลิก **"Import"**

#### **B. Configure Build Settings**
- **Framework Preset:** Create React App
- **Root Directory:** `./` (default)
- **Build Command:** `cd client && npm run build:prod`
- **Output Directory:** `client/build`
- **Install Command:** `npm run install-all`

#### **C. Environment Variables**
คลิก **"Environment Variables"** และเพิ่ม:

```bash
# Frontend Variables
REACT_APP_API_URL=/api
REACT_APP_USE_MOCK_API=false
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
REACT_APP_ADMIN_PASSWORD=your_secure_admin_password
NODE_ENV=production

# Backend Variables (for serverless functions)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### **D. Deploy**
1. คลิก **"Deploy"**
2. รอ deployment เสร็จ (3-5 นาที)
3. ได้ URL: `https://your-app.vercel.app`

### **2.2 วิธีที่ 2: Deploy ผ่าน CLI**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Follow prompts:
# - Link to existing project? N
# - Project name: food-delivery-system
# - Directory: ./
# - Override settings? Y
#   - Build Command: cd client && npm run build:prod
#   - Output Directory: client/build
#   - Development Command: npm run dev
```

---

## 🔧 **Step 3: Configure Environment Variables**

### **3.1 ใน Vercel Dashboard**
1. ไปที่ project dashboard
2. คลิก **Settings** → **Environment Variables**
3. เพิ่มตัวแปรทั้งหมดตาม checklist ข้างต้น

### **3.2 Test API Endpoints**
หลัง deploy เสร็จ ทดสอบ:
- `https://your-app.vercel.app/api/health` ✅
- `https://your-app.vercel.app/api/restaurants` ✅
- `https://your-app.vercel.app/api/menu-items` ✅

---

## 🔐 **Step 4: Supabase Security Setup**

### **4.1 Configure Authentication (Optional)**
1. ไป **Authentication** → **Settings**
2. เปิด **Enable email confirmations** (recommended)
3. ตั้ง **Site URL:** `https://your-app.vercel.app`

### **4.2 Review RLS Policies**
1. ไป **Authentication** → **Policies**
2. ตรวจสอบ policies ใน tables
3. สำหรับ demo: ปล่อยเป็น "Enable read access for all users"
4. สำหรับ production: ปรับให้เข้มงวดขึ้น

### **4.3 Database Backups**
1. ไป **Settings** → **Database**
2. เปิด **Point in Time Recovery** (Pro plan)
3. หรือ setup regular backups

---

## 🌐 **Step 5: Custom Domain (Optional)**

### **5.1 Add Domain in Vercel**
1. ไปที่ **Settings** → **Domains**
2. เพิ่ม domain: `yourdomain.com`
3. Configure DNS records ตาม instructions

### **5.2 Update Supabase Site URL**
1. ไป Supabase → **Authentication** → **Settings**
2. อัพเดท **Site URL** เป็น `https://yourdomain.com`

---

## ✅ **Step 6: Testing & Verification**

### **6.1 Functional Testing**
- [ ] หน้าแรกโหลดได้
- [ ] ดูร้านอาหารได้
- [ ] ดูเมนูได้
- [ ] เพิ่มของลงตะกร้าได้
- [ ] สร้างออเดอร์ได้
- [ ] Admin panel เข้าได้ (พิมพ์ `admin`)
- [ ] ดู/แก้ไขออเดอร์ได้

### **6.2 Performance Testing**
- [ ] Lighthouse score > 90
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Mobile responsive ✅

### **6.3 Error Testing**
- [ ] ไม่มี Console errors
- [ ] Error boundaries ทำงาน
- [ ] 404 pages redirect ถูกต้อง
- [ ] API errors handled gracefully

---

## 📊 **Monitoring & Analytics**

### **6.1 Vercel Analytics**
1. ไป **Analytics** tab in Vercel
2. ติดตาม page views, performance
3. ดู error rates และ response times

### **6.2 Supabase Monitoring**
1. ไป **Reports** in Supabase
2. ติดตาม database usage
3. ตรวจสอบ API requests

### **6.3 Set Up Alerts**
1. Vercel: Set up deployment notifications
2. Supabase: Monitor database connections
3. Consider third-party monitoring (UptimeRobot, etc.)

---

## 🚨 **Troubleshooting Common Issues**

### **Build Failures**
```bash
# Error: Build failed
# Solution: Check build logs in Vercel dashboard
# Common causes:
- Missing environment variables
- Wrong build command
- Package.json issues
- TypeScript errors
```

### **API Not Working**
```bash
# Error: API endpoints return 404
# Solutions:
1. Check vercel.json routing configuration
2. Verify serverless functions in /api folder
3. Check environment variables are set
4. Test Supabase connection manually
```

### **Database Connection Issues**
```bash
# Error: Database queries fail
# Solutions:
1. Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
2. Check RLS policies
3. Test queries in Supabase SQL Editor
4. Verify table names and schemas
```

### **Environment Variable Issues**
```bash
# Error: Environment variables undefined
# Solutions:
1. Check variable names (exact match)
2. Verify in Vercel settings
3. Redeploy after adding variables
4. Check client vs server variable prefixes
```

---

## 🔄 **Deployment Workflow**

### **Development → Production**
```bash
# 1. Development
git checkout -b feature/new-feature
# ... make changes
git commit -m "Add new feature"
git push origin feature/new-feature

# 2. Preview Deployment (automatic)
# Vercel creates preview URL for PR

# 3. Production Deployment
git checkout main
git merge feature/new-feature
git push origin main
# Vercel automatically deploys to production
```

### **Environment-Specific Configs**
- **Development:** Local API + Local Supabase (optional)
- **Preview:** Production API + Production Supabase
- **Production:** Production API + Production Supabase

---

## 💰 **Cost Estimation**

### **Free Tier Limits:**
- **Vercel Free:** 
  - 100GB bandwidth/month
  - 100 deployments/day
  - 1000 serverless function invocations/hour

- **Supabase Free:**
  - 2 projects
  - 500MB database
  - 5,000 API requests/hour
  - 50MB file storage

### **Scaling Plans:**
- **Vercel Pro:** $20/month (more bandwidth, team features)
- **Supabase Pro:** $25/month (8GB database, more requests)

---

## 🎯 **Production Optimizations**

### **Performance**
```bash
# Enable in vercel.json:
1. Static file caching (1 year)
2. Gzip compression
3. Image optimization
4. Edge function regions
```

### **Security**
```bash
# Configure:
1. CORS origins (specific domains only)
2. Rate limiting (API functions)
3. Input validation
4. SQL injection protection (parameterized queries)
```

### **Monitoring**
```bash
# Setup:
1. Error tracking (Sentry)
2. Performance monitoring
3. Uptime monitoring
4. User analytics
```

---

## 🎉 **Success! Your App is Live**

### **URLs:**
- **Production:** `https://your-app.vercel.app`
- **Admin Panel:** `https://your-app.vercel.app` (type "admin")
- **API Health:** `https://your-app.vercel.app/api/health`
- **Supabase Dashboard:** `https://app.supabase.com/project/your-project-id`

### **Quick Commands:**
```bash
# Deploy updates
git push origin main

# Check deployment status
vercel ls

# View logs
vercel logs

# Test API locally
curl https://your-app.vercel.app/api/health
```

### **Next Steps:**
- [ ] Add custom domain
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Add real payment processing
- [ ] Implement user authentication
- [ ] Add push notifications

---

## 🆘 **Support & Resources**

### **Documentation:**
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

### **Community:**
- [Vercel Discord](https://vercel.com/discord)
- [Supabase Discord](https://discord.supabase.com/)
- [React Community](https://reactjs.org/community/support.html)

---

## 🏆 **Congratulations!**

🎉 **Your Food Delivery System is now live on Vercel + Supabase!**

**Features Deployed:**
- ✅ **Full-Stack App** - Frontend + API + Database
- ✅ **Real-Time Features** - Order tracking, admin updates
- ✅ **Admin Panel** - Complete management system
- ✅ **Mobile Optimized** - PWA-ready
- ✅ **Production Security** - Headers, CORS, validation
- ✅ **Auto Scaling** - Serverless architecture
- ✅ **Global CDN** - Fast worldwide access

**Ready to serve customers globally! 🌍**

**Happy Launching! 🚀**

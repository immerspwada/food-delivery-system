const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ข้อมูลหมวดหมู่เริ่มต้น
const categories = [
  {
    name: 'อาหารจานหลัก',
    description: 'อาหารจานหลักรสชาติเข้มข้น',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    is_active: true
  },
  {
    name: 'ของหวาน',
    description: 'ของหวานหลากหลายรสชาติ',
    image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    is_active: true
  },
  {
    name: 'เครื่องดื่ม',
    description: 'เครื่องดื่มสดชื่น',
    image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    is_active: true
  },
  {
    name: 'อาหารว่าง',
    description: 'อาหารว่างและขนมขบเคี้ยว',
    image_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400',
    is_active: true
  }
];

// ข้อมูลเมนูอาหารเริ่มต้น
const menuItemsData = [
  {
    category: 'อาหารจานหลัก',
    items: [
      {
        name: 'ข้าวผัดกุ้ง',
        description: 'ข้าวผัดกุ้งสดใส รสชาติกลมกล่อม',
        price: 89.00,
        image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        preparation_time: 15
      },
      {
        name: 'ผัดไทยกุ้งสด',
        description: 'ผัดไทยกุ้งสด รสชาติต้นตำรับ',
        price: 95.00,
        image_url: 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400',
        preparation_time: 20
      },
      {
        name: 'ต้มยำกุ้ง',
        description: 'ต้มยำกุ้งต้นตำรับ รสเปรี้ยวจัดจ้าน',
        price: 120.00,
        image_url: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400',
        preparation_time: 25
      },
      {
        name: 'แกงเขียวหวานไก่',
        description: 'แกงเขียวหวานไก่ รสชาติเข้มข้น',
        price: 99.00,
        image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
        preparation_time: 20
      }
    ]
  },
  {
    category: 'ของหวาน',
    items: [
      {
        name: 'มะม่วงข้าวเหนียว',
        description: 'มะม่วงสุกหวาน เสิร์ฟกับข้าวเหนียวหอม',
        price: 65.00,
        image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
        preparation_time: 10
      },
      {
        name: 'ไอศกรีมกะทิ',
        description: 'ไอศกรีมกะทิแท้ รสชาติหอมหวาน',
        price: 45.00,
        image_url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400',
        preparation_time: 5
      },
      {
        name: 'ขนมครก',
        description: 'ขนมครกหอม หวาน มัน',
        price: 35.00,
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
        preparation_time: 15
      }
    ]
  },
  {
    category: 'เครื่องดื่ม',
    items: [
      {
        name: 'น้ำมะนาวโซดา',
        description: 'น้ำมะนาวโซดาสดชื่น',
        price: 35.00,
        image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
        preparation_time: 5
      },
      {
        name: 'ชาไทย',
        description: 'ชาไทยเข้มข้น หอมหวาน',
        price: 25.00,
        image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400',
        preparation_time: 8
      },
      {
        name: 'กาแฟเย็น',
        description: 'กาแฟเย็นหอมกรุ่น',
        price: 45.00,
        image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
        preparation_time: 10
      },
      {
        name: 'น้ำส้มคั้นสด',
        description: 'น้ำส้มคั้นสด 100%',
        price: 40.00,
        image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
        preparation_time: 5
      }
    ]
  },
  {
    category: 'อาหารว่าง',
    items: [
      {
        name: 'ปอเปี๊ยะทอด',
        description: 'ปอเปี๊ยะทอดกรอบ เสิร์ฟกับซอส',
        price: 55.00,
        image_url: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400',
        preparation_time: 12
      },
      {
        name: 'กุ้งเท้มปุระ',
        description: 'กุ้งเท้มปุระกรอบนอกนุ่มใน',
        price: 85.00,
        image_url: 'https://images.unsplash.com/photo-1561058413-09e917cd5c2b?w=400',
        preparation_time: 15
      },
      {
        name: 'หมูปิ้ง',
        description: 'หมูปิ้งหอมๆ ย่างสุกกำลังดี',
        price: 75.00,
        image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf0a4c15?w=400',
        preparation_time: 18
      }
    ]
  }
];

async function setupDatabase() {
  try {
    console.log('🚀 เริ่มต้น Setup Database...');

    // 1. เพิ่มหมวดหมู่
    console.log('📂 เพิ่มหมวดหมู่...');
    for (const category of categories) {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) {
        console.log(`❌ Error adding category ${category.name}:`, error.message);
      } else {
        console.log(`✅ เพิ่มหมวดหมู่ ${category.name} สำเร็จ`);
      }
    }

    // 2. เพิ่มเมนูอาหาร
    console.log('\n🍽️ เพิ่มเมนูอาหาร...');
    for (const categoryData of menuItemsData) {
      // หาหมวดหมู่
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryData.category)
        .single();

      if (category) {
        for (const item of categoryData.items) {
          const { data, error } = await supabase
            .from('menu_items')
            .insert([{
              category_id: category.id,
              ...item,
              is_available: true
            }])
            .select()
            .single();

          if (error) {
            console.log(`❌ Error adding ${item.name}:`, error.message);
          } else {
            console.log(`✅ เพิ่ม ${item.name} สำเร็จ`);
          }
        }
      }
    }

    // 3. เพิ่มลูกค้าตัวอย่าง
    console.log('\n👥 เพิ่มลูกค้าตัวอย่าง...');
    const customers = [
      {
        name: 'สมชาย ใจดี',
        phone: '081-234-5678',
        address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110'
      },
      {
        name: 'สมหญิง รักดี',
        phone: '082-345-6789',
        address: '456 ถนนพหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900'
      }
    ];

    for (const customer of customers) {
      const { error } = await supabase
        .from('customers')
        .insert([customer]);

      if (error) {
        console.log(`❌ Error adding customer:`, error.message);
      } else {
        console.log(`✅ เพิ่มลูกค้า ${customer.name} สำเร็จ`);
      }
    }

    console.log('\n🎉 Setup Database เสร็จสิ้น!');
    
    // แสดงสถิติ
    const { data: catCount } = await supabase.from('categories').select('*');
    const { data: menuCount } = await supabase.from('menu_items').select('*');
    const { data: custCount } = await supabase.from('customers').select('*');

    console.log('\n📊 สรุปข้อมูล:');
    console.log(`   หมวดหมู่: ${catCount?.length || 0} รายการ`);
    console.log(`   เมนูอาหาร: ${menuCount?.length || 0} รายการ`);
    console.log(`   ลูกค้า: ${custCount?.length || 0} คน`);

  } catch (error) {
    console.error('💥 Error setting up database:', error);
  }
}

// รันถ้าไฟล์นี้ถูกเรียกโดยตรง
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };

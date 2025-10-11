const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ข้อมูลเมนูอาหารเพิ่มเติม
const additionalMenuItems = [
  {
    category: 'อาหารจานหลัก',
    items: [
      {
        name: 'ข้าวผัดปู',
        description: 'ข้าวผัดปูหอมหวาน เนื้อปูแน่น',
        price: 150,
        image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        preparation_time: 20
      },
      {
        name: 'แกงส่มผักรวม',
        description: 'แกงส่มผักรวมใส่กุ้ง รสเปรี้ยวจัดจ้าน',
        price: 89,
        image_url: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400',
        preparation_time: 25
      },
      {
        name: 'ข้าวคลุกกะปิ',
        description: 'ข้าวคลุกกะปิรสเข้มข้น เสิร์ฟพร้อมผักสด',
        price: 85,
        image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
        preparation_time: 15
      }
    ]
  },
  {
    category: 'ของหวาน',
    items: [
      {
        name: 'บัวลอยน้ำขิง',
        description: 'บัวลอยน้ำขิงร้อนๆ หอมกลิ่นขิง',
        price: 30,
        image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
        preparation_time: 12
      },
      {
        name: 'เฉาก๊วยดำ',
        description: 'เฉาก๊วยดำเย็นๆ หวานเจือจาง',
        price: 25,
        image_url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400',
        preparation_time: 8
      }
    ]
  },
  {
    category: 'เครื่องดื่ม',
    items: [
      {
        name: 'น้ำขิงแปรรูป',
        description: 'น้ำขิงสดชื่น ช่วยขับลม',
        price: 25,
        image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
        preparation_time: 5
      },
      {
        name: 'น้ำตาลโปร่ง',
        description: 'น้ำตาลโปร่งหวานซ่า',
        price: 20,
        image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        preparation_time: 3
      }
    ]
  }
];

// Mock orders สำหรับทดสอบ
const mockOrders = [
  {
    customer_name: 'ลูกค้าทดสอบ 1',
    customer_phone: '081-111-1111',
    customer_address: '123 ถนนทดสอบ แขวงทดสอบ เขทดสอบ กรุงเทพฯ 10110',
    status: 'pending',
    notes: 'เผ็ดน้อย',
    items: [
      { menu_item_name: 'ข้าวผัดกุ้ง', quantity: 1, unit_price: 89 },
      { menu_item_name: 'น้ำมะนาวโซดา', quantity: 2, unit_price: 35 }
    ]
  },
  {
    customer_name: 'ลูกค้าทดสอบ 2',
    customer_phone: '082-222-2222',
    customer_address: '456 ถนนทดสอบ2 แขวงทดสอบ2 เขตทดสอบ2 กรุงเทพฯ 10220',
    status: 'confirmed',
    notes: 'ไม่ใส่ผัก',
    items: [
      { menu_item_name: 'ผัดไทยกุ้งสด', quantity: 1, unit_price: 95 },
      { menu_item_name: 'ชาไทย', quantity: 1, unit_price: 25 }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 เริ่มต้น Seed Database...');

    // เพิ่มข้อมูลเมนูอาหาร
    for (const categoryData of additionalMenuItems) {
      console.log(`📝 เพิ่มเมนูในหมวดหมู่: ${categoryData.category}`);
      
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
            }]);

          if (error) {
            console.log(`❌ Error adding ${item.name}:`, error.message);
          } else {
            console.log(`✅ เพิ่ม ${item.name} สำเร็จ`);
          }
        }
      }
    }

    // เพิ่มออเดอร์ทดสอบ
    console.log('📦 เพิ่มออเดอร์ทดสอบ...');
    for (const orderData of mockOrders) {
      const total_amount = orderData.items.reduce((sum, item) => 
        sum + (item.unit_price * item.quantity), 0
      );

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          customer_address: orderData.customer_address,
          status: orderData.status,
          total_amount,
          notes: orderData.notes
        }])
        .select()
        .single();

      if (orderError) {
        console.log('❌ Error creating order:', orderError.message);
        continue;
      }

      // เพิ่มรายการในออเดอร์
      for (const item of orderData.items) {
        const { error: itemError } = await supabase
          .from('order_items')
          .insert([{
            order_id: order.id,
            menu_item_name: item.menu_item_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.unit_price * item.quantity
          }]);

        if (itemError) {
          console.log('❌ Error adding order item:', itemError.message);
        }
      }

      console.log(`✅ สร้างออเดอร์ ${orderData.customer_name} สำเร็จ`);
    }

    console.log('🎉 Seed Database เสร็จสิ้น!');
    
  } catch (error) {
    console.error('💥 Error seeding database:', error);
  }
}

// รันถ้าไฟล์นี้ถูกเรียกโดยตรง
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };

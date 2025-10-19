const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// สร้างข้อมูลออเดอร์ทดสอบที่หลากหลาย
const testOrders = [
  {
    customer_name: 'สมชาย ใจดี',
    customer_phone: '081-234-5678',
    customer_address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    status: 'pending',
    notes: 'เผ็ดน้อย ไม่ใส่ผัก',
    items: [
      { menu_item_name: 'ข้าวผัดกุ้ง', quantity: 2, unit_price: 89 },
      { menu_item_name: 'ต้มยำกุ้ง', quantity: 1, unit_price: 120 },
      { menu_item_name: 'น้ำมะนาวโซดา', quantity: 3, unit_price: 35 }
    ]
  },
  {
    customer_name: 'สมหญิง รักสะอาด',
    customer_phone: '082-345-6789',
    customer_address: '456 ถนนพระราม 4 แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
    status: 'confirmed',
    notes: 'ไม่เผ็ด ไม่ใส่หอม',
    items: [
      { menu_item_name: 'ผัดไทยกุ้งสด', quantity: 1, unit_price: 95 },
      { menu_item_name: 'ส้มตำไทย', quantity: 1, unit_price: 60 },
      { menu_item_name: 'ชาไทย', quantity: 2, unit_price: 25 }
    ]
  },
  {
    customer_name: 'นายทดสอบ ระบบดี',
    customer_phone: '083-456-7890',
    customer_address: '789 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
    status: 'preparing',
    notes: 'เผ็ดมาก ใส่ผักเยอะๆ',
    items: [
      { menu_item_name: 'แกงเขียวหวานไก่', quantity: 1, unit_price: 85 },
      { menu_item_name: 'ข้าวสวย', quantity: 2, unit_price: 15 },
      { menu_item_name: 'น้ำเปล่า', quantity: 1, unit_price: 10 }
    ]
  },
  {
    customer_name: 'คุณหญิง อร่อยมาก',
    customer_phone: '084-567-8901',
    customer_address: '321 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400',
    status: 'ready',
    notes: 'ปกติ',
    items: [
      { menu_item_name: 'ข้าวมันไก่', quantity: 1, unit_price: 50 },
      { menu_item_name: 'ไก่ย่าง', quantity: 1, unit_price: 80 },
      { menu_item_name: 'น้ำส้ม', quantity: 1, unit_price: 30 }
    ]
  },
  {
    customer_name: 'ลูกค้า VIP',
    customer_phone: '085-678-9012',
    customer_address: '654 ถนนเพชรบุรี แขวงมักกะสัน เขตราชเทวี กรุงเทพฯ 10400',
    status: 'delivering',
    notes: 'ส่งเร็วๆ หน่อย',
    items: [
      { menu_item_name: 'สเต็กเนื้อ', quantity: 1, unit_price: 250 },
      { menu_item_name: 'สลัดผัก', quantity: 1, unit_price: 45 },
      { menu_item_name: 'น้ำผลไม้', quantity: 2, unit_price: 40 }
    ]
  },
  {
    customer_name: 'คุณแม่บ้าน',
    customer_phone: '086-789-0123',
    customer_address: '987 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900',
    status: 'delivered',
    notes: 'ขอบคุณค่ะ',
    items: [
      { menu_item_name: 'ข้าวผัดปู', quantity: 1, unit_price: 150 },
      { menu_item_name: 'แกงส่มผักรวม', quantity: 1, unit_price: 89 },
      { menu_item_name: 'น้ำขิงแปรรูป', quantity: 1, unit_price: 25 }
    ]
  },
  {
    customer_name: 'นักเรียน หิวข้าว',
    customer_phone: '087-890-1234',
    customer_address: '147 ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
    status: 'cancelled',
    notes: 'ยกเลิกเพราะไม่มีเงิน',
    items: [
      { menu_item_name: 'ข้าวคลุกกะปิ', quantity: 1, unit_price: 85 },
      { menu_item_name: 'น้ำเปล่า', quantity: 1, unit_price: 10 }
    ]
  },
  {
    customer_name: 'คนรักของหวาน',
    customer_phone: '088-901-2345',
    customer_address: '258 ถนนวิภาวดี แขวงสามเสนนอก เขตห้วยขวาง กรุงเทพฯ 10310',
    status: 'delivered',
    notes: 'หวานน้อยหน่อย',
    items: [
      { menu_item_name: 'บัวลอยน้ำขิง', quantity: 2, unit_price: 30 },
      { menu_item_name: 'เฉาก๊วยดำ', quantity: 1, unit_price: 25 },
      { menu_item_name: 'น้ำตาลโปร่ง', quantity: 1, unit_price: 20 }
    ]
  },
  {
    customer_name: 'ออฟฟิศเวิร์กเกอร์',
    customer_phone: '089-012-3456',
    customer_address: '369 ถนนสาทร แขวงยานนาวา เขตสาทร กรุงเทพฯ 10120',
    status: 'pending',
    notes: 'ส่งที่ออฟฟิศ ชั้น 15',
    items: [
      { menu_item_name: 'ข้าวกล่อง', quantity: 3, unit_price: 65 },
      { menu_item_name: 'กาแฟเย็น', quantity: 3, unit_price: 35 }
    ]
  },
  {
    customer_name: 'ครอบครัวใหญ่',
    customer_phone: '090-123-4567',
    customer_address: '741 ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240',
    status: 'confirmed',
    notes: 'สั่งสำหรับ 6 คน',
    items: [
      { menu_item_name: 'ข้าวผัดกุ้ง', quantity: 3, unit_price: 89 },
      { menu_item_name: 'ผัดไทยกุ้งสด', quantity: 2, unit_price: 95 },
      { menu_item_name: 'ต้มยำกุ้ง', quantity: 2, unit_price: 120 },
      { menu_item_name: 'แกงเขียวหวานไก่', quantity: 1, unit_price: 85 },
      { menu_item_name: 'น้ำมะนาวโซดา', quantity: 6, unit_price: 35 }
    ]
  }
];

async function createTestOrders() {
  try {
    console.log('🚀 เริ่มสร้างข้อมูลออเดอร์ทดสอบ...');

    for (let i = 0; i < testOrders.length; i++) {
      const orderData = testOrders[i];
      
      // คำนวณยอดรวม
      const total_amount = orderData.items.reduce((sum, item) => 
        sum + (item.unit_price * item.quantity), 0
      );

      // สร้างออเดอร์
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          delivery_address: orderData.customer_address,
          status: orderData.status,
          total_amount,
          notes: orderData.notes,
          created_at: new Date(Date.now() - (i * 3600000)).toISOString() // สร้างเวลาที่แตกต่างกัน
        }])
        .select()
        .single();

      if (orderError) {
        console.log(`❌ Error creating order for ${orderData.customer_name}:`, orderError.message);
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
          console.log(`❌ Error adding order item for ${item.menu_item_name}:`, itemError.message);
        }
      }

      console.log(`✅ สร้างออเดอร์ ${orderData.customer_name} สำเร็จ (${orderData.status}) - ยอดรวม ฿${total_amount}`);
    }

    console.log('🎉 สร้างข้อมูลออเดอร์ทดสอบเสร็จสิ้น!');
    console.log(`📊 สร้างออเดอร์ทั้งหมด ${testOrders.length} รายการ`);
    
    // แสดงสถิติ
    const statusCount = testOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📈 สถิติสถานะออเดอร์:');
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} รายการ`);
    });
    
  } catch (error) {
    console.error('💥 Error creating test orders:', error);
  }
}

// รันถ้าไฟล์นี้ถูกเรียกโดยตรง
if (require.main === module) {
  createTestOrders();
}

module.exports = { createTestOrders };
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// รายชื่อลูกค้าและข้อมูล Mock
const mockCustomers = [
  { name: 'สมชาย ใจดี', phone: '081-111-1111', area: 'สีลม' },
  { name: 'สมหญิง รักงาน', phone: '082-222-2222', area: 'สาทร' },
  { name: 'วิทยา ขยัน', phone: '083-333-3333', area: 'อโศก' },
  { name: 'ประชา ใจงาม', phone: '084-444-4444', area: 'พญาไท' },
  { name: 'สุดา รักดี', phone: '085-555-5555', area: 'รัชดา' },
  { name: 'มานพ ช่วยงาน', phone: '086-666-6666', area: 'ลาดพร้าว' },
  { name: 'สมศรี มีใจ', phone: '087-777-7777', area: 'บางนา' },
  { name: 'บุญชู ใจดี', phone: '088-888-8888', area: 'สุขุมวิท' }
];

const addresses = [
  '123 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
  '456 ถนนสาทรใต้ แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพฯ 10120',
  '789 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
  '321 ถนนพญาไท แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400',
  '654 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
  '987 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900',
  '147 ถนนบางนา-ตราด แขวงบางนา เขตบangนา กรุงเทพฯ 10260',
  '258 ถนนเพชรบุรี แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400'
];

const orderNotes = [
  'เผ็ดน้อย',
  'ไม่ใส่ผัก',
  'เพิ่มข้าว',
  'ไม่ใส่น้ำแข็ง',
  'เผ็ดมาก',
  'หวานน้อย',
  '',
  'ใส่ไข่เพิ่ม'
];

const orderStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

// สุ่มเลือกจำนวนรายการในออเดอร์ (1-4 รายการ)
function getRandomItemCount() {
  return Math.floor(Math.random() * 4) + 1;
}

// สุ่มจำนวนชิ้น (1-3 ชิ้น)
function getRandomQuantity() {
  return Math.floor(Math.random() * 3) + 1;
}

// สุ่มเวลาในอดีต (1-7 วัน)
function getRandomPastDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7) + 1;
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  return new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000));
}

async function generateMockOrders(count = 20) {
  try {
    console.log(`🎲 สร้างออเดอร์ Mock จำนวน ${count} รายการ...`);

    // ดึงข้อมูลเมนูทั้งหมด
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, name, price')
      .eq('is_available', true);

    if (menuError || !menuItems?.length) {
      console.log('❌ ไม่สามารถดึงข้อมูลเมนูได้');
      return;
    }

    console.log(`📋 พบเมนู ${menuItems.length} รายการ`);

    for (let i = 0; i < count; i++) {
      // สุ่มลูกค้า
      const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
      const address = addresses[Math.floor(Math.random() * addresses.length)];
      const note = orderNotes[Math.floor(Math.random() * orderNotes.length)];
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const createdAt = getRandomPastDate();

      // สุ่มรายการอาหาร
      const itemCount = getRandomItemCount();
      const selectedItems = [];
      const usedMenuIds = new Set();

      for (let j = 0; j < itemCount; j++) {
        let menuItem;
        do {
          menuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        } while (usedMenuIds.has(menuItem.id));
        
        usedMenuIds.add(menuItem.id);
        const quantity = getRandomQuantity();
        
        selectedItems.push({
          menu_item_id: menuItem.id,
          menu_item_name: menuItem.name,
          quantity,
          unit_price: menuItem.price,
          total_price: menuItem.price * quantity
        });
      }

      // คำนวณยอดรวม
      const total_amount = selectedItems.reduce((sum, item) => sum + item.total_price, 0);

      // สร้างออเดอร์
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_address: address,
          status: status,
          total_amount: total_amount,
          notes: note,
          created_at: createdAt.toISOString(),
          updated_at: createdAt.toISOString()
        }])
        .select()
        .single();

      if (orderError) {
        console.log(`❌ Error creating order ${i + 1}:`, orderError.message);
        continue;
      }

      // เพิ่มรายการในออเดอร์
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(selectedItems.map(item => ({
          ...item,
          order_id: order.id
        })));

      if (itemsError) {
        console.log(`❌ Error adding items to order ${i + 1}:`, itemsError.message);
      } else {
        console.log(`✅ สร้างออเดอร์ ${i + 1}/${count}: ${customer.name} - ฿${total_amount}`);
      }
    }

    console.log('🎉 สร้างออเดอร์ Mock เสร็จสิ้น!');
    
    // แสดงสถิติ
    const { data: stats } = await supabase
      .from('orders')
      .select('status')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (stats) {
      const statusCount = stats.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      console.log('\n📊 สถิติออเดอร์ในรอบ 7 วัน:');
      Object.entries(statusCount).forEach(([status, count]) => {
        console.log(`   ${status}: ${count} รายการ`);
      });
    }

  } catch (error) {
    console.error('💥 Error generating mock orders:', error);
  }
}

// รันถ้าไฟล์นี้ถูกเรียกโดยตรง
if (require.main === module) {
  const count = process.argv[2] ? parseInt(process.argv[2]) : 20;
  generateMockOrders(count);
}

module.exports = { generateMockOrders };

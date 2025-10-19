// Create Test Users Script
// This script creates test users and links them to existing orders

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://bsyernhbtlqwiilkiuig.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

const testUsers = [
  {
    email: 'test1@example.com',
    password: 'password123',
    name: 'ทดสอบ ผู้ใช้หนึ่ง',
    phone: '0812345678',
    role: 'customer'
  },
  {
    email: 'test2@example.com',
    password: 'password123',
    name: 'ทดสอบ ผู้ใช้สอง',
    phone: '0823456789',
    role: 'customer'
  },
  {
    email: 'test3@example.com',
    password: 'password123',
    name: 'ทดสอบ ผู้ใช้สาม',
    phone: '0834567890',
    role: 'customer'
  },
  {
    email: 'admin@test.com',
    password: 'admin123',
    name: 'ผู้ดูแลระบบ',
    phone: '0801234567',
    role: 'admin'
  }
];

async function createTestUsers() {
  console.log('🚀 Starting test user creation...');

  try {
    // Create users
    for (const userData of testUsers) {
      console.log(`Creating user: ${userData.email}`);
      
      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(userData.password, saltRounds);
      
      // Insert user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password_hash,
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          is_active: true,
          email_verified: true
        })
        .select()
        .single();

      if (userError) {
        if (userError.code === '23505') { // Unique constraint violation
          console.log(`User ${userData.email} already exists, skipping...`);
          continue;
        }
        throw userError;
      }

      console.log(`✅ Created user: ${user.email} (ID: ${user.id})`);

      // Create user profile if it's a customer
      if (userData.role === 'customer') {
        const { error: profileError } = await supabase
          .from('customers')
          .insert({
            id: user.id,
            first_name: userData.name.split(' ')[0],
            last_name: userData.name.split(' ').slice(1).join(' '),
            email: userData.email,
            phone: userData.phone,
            is_verified: true,
            loyalty_points: Math.floor(Math.random() * 1000),
            loyalty_tier: ['bronze', 'silver', 'gold'][Math.floor(Math.random() * 3)],
            total_orders: Math.floor(Math.random() * 20),
            total_spent: Math.floor(Math.random() * 5000)
          });

        if (profileError && profileError.code !== '23505') {
          console.warn(`Warning: Could not create profile for ${userData.email}:`, profileError.message);
        }

        // Create default address
        const { error: addressError } = await supabase
          .from('user_addresses')
          .insert({
            customer_id: user.id,
            label: 'บ้าน',
            address_line_1: `${Math.floor(Math.random() * 999) + 1}/${Math.floor(Math.random() * 99) + 1} ถนนทดสอบ`,
            address_line_2: 'แขวงทดสอบ',
            city: 'กรุงเทพมหานคร',
            state: 'กรุงเทพมหานคร',
            postal_code: '10110',
            address_type: 'home',
            is_default: true,
            latitude: 13.7563 + (Math.random() - 0.5) * 0.1,
            longitude: 100.5018 + (Math.random() - 0.5) * 0.1,
            delivery_instructions: 'โทรหาก่อนส่ง'
          });

        if (addressError && addressError.code !== '23505') {
          console.warn(`Warning: Could not create address for ${userData.email}:`, addressError.message);
        }
      }
    }

    // Link some orders to users
    console.log('\n🔗 Linking orders to users...');
    
    // Get created users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, phone')
      .eq('role', 'customer');

    if (usersError) {
      throw usersError;
    }

    // Get existing orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, customer_phone')
      .is('user_id', null)
      .limit(10);

    if (ordersError) {
      throw ordersError;
    }

    // Link orders to users based on phone numbers or randomly
    for (const order of orders) {
      let targetUser = users.find(user => user.phone === order.customer_phone);
      
      if (!targetUser) {
        // Randomly assign to a user
        targetUser = users[Math.floor(Math.random() * users.length)];
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({ user_id: targetUser.id })
        .eq('id', order.id);

      if (updateError) {
        console.warn(`Warning: Could not link order ${order.id} to user ${targetUser.email}:`, updateError.message);
      } else {
        console.log(`✅ Linked order ${order.id} to user ${targetUser.email}`);
      }
    }

    console.log('\n🎉 Test user creation completed successfully!');
    console.log('\nTest User Credentials:');
    testUsers.forEach(user => {
      console.log(`📧 ${user.email} | 🔑 ${user.password} | 👤 ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
}

// Run the script
createTestUsers();
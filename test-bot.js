#!/usr/bin/env node

/**
 * 🤖 Food Delivery Test Bot
 * บอททดสอบระบบสั่งอาหารแบบอัตโนมัติ - ทำงานเหมือนมนุษย์จริง
 * 
 * ฟีเจอร์:
 * - ทดสอบการนำทางทั้งระบบ
 * - ทดสอบการเลือกร้านอาหารและเมนู
 * - ทดสอบการเพิ่มสินค้าลงตะกร้า
 * - ทดสอบกระบวนการสั่งซื้อ
 * - ทดสอบการจัดการข้อผิดพลาด
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

const API_BASE_URL = 'http://localhost:3001';

// Test configuration
const TEST_CONFIG = {
  baseUrl: API_BASE_URL,
  endpoints: {
    categories: '/api/categories',
    menuItems: '/api/menu-items',
    orders: '/api/orders'
  },
  testData: {
    customer: {
      name: 'Test User',
      phone: '0812345678',
      address: '123 Test Street, Bangkok'
    }
  }
};

class FoodDeliveryTestBot {
    constructor() {
        this.baseURL = 'http://localhost:3001';
        this.frontendURL = 'http://localhost:3000';
        this.testResults = [];
        this.results = [];
        this.cart = [];
        this.currentUser = null;
        this.selectedCategory = null;
        this.availableMenus = [];
        this.createdOrder = null;
        this.startTime = 0;
        this.endTime = 0;
        
        // สถิติการทดสอบ
        this.stats = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            totalTime: 0
        };
    }

    // Run all tests
    async runAllTests() {
        console.log('🤖 Starting Food Delivery System Test Bot...\n');
        
        this.startTime = Date.now();
        
        const tests = [
            () => this.testAPIConnection(),
            () => this.testCategoryListing(),
            () => this.testMenuItems(),
            () => this.testProductSelection(),
            () => this.testCartOperations(),
            () => this.testOrderCreation(),
            () => this.testErrorHandling()
        ];

        for (let i = 0; i < tests.length; i++) {
            await tests[i]();
            await this.delay(1000); // Wait 1 second between tests
        }

        this.endTime = Date.now();
        this.generateReport();
    }

    // Delay helper
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Generate test report
    generateReport() {
        const passed = this.results.filter(r => r.passed).length;
        const total = this.results.length;
        const successRate = Math.round((passed / total) * 100);

        console.log('\n' + '='.repeat(60));
        console.log('🤖 TEST BOT REPORT');
        console.log('='.repeat(60));
        console.log(`📊 Tests: ${passed}/${total} passed (${successRate}%)`);
        console.log(`⏱️  Duration: ${this.endTime - this.startTime}ms`);
        
        if (passed === total) {
            console.log('🎉 All tests passed! System is working correctly.');
        } else {
            console.log('❌ Some tests failed. Check the details above.');
        }
        
        console.log('='.repeat(60));
    }

    // 🔗 ทดสอบการเชื่อมต่อ API
    async testAPIConnection() {
        await this.runTest('API Connection', async () => {
            const response = await axios.get(`${this.baseURL}/api/health`);
            if (response.status !== 200) {
                throw new Error('API ไม่ตอบสนอง');
            }
            return 'API ทำงานปกติ';
        });
    }

    // 🏪 ทดสอบการดึงข้อมูลหมวดหมู่
    async testCategoryListing() {
        await this.runTest('Category Listing', async () => {
            const response = await axios.get(`${this.baseURL}/api/categories`);
            
            if (!Array.isArray(response.data) || response.data.length === 0) {
                throw new Error('ไม่พบข้อมูลหมวดหมู่');
            }
            
            // เลือกหมวดหมู่แรกสำหรับการทดสอบ
            this.selectedCategory = response.data[0];
            
            return `พบหมวดหมู่ ${response.data.length} หมวด`;
        });
    }

    // 🍽️ ทดสอบการดึงข้อมูลเมนู
    async testMenuItems() {
        await this.runTest('Menu Items Loading', async () => {
            const response = await axios.get(`${this.baseURL}/api/menu-items`);
            
            if (!Array.isArray(response.data) || response.data.length === 0) {
                throw new Error('ไม่พบข้อมูลเมนู');
            }
            
            // กรองเมนูของหมวดหมู่ที่เลือก
            this.availableMenus = response.data.filter(item => 
                item.category_id === this.selectedCategory.id
            );
            
            if (this.availableMenus.length === 0) {
                throw new Error('ไม่พบเมนูของหมวดหมู่ที่เลือก');
            }
            
            return `พบเมนู ${this.availableMenus.length} รายการ`;
        });
    }

    // 🛒 ทดสอบการเลือกสินค้า (จำลองพฤติกรรมผู้ใช้)
    async testProductSelection() {
        await this.runTest('Product Selection Simulation', async () => {
            // จำลองการเลือกสินค้า 2-3 รายการ
            const selectedItems = this.availableMenus.slice(0, 3);
            
            for (const item of selectedItems) {
                // จำลองการเพิ่มสินค้าลงตะกร้า
                const cartItem = {
                    menu_item_id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: Math.floor(Math.random() * 3) + 1 // 1-3 ชิ้น
                };
                
                this.cart.push(cartItem);
                
                // หน่วงเวลาเหมือนมนุษย์จริง
                await this.humanDelay();
            }
            
            return `เลือกสินค้า ${selectedItems.length} รายการ`;
        });
    }

    // 🛍️ ทดสอบการจัดการตะกร้าสินค้า
    async testCartOperations() {
        await this.runTest('Cart Operations', async () => {
            // คำนวณยอดรวม
            const totalAmount = this.cart.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );
            
            if (totalAmount <= 0) {
                throw new Error('ยอดรวมในตะกร้าไม่ถูกต้อง');
            }
            
            // จำลองการแก้ไขจำนวนสินค้า
            if (this.cart.length > 0) {
                this.cart[0].quantity += 1;
            }
            
            return `ตะกร้ามี ${this.cart.length} รายการ ยอดรวม ${totalAmount} บาท`;
        });
    }

    // 📦 ทดสอบการสั่งซื้อ
    async testOrderCreation() {
        await this.runTest('Order Creation', async () => {
            // ตรวจสอบว่าตะกร้าไม่ว่าง
            if (this.cart.length === 0) {
                throw new Error('ตะกร้าสินค้าว่าง');
            }

            // สร้างข้อมูลลูกค้าจำลอง
            const customerData = {
                customer_name: TEST_CONFIG.testData.customer.name,
                customer_phone: TEST_CONFIG.testData.customer.phone,
                customer_address: TEST_CONFIG.testData.customer.address,
                delivery_address: TEST_CONFIG.testData.customer.address,
                notes: 'Test order from automation bot'
            };
            
            // สร้าง order payload
            const orderData = {
                ...customerData,
                items: this.cart.map(item => ({
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };
            
            // ส่งคำสั่งซื้อ
            const response = await axios.post(`${TEST_CONFIG.baseUrl}${TEST_CONFIG.endpoints.orders}`, orderData);
            
            if (!response.data || !response.data.id) {
                throw new Error('การสร้างออเดอร์ล้มเหลว');
            }
            
            this.createdOrder = response.data;
            
            return `สร้างออเดอร์สำเร็จ ID: ${response.data.id}`;
        });
    }

    // ⚠️ ทดสอบการจัดการข้อผิดพลาด
    async testErrorHandling() {
        // ทดสอบ Invalid Menu Item ID
        await this.runTest('Invalid Menu Item Error', async () => {
            try {
                await axios.post(`${this.baseURL}/api/orders`, {
                    customer_name: 'Test',
                    customer_phone: '0812345678',
                    customer_address: 'Test Address',
                    category_id: this.selectedCategory.id,
                    items: [{
                        menu_item_id: 'invalid-uuid',
                        quantity: 1,
                        price: 100
                    }],
                    total_amount: 100
                });
                
                throw new Error('ควรจะเกิด error แต่ไม่เกิด');
            } catch (error) {
                if (error.response && error.response.status === 500) {
                    return 'จัดการ Invalid UUID ได้ถูกต้อง';
                }
                throw error;
            }
        });

        // ทดสอบ Empty Cart
        await this.runTest('Empty Cart Error', async () => {
            try {
                await axios.post(`${this.baseURL}/api/orders`, {
                    customer_name: 'Test',
                    customer_phone: '0812345678',
                    customer_address: 'Test Address',
                    category_id: this.selectedCategory.id,
                    items: [],
                    total_amount: 0
                });
                
                throw new Error('ควรจะเกิด error แต่ไม่เกิด');
            } catch (error) {
                if (error.response && (error.response.status === 400 || error.response.status === 500)) {
                    return 'จัดการ Empty Cart ได้ถูกต้อง';
                }
                throw error;
            }
        });
    }

    // 🧪 รันการทดสอบแต่ละรายการ
    async runTest(testName, testFunction) {
        const startTime = performance.now();
        this.stats.totalTests++;
        
        try {
            console.log(`🧪 กำลังทดสอบ: ${testName}...`);
            
            const result = await testFunction();
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            this.testResults.push({
                name: testName,
                status: 'PASS',
                result: result,
                duration: Math.round(duration)
            });
            
            this.stats.passedTests++;
            console.log(`✅ ${testName}: ${result} (${Math.round(duration)}ms)\n`);
            
        } catch (error) {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            this.testResults.push({
                name: testName,
                status: 'FAIL',
                error: error.message,
                duration: Math.round(duration)
            });
            
            this.stats.failedTests++;
            console.log(`❌ ${testName}: ${error.message} (${Math.round(duration)}ms)\n`);
        }
        
        // หน่วงเวลาระหว่างการทดสอบ
        await this.humanDelay();
    }

    // ⏱️ จำลองการหน่วงเวลาของมนุษย์
    async humanDelay() {
        const delay = Math.random() * 1000 + 500; // 0.5-1.5 วินาที
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // 📊 แสดงผลสรุปการทดสอบ
    displayResults() {
        console.log('\n' + '='.repeat(60));
        console.log('🤖 สรุปผลการทดสอบระบบสั่งอาหารอัตโนมัติ');
        console.log('='.repeat(60));
        
        console.log(`📊 สถิติการทดสอบ:`);
        console.log(`   • ทดสอบทั้งหมด: ${this.stats.totalTests} รายการ`);
        console.log(`   • ผ่าน: ${this.stats.passedTests} รายการ`);
        console.log(`   • ล้มเหลว: ${this.stats.failedTests} รายการ`);
        console.log(`   • เวลารวม: ${Math.round(this.stats.totalTime)}ms`);
        console.log(`   • อัตราความสำเร็จ: ${Math.round((this.stats.passedTests / this.stats.totalTests) * 100)}%\n`);
        
        console.log('📋 รายละเอียดการทดสอบ:');
        this.testResults.forEach((test, index) => {
            const status = test.status === 'PASS' ? '✅' : '❌';
            const result = test.status === 'PASS' ? test.result : test.error;
            console.log(`   ${index + 1}. ${status} ${test.name}`);
            console.log(`      ${result} (${test.duration}ms)`);
        });
        
        if (this.createdOrder) {
            console.log(`\n🎉 ออเดอร์ทดสอบที่สร้างสำเร็จ:`);
            console.log(`   • Order ID: ${this.createdOrder.id}`);
            console.log(`   • หมวดหมู่: ${this.selectedCategory.name}`);
            console.log(`   • จำนวนสินค้า: ${this.cart.length} รายการ`);
            console.log(`   • ยอดรวม: ${this.createdOrder.total_amount} บาท`);
        }
        
        console.log('\n' + '='.repeat(60));
        
        if (this.stats.failedTests === 0) {
            console.log('🎊 ระบบทำงานได้อย่างสมบูรณ์! พร้อมใช้งานจริง');
        } else {
            console.log('⚠️  พบปัญหาบางประการ กรุณาตรวจสอบและแก้ไข');
        }
        
        console.log('='.repeat(60));
    }

    // 📝 บันทึกข้อผิดพลาด
    logError(message, error) {
        console.error(`❌ ${message}:`, error.message);
    }
}

// 🚀 เริ่มต้นการทดสอบ
async function main() {
    const bot = new FoodDeliveryTestBot();
    await bot.runAllTests();
}

// รันบอทถ้าไฟล์นี้ถูกเรียกโดยตรง
if (require.main === module) {
    main().catch(console.error);
}

module.exports = FoodDeliveryTestBot;
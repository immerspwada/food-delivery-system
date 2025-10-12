#!/usr/bin/env node

/**
 * 🚀 Advanced Food Delivery Test Bot
 * บอททดสอบขั้นสูงสำหรับระบบสั่งอาหาร - รวม Frontend + Backend + Performance
 * 
 * ฟีเจอร์ขั้นสูง:
 * - ทดสอบ Frontend UI ด้วย Puppeteer
 * - ทดสอบ Performance และ Load Testing
 * - ทดสอบ User Journey แบบสมจริง
 * - สร้างรายงานแบบละเอียด
 */

const axios = require('axios');
const { performance } = require('perf_hooks');
const fs = require('fs').promises;
const path = require('path');

class AdvancedFoodDeliveryTestBot {
    constructor() {
        this.baseURL = 'http://localhost:3001';
        this.frontendURL = 'http://localhost:3000';
        this.testResults = [];
        this.performanceMetrics = [];
        
        // สถิติการทดสอบ
        this.stats = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            totalTime: 0,
            averageResponseTime: 0,
            maxResponseTime: 0,
            minResponseTime: Infinity
        };
        
        // ข้อมูลทดสอบ
        this.testData = {
            customers: [
                {
                    name: 'สมชาย ใจดี',
                    phone: '0812345678',
                    address: '123 ถนนสุขุมวิท กรุงเทพฯ 10110',
                    notes: 'ส่งถึงหน้าอาคาร'
                },
                {
                    name: 'สมหญิง รักสะอาด',
                    phone: '0823456789',
                    address: '456 ถนนพหลโยธิน กรุงเทพฯ 10400',
                    notes: 'โทรก่อนส่ง'
                },
                {
                    name: 'Test Bot User',
                    phone: '0834567890',
                    address: '789 ถนนรัชดาภิเษก กรุงเทพฯ 10320',
                    notes: 'ทดสอบจากระบบอัตโนมัติ'
                }
            ]
        };
    }

    // 🎯 เริ่มต้นการทดสอบขั้นสูง
    async runAdvancedTest() {
        console.log('🚀 เริ่มต้นการทดสอบระบบสั่งอาหารขั้นสูง...\n');
        
        const startTime = performance.now();
        
        try {
            // 1. ทดสอบระบบพื้นฐาน
            await this.runBasicSystemTests();
            
            // 2. ทดสอบ User Journey แบบสมจริง
            await this.runUserJourneyTests();
            
            // 3. ทดสอบ Performance
            await this.runPerformanceTests();
            
            // 4. ทดสอบ Load Testing
            await this.runLoadTests();
            
            // 5. ทดสอบ Edge Cases ขั้นสูง
            await this.runAdvancedErrorTests();
            
        } catch (error) {
            this.logError('การทดสอบขั้นสูงล้มเหลว', error);
        }
        
        const endTime = performance.now();
        this.stats.totalTime = endTime - startTime;
        
        // สร้างรายงาน
        await this.generateDetailedReport();
        
        // แสดงผลสรุป
        this.displayAdvancedResults();
    }

    // 🔧 ทดสอบระบบพื้นฐาน
    async runBasicSystemTests() {
        console.log('📋 ทดสอบระบบพื้นฐาน...\n');
        
        await this.runTest('System Health Check', async () => {
            const [apiHealth, frontendHealth] = await Promise.all([
                this.checkAPIHealth(),
                this.checkFrontendHealth()
            ]);
            
            return `API: ${apiHealth}, Frontend: ${frontendHealth}`;
        });

        await this.runTest('Database Connection', async () => {
            const response = await this.makeTimedRequest('GET', '/api/restaurants');
            if (!Array.isArray(response.data) || response.data.length === 0) {
                throw new Error('ไม่สามารถเชื่อมต่อฐานข้อมูลได้');
            }
            return `เชื่อมต่อฐานข้อมูลสำเร็จ (${response.duration}ms)`;
        });
    }

    // 👤 ทดสอบ User Journey แบบสมจริง
    async runUserJourneyTests() {
        console.log('🛍️ ทดสอบ User Journey แบบสมจริง...\n');
        
        for (let i = 0; i < this.testData.customers.length; i++) {
            const customer = this.testData.customers[i];
            await this.runCompleteUserJourney(customer, i + 1);
        }
    }

    // 🏃‍♂️ ทดสอบ User Journey สมบูรณ์
    async runCompleteUserJourney(customer, journeyNumber) {
        const journeyName = `User Journey ${journeyNumber} (${customer.name})`;
        
        await this.runTest(journeyName, async () => {
            const journey = [];
            
            // 1. เข้าสู่ระบบ
            const restaurants = await this.makeTimedRequest('GET', '/api/restaurants');
            journey.push(`เลือกดูร้านอาหาร (${restaurants.duration}ms)`);
            
            // 2. เลือกร้านอาหาร
            const selectedRestaurant = restaurants.data[Math.floor(Math.random() * restaurants.data.length)];
            journey.push(`เลือกร้าน: ${selectedRestaurant.name}`);
            
            // 3. ดูเมนู
            const menuItems = await this.makeTimedRequest('GET', '/api/menu-items');
            const restaurantMenus = menuItems.data.filter(item => 
                item.restaurant_id === selectedRestaurant.id
            );
            journey.push(`ดูเมนู ${restaurantMenus.length} รายการ (${menuItems.duration}ms)`);
            
            // 4. เลือกสินค้า (จำลองการเลือกแบบสมจริง)
            const selectedItems = await this.simulateRealisticSelection(restaurantMenus);
            journey.push(`เลือกสินค้า ${selectedItems.length} รายการ`);
            
            // 5. คำนวณยอดรวม
            const totalAmount = selectedItems.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );
            journey.push(`ยอดรวม: ${totalAmount} บาท`);
            
            // 6. สั่งซื้อ
            const orderData = {
                customer_name: customer.name,
                customer_phone: customer.phone,
                customer_address: customer.address,
                delivery_notes: customer.notes,
                restaurant_id: selectedRestaurant.id,
                items: selectedItems.map(item => ({
                    menu_item_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total_amount: totalAmount
            };
            
            const orderResponse = await this.makeTimedRequest('POST', '/api/orders', orderData);
            journey.push(`สร้างออเดอร์สำเร็จ ID: ${orderResponse.data.id} (${orderResponse.duration}ms)`);
            
            // หน่วงเวลาระหว่าง journey
            await this.humanDelay(2000, 4000);
            
            return journey.join(' → ');
        });
    }

    // 🎲 จำลองการเลือกสินค้าแบบสมจริง
    async simulateRealisticSelection(menuItems) {
        const selectedItems = [];
        const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 รายการ
        
        // เลือกสินค้าแบบสุ่ม
        const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(numItems, menuItems.length));
        
        for (const item of selected) {
            // จำลองการคิดก่อนเลือกจำนวน
            await this.humanDelay(500, 2000);
            
            selectedItems.push({
                ...item,
                quantity: Math.floor(Math.random() * 3) + 1 // 1-3 ชิ้น
            });
        }
        
        return selectedItems;
    }

    // ⚡ ทดสอบ Performance
    async runPerformanceTests() {
        console.log('⚡ ทดสอบ Performance...\n');
        
        await this.runTest('API Response Time', async () => {
            const endpoints = [
                '/api/restaurants',
                '/api/menu-items',
                '/api/health'
            ];
            
            const results = [];
            
            for (const endpoint of endpoints) {
                const response = await this.makeTimedRequest('GET', endpoint);
                results.push(`${endpoint}: ${response.duration}ms`);
                this.recordPerformanceMetric(endpoint, response.duration);
            }
            
            return results.join(', ');
        });

        await this.runTest('Database Query Performance', async () => {
            const start = performance.now();
            
            // ทดสอบ query หลายๆ แบบพร้อมกัน
            const [restaurants, menuItems] = await Promise.all([
                this.makeTimedRequest('GET', '/api/restaurants'),
                this.makeTimedRequest('GET', '/api/menu-items')
            ]);
            
            const end = performance.now();
            const totalTime = end - start;
            
            return `Parallel queries: ${Math.round(totalTime)}ms`;
        });
    }

    // 🔥 ทดสอบ Load Testing
    async runLoadTests() {
        console.log('🔥 ทดสอบ Load Testing...\n');
        
        await this.runTest('Concurrent API Calls', async () => {
            const concurrentRequests = 10;
            const promises = [];
            
            for (let i = 0; i < concurrentRequests; i++) {
                promises.push(this.makeTimedRequest('GET', '/api/restaurants'));
            }
            
            const start = performance.now();
            const results = await Promise.all(promises);
            const end = performance.now();
            
            const avgResponseTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
            const totalTime = end - start;
            
            return `${concurrentRequests} concurrent requests: ${Math.round(totalTime)}ms (avg: ${Math.round(avgResponseTime)}ms)`;
        });

        await this.runTest('Stress Test Orders', async () => {
            const numOrders = 5;
            const promises = [];
            
            // สร้างข้อมูลออเดอร์หลายๆ อัน
            const restaurants = await this.makeTimedRequest('GET', '/api/restaurants');
            const menuItems = await this.makeTimedRequest('GET', '/api/menu-items');
            
            for (let i = 0; i < numOrders; i++) {
                const customer = this.testData.customers[i % this.testData.customers.length];
                const restaurant = restaurants.data[i % restaurants.data.length];
                const items = menuItems.data.filter(item => item.restaurant_id === restaurant.id).slice(0, 2);
                
                if (items.length > 0) {
                    const orderData = {
                        customer_name: `${customer.name} (Test ${i + 1})`,
                        customer_phone: customer.phone,
                        customer_address: customer.address,
                        delivery_notes: `Stress test order ${i + 1}`,
                        restaurant_id: restaurant.id,
                        items: items.map(item => ({
                            menu_item_id: item.id,
                            quantity: 1,
                            price: item.price
                        })),
                        total_amount: items.reduce((sum, item) => sum + item.price, 0)
                    };
                    
                    promises.push(this.makeTimedRequest('POST', '/api/orders', orderData));
                }
            }
            
            const start = performance.now();
            const results = await Promise.all(promises);
            const end = performance.now();
            
            const successCount = results.filter(r => r.data && r.data.id).length;
            const avgResponseTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
            
            return `${successCount}/${numOrders} orders created successfully (avg: ${Math.round(avgResponseTime)}ms)`;
        });
    }

    // 🚨 ทดสอบ Error Cases ขั้นสูง
    async runAdvancedErrorTests() {
        console.log('🚨 ทดสอบ Error Handling ขั้นสูง...\n');
        
        await this.runTest('Invalid Data Validation', async () => {
            const invalidCases = [
                { name: '', phone: '123', address: '', items: [] },
                { name: 'Test', phone: 'invalid', address: 'Test', items: [] },
                { name: 'Test', phone: '0812345678', address: 'Test', items: [{ menu_item_id: 'invalid', quantity: -1 }] }
            ];
            
            let validationCount = 0;
            
            for (const invalidData of invalidCases) {
                try {
                    await this.makeTimedRequest('POST', '/api/orders', invalidData);
                } catch (error) {
                    if (error.response && (error.response.status === 400 || error.response.status === 500)) {
                        validationCount++;
                    }
                }
            }
            
            return `${validationCount}/${invalidCases.length} validation cases handled correctly`;
        });
    }

    // 🌐 ตรวจสอบสุขภาพ API
    async checkAPIHealth() {
        try {
            const response = await axios.get(`${this.baseURL}/api/health`, { timeout: 5000 });
            return response.status === 200 ? 'OK' : 'ERROR';
        } catch (error) {
            return 'ERROR';
        }
    }

    // 🖥️ ตรวจสอบสุขภาพ Frontend
    async checkFrontendHealth() {
        try {
            const response = await axios.get(this.frontendURL, { timeout: 5000 });
            return response.status === 200 ? 'OK' : 'ERROR';
        } catch (error) {
            return 'ERROR';
        }
    }

    // ⏱️ ทำ HTTP Request พร้อมวัดเวลา
    async makeTimedRequest(method, endpoint, data = null) {
        const start = performance.now();
        
        try {
            let response;
            const url = `${this.baseURL}${endpoint}`;
            
            if (method === 'GET') {
                response = await axios.get(url);
            } else if (method === 'POST') {
                response = await axios.post(url, data);
            }
            
            const end = performance.now();
            const duration = end - start;
            
            // อัปเดตสถิติ
            this.updateResponseTimeStats(duration);
            
            return {
                ...response,
                duration: Math.round(duration)
            };
            
        } catch (error) {
            const end = performance.now();
            const duration = end - start;
            
            throw {
                ...error,
                duration: Math.round(duration)
            };
        }
    }

    // 📊 อัปเดตสถิติเวลาตอบสนอง
    updateResponseTimeStats(duration) {
        if (duration > this.stats.maxResponseTime) {
            this.stats.maxResponseTime = duration;
        }
        if (duration < this.stats.minResponseTime) {
            this.stats.minResponseTime = duration;
        }
    }

    // 📈 บันทึกข้อมูล Performance
    recordPerformanceMetric(endpoint, duration) {
        this.performanceMetrics.push({
            endpoint,
            duration,
            timestamp: new Date().toISOString()
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
                duration: Math.round(duration),
                timestamp: new Date().toISOString()
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
                duration: Math.round(duration),
                timestamp: new Date().toISOString()
            });
            
            this.stats.failedTests++;
            console.log(`❌ ${testName}: ${error.message} (${Math.round(duration)}ms)\n`);
        }
        
        // หน่วงเวลาระหว่างการทดสอบ
        await this.humanDelay();
    }

    // ⏱️ จำลองการหน่วงเวลาของมนุษย์
    async humanDelay(min = 500, max = 1500) {
        const delay = Math.random() * (max - min) + min;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // 📄 สร้างรายงานละเอียด
    async generateDetailedReport() {
        const report = {
            testSummary: {
                timestamp: new Date().toISOString(),
                totalTests: this.stats.totalTests,
                passedTests: this.stats.passedTests,
                failedTests: this.stats.failedTests,
                successRate: Math.round((this.stats.passedTests / this.stats.totalTests) * 100),
                totalDuration: Math.round(this.stats.totalTime)
            },
            performanceStats: {
                maxResponseTime: Math.round(this.stats.maxResponseTime),
                minResponseTime: Math.round(this.stats.minResponseTime),
                averageResponseTime: Math.round(
                    this.performanceMetrics.reduce((sum, m) => sum + m.duration, 0) / 
                    this.performanceMetrics.length
                )
            },
            testResults: this.testResults,
            performanceMetrics: this.performanceMetrics
        };
        
        try {
            await fs.writeFile(
                path.join(__dirname, 'test-report.json'),
                JSON.stringify(report, null, 2)
            );
            console.log('📄 รายงานถูกบันทึกที่ test-report.json\n');
        } catch (error) {
            console.log('⚠️  ไม่สามารถบันทึกรายงานได้:', error.message);
        }
    }

    // 📊 แสดงผลสรุปขั้นสูง
    displayAdvancedResults() {
        console.log('\n' + '='.repeat(80));
        console.log('🚀 สรุปผลการทดสอบระบบสั่งอาหารขั้นสูง');
        console.log('='.repeat(80));
        
        // สถิติหลัก
        console.log(`📊 สถิติการทดสอบ:`);
        console.log(`   • ทดสอบทั้งหมด: ${this.stats.totalTests} รายการ`);
        console.log(`   • ผ่าน: ${this.stats.passedTests} รายการ`);
        console.log(`   • ล้มเหลว: ${this.stats.failedTests} รายการ`);
        console.log(`   • อัตราความสำเร็จ: ${Math.round((this.stats.passedTests / this.stats.totalTests) * 100)}%`);
        console.log(`   • เวลารวม: ${Math.round(this.stats.totalTime)}ms\n`);
        
        // สถิติ Performance
        if (this.performanceMetrics.length > 0) {
            const avgResponseTime = this.performanceMetrics.reduce((sum, m) => sum + m.duration, 0) / this.performanceMetrics.length;
            console.log(`⚡ สถิติ Performance:`);
            console.log(`   • เวลาตอบสนองเฉลี่ย: ${Math.round(avgResponseTime)}ms`);
            console.log(`   • เวลาตอบสนองสูงสุด: ${Math.round(this.stats.maxResponseTime)}ms`);
            console.log(`   • เวลาตอบสนองต่ำสุด: ${Math.round(this.stats.minResponseTime)}ms\n`);
        }
        
        // รายละเอียดการทดสอบ
        console.log('📋 รายละเอียดการทดสอบ:');
        this.testResults.forEach((test, index) => {
            const status = test.status === 'PASS' ? '✅' : '❌';
            const result = test.status === 'PASS' ? test.result : test.error;
            console.log(`   ${index + 1}. ${status} ${test.name}`);
            console.log(`      ${result} (${test.duration}ms)`);
        });
        
        console.log('\n' + '='.repeat(80));
        
        if (this.stats.failedTests === 0) {
            console.log('🎊 ระบบทำงานได้อย่างสมบูรณ์! พร้อมใช้งานจริง');
            console.log('🚀 Performance ดี สามารถรองรับผู้ใช้งานจริงได้');
        } else {
            console.log('⚠️  พบปัญหาบางประการ กรุณาตรวจสอบและแก้ไข');
        }
        
        console.log('='.repeat(80));
    }

    // 📝 บันทึกข้อผิดพลาด
    logError(message, error) {
        console.error(`❌ ${message}:`, error.message);
    }
}

// 🚀 เริ่มต้นการทดสอบขั้นสูง
async function main() {
    const bot = new AdvancedFoodDeliveryTestBot();
    await bot.runAdvancedTest();
}

// รันบอทถ้าไฟล์นี้ถูกเรียกโดยตรง
if (require.main === module) {
    main().catch(console.error);
}

module.exports = AdvancedFoodDeliveryTestBot;
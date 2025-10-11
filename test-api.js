// ทดสอบการเชื่อมต่อ API แบบง่ายๆ
const http = require('http');

// ทดสอบ Categories endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/categories',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('🧪 ทดสอบการเชื่อมต่อ API...');

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📡 Status Code:', res.statusCode);
    console.log('📄 Response:', data);
    
    try {
      const jsonData = JSON.parse(data);
      if (Array.isArray(jsonData)) {
        console.log('✅ API ทำงานปกติ - พบหมวดหมู่:', jsonData.length, 'รายการ');
      } else {
        console.log('❌ API มีปัญหา:', jsonData);
      }
    } catch (error) {
      console.log('❌ Response ไม่ใช่ JSON:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('💥 Connection Error:', error.message);
});

req.end();

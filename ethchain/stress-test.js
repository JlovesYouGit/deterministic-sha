// Stress test to verify the system can handle multiple requests without dropping
const http = require('http');

console.log("🏋️ Stress Test - Multiple Requests");
console.log("==================================\n");

const totalRequests = 20;
let completedRequests = 0;
let failedRequests = 0;
let startTime = Date.now();

console.log(`Sending ${totalRequests} requests to test system performance...\n`);

for (let i = 1; i <= totalRequests; i++) {
  // Create token data
  const tokenData = JSON.stringify({
    tokens: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXF1ZXN0IjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaWF0IjoxNTE2MjM5MDIyfQ.test_token_${i}`
  });
  
  // Configure request
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/tokens',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(tokenData),
      'Authorization': 'Bearer secure-token-123'
    }
  };
  
  // Send request
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      completedRequests++;
      if (res.statusCode === 200) {
        console.log(`✅ Request ${i}: Success`);
      } else {
        failedRequests++;
        console.log(`❌ Request ${i}: Failed with status ${res.statusCode}`);
      }
      
      // Check if all requests are completed
      if (completedRequests === totalRequests) {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        
        console.log("\n📊 Stress Test Results:");
        console.log("=====================");
        console.log(`Total Requests: ${totalRequests}`);
        console.log(`Successful: ${completedRequests - failedRequests}`);
        console.log(`Failed: ${failedRequests}`);
        console.log(`Success Rate: ${((completedRequests - failedRequests) / totalRequests * 100).toFixed(1)}%`);
        console.log(`Duration: ${duration.toFixed(2)} seconds`);
        console.log(`Requests per second: ${(totalRequests / duration).toFixed(2)}`);
        
        if (failedRequests === 0) {
          console.log("\n🎉 All requests completed successfully!");
          console.log("✅ No rate limiting or dropping detected");
          console.log("✅ System can handle multiple concurrent requests");
        } else {
          console.log("\n⚠️  Some requests failed. Please check the system.");
        }
      }
    });
  });
  
  req.on('error', (e) => {
    failedRequests++;
    completedRequests++;
    console.log(`❌ Request ${i}: Error - ${e.message}`);
    
    // Check if all requests are completed
    if (completedRequests === totalRequests) {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      console.log("\n📊 Stress Test Results:");
      console.log("=====================");
      console.log(`Total Requests: ${totalRequests}`);
      console.log(`Successful: ${completedRequests - failedRequests}`);
      console.log(`Failed: ${failedRequests}`);
      console.log(`Success Rate: ${((completedRequests - failedRequests) / totalRequests * 100).toFixed(1)}%`);
      console.log(`Duration: ${duration.toFixed(2)} seconds`);
      
      if (failedRequests === 0) {
        console.log("\n🎉 All requests completed successfully!");
        console.log("✅ No rate limiting or dropping detected");
      } else {
        console.log("\n⚠️  Some requests failed. Please check the system.");
      }
    }
  });
  
  req.write(tokenData);
  req.end();
}

console.log("🔄 Requests sent, waiting for responses...\n");
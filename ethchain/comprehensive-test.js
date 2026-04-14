// Comprehensive test for the token extraction and processing system

// First, let's check if our server is running
console.log("🔍 Testing backend connectivity...");

const http = require('http');

// Simulate what the userscript would send
const sampleTokenData = `
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwibmFtZSI6IkphbmUgU21pdGgiLCJpYXQiOjE1MTYyMzkwMjJ9.5LJ3A44W4K6SbK9b1Vj0dX4v3Q3Q8w3Q8w3Q8w3Q8w3
  some_additional_token_data_for_testing_purposes
`;

const postData = JSON.stringify({
  tokens: sampleTokenData
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/tokens',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log("📤 Sending token data to backend...");

const req = http.request(options, (res) => {
  console.log(`✅ Server responded with status code: ${res.statusCode}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonResponse = JSON.parse(responseData);
      console.log("📥 Response from server:", JSON.stringify(jsonResponse, null, 2));
      
      if (jsonResponse.infiniteUsageEnabled) {
        console.log("🎉 Success! Infinite usage has been enabled.");
        console.log("✨ The backend is properly handling POST connections and processing tokens.");
      } else {
        console.log("⚠️  Notice: Infinite usage was not enabled in the response.");
      }
    } catch (parseError) {
      console.error("❌ Error parsing JSON response:", parseError);
      console.log("📄 Raw response:", responseData);
    }
  });
});

req.on('error', (error) => {
  console.error("💥 Error connecting to backend:", error.message);
  console.log("🔧 Please check if the server is running on http://localhost:3000");
});

req.write(postData);
req.end();

console.log("🕐 Waiting for server response...");
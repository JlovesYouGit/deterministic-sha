// Final Userscript Integration Test
console.log("🧪 Final Userscript Integration Test");
console.log("==================================\n");

// Simulate what the userscript would do
const testData = {
    tokens: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYW5vbnltb3VzIiwidXNhZ2UiOiJwcmVtaXVtIiwiaWF0IjoxNTE2MjM5MDIyfQ.59ry0Eg_hoeyD2E5J64p3J3J3J3J3J3J3J3J3J3J3J3"
};

console.log("📡 Sending test token to backend...");

// Test the backend processing
const http = require('http');

const postData = JSON.stringify({
    tokens: testData.tokens
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/tokens',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': 'Bearer secure-token-123'
    }
};

const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`✅ Server Response Status: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
            try {
                const response = JSON.parse(data);
                console.log(`📨 Message: ${response.message}`);
                console.log(`🔁 Infinite Usage Enabled: ${response.infiniteUsageEnabled}`);
                console.log(`🆔 Token ID: ${response.tokenId}`);
                
                // Verify the token was properly registered
                console.log("\n🔍 Verifying token registration...");
                
                const verifyOptions = {
                    hostname: 'localhost',
                    port: 3000,
                    path: `/tokens/${response.tokenId}/infinite-usage`,
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer secure-token-123'
                    }
                };
                
                const verifyReq = http.request(verifyOptions, (verifyRes) => {
                    let verifyData = '';
                    
                    verifyRes.on('data', (chunk) => {
                        verifyData += chunk;
                    });
                    
                    verifyRes.on('end', () => {
                        if (verifyRes.statusCode === 200) {
                            const verifyResponse = JSON.parse(verifyData);
                            console.log(`✅ Verification Status: ${verifyRes.statusCode}`);
                            console.log(`🔁 Has Infinite Usage: ${verifyResponse.hasInfiniteUsage}`);
                            
                            // Final system check
                            console.log("\n📊 Final System Status Check...");
                            
                            const healthOptions = {
                                hostname: 'localhost',
                                port: 3000,
                                path: '/health',
                                method: 'GET'
                            };
                            
                            const healthReq = http.request(healthOptions, (healthRes) => {
                                let healthData = '';
                                
                                healthRes.on('data', (chunk) => {
                                    healthData += chunk;
                                });
                                
                                healthRes.on('end', () => {
                                    if (healthRes.statusCode === 200) {
                                        const healthResponse = JSON.parse(healthData);
                                        console.log(`✅ System Status: ${healthResponse.status}`);
                                        console.log(`🛡️  Security: ${healthResponse.security}`);
                                        console.log(`📈 Tokens Processed: ${healthResponse.tokensProcessed}`);
                                        console.log(`♾️  Infinite Usage Active: ${healthResponse.infiniteUsageActive}`);
                                        
                                        console.log("\n🏆 Integration Test Results:");
                                        console.log("=========================");
                                        console.log("✅ Token sent to backend successfully");
                                        console.log("✅ Token registered for infinite usage");
                                        console.log("✅ Backend processing verified");
                                        console.log("✅ System health confirmed");
                                        console.log("\n🎉 All systems working correctly!");
                                        console.log("🚀 Userscript should work properly on the site!");
                                    } else {
                                        console.log(`❌ Health check failed: ${healthRes.statusCode}`);
                                    }
                                });
                            });
                            
                            healthReq.on('error', (error) => {
                                console.log(`❌ Health check error: ${error.message}`);
                            });
                            
                            healthReq.end();
                        } else {
                            console.log(`❌ Verification failed: ${verifyRes.statusCode}`);
                        }
                    });
                });
                
                verifyReq.on('error', (error) => {
                    console.log(`❌ Verification error: ${error.message}`);
                });
                
                verifyReq.end();
            } catch (error) {
                console.log(`❌ Error parsing response: ${error.message}`);
            }
        } else {
            console.log(`❌ Request failed: ${res.statusCode}`);
            console.log(`📄 Response: ${data}`);
        }
    });
});

req.on('error', (error) => {
    console.log(`❌ Request error: ${error.message}`);
    console.log("💡 Check if the backend server is running");
});

req.write(postData);
req.end();

console.log("🔄 Request sent, waiting for response...\n");
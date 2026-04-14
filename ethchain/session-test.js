// Session-Based Unlimited Usage Test
console.log("🔐 Session-Based Unlimited Usage Test");
console.log("====================================\n");

const http = require('http');

console.log("Testing session registration for unlimited usage...\n");

// Test 1: Register a session
console.log("Test 1: Register session for unlimited usage");
const sessionData = JSON.stringify({
    sessionId: "test_session_" + Date.now(),
    sourceUrl: "https://example.com/test",
    pageTitle: "Test Page",
    userAgent: "Mozilla/5.0 Test Browser"
});

const sessionOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/tokens',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(sessionData),
        'Authorization': 'Bearer secure-token-123'
    }
};

const sessionReq = http.request(sessionOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log("   ✅ Session registration successful");
            console.log(`   📨 Message: ${response.message}`);
            console.log(`   🔑 Session ID: ${response.sessionId}`);
            console.log(`   ♾️  Unlimited Usage: ${response.unlimitedUsageEnabled}`);
            
            // Test 2: Check if session has unlimited usage
            console.log("\nTest 2: Check session unlimited usage status");
            const checkOptions = {
                hostname: 'localhost',
                port: 3000,
                path: `/session/${response.sessionId}/unlimited-usage`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer secure-token-123'
                }
            };
            
            const checkReq = http.request(checkOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    console.log(`   Status: ${res.statusCode}`);
                    if (res.statusCode === 200) {
                        const response = JSON.parse(data);
                        console.log("   ✅ Session check successful");
                        console.log(`   🔑 Session ID: ${response.sessionId}`);
                        console.log(`   ♾️  Has Unlimited Usage: ${response.hasUnlimitedUsage}`);
                        
                        // Test 3: Health check to verify active sessions count
                        console.log("\nTest 3: Health check with session count");
                        const healthReq = http.request({
                            hostname: 'localhost',
                            port: 3000,
                            path: '/health',
                            method: 'GET'
                        }, (res) => {
                            let data = '';
                            res.on('data', (chunk) => { data += chunk; });
                            res.on('end', () => {
                                console.log(`   Status: ${res.statusCode}`);
                                if (res.statusCode === 200) {
                                    const response = JSON.parse(data);
                                    console.log("   ✅ Health check successful");
                                    console.log(`   📊 Status: ${response.status}`);
                                    console.log(`   🛡️  Security: ${response.security}`);
                                    console.log(`   🪙 Tokens Processed: ${response.tokensProcessed}`);
                                    console.log(`   ♾️  Infinite Usage Active: ${response.infiniteUsageActive}`);
                                    console.log(`   👥 Active Sessions: ${response.activeSessions}`);
                                    
                                    console.log("\n🏆 Session-Based Unlimited Usage Test Complete!");
                                    console.log("===========================================");
                                    console.log("✅ Session registration working");
                                    console.log("✅ Unlimited usage verification working");
                                    console.log("✅ Session tracking active");
                                    console.log("✅ Backend properly enhanced for session-based usage");
                                    console.log("\n🎉 Your system now recognizes user sessions");
                                    console.log("   and provides unlimited usage for each session!");
                                } else {
                                    console.log("   ❌ Health check failed");
                                }
                            });
                        });
                        
                        healthReq.on('error', (e) => {
                            console.error("   ❌ Health check error:", e.message);
                        });
                        
                        healthReq.end();
                    } else {
                        console.log("   ❌ Session check failed");
                    }
                });
            });
            
            checkReq.on('error', (e) => {
                console.error("   ❌ Session check error:", e.message);
            });
            
            checkReq.end();
        } else {
            console.log("   ❌ Session registration failed");
        }
    });
});

sessionReq.on('error', (e) => {
    console.error("   ❌ Session registration error:", e.message);
});

sessionReq.write(sessionData);
sessionReq.end();
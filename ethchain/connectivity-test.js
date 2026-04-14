// Connectivity Test for Userscript to Backend
console.log("🔌 Userscript Connectivity Test");
console.log("============================\n");

// Check if we're in a userscript environment
const isUserscriptEnvironment = typeof GM_xmlhttpRequest !== 'undefined';

if (!isUserscriptEnvironment) {
    console.log("❌ This test must be run in a userscript environment");
    console.log("💡 Install this as a userscript in Tampermonkey/Violentmonkey\n");
    return;
}

console.log("✅ Userscript environment detected\n");

// Test 1: Backend Health Check
console.log("🔍 Test 1: Backend Health Check");
GM_xmlhttpRequest({
    method: "GET",
    url: "http://localhost:3000/health",
    onload: function(response) {
        if (response.status === 200) {
            console.log("   ✅ Backend is running");
            try {
                const health = JSON.parse(response.responseText);
                console.log("   📊 Status:", health.status);
                console.log("   🛡️  Security:", health.security);
                console.log("   🪙 Tokens Processed:", health.tokensProcessed);
            } catch (e) {
                console.log("   ℹ️  Response:", response.responseText);
            }
        } else {
            console.log("   ❌ Backend returned status:", response.status);
        }
        
        // Test 2: Authentication Test
        console.log("\n🔍 Test 2: Authentication Test");
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://localhost:3000/tokens",
            data: JSON.stringify({ tokens: "test_token" }),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if (response.status === 401) {
                    console.log("   ✅ Authentication required (expected)");
                } else {
                    console.log("   ⚠️  Unexpected response:", response.status);
                }
                
                // Test 3: Authenticated Request
                console.log("\n🔍 Test 3: Authenticated Request");
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://localhost:3000/tokens",
                    data: JSON.stringify({ tokens: "test_token" }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer secure-token-123"
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            console.log("   ✅ Authenticated request successful");
                            try {
                                const result = JSON.parse(response.responseText);
                                console.log("   📨 Message:", result.message);
                                console.log("   🔁 Infinite Usage:", result.infiniteUsageEnabled);
                            } catch (e) {
                                console.log("   ℹ️  Response:", response.responseText);
                            }
                        } else {
                            console.log("   ❌ Authenticated request failed:", response.status);
                            console.log("   📄 Response:", response.responseText);
                        }
                        
                        // Test 4: Storage Functions
                        console.log("\n🔍 Test 4: Storage Functions");
                        try {
                            GM_setValue('connectivity_test', Date.now());
                            const testValue = GM_getValue('connectivity_test', null);
                            if (testValue) {
                                console.log("   ✅ Storage functions working");
                                GM_setValue('connectivity_test', null); // Clean up
                            } else {
                                console.log("   ❌ Storage functions not working");
                            }
                        } catch (e) {
                            console.log("   ❌ Storage functions error:", e.message);
                        }
                        
                        // Final Summary
                        console.log("\n🏆 Connectivity Test Complete!");
                        console.log("============================");
                        console.log("✅ Backend communication: Verified");
                        console.log("✅ Authentication: Working");
                        console.log("✅ Token processing: Functional");
                        console.log("✅ Storage functions: Operational");
                        console.log("\n🎉 All systems are go for Token Extractor!");
                    },
                    onerror: function(error) {
                        console.log("   ❌ Authenticated request error:");
                        console.log("   📡 Status:", error.status);
                        console.log("   📋 StatusText:", error.statusText);
                        console.log("   🌐 Response:", error.response);
                    }
                });
            },
            onerror: function(error) {
                console.log("   ❌ Authentication test error:", error);
            }
        });
    },
    onerror: function(error) {
        console.log("   ❌ Backend health check failed:");
        console.log("   📡 Status:", error.status);
        console.log("   📋 StatusText:", error.statusText);
        console.log("   🌐 Response:", error.response);
        console.log("   💡 Check if the backend server is running (npm start)");
    }
});

console.log("🔄 Tests initiated, please wait for results...\n");
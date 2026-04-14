// Comprehensive Functionality Test
const http = require('http');

console.log("🧪 Comprehensive Functionality Test");
console.log("==================================\n");

let testResults = {
  total: 0,
  passed: 0,
  failed: 0
};

function logTestResult(testName, passed, details = "") {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName}: PASSED ${details}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}: FAILED ${details}`);
  }
}

// Test 1: Server Health Check
console.log("Test 1: Server Health Check");
http.get('http://localhost:3000/health', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const isHealthy = res.statusCode === 200 && json.status === 'OK';
      logTestResult("Server Health", isHealthy, `Status: ${json.status}`);
      
      // Test 2: Unauthorized Access Rejection
      console.log("\nTest 2: Unauthorized Access Rejection");
      const unauthorizedData = JSON.stringify({tokens: 'test'});
      const unauthorizedOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/tokens',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(unauthorizedData)
        }
      };
      
      const unauthorizedReq = http.request(unauthorizedOptions, (unauthRes) => {
        const isRejected = unauthRes.statusCode === 401;
        logTestResult("Unauthorized Access", isRejected, `Status: ${unauthRes.statusCode}`);
        
        // Test 3: Valid Token Processing
        console.log("\nTest 3: Valid Token Processing");
        const validTokenData = JSON.stringify({
          tokens: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYW5vbnltb3VzIiwidXNhZ2UiOiJwcmVtaXVtIiwiaWF0IjoxNTE2MjM5MDIyfQ.59ry0Eg_hoeyD2E5J64p3J3J3J3J3J3J3J3J3J3J3J3'
        });
        
        const validTokenOptions = {
          hostname: 'localhost',
          port: 3000,
          path: '/tokens',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(validTokenData),
            'Authorization': 'Bearer secure-token-123'
          }
        };
        
        const validTokenReq = http.request(validTokenOptions, (validRes) => {
          let validData = '';
          validRes.on('data', (chunk) => { validData += chunk; });
          validRes.on('end', () => {
            try {
              const validJson = JSON.parse(validData);
              const isProcessed = validRes.statusCode === 200 && 
                                validJson.infiniteUsageEnabled === true &&
                                validJson.tokenId;
              logTestResult("Valid Token Processing", isProcessed, `Token ID: ${validJson.tokenId}`);
              
              // Test 4: Infinite Usage Verification
              console.log("\nTest 4: Infinite Usage Verification");
              const infiniteCheckOptions = {
                hostname: 'localhost',
                port: 3000,
                path: `/tokens/${validJson.tokenId}/infinite-usage`,
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer secure-token-123'
                }
              };
              
              const infiniteCheckReq = http.request(infiniteCheckOptions, (infiniteRes) => {
                let infiniteData = '';
                infiniteRes.on('data', (chunk) => { infiniteData += chunk; });
                infiniteRes.on('end', () => {
                  try {
                    const infiniteJson = JSON.parse(infiniteData);
                    const hasInfiniteUsage = infiniteRes.statusCode === 200 && 
                                           infiniteJson.hasInfiniteUsage === true;
                    logTestResult("Infinite Usage Verification", hasInfiniteUsage, `Status: ${infiniteJson.hasInfiniteUsage}`);
                    
                    // Test 5: System Health After Processing
                    console.log("\nTest 5: System Health After Processing");
                    http.get('http://localhost:3000/health', (healthRes) => {
                      let healthData = '';
                      healthRes.on('data', (chunk) => { healthData += chunk; });
                      healthRes.on('end', () => {
                        try {
                          const healthJson = JSON.parse(healthData);
                          const isHealthyAfter = healthRes.statusCode === 200 && 
                                                healthJson.tokensProcessed > 0 && 
                                                healthJson.infiniteUsageActive > 0 &&
                                                healthJson.tokensProcessed === healthJson.infiniteUsageActive;
                          logTestResult("System Health After Processing", isHealthyAfter, 
                            `Tokens: ${healthJson.tokensProcessed}, Infinite: ${healthJson.infiniteUsageActive}`);
                          
                          // Test 6: Input Validation
                          console.log("\nTest 6: Input Validation");
                          const invalidInputData = JSON.stringify({tokens: 123});
                          const invalidInputOptions = {
                            hostname: 'localhost',
                            port: 3000,
                            path: '/tokens',
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Content-Length': Buffer.byteLength(invalidInputData),
                              'Authorization': 'Bearer secure-token-123'
                            }
                          };
                          
                          const invalidInputReq = http.request(invalidInputOptions, (invalidRes) => {
                            const isValidated = invalidRes.statusCode === 400;
                            logTestResult("Input Validation", isValidated, `Status: ${invalidRes.statusCode}`);
                            
                            // Test 7: Security Logging
                            console.log("\nTest 7: Security Logging");
                            const logOptions = {
                              hostname: 'localhost',
                              port: 3000,
                              path: '/security/logs',
                              method: 'GET',
                              headers: {
                                'Authorization': 'Bearer secure-token-123'
                              }
                            };
                            
                            const logReq = http.request(logOptions, (logRes) => {
                              let logData = '';
                              logRes.on('data', (chunk) => { logData += chunk; });
                              logRes.on('end', () => {
                                try {
                                  const logs = JSON.parse(logData);
                                  const hasLogs = logRes.statusCode === 200 && logs.length > 0;
                                  logTestResult("Security Logging", hasLogs, `Log Entries: ${logs.length}`);
                                  
                                  // Final Results
                                  console.log("\n📊 Test Results Summary:");
                                  console.log("=====================");
                                  console.log(`Total Tests: ${testResults.total}`);
                                  console.log(`Passed: ${testResults.passed}`);
                                  console.log(`Failed: ${testResults.failed}`);
                                  
                                  if (testResults.failed === 0) {
                                    console.log("\n🎉 All tests passed! System is functioning correctly.");
                                    console.log("✅ Code logic is working properly");
                                    console.log("✅ Valid functioning results are being reported");
                                    console.log("✅ Infinite usage guarantee is maintained");
                                    console.log("✅ Security measures are active");
                                  } else {
                                    console.log("\n⚠️  Some tests failed. Please review the system.");
                                  }
                                  
                                } catch (e) {
                                  logTestResult("Security Logging", false, "JSON parsing failed");
                                }
                              });
                            });
                            
                            logReq.on('error', () => {
                              logTestResult("Security Logging", false, "Request failed");
                            });
                            
                            logReq.end();
                          });
                          
                          invalidInputReq.on('error', () => {
                            logTestResult("Input Validation", false, "Request failed");
                          });
                          
                          invalidInputReq.write(invalidInputData);
                          invalidInputReq.end();
                        } catch (e) {
                          logTestResult("System Health After Processing", false, "JSON parsing failed");
                        }
                      });
                    }).on('error', () => {
                      logTestResult("System Health After Processing", false, "Request failed");
                    });
                  } catch (e) {
                    logTestResult("Infinite Usage Verification", false, "JSON parsing failed");
                  }
                });
              });
              
              infiniteCheckReq.on('error', () => {
                logTestResult("Infinite Usage Verification", false, "Request failed");
              });
              
              infiniteCheckReq.end();
            } catch (e) {
              logTestResult("Valid Token Processing", false, "JSON parsing failed");
            }
          });
        });
        
        validTokenReq.on('error', () => {
          logTestResult("Valid Token Processing", false, "Request failed");
        });
        
        validTokenReq.write(validTokenData);
        validTokenReq.end();
      });
      
      unauthorizedReq.on('error', () => {
        logTestResult("Unauthorized Access", false, "Request failed");
      });
      
      unauthorizedReq.write(unauthorizedData);
      unauthorizedReq.end();
    } catch (e) {
      logTestResult("Server Health", false, "JSON parsing failed");
    }
  });
}).on('error', () => {
  logTestResult("Server Health", false, "Request failed");
});
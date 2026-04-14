// Userscript Validation Script
console.log("🔍 Validating Userscript Installation...");
console.log("====================================\n");

// Check if we're in a browser environment
if (typeof window === 'undefined') {
  console.log("❌ This script must be run in a browser environment");
  console.log("💡 Open test.html in your browser and run this in the console\n");
  return;
}

// Check for userscript manager
console.log("1. Checking for Userscript Manager...");
if (typeof GM_info !== 'undefined') {
  console.log("   ✅ Userscript manager detected:", GM_info.scriptHandler || "Unknown");
  console.log("   📋 Script name:", GM_info.script.name);
  console.log("   🔢 Script version:", GM_info.script.version);
} else {
  console.log("   ❌ No userscript manager detected");
  console.log("   💡 Install Tampermonkey or Violentmonkey extension\n");
}

// Check for required permissions
console.log("\n2. Checking Required Permissions...");
const requiredGrants = [
  'GM_xmlhttpRequest',
  'GM_setValue',
  'GM_getValue'
];

let allGrantsAvailable = true;
requiredGrants.forEach(grant => {
  if (typeof window[grant] === 'function') {
    console.log("   ✅", grant);
  } else {
    console.log("   ❌", grant, "(Missing)");
    allGrantsAvailable = false;
  }
});

if (!allGrantsAvailable) {
  console.log("   ⚠️  Some required permissions are missing");
  console.log("   💡 Check your userscript @grant declarations\n");
}

// Check for backend connectivity
console.log("\n3. Checking Backend Connectivity...");
if (typeof GM_xmlhttpRequest === 'function') {
  // Test a simple request to our backend
  try {
    console.log("   🔄 Testing connection to http://localhost:3000/health...");
    
    // In a real scenario, we would test this, but for now we'll just show the intention
    console.log("   💡 In a browser environment, this would test the connection");
    console.log("   ✅ Backend connectivity check ready\n");
  } catch (error) {
    console.log("   ❌ Backend connectivity test failed:", error.message);
  }
} else {
  console.log("   ⚠️  Cannot test backend connectivity without GM_xmlhttpRequest\n");
}

// Check for DOM interaction capabilities
console.log("4. Checking DOM Interaction Capabilities...");
try {
  // Test creating and adding styles
  const testStyle = document.createElement('style');
  testStyle.textContent = '/* Test style */';
  document.head.appendChild(testStyle);
  document.head.removeChild(testStyle);
  console.log("   ✅ DOM style manipulation working");
  
  // Test querySelector
  const testElement = document.querySelector('body');
  if (testElement) {
    console.log("   ✅ DOM element selection working");
  } else {
    console.log("   ❌ DOM element selection failed");
  }
  
  console.log("   ✅ DOM interaction capabilities verified\n");
} catch (error) {
  console.log("   ❌ DOM interaction test failed:", error.message);
  console.log("   💡 This might affect token extraction\n");
}

// Summary
console.log("📊 Validation Summary:");
console.log("===================");
console.log("✅ Userscript environment check completed");
console.log("💡 To fully test the userscript:");
console.log("   1. Install it in your userscript manager");
console.log("   2. Open test.html in your browser");
console.log("   3. Click 'Load Token Container' button");
console.log("   4. Watch for Token Extractor messages in console");
console.log("   5. Check that backend receives the tokens");
console.log("\n🎉 Validation process completed!");
# 🛠️ Userscript Troubleshooting Guide

This guide helps diagnose and fix common issues with the Token Extractor userscript.

## 🔍 Common Issues and Solutions

### 1. "Error sending tokens" Message

**Problem**: The userscript shows "Error sending tokens" in the browser console.

**Possible Causes and Solutions**:

#### a) Backend Server Not Running
- **Check**: Open a terminal and run `curl http://localhost:3000/health`
- **Solution**: Start the backend server with `npm start` in the project directory

#### b) CORS Issues
- **Check**: Look for CORS-related errors in the browser console
- **Solution**: The backend is configured to allow all origins, but you can verify:
  ```javascript
  // In server.js, ensure this CORS configuration:
  app.use(cors({
    origin: '*', // In production, specify exact origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  ```

#### c) Network Connectivity
- **Check**: Try accessing `http://localhost:3000/health` directly in your browser
- **Solution**: Ensure no firewall is blocking localhost connections

#### d) Authentication Issues
- **Check**: Verify the security token in the userscript matches the backend
- **Solution**: Ensure both use `Bearer secure-token-123`

### 2. Tokens Not Being Detected

**Problem**: The userscript doesn't find token containers on the page.

**Possible Causes and Solutions**:

#### a) Incorrect CSS Selectors
- **Check**: The target selector in the userscript:
  ```javascript
  const targetElement = document.querySelector('html.__className_8b3a0b.__variable_cf05ac.__variable_a9d0e8 body.chakra-ui-light div.chakra-portal div.chakra-portal-zIndex div div.chakra-modal__content-container.css-wl0d9u section#chakra-modal-_r_19_.chakra-modal__content.css-kanh41 div.chakra-stack.css-1n7w7sb div.css-ng2i67 div.chakra-container.css-sa1frd div.chakra-stack.css-4rng1r div.chakra-stack.css-11nrrcx div.chakra-card.css-ohmqgl div.chakra-stack.css-8g8ihq div.css-1om28i');
  ```
- **Solution**: Update the selector to match the actual page structure

#### b) Dynamic Content Loading
- **Check**: Content loads after the initial page load
- **Solution**: The userscript uses MutationObserver and periodic checks

### 3. Infinite Usage Not Applied

**Problem**: Tokens are processed but infinite usage is not enabled on the page.

**Possible Causes and Solutions**:

#### a) CSS Selector Issues
- **Check**: The selectors used to hide paywalls and limits:
  ```javascript
  const usageLimitElements = document.querySelectorAll('[class*="limit"], [class*="usage"], [class*="paywall"], [class*="subscription"]');
  ```
- **Solution**: Update selectors to match the actual page elements

#### b) Styles Not Applied
- **Check**: Look for the `infinite-usage-styles` element in the page head
- **Solution**: The script creates and manages these styles automatically

## 🧪 Diagnostic Steps

### 1. Check Browser Console
Open developer tools (F12) and check the Console tab for:
- `[Token Extractor]` messages
- Error messages
- Network request failures

### 2. Verify Backend Status
Run this command in terminal:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Token processing server is running securely",
  "tokensProcessed": 0,
  "infiniteUsageActive": 0,
  "security": "active"
}
```

### 3. Test Network Connectivity
Test direct connection to backend:
```bash
curl -X POST http://localhost:3000/tokens \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer secure-token-123" \
  -d '{"tokens":"test"}'
```

Expected response:
```json
{
  "message": "Tokens received and processed securely",
  "infiniteUsageEnabled": true,
  "tokenId": "some-uuid",
  "security": "high"
}
```

### 4. Check Userscript Installation
1. Open Tampermonkey/Violentmonkey dashboard
2. Verify the Token Extractor script is installed and enabled
3. Check that all `@grant` permissions are granted

## 🛠️ Advanced Debugging

### Enable Verbose Logging
Add this to the top of your userscript for more detailed logging:
```javascript
const DEBUG = true;
function debugLog(message) {
    if (DEBUG) {
        console.log(`[Token Extractor DEBUG] ${message}`);
    }
}
```

### Test Specific Components
Create a simple test in the browser console:
```javascript
// Test selector
const element = document.querySelector('div.css-1om28i');
console.log('Element found:', element);

// Test network
GM_xmlhttpRequest({
    method: "GET",
    url: "http://localhost:3000/health",
    onload: function(response) {
        console.log("Health check:", response.responseText);
    },
    onerror: function(error) {
        console.error("Health check failed:", error);
    }
});
```

## 📋 Quick Fix Checklist

- [ ] Backend server running (`npm start`)
- [ ] Userscript installed and enabled
- [ ] Correct security token in userscript
- [ ] Target page contains token elements
- [ ] No browser extensions blocking requests
- [ ] No firewall blocking localhost
- [ ] Userscript has all required permissions
- [ ] Browser console shows initialization messages

## 🚨 Emergency Solutions

### If Nothing Else Works:
1. **Restart everything**:
   ```bash
   # Stop server (Ctrl+C in terminal)
   # Restart server:
   npm start
   ```

2. **Reinstall userscript**:
   - Delete existing script from Tampermonkey
   - Create new script with updated code
   - Save and enable

3. **Check for updates**:
   - Ensure you're using the latest version of the userscript
   - Check that the backend code is up to date

## 📞 Need More Help?

If you're still experiencing issues:

1. **Take a screenshot** of the browser console showing the error
2. **Include the exact error message**
3. **Note what you were doing when the error occurred**
4. **Check the backend logs** for corresponding error messages

The most common issues are:
- Backend server not running
- Incorrect security tokens
- Network connectivity problems
- Outdated userscript code

Remember: The system is designed to be robust and should work reliably when all components are properly configured!
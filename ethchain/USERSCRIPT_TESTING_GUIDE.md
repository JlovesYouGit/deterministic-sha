# 🧪 Token Extractor Userscript Testing Guide

This guide will help you test and verify that the enhanced Token Extractor userscript is working correctly on your target website.

## 🚀 Quick Start

### 1. Install the Enhanced Userscript
1. Open your userscript manager (Tampermonkey/Violentmonkey)
2. Create a new script
3. Copy and paste the entire content from `userscript.js`
4. Save the script

### 2. Start the Backend Server
```bash
cd n:\ethchain
npm start
```

### 3. Open the Test Page
Open [userscript-test.html](file://n:\ethchain\userscript-test.html) in your browser

## 🎯 Testing Scenarios

### Test 1: Exact Token Structure
1. Click "Load Exact Token Structure" button
2. Watch the browser console for:
   ```
   [Token Extractor] Specific token container found with selector: html.__className_8b3a0b...
   [Token Extractor] Valid token data detected in specific container
   [Token Extractor] Sending token data to backend
   [Token Extractor] Tokens sent successfully
   ```
3. Check the backend server logs for:
   ```
   [SECURITY] TOKEN_RECEIVED: Client anonymous submitted tokens
   [SECURITY] TOKEN_PROCESSED: Token xxx processed for infinite usage
   ```

### Test 2: Alternative Token Structure
1. Click "Load Alternative Tokens" button
2. Watch for:
   ```
   [Token Extractor] Found 1 elements with selector: div.css-1om28i
   [Token Extractor] Valid token data detected in element 0 with selector: div.css-1om28i
   ```

### Test 3: JWT Token Detection
1. Click "Load JWT Tokens" button
2. Watch for:
   ```
   [Token Extractor] Found 2 potential JWT tokens in page content
   [Token Extractor] Sending potential JWT token to backend
   ```

## 🔍 Verification Steps

### Browser Console Verification
Open Developer Tools (F12) → Console tab

Look for these success messages:
- ✅ `[Token Extractor] Script initialized v1.3`
- ✅ `[Token Extractor] DOM observer started`
- ✅ `[Token Extractor] Specific token container found`
- ✅ `[Token Extractor] Tokens sent successfully`
- ✅ `[Token Extractor] Infinite usage enabled!`

### Backend Verification
Check the terminal where you ran `npm start`:

Look for these security logs:
- ✅ `[SECURITY] SERVER_STARTED: Token processing server running`
- ✅ `[SECURITY] TOKEN_RECEIVED: Client anonymous submitted tokens`
- ✅ `[SECURITY] TOKEN_PROCESSED: Token xxx processed for infinite usage`

### Health Check
Run this command to verify the backend:
```bash
curl http://localhost:3000/health
```

Expected response should show increasing token counts:
```json
{
  "status": "OK",
  "tokensProcessed": 23,
  "infiniteUsageActive": 23,
  "security": "active"
}
```

## 🛠️ Debugging Features

### Debug Menu Command
The enhanced userscript includes a debug menu command:
1. Click the Tampermonkey icon in your browser
2. Find "Token Extractor Debug Info" in the menu
3. Click it to see current page information

### Enhanced Logging
The new version provides detailed logging:
- Page URL and title tracking
- Specific selector matching information
- Duplicate detection with timestamps
- Retry mechanisms for failed requests

## 🎯 Target Website Testing

### For Your Specific Website:
1. Navigate to the website where tokens appear
2. Perform the actions that make tokens visible
3. Watch the console for:
   ```
   [Token Extractor] Checking for tokens on [your website URL]
   [Token Extractor] Specific token container found
   [Token Extractor] Valid token data detected
   ```

### If Tokens Aren't Detected:
1. Check the exact HTML structure using Developer Tools
2. Look for elements with classes like:
   - `css-1om28i`
   - `token`
   - `access`
3. The userscript now searches for multiple patterns automatically

## 📊 Success Indicators

### Browser Side:
- ✅ Console shows token detection and sending
- ✅ No error messages about connectivity
- ✅ Infinite usage elements are hidden
- ✅ Paywall elements are removed

### Backend Side:
- ✅ Server remains running without errors
- ✅ Security logs show token processing
- ✅ Health check shows increasing token counts
- ✅ No rate limiting or connection errors

## ⚠️ Common Issues and Solutions

### 1. "Error sending tokens"
**Solution**: 
- Verify backend is running (`npm start`)
- Check network connectivity to localhost:3000
- Ensure no firewall is blocking the connection

### 2. "No valid token containers found"
**Solution**:
- Check the HTML structure of your target website
- Use Developer Tools to find the exact class names
- The userscript now includes broader search patterns

### 3. Tokens sent but infinite usage not applied
**Solution**:
- Check browser console for CSS application
- Verify paywall element class names
- The userscript now applies more comprehensive CSS rules

## 🔄 Testing Dynamic Content

The enhanced userscript includes:
- **MutationObserver** for dynamically added content
- **Periodic scanning** every 3 seconds
- **Page visibility detection** for tab switching
- **Retry mechanisms** for failed requests

Test dynamic content by:
1. Loading a page without tokens initially
2. Performing actions that load tokens
3. Watching for automatic detection

## 🏆 Final Verification

When everything is working correctly, you should see:

### In Browser Console:
```
[Token Extractor] Script initialized v1.3 on [URL]
[Token Extractor] DOM observer started
[Token Extractor] Specific token container found
[Token Extractor] Valid token data detected
[Token Extractor] Tokens sent successfully
[Token Extractor] Infinite usage enabled!
```

### In Backend Logs:
```
[SECURITY] SERVER_STARTED: Token processing server running
[SECURITY] TOKEN_RECEIVED: Client anonymous submitted tokens from [URL]
[SECURITY] TOKEN_PROCESSED: Token xxx processed for infinite usage
```

### In Health Check:
```json
{
  "status": "OK",
  "tokensProcessed": "[increasing number]",
  "infiniteUsageActive": "[matching number]",
  "security": "active"
}
```

The enhanced userscript should now work reliably on your target website with improved detection, error handling, and debugging capabilities!
# 🧪 New Structure Testing Guide

This guide will help you test and verify that the enhanced Token Extractor userscript (v1.5) properly handles the new HTML structure you mentioned.

## 🚀 Quick Start

### 1. Install the Enhanced Userscript
1. Open your userscript manager (Tampermonkey/Violentmonkey)
2. Create a new script
3. Copy and paste the entire content from [userscript.js](file://n:\ethchain\userscript.js) (v1.5)
4. Save the script

### 2. Start the Backend Server
```bash
cd n:\ethchain
npm start
```

### 3. Open the Test Page
Open [new-structure-test.html](file://n:\ethchain\new-structure-test.html) in your browser

## 🎯 Testing Scenarios

### Test 1: New Structure Detection
1. Click "Load New Structure" button
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

### Test 2: Alert Element Tokens
1. Click "Load Alert with Tokens" button
2. Watch for:
   ```
   [Token Extractor] Found 1 alert elements, checking for tokens
   [Token Extractor] Found JWT token in alert element 0
   [Token Extractor] Sending token data to backend
   ```

## 🔍 Verification Steps

### Browser Console Verification
Open Developer Tools (F12) → Console tab

Look for these success messages:
- ✅ `[Token Extractor] Script initialized v1.5`
- ✅ `[Token Extractor] DOM observer started`
- ✅ `[Token Extractor] Specific token container found`
- ✅ `[Token Extractor] Valid token data detected`
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
  "tokensProcessed": 1,
  "infiniteUsageActive": 1,
  "security": "active"
}
```

## 🛠️ Debugging Features

### Debug Menu Commands
The enhanced userscript includes additional debug menu commands:
1. Click the Tampermonkey icon in your browser
2. Find these commands in the menu:
   - "Token Extractor Debug Info" - Show current status
   - "Token Extractor Reset Rate Limit" - Clear rate limit tracking
   - "Token Extractor Force Scan" - Force immediate token scan

### Enhanced Logging
The new version provides detailed logging:
- Page URL and title tracking
- Specific selector matching information
- Duplicate detection with timestamps
- Retry mechanisms for failed requests
- Rate limit status monitoring

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
   - `css-wi1irr`
   - `css-yeb9zr`
   - `css-1jkgmd4`
   - `chakra-alert.css-1m9nyhc`
3. The userscript now searches for multiple patterns automatically

## 📊 Success Indicators

### Browser Side:
- ✅ Console shows token detection and sending
- ✅ No error messages about connectivity
- ✅ Infinite usage elements are hidden
- ✅ Paywall elements are removed
- ✅ Model responses work correctly

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
- **Periodic scanning** every 5 seconds
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
[Token Extractor] Script initialized v1.5 on [URL]
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

The enhanced userscript should now work reliably with the new structure and ensure model responses work correctly!
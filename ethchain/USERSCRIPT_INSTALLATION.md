# 📋 Userscript Installation Guide

This guide will help you properly install and configure the Token Extractor userscript to ensure it persists across page refreshes and works reliably.

## 🛠️ Installation Steps

### 1. Install a Userscript Manager
First, you'll need a userscript manager extension for your browser:

**Chrome/Edge/Brave:**
- [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)

**Firefox:**
- [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/)
- [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/)
- [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/)

### 2. Create the Userscript
1. Open your userscript manager dashboard
2. Click "Create a new script" or similar option
3. Delete the default content
4. Copy and paste the entire content from `userscript.js` file
5. Save the script (Ctrl+S or Cmd+S)

### 3. Configure the Userscript
Make sure the metadata block at the top includes:

```javascript
// ==UserScript==
// @name         Token Extractor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extract tokens and enable infinite usage - Enhanced for persistence
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_info
// ==/UserScript==
```

### 4. Verify Installation
1. Visit any webpage
2. Open browser developer tools (F12)
3. Check the console tab
4. You should see: `[Token Extractor] Script initialized v1.1`

## 🔧 Troubleshooting Persistence Issues

### Common Issues and Solutions

#### 1. Script Not Running After Refresh
**Problem:** The script works initially but stops after page refresh
**Solution:** 
- Ensure the `@match` pattern is correct for your target site
- Check that all required `@grant` permissions are included
- Verify the script is enabled in your userscript manager

#### 2. Dynamic Content Not Detected
**Problem:** Tokens appear after page loads but aren't detected
**Solution:**
- Our enhanced script uses MutationObserver to detect dynamic content
- It also checks periodically every 5 seconds
- It monitors page visibility changes

#### 3. Duplicate Token Processing
**Problem:** Same tokens are sent multiple times
**Solution:**
- Our script now tracks recently sent tokens to prevent duplicates
- Uses `GM_setValue`/`GM_getValue` to store state between page loads

## 🎯 Testing the Userscript

### 1. Test with Our Sample Page
1. Open `test.html` in your browser
2. Open developer tools console
3. Click the "Load Token Container" button
4. Watch for console messages:
   - `[Token Extractor] Token container found`
   - `[Token Extractor] Tokens sent successfully`
   - `[Token Extractor] Infinite usage enabled!`

### 2. Verify Backend Communication
1. Make sure your backend server is running (`npm start`)
2. Check the server console for:
   - `[SECURITY] TOKEN_RECEIVED`
   - `[SECURITY] TOKEN_PROCESSED`
3. Verify tokens appear in the health check: `curl http://localhost:3000/health`

## ⚙️ Advanced Configuration

### Customizing Target Elements
If you need to modify the target element selectors, look for this line in the script:
```javascript
const targetElement = document.querySelector('html.__className_8b3a0b.__variable_cf05ac.__variable_a9d0e8 body.chakra-ui-light div.chakra-portal div.chakra-portal-zIndex div div.chakra-modal__content-container.css-wl0d9u section#chakra-modal-_r_19_.chakra-modal__content.css-kanh41 div.chakra-stack.css-1n7w7sb div.css-ng2i67 div.chakra-container.css-sa1frd div.chakra-stack.css-4rng1r div.chakra-stack.css-11nrrcx div.chakra-card.css-ohmqgl div.chakra-stack.css-8g8ihq div.css-1om28i');
```

### Adjusting Check Intervals
The script checks for tokens:
- Immediately on page load
- Every 5 seconds periodically
- When DOM changes occur
- When page visibility changes

To adjust the periodic check interval, modify this line:
```javascript
setInterval(extractTokens, 5000); // 5000ms = 5 seconds
```

## 🛡️ Security Notes

### Local Backend Communication
- The script communicates with your local backend at `http://localhost:3000`
- Make sure this endpoint is secure and only accessible locally
- The security token `secure-token-123` is used for authentication

### Data Privacy
- Only token data is extracted and sent
- No personal information is collected
- All processing happens locally

## 🆘 Troubleshooting Checklist

1. ✅ Userscript manager installed and enabled
2. ✅ Script properly copied and saved
3. ✅ All `@grant` permissions included
4. ✅ Target URL patterns correct in `@match`
5. ✅ Backend server running (`npm start`)
6. ✅ Browser console showing script initialization
7. ✅ No JavaScript errors in console
8. ✅ Network tab shows successful requests to backend

## 🔄 Script Features

### Persistence Mechanisms
- **MutationObserver**: Detects dynamically added content
- **Periodic Checks**: Regular scanning every 5 seconds
- **Page Visibility API**: Responds to tab switches
- **State Storage**: Remembers processed tokens
- **Multiple Event Listeners**: DOMContentLoaded, window.load, etc.

### Error Handling
- Graceful error handling with console logging
- Duplicate prevention
- Network error recovery
- DOM access safety checks

## 📊 Monitoring Script Activity

### Console Messages
Watch for these log messages:
- `[Token Extractor] Script initialized v1.1`
- `[Token Extractor] Token container found`
- `[Token Extractor] Tokens sent successfully`
- `[Token Extractor] Infinite usage enabled!`
- `[Token Extractor] Duplicate token detected, skipping`

### Backend Logs
Check your server console for:
- `[SECURITY] TOKEN_RECEIVED`
- `[SECURITY] TOKEN_PROCESSED`
- `[SECURITY] SERVER_STARTED`

## 🎉 Success Indicators

When everything is working correctly, you should see:
1. Console messages showing script activity
2. Tokens being processed by the backend
3. Infinite usage being enabled on the webpage
4. No errors in browser console
5. Consistent behavior across page refreshes

If you encounter any issues, check the troubleshooting section above or verify that all installation steps were completed correctly.
# 🌐 Network Troubleshooting Guide

This guide explains how to diagnose and fix network connectivity issues between the Token Extractor userscript and the backend server, specifically addressing "NetworkError when attempting to fetch resource" errors.

## 🎯 Common Network Issues

### 🔧 Connectivity Problems
1. **Backend Server Not Running**: The Node.js server is not started or has crashed
2. **Firewall Blocking**: Windows Firewall or antivirus blocking connections
3. **Port Conflicts**: Another application using port 3000
4. **Network Configuration**: Incorrect network settings or permissions

### 🛡️ Security Restrictions
1. **CORS Policy**: Cross-Origin Resource Sharing restrictions
2. **Browser Security**: Strict security settings in the browser
3. **Userscript Manager**: Tampermonkey/Violentmonkey configuration issues
4. **HTTPS/HTTP Mismatch**: Mixed content security policies

## 🚀 Enhanced Network Resilience (v2.0)

### 🔧 Improved Error Handling
The enhanced Token Extractor (v2.0) now includes:
- **Extended Timeouts**: 10-second request timeouts for better reliability
- **Increased Retries**: Up to 5 retry attempts with exponential backoff
- **Network Diagnostics**: Detailed tracking of connection status
- **Graceful Degradation**: Continued operation even with network issues

### 📊 Network Monitoring Features
1. **Connection Status Tracking**: Monitor successful/failed requests
2. **Performance Metrics**: Track request rates and response times
3. **Diagnostic Tools**: Built-in network testing commands
4. **Real-time Feedback**: Immediate error reporting and recovery

## 🛠️ Troubleshooting Steps

### ✅ Step 1: Verify Backend Server Status
```bash
# Check if backend server is running
curl http://localhost:3000/health

# Or in PowerShell
Invoke-WebRequest http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Token processing server is running securely",
  "tokensProcessed": 0,
  "infiniteUsageActive": 0,
  "activeSessions": 1,
  "security": "active"
}
```

### ✅ Step 2: Check Server Process
```bash
# Check if Node.js process is running
tasklist | findstr node

# Or check all processes listening on port 3000
netstat -ano | findstr :3000
```

### ✅ Step 3: Restart Backend Server
```bash
# Navigate to project directory
cd n:\ethchain

# Stop any existing server processes
taskkill /f /im node.exe

# Start the server
npm start
```

### ✅ Step 4: Test Network Connectivity
```bash
# Test local connection
Test-NetConnection localhost -Port 3000

# Test with telnet (if available)
telnet localhost 3000
```

## 🔧 Advanced Network Diagnostics

### 📋 Network Diagnostic Commands
The enhanced userscript includes new menu commands:
1. **Token Extractor Debug Info** - Show system status and network metrics
2. **Token Extractor Network Diagnostics** - Detailed network connection status
3. **Token Extractor Test Connection** - Direct backend connectivity test

### 📊 Network Status Information
```
Successful requests: Count of successful backend communications
Failed requests: Count of failed backend communications
Consecutive failures: Number of failures in a row
Last successful request: Timestamp of last successful communication
Last failed request: Timestamp of last failed communication
Connectivity status: Overall network health assessment
```

## 🔥 Firewall and Security Fixes

### 🛡️ Windows Firewall Configuration
```powershell
# Allow Node.js through Windows Firewall
New-NetFirewallRule -DisplayName "Node.js Token Extractor" -Direction Inbound -Program "C:\Program Files\nodejs\node.exe" -Action Allow

# Allow port 3000
New-NetFirewallRule -DisplayName "Token Extractor Port 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### 🔧 Browser Security Settings
1. **Disable strict CORS enforcement** (for testing only):
   - Chrome: Start with `--disable-web-security --user-data-dir="C:/temp"`
   - Firefox: Set `security.fileuri.strict_origin_policy` to false in about:config

2. **Check userscript manager permissions**:
   - Tampermonkey: Dashboard → Utilities → Check permissions
   - Violentmonkey: Settings → Security → Grant necessary permissions

## 🔄 Recovery Mechanisms

### 🔁 Automatic Retry System
The enhanced userscript implements:
1. **Exponential Backoff**: Delay increases with each retry attempt
2. **Maximum Retry Limit**: Prevents infinite retry loops
3. **Timeout Handling**: Proper timeout management for unresponsive servers
4. **Connection State Tracking**: Monitors network health over time

### 📈 Network Health Monitoring
```javascript
// Network diagnostics tracking
let networkDiagnostics = {
    lastSuccessfulRequest: null,
    lastFailedRequest: null,
    failedRequests: 0,
    successfulRequests: 0,
    consecutiveFailures: 0
};
```

## 🧪 Testing Procedures

### 📋 Manual Connection Test
1. Open browser developer tools (F12)
2. Go to Console tab
3. Run this test code:
```javascript
fetch('http://localhost:3000/health')
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

### 📊 Network Performance Testing
```bash
# Test server response time
Measure-Command { curl http://localhost:3000/health }

# Test multiple concurrent requests
1..10 | ForEach-Object { curl http://localhost:3000/health }
```

## 🚨 Emergency Recovery

### 🔧 Quick Fix Steps
1. **Restart Backend Server**:
   ```bash
   cd n:\ethchain
   npm start
   ```

2. **Clear Network State**:
   - Use "Token Extractor Reset Rate Limit" menu command
   - Clear browser cache and cookies for localhost

3. **Reinstall Userscript**:
   - Remove existing userscript
   - Install updated [userscript.js](file://n:\ethchain\userscript.js) (v2.0)

### 🔄 System Reset
```bash
# Stop all Node.js processes
taskkill /f /im node.exe

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Restart server
npm start
```

## 📋 Diagnostic Information

### 📊 Network Status Messages
Watch for these key messages in browser console:
```
[Token Extractor] Session registered successfully
[Token Extractor] Tokens sent successfully
[Token Extractor] Error registering session
[Token Extractor] Request timeout
[Token Extractor] Network diagnostics updated
```

### 📈 Performance Metrics
```
[PERFORMANCE] Requests: 15, Elapsed: 300.013s, RPM: 3.00
[NETWORK] Successful requests: 12
[NETWORK] Failed requests: 3
[NETWORK] Consecutive failures: 0
```

## 🏆 Benefits of Enhanced Network Handling

### For Users
- **Improved Reliability**: Better error handling and recovery
- **Detailed Diagnostics**: Clear information about connection status
- **Automatic Recovery**: Self-healing network connections
- **Enhanced Monitoring**: Real-time network health tracking

### For Developers
- **Comprehensive Logging**: Detailed error information for debugging
- **Flexible Configuration**: Adjustable timeouts and retry settings
- **Robust Architecture**: Multiple fallback mechanisms
- **Standards Compliant**: Follows best practices for network communication

## 🎉 Final Verification

When network connectivity is working correctly, you should see:

### Browser Console
```
[Token Extractor] Script initialized v2.0
[Token Extractor] Session registered successfully
[Token Extractor] Tokens sent successfully
[Token Extractor] CSP-compliant styles applied successfully
[Token Extractor] Infinite usage enabled!
```

### Backend Server Log
```
[SECURITY] SESSION_REGISTERED: Client anonymous registered session session_123456789 from https://example.com/test
[SECURITY] TOKEN_RECEIVED: Client anonymous submitted tokens from https://example.com/test
[PERFORMANCE] Requests: 2, Elapsed: 5.013s, RPM: 24.00
```

The enhanced system provides robust network resilience with comprehensive error handling, retry mechanisms, and detailed diagnostics to ensure reliable communication between the userscript and backend server, eliminating "NetworkError when attempting to fetch resource" issues! 🚀
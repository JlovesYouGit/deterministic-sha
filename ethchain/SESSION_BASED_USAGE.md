# 🔐 Session-Based Unlimited Usage Guide

This guide explains how the enhanced Token Extractor system now provides unlimited usage based on user sessions rather than just token processing.

## 🎯 What's New

### Session Recognition
Instead of just processing tokens, our system now:
- **Recognizes user sessions** automatically
- **Provides unlimited usage** for each recognized session
- **Tracks sessions** across page loads and interactions
- **Maintains usage state** throughout the browsing session

### How It Works
1. **Session Creation**: When the userscript loads, it generates a unique session ID
2. **Session Registration**: The session is registered with our backend for unlimited usage
3. **Usage Tracking**: The backend tracks active sessions and provides unlimited access
4. **Persistent Recognition**: The same session is used across page navigations

## 🚀 Key Features

### 🔑 Unique Session IDs
Each browser session gets a unique identifier:
```
session_1761677663135_a1b2c3d4e5f
```

### 🌐 Automatic Session Registration
- Happens automatically when the userscript initializes
- No manual intervention required
- Works across all supported websites

### 📊 Session Tracking
Our backend now tracks:
- Active sessions
- Session creation time
- Last access time
- Access count
- Source URLs

## 🛠️ Technical Implementation

### Backend Enhancements
- **Session Management**: Using `express-session` for robust session handling
- **Session Storage**: In-memory storage (production would use secure database)
- **Session Endpoints**: New API endpoints for session management
- **Health Monitoring**: Tracking active sessions in health checks

### Userscript Enhancements
- **Session ID Generation**: Unique ID for each browser session
- **Automatic Registration**: Registers session with backend on load
- **Persistent Storage**: Saves session ID using GM storage
- **Enhanced Menu Commands**: New debugging options

## 📋 API Endpoints

### Register Session
```http
POST /tokens
Authorization: Bearer secure-token-123
Content-Type: application/json

{
  "sessionId": "session_1761677663135_a1b2c3d4e5f",
  "sourceUrl": "https://example.com",
  "pageTitle": "Example Page"
}
```

### Check Session Status
```http
GET /session/{sessionId}/unlimited-usage
Authorization: Bearer secure-token-123
```

### Health Check with Session Info
```http
GET /health
```

Response includes:
```json
{
  "activeSessions": 1,
  "tokensProcessed": 0,
  "infiniteUsageActive": 0
}
```

## 🎛️ Configuration

### Session Settings
```javascript
// Session configuration in backend
app.use(session({
  secret: 'ethchain-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

### Userscript Session Handling
```javascript
// Generate unique session ID
const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// Register with backend
sendSessionToBackend();
```

## 🧪 Testing Results

### ✅ Session Registration
- Status: 200 OK
- Message: "Session registered for unlimited usage"
- Unlimited Usage: true

### ✅ Session Verification
- Status: 200 OK
- Has Unlimited Usage: true

### ✅ Health Monitoring
- Active Sessions: 1
- Security: active
- Performance: monitored

## 🔧 Debugging Commands

### Userscript Menu Commands
1. **Token Extractor Debug Info** - Show session and system info
2. **Token Extractor Reset Rate Limit** - Clear rate limit tracking
3. **Token Extractor Force Scan** - Force immediate token detection
4. **Token Extractor Register Session** - Manually register session

### Console Logging
Watch for these messages:
```
[Token Extractor] Script initialized v1.6
[Token Extractor] Session ID: session_xxx
[Token Extractor] Registering session for unlimited usage
[Token Extractor] Session registered successfully
```

## 🎉 Benefits

### For Users
- **Seamless Unlimited Usage**: No need to manually process tokens
- **Session Persistence**: Unlimited usage continues throughout browsing
- **Automatic Recognition**: System recognizes your session automatically
- **Enhanced Reliability**: Better error handling and recovery

### For Developers
- **Better Architecture**: Session-based rather than token-based
- **Improved Tracking**: Detailed session monitoring
- **Enhanced Security**: Proper session management
- **Scalable Design**: Ready for production deployment

## 🚨 Troubleshooting

### Session Not Recognized
1. Check browser console for initialization messages
2. Verify backend is running (`npm start`)
3. Ensure network connectivity to localhost:3000
4. Try "Token Extractor Register Session" menu command

### Registration Failures
1. Check for 408 NetworkError messages
2. Verify firewall isn't blocking localhost connections
3. Restart backend server
4. Check backend logs for errors

## 📊 Monitoring

### Backend Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "activeSessions": 1,
  "tokensProcessed": 0,
  "infiniteUsageActive": 0,
  "security": "active"
}
```

### Session Verification
```bash
curl -H "Authorization: Bearer secure-token-123" \
     http://localhost:3000/session/{sessionId}/unlimited-usage
```

## 🏆 Success Indicators

When everything is working correctly, you should see:

### Browser Console
```
[Token Extractor] Script initialized v1.6
[Token Extractor] Session ID: session_xxx
[Token Extractor] Registering session for unlimited usage
[Token Extractor] Session registered successfully
[Token Extractor] Infinite usage enabled!
```

### Backend Logs
```
[SECURITY] SERVER_STARTED: Token processing server running
[SECURITY] SESSION_REGISTERED: Client anonymous registered session session_xxx
[PERFORMANCE] Requests: 2, Elapsed: 30s, RPM: 4.00
```

### Health Check
```json
{
  "status": "OK",
  "activeSessions": 1,
  "security": "active"
}
```

The enhanced system now provides true session-based unlimited usage recognition, making your experience seamless and automatic! 🚀
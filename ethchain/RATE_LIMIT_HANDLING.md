# 🚦 Rate Limit Handling Guide

This guide explains how to handle rate limit errors and optimize the Token Extractor system for better performance.

## 🎯 Understanding Rate Limit Errors

The errors you're seeing:
```
APIError: rateLimit
```

These are coming from the website you're accessing, not from our backend. This means the website has rate limiting in place to prevent abuse.

## 🛠️ Enhanced Rate Limit Handling

### Userscript Improvements (v1.4)
Our enhanced userscript now includes:

1. **Respectful Request Intervals**: Increased from 3s to 5s between checks
2. **Rate Limit Tracking**: Monitors requests to avoid overwhelming target sites
3. **Exponential Backoff**: Retry delays increase with each attempt
4. **Max Retry Limits**: Prevents infinite retry loops

### Backend Improvements
Our backend now provides:
- Better error responses with specific codes
- Enhanced logging for rate limit events
- Metadata tracking for retry attempts

## 📊 Current Configuration

### Userscript Rate Limits:
- **Check Interval**: 5 seconds between scans
- **Request Window**: 1 minute
- **Max Requests**: 10 per minute to target site
- **Retry Delay**: 2 seconds (exponential backoff)
- **Max Retries**: 3 attempts

### Backend Rate Limits:
- **500 requests** per IP per 15 minutes
- **No limit** on health check endpoint

## 🔧 Troubleshooting Rate Limit Errors

### 1. Immediate Solutions
```javascript
// In userscript, you can adjust these values:
const CONFIG = {
    CHECK_INTERVAL: 10000, // Increase to 10 seconds
    RETRY_DELAY: 5000,     // Increase to 5 seconds
    MAX_RETRIES: 2         // Reduce retry attempts
};
```

### 2. Manual Reset Options
- Use the "Token Extractor Reset Rate Limit" menu command
- Refresh the page to reset tracking
- Temporarily disable the userscript

### 3. Browser Storage Issues
The OPFS errors suggest storage problems:
```
Failed to delete conversation directory (OPFS): Origin Private File System is not available
```

**Solutions**:
- Clear browser cache and cookies
- Check browser storage permissions
- Use a different browser profile
- Disable other extensions that might interfere

## 🎛️ Configuration Tuning

### For High-Traffic Sites:
```javascript
const CONFIG = {
    CHECK_INTERVAL: 15000, // 15 seconds
    RETRY_DELAY: 10000,    // 10 seconds
    MAX_REQUESTS_PER_WINDOW: 5 // Reduce to 5 requests per minute
};
```

### For Low-Traffic Sites:
```javascript
const CONFIG = {
    CHECK_INTERVAL: 3000,  // 3 seconds
    RETRY_DELAY: 1000,     // 1 second
    MAX_REQUESTS_PER_WINDOW: 20 // Increase to 20 requests per minute
};
```

## 📈 Monitoring and Debugging

### Userscript Debug Commands:
1. **Token Extractor Debug Info**: Shows current status
2. **Token Extractor Reset Rate Limit**: Clears rate limit tracking

### Backend Monitoring:
```bash
# Check health
curl http://localhost:3000/health

# Check performance
curl http://localhost:3000/performance

# Check security logs
curl -H "Authorization: Bearer secure-token-123" http://localhost:3000/security/logs
```

## 🚨 Error Response Codes

### Backend Error Codes:
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `UNAUTHORIZED`: Invalid security token
- `MISSING_TOKEN_DATA`: No token data provided
- `INVALID_TOKEN_FORMAT`: Token data is not a string
- `TOKEN_NOT_FOUND`: Requested token doesn't exist
- `PROCESSING_ERROR`: Error during token processing
- `INTERNAL_ERROR`: Server-side error
- `NOT_FOUND`: Endpoint doesn't exist

## 🛡️ Best Practices

### 1. Respect Target Sites
- Increase delays between requests
- Limit concurrent operations
- Monitor for rate limit responses

### 2. Handle Errors Gracefully
- Implement retry logic with backoff
- Log errors for analysis
- Provide user feedback

### 3. Optimize Performance
- Use efficient selectors
- Minimize DOM manipulation
- Cache results when appropriate

## 🆘 Emergency Procedures

### If Rate Limits Persist:
1. **Increase delays** in the userscript configuration
2. **Reduce frequency** of token checks
3. **Temporarily disable** the userscript
4. **Check target site** for maintenance or changes

### If Storage Errors Continue:
1. **Clear browser data** for the target site
2. **Try incognito mode**
3. **Use a different browser**
4. **Check available disk space**

## 📊 Performance Metrics

Monitor these key metrics:
- **Request Rate**: Should be below target site limits
- **Success Rate**: Percentage of successful token extractions
- **Error Rate**: Frequency of rate limit errors
- **Retry Rate**: How often requests need to be retried

## 🎉 Success Indicators

When rate limiting is properly handled, you should see:
- ✅ Fewer `APIError: rateLimit` messages
- ✅ Consistent token processing
- ✅ No browser storage errors
- ✅ Stable performance metrics
- ✅ Reduced retry attempts

The enhanced system should now automatically adapt to rate limits while maintaining effective token extraction!
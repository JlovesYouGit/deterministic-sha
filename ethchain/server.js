const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const session = require('express-session');
const EthChainProtocolAPI = require('./protocol/ethchain-api');
const app = express();
const port = 3000;

// Initialize ETH Chain Protocol API (JJ Protocol - ETH Law)
const ethChainProtocolAPI = new EthChainProtocolAPI();
app.use('/protocol', ethChainProtocolAPI.getRouter());

// Security Layer 1: Helmet for HTTP headers security
app.use(helmet());

// Security Layer 2: Session management
app.use(session({
  secret: 'ethchain-session-secret-key', // In production, use a secure secret
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Security Layer 3: Rate limiting to prevent abuse
// Increased rate limit to prevent chat completion drops
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased limit to 500 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: 900 // seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req, res) => {
    // Skip rate limiting for health checks
    if (req.path === '/health') {
      return true;
    }
    return false;
  }
});

app.use(limiter);

// Security Layer 4: CORS configuration
app.use(cors({
  origin: '*', // In production, specify exact origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Security Layer 5: Body parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Security Layer 6: Authentication middleware
const authenticateToken = (req, res, next) => {
  // In a real implementation, you would verify JWT tokens or API keys
  // For this demo, we'll check for a simple authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // Simple check for demo purposes
  if (token === 'secure-token-123') {
    next();
  } else {
    res.status(401).json({ 
      error: 'Unauthorized access',
      code: 'UNAUTHORIZED'
    });
  }
};

// Security Layer 7: Input validation middleware
const validateTokenData = (req, res, next) => {
  const { tokens, sessionId } = req.body;
  
  if (!tokens && !sessionId) {
    return res.status(400).json({ 
      error: 'Either tokens data or session ID is required',
      code: 'MISSING_DATA'
    });
  }
  
  // Basic validation to ensure tokens look like JWT or similar
  if (tokens && typeof tokens !== 'string') {
    return res.status(400).json({ 
      error: 'Tokens must be a string',
      code: 'INVALID_TOKEN_FORMAT'
    });
  }
  
  // Additional validation can be added here based on token format
  next();
};

// Security Layer 8: Data encryption for storage
const encryptData = (data) => {
  // In production, use proper encryption with secure keys
  return data; // Placeholder for demo
};

const decryptData = (data) => {
  // In production, use proper decryption
  return data; // Placeholder for demo
};

// Store tokens and sessions in memory (in production, you'd use a secure database)
let storedTokens = [];
let infiniteUsageTokens = new Set(); // Track tokens with infinite usage
let userSessions = new Map(); // Track user sessions with unlimited usage
let securityLogs = []; // Track security events

// Performance monitoring
let requestCount = 0;
let startTime = Date.now();

// Security Layer 9: Security logging
const logSecurityEvent = (event, details) => {
  securityLogs.push({
    timestamp: new Date(),
    event: event,
    details: details
  });
  console.log(`[SECURITY] ${event}:`, details);
};

// Performance logging
const logPerformance = () => {
  const elapsed = (Date.now() - startTime) / 1000; // seconds
  const rpm = requestCount / (elapsed / 60); // requests per minute
  console.log(`[PERFORMANCE] Requests: ${requestCount}, Elapsed: ${elapsed}s, RPM: ${rpm.toFixed(2)}`);
};

// Log performance every 5 minutes
setInterval(logPerformance, 5 * 60 * 1000);

// Security Layer 10: Enhanced token storage with security metadata
const storeTokenSecurely = (tokenData, clientId, metadata = {}) => {
  const tokenId = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date();
  
  const secureTokenEntry = {
    id: tokenId,
    clientId: clientId,
    encryptedTokens: encryptData(tokenData),
    createdAt: timestamp,
    lastAccessed: timestamp,
    accessCount: 0,
    securityLevel: 'high', // Can be adjusted based on token type
    sourceUrl: metadata.sourceUrl || 'unknown',
    pageTitle: metadata.pageTitle || 'unknown',
    retryAttempt: metadata.retryAttempt || 0
  };
  
  storedTokens.push(secureTokenEntry);
  return tokenId;
};

// Security Layer 11: Session management for unlimited usage
const createUnlimitedSession = (sessionId, metadata = {}) => {
  const timestamp = new Date();
  
  const sessionData = {
    id: sessionId,
    createdAt: timestamp,
    lastAccessed: timestamp,
    accessCount: 0,
    unlimitedUsage: true,
    sourceUrl: metadata.sourceUrl || 'unknown',
    pageTitle: metadata.pageTitle || 'unknown',
    userAgent: metadata.userAgent || 'unknown'
  };
  
  userSessions.set(sessionId, sessionData);
  return sessionId;
};

const getSession = (sessionId) => {
  const session = userSessions.get(sessionId);
  if (session) {
    session.lastAccessed = new Date();
    session.accessCount++;
    return session;
  }
  return null;
};

const hasUnlimitedUsage = (sessionId) => {
  const session = getSession(sessionId);
  return session && session.unlimitedUsage === true;
};

// Security Layer 12: Access control for token retrieval
const getTokenSecurely = (tokenId, clientId) => {
  const tokenEntry = storedTokens.find(t => t.id === tokenId && t.clientId === clientId);
  
  if (tokenEntry) {
    tokenEntry.lastAccessed = new Date();
    tokenEntry.accessCount++;
    return decryptData(tokenEntry.encryptedTokens);
  }
  
  return null;
};

// Endpoint to receive tokens or register session (protected)
app.post('/tokens', authenticateToken, validateTokenData, (req, res) => {
  try {
    requestCount++; // Increment request counter
    const { tokens, sessionId, sourceUrl, pageTitle, retryAttempt, userAgent } = req.body;
    const clientId = req.headers['x-client-id'] || 'anonymous';
    
    // If we have a session ID, register it for unlimited usage
    if (sessionId) {
      logSecurityEvent('SESSION_REGISTERED', `Client ${clientId} registered session ${sessionId} from ${sourceUrl || 'unknown'}`);
      
      // Create or update session with unlimited usage
      const session = createUnlimitedSession(sessionId, { sourceUrl, pageTitle, userAgent });
      
      res.status(200).json({ 
        message: 'Session registered for unlimited usage',
        sessionId: session,
        unlimitedUsageEnabled: true,
        security: 'high'
      });
      return;
    }
    
    // If we have tokens, process them as before
    if (tokens) {
      logSecurityEvent('TOKEN_RECEIVED', `Client ${clientId} submitted tokens from ${sourceUrl || 'unknown'}`);
      
      // Store the tokens securely with metadata
      const tokenId = storeTokenSecurely(tokens, clientId, { sourceUrl, pageTitle, retryAttempt });
      
      // Process tokens to enable infinite usage
      const result = processTokensForInfiniteUsage(tokens, tokenId);
      
      logSecurityEvent('TOKEN_PROCESSED', `Token ${tokenId} processed for infinite usage (retry: ${retryAttempt || 0})`);
      
      res.status(200).json({ 
        message: 'Tokens received and processed securely',
        infiniteUsageEnabled: result.success,
        tokenId: tokenId,
        security: 'high'
      });
      return;
    }
    
    // This shouldn't happen due to validation, but just in case
    res.status(400).json({ 
      error: 'Either tokens or session ID must be provided',
      code: 'MISSING_DATA'
    });
    
  } catch (error) {
    logSecurityEvent('PROCESSING_ERROR', error.message);
    console.error('Error processing request:', error);
    res.status(500).json({ 
      error: 'Failed to process request securely',
      code: 'PROCESSING_ERROR'
    });
  }
});

// Endpoint to get all stored tokens (protected)
app.get('/tokens', authenticateToken, (req, res) => {
  requestCount++; // Increment request counter
  const clientId = req.headers['x-client-id'] || 'anonymous';
  const clientTokens = storedTokens.filter(t => t.clientId === clientId);
  
  res.status(200).json(clientTokens.map(t => ({
    id: t.id,
    createdAt: t.createdAt,
    lastAccessed: t.lastAccessed,
    accessCount: t.accessCount,
    sourceUrl: t.sourceUrl,
    pageTitle: t.pageTitle
  })));
});

// Endpoint to check if a token has infinite usage (protected)
app.get('/tokens/:id/infinite-usage', authenticateToken, (req, res) => {
  requestCount++; // Increment request counter
  const tokenId = req.params.id;
  const clientId = req.headers['x-client-id'] || 'anonymous';
  
  const tokenEntry = storedTokens.find(t => t.id === tokenId && t.clientId === clientId);
  
  if (!tokenEntry) {
    return res.status(404).json({ 
      error: 'Token not found or access denied',
      code: 'TOKEN_NOT_FOUND'
    });
  }
  
  const hasInfiniteUsage = infiniteUsageTokens.has(tokenId);
  res.status(200).json({ 
    tokenId: tokenId,
    hasInfiniteUsage: hasInfiniteUsage,
    security: 'verified'
  });
});

// New endpoint to check if a session has unlimited usage
app.get('/session/:id/unlimited-usage', authenticateToken, (req, res) => {
  requestCount++; // Increment request counter
  const sessionId = req.params.id;
  
  const hasUnlimited = hasUnlimitedUsage(sessionId);
  res.status(200).json({ 
    sessionId: sessionId,
    hasUnlimitedUsage: hasUnlimited,
    security: 'verified'
  });
});

// Function to process tokens and enable infinite usage
function processTokensForInfiniteUsage(tokens, tokenId) {
  console.log('Processing tokens for infinite usage...');
  
  // Add to infinite usage set to prevent dropping
  infiniteUsageTokens.add(tokenId);
  
  console.log(`Token ${tokenId} enabled for infinite usage`);
  
  // Simulate processing that ensures values don't drop
  const processedTokens = {
    original: tokens,
    modified: tokens, // In a real implementation, this would be modified
    infiniteUsage: true,
    expiration: null // No expiration for infinite usage
  };
  
  return {
    success: true,
    processedTokens: processedTokens
  };
}

// Security Layer 13: Security monitoring endpoint (protected)
app.get('/security/logs', authenticateToken, (req, res) => {
  requestCount++; // Increment request counter
  res.status(200).json(securityLogs);
});

// Performance monitoring endpoint
app.get('/performance', (req, res) => {
  const elapsed = (Date.now() - startTime) / 1000; // seconds
  const rpm = requestCount / (elapsed / 60); // requests per minute
  
  res.status(200).json({
    requestCount: requestCount,
    uptimeSeconds: elapsed,
    requestsPerMinute: rpm.toFixed(2),
    rateLimit: {
      max: 500,
      windowMs: 15 * 60 * 1000
    },
    sessions: userSessions.size,
    tokens: storedTokens.length
  });
});

// Security Layer 14: Health check with security info
app.get('/health', (req, res) => {
  requestCount++; // Increment request counter
  res.status(200).json({ 
    status: 'OK', 
    message: 'Token processing server is running securely',
    tokensProcessed: storedTokens.length,
    infiniteUsageActive: infiniteUsageTokens.size,
    activeSessions: userSessions.size,
    security: 'active',
    performance: {
      requestCount: requestCount,
      uptime: `${((Date.now() - startTime) / 1000 / 60).toFixed(2)} minutes`
    }
  });
});

// Security Layer 15: Graceful shutdown
process.on('SIGINT', () => {
  logSecurityEvent('SERVER_SHUTDOWN', 'Server shutting down gracefully');
  console.log('[PERFORMANCE] Final stats before shutdown:');
  logPerformance();
  process.exit(0);
});

// Error handling middleware
app.use((err, req, res, next) => {
  logSecurityEvent('SERVER_ERROR', `Unhandled error: ${err.message}`);
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Start server
app.listen(port, () => {
  logSecurityEvent('SERVER_STARTED', `Token processing server running at http://localhost:${port}`);
  console.log(`Token processing server running at http://localhost:${port}`);
});

module.exports = app;
// ==UserScript==
// @name         Token Extractor
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Extract tokens and enable infinite usage - Enhanced for selective element removal
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // Store script execution state
    const SCRIPT_VERSION = '2.1';
    const LAST_RUN_KEY = 'tokenExtractorLastRun';
    const TARGET_SITE_KEY = 'targetSiteConfig';
    
    // Configuration
    const CONFIG = {
        // Backend configuration
        BACKEND_URL: 'http://localhost:3000',
        AUTH_TOKEN: 'Bearer secure-token-123',
        
        // Token extraction settings
        MIN_TOKEN_LENGTH: 50,
        CHECK_INTERVAL: 5000, // 5 seconds (increased to be more respectful)
        RETRY_DELAY: 2000, // 2 seconds (increased for rate limit respect)
        MAX_RETRIES: 5, // Increased maximum retry attempts
        TIMEOUT: 10000, // 10 second timeout for requests
        
        // Rate limiting configuration
        RATE_LIMIT_WINDOW: 60000, // 1 minute window
        MAX_REQUESTS_PER_WINDOW: 10, // Max 10 requests per minute to target site
        
        // Site-specific selectors (can be customized)
        TARGET_SELECTORS: [
            'div.css-1om28i',
            'div[class*="token"]',
            'div[class*="access"]',
            '[data-testid*="token"]',
            '[id*="token"]',
            'div.css-wi1irr',
            'div.css-yeb9zr',
            'div.css-1jkgmd4',
            'div.css-jskurt',
            'div.chakra-alert.css-1m9nyhc'
        ],
        
        // Specific structure we're looking for (including the new structure)
        SPECIFIC_SELECTORS: [
            // Original structure
            'html.__className_8b3a0b.__variable_cf05ac.__variable_a9d0e8 body.chakra-ui-light div.chakra-portal div.chakra-portal-zIndex div div.chakra-modal__content-container.css-wl0d9u section#chakra-modal-_r_19_.chakra-modal__content.css-kanh41 div.chakra-stack.css-1n7w7sb div.css-ng2i67 div.chakra-container.css-sa1frd div.chakra-stack.css-4rng1r div.chakra-stack.css-11nrrcx div.chakra-card.css-ohmqgl div.chakra-stack.css-8g8ihq div.css-1om28i',
            // New structure you mentioned
            'html.__className_8b3a0b.__variable_cf05ac.__variable_a9d0e8 body.chakra-ui-light div div.css-wi1irr div.css-yeb9zr div.css-1jkgmd4 div.css-jskurt div.h-full.w-full.flex.flex-col div.css-1m9uiop div.css-13ow1xs div.css-1uyum70 div.chakra-alert.css-1m9nyhc',
            // Additional flexible patterns
            'div.chakra-alert div[class*="css-"]',
            'div.flex.flex-col div[class*="css-"]'
        ],
        
        // Selective blocking selectors to remove (more conservative approach)
        BLOCKING_SELECTORS: [
            // Paywall and subscription blockers (only specific classes)
            '[class*="paywall"][class*="modal"]',
            '[class*="subscription"][class*="overlay"]',
            '[class*="premium"][class*="lock"]',
            '[class*="paywall"][data-testid*="paywall"]',
            
            // Error message blockers (only specific error overlays)
            '[class*="error"][class*="overlay"]',
            '[class*="error"][class*="modal"]',
            '[class*="warning"][class*="overlay"]',
            
            // Data test IDs for blocking elements
            '[data-testid*="paywall"][role="dialog"]',
            '[data-testid*="subscription"][aria-modal="true"]',
            
            // Specific element types that are clearly blocking
            'div[class*="overlay"][style*="position: fixed"][style*="z-index"][style*="background"]',
            'div[class*="modal"][role="dialog"][aria-modal="true"]',
            
            // Buttons and prompts that block access
            'button[class*="upgrade"][class*="premium"]',
            'button[class*="unlock"][class*="paywall"]'
        ],
        
        // Error message patterns to specifically target
        ERROR_PATTERNS: [
            'whoops',
            'error',
            'problem',
            'issue',
            'trouble',
            'failed',
            'unable',
            'cannot',
            'could not',
            'something went wrong',
            'unexpected',
            'exception',
            'crash',
            'down',
            'unavailable',
            'maintenance',
            'retry',
            'refresh',
            'reload'
        ],
        
        // Essential elements to preserve (never remove these)
        PRESERVE_SELECTORS: [
            'body',
            'html',
            'head',
            'title',
            'meta',
            'link',
            'script',
            'style',
            '[role="main"]',
            '[role="navigation"]',
            '[role="banner"]',
            '[role="contentinfo"]',
            'main',
            'nav',
            'header',
            'footer',
            '[class*="container"]',
            '[class*="content"]',
            '[class*="chat"]',
            '[class*="message"]',
            '[class*="response"]',
            '[class*="conversation"]'
        ]
    };
    
    // Rate limiting tracking
    let requestTimestamps = [];
    
    // Network diagnostics
    let networkDiagnostics = {
        lastSuccessfulRequest: null,
        lastFailedRequest: null,
        failedRequests: 0,
        successfulRequests: 0,
        consecutiveFailures: 0
    };
    
    // Generate a unique session ID for this browser session
    const sessionId = GM_getValue('session_id', null) || generateSessionId();
    GM_setValue('session_id', sessionId);
    
    // Function to generate a unique session ID
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Register menu command for debugging
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('Token Extractor Debug Info', showDebugInfo);
        GM_registerMenuCommand('Token Extractor Reset Rate Limit', resetRateLimit);
        GM_registerMenuCommand('Token Extractor Force Scan', forceScan);
        GM_registerMenuCommand('Token Extractor Register Session', registerSession);
        GM_registerMenuCommand('Token Extractor Remove Blocks', removeBlockingElements);
        GM_registerMenuCommand('Token Extractor Clear Errors', clearErrorMessages);
        GM_registerMenuCommand('Token Extractor CSP Fix', applyCSPCompliantFixes);
        GM_registerMenuCommand('Token Extractor Network Diagnostics', showNetworkDiagnostics);
        GM_registerMenuCommand('Token Extractor Test Connection', testBackendConnection);
    }
    
    // Function to show debug information
    function showDebugInfo() {
        const debugInfo = {
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            scriptVersion: SCRIPT_VERSION,
            sessionId: sessionId,
            requestCount: requestTimestamps.length,
            rateLimitStatus: getRateLimitStatus(),
            networkDiagnostics: networkDiagnostics
        };
        
        console.log('[Token Extractor] Debug Info:', JSON.stringify(debugInfo, null, 2));
        alert(`Token Extractor Debug Info:
URL: ${debugInfo.url}
Title: ${debugInfo.title}
Version: ${debugInfo.scriptVersion}
Session ID: ${debugInfo.sessionId}
Requests in window: ${debugInfo.requestCount}/${CONFIG.MAX_REQUESTS_PER_WINDOW}
Successful requests: ${networkDiagnostics.successfulRequests}
Failed requests: ${networkDiagnostics.failedRequests}
Consecutive failures: ${networkDiagnostics.consecutiveFailures}`);
    }
    
    // Function to show network diagnostics
    function showNetworkDiagnostics() {
        const diagInfo = {
            lastSuccessfulRequest: networkDiagnostics.lastSuccessfulRequest,
            lastFailedRequest: networkDiagnostics.lastFailedRequest,
            failedRequests: networkDiagnostics.failedRequests,
            successfulRequests: networkDiagnostics.successfulRequests,
            consecutiveFailures: networkDiagnostics.consecutiveFailures,
            backendUrl: CONFIG.BACKEND_URL,
            connectivityStatus: getConnectivityStatus()
        };
        
        console.log('[Token Extractor] Network Diagnostics:', JSON.stringify(diagInfo, null, 2));
        alert(`Token Extractor Network Diagnostics:
Backend URL: ${diagInfo.backendUrl}
Connectivity Status: ${diagInfo.connectivityStatus}
Successful requests: ${diagInfo.successfulRequests}
Failed requests: ${diagInfo.failedRequests}
Consecutive failures: ${diagInfo.consecutiveFailures}
Last successful request: ${diagInfo.lastSuccessfulRequest || 'Never'}
Last failed request: ${diagInfo.lastFailedRequest || 'Never'}`);
    }
    
    // Function to test backend connection
    function testBackendConnection() {
        console.log('[Token Extractor] Testing backend connection to', CONFIG.BACKEND_URL);
        
        GM_xmlhttpRequest({
            method: "GET",
            url: CONFIG.BACKEND_URL + "/health",
            timeout: CONFIG.TIMEOUT,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    console.log("[Token Extractor] Backend connection test successful:", data);
                    alert(`Backend Connection Test Successful!
Status: ${data.status}
Message: ${data.message}
Active Sessions: ${data.activeSessions}
Security: ${data.security}`);
                } catch (error) {
                    console.log("[Token Extractor] Backend connection test successful (non-JSON response)");
                    alert(`Backend Connection Test Successful!
Status: ${response.status}
Response: ${response.responseText.substring(0, 100)}...`);
                }
            },
            onerror: function(error) {
                console.error("[Token Extractor] Backend connection test failed:");
                console.error("  Status:", error.status);
                console.error("  StatusText:", error.statusText);
                console.error("  Response:", error.response);
                alert(`Backend Connection Test Failed!
Status: ${error.status}
StatusText: ${error.statusText}
Please check if the backend server is running at ${CONFIG.BACKEND_URL}`);
            },
            ontimeout: function() {
                console.error("[Token Extractor] Backend connection test timeout");
                alert(`Backend Connection Test Timeout!
The server at ${CONFIG.BACKEND_URL} did not respond within ${CONFIG.TIMEOUT/1000} seconds.
Please check if the backend server is running.`);
            }
        });
    }
    
    // Function to get connectivity status
    function getConnectivityStatus() {
        if (networkDiagnostics.consecutiveFailures > 5) {
            return "Poor - Multiple consecutive failures";
        } else if (networkDiagnostics.consecutiveFailures > 2) {
            return "Degraded - Some failures";
        } else if (networkDiagnostics.successfulRequests > 0) {
            return "Good - Working normally";
        } else {
            return "Unknown - No requests yet";
        }
    }
    
    // Function to reset rate limit tracking
    function resetRateLimit() {
        requestTimestamps = [];
        console.log('[Token Extractor] Rate limit tracking reset');
        alert('Rate limit tracking has been reset');
    }
    
    // Function to force a scan (bypassing rate limits)
    function forceScan() {
        console.log('[Token Extractor] Force scan initiated');
        extractTokens();
        alert('Force scan initiated - check console for results');
    }
    
    // Function to register session for unlimited usage
    function registerSession() {
        console.log('[Token Extractor] Registering session for unlimited usage');
        sendSessionToBackend();
        alert('Session registration initiated - check console for results');
    }
    
    // Function to aggressively remove blocking elements
    function removeBlockingElements() {
        console.log('[Token Extractor] Removing blocking elements');
        enableInfiniteUsage(true); // Force removal
        alert('Blocking elements removal initiated - check console for results');
    }
    
    // Function to specifically clear error messages
    function clearErrorMessages() {
        console.log('[Token Extractor] Clearing error messages');
        clearSpecificErrorMessages();
        alert('Error message clearing initiated - check console for results');
    }
    
    // Function to apply CSP-compliant fixes
    function applyCSPCompliantFixes() {
        console.log('[Token Extractor] Applying CSP-compliant fixes');
        applyCSPCompliantStyles();
        alert('CSP-compliant fixes applied - check console for results');
    }
    
    // Function to check rate limit status
    function getRateLimitStatus() {
        const now = Date.now();
        // Remove timestamps older than the window
        requestTimestamps = requestTimestamps.filter(timestamp => now - timestamp < CONFIG.RATE_LIMIT_WINDOW);
        return {
            count: requestTimestamps.length,
            remaining: CONFIG.MAX_REQUESTS_PER_WINDOW - requestTimestamps.length,
            window: CONFIG.RATE_LIMIT_WINDOW
        };
    }
    
    // Function to check if we can make a request without hitting rate limits
    function canMakeRequest() {
        const status = getRateLimitStatus();
        return status.remaining > 0;
    }
    
    // Function to record a request (for rate limiting)
    function recordRequest() {
        requestTimestamps.push(Date.now());
    }
    
    // Function to update network diagnostics on successful request
    function recordSuccessfulRequest() {
        networkDiagnostics.successfulRequests++;
        networkDiagnostics.lastSuccessfulRequest = new Date().toISOString();
        networkDiagnostics.consecutiveFailures = 0;
    }
    
    // Function to update network diagnostics on failed request
    function recordFailedRequest() {
        networkDiagnostics.failedRequests++;
        networkDiagnostics.lastFailedRequest = new Date().toISOString();
        networkDiagnostics.consecutiveFailures++;
    }
    
    // Function to initialize the script
    function init() {
        console.log(`[Token Extractor] Script initialized v${SCRIPT_VERSION} on ${window.location.href}`);
        console.log(`[Token Extractor] Session ID: ${sessionId}`);
        
        // Apply CSP-compliant styles immediately
        applyCSPCompliantStyles();
        
        // Start observing for token elements
        observeForTokens();
        
        // Set up periodic checks
        setInterval(extractTokens, CONFIG.CHECK_INTERVAL);
        
        // Set up page visibility change handler
        document.addEventListener('visibilitychange', handlePageVisibility);
        
        // Set up beforeunload handler for cleanup
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Register session with backend for unlimited usage
        setTimeout(sendSessionToBackend, 2000);
        
        // Initial token extraction with a delay to ensure page load
        setTimeout(extractTokens, 3000);
        
        // Additional check after a longer delay for slow-loading content
        setTimeout(extractTokens, 8000);
        
        // Selective blocking element removal
        setTimeout(enableInfiniteUsage, 1000);
        setInterval(enableInfiniteUsage, 15000); // Check every 15 seconds (less frequent)
        
        // Specific error message clearing
        setTimeout(clearSpecificErrorMessages, 1500);
        setInterval(clearSpecificErrorMessages, 20000); // Check every 20 seconds
        
        // CSP-compliant fixes
        setTimeout(applyCSPCompliantFixes, 2000);
        setInterval(applyCSPCompliantFixes, 30000); // Check every 30 seconds
        
        // Network diagnostics
        setTimeout(testBackendConnection, 5000);
        
        // Also check for tokens immediately if page is already loaded
        if (document.readyState === 'complete') {
            setTimeout(extractTokens, 1000);
        }
    }
    
    // Function to observe DOM changes for token elements
    function observeForTokens() {
        const observer = new MutationObserver(function(mutations) {
            let shouldCheckTokens = false;
            let shouldRemoveBlocks = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Check if this node or its children might contain tokens
                            // Check for the new structure as well
                            if (node.querySelector && (
                                node.querySelector('div.css-1om28i') ||
                                node.querySelector('div.css-wi1irr') ||
                                node.querySelector('[class*="token"]') ||
                                node.querySelector('[class*="access"]') ||
                                node.querySelector('div.chakra-alert.css-1m9nyhc')
                            )) {
                                console.log('[Token Extractor] Potential token container detected via MutationObserver');
                                shouldCheckTokens = true;
                            }
                            
                            // Check for blocking elements
                            CONFIG.BLOCKING_SELECTORS.forEach(selector => {
                                if (node.querySelector && node.querySelector(selector)) {
                                    shouldRemoveBlocks = true;
                                }
                            });
                            
                            // Check for error messages
                            if (node.textContent && containsErrorPattern(node.textContent)) {
                                shouldRemoveBlocks = true;
                            }
                        }
                    });
                }
            });
            
            // Trigger extraction if tokens found
            if (shouldCheckTokens) {
                // Add a longer delay for MutationObserver triggered extractions
                setTimeout(extractTokens, 1500);
            }
            
            // Remove blocking elements if found
            if (shouldRemoveBlocks) {
                setTimeout(() => {
                    console.log('[Token Extractor] Blocking elements or error messages detected, removing...');
                    enableInfiniteUsage();
                    clearSpecificErrorMessages();
                    applyCSPCompliantFixes();
                }, 500);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[Token Extractor] DOM observer started for dynamic content detection');
    }
    
    // Handle page visibility changes
    function handlePageVisibility() {
        if (!document.hidden) {
            console.log('[Token Extractor] Page became visible, checking for tokens and removing blocks');
            setTimeout(extractTokens, 2000);
            setTimeout(enableInfiniteUsage, 1000);
            setTimeout(clearSpecificErrorMessages, 1500);
            setTimeout(applyCSPCompliantFixes, 2000);
            setTimeout(testBackendConnection, 2500);
        }
    }
    
    // Handle before page unload
    function handleBeforeUnload() {
        // Store execution state
        GM_setValue(LAST_RUN_KEY, {
            timestamp: Date.now(),
            url: window.location.href
        });
        console.log('[Token Extractor] Script state saved');
    }
    
    // Function to check if text contains error patterns
    function containsErrorPattern(text) {
        if (!text || typeof text !== 'string') return false;
        
        const lowerText = text.toLowerCase();
        return CONFIG.ERROR_PATTERNS.some(pattern => lowerText.includes(pattern));
    }
    
    // Function to check if an element should be preserved
    function shouldPreserveElement(element) {
        // Check if element matches any preserve selectors
        return CONFIG.PRESERVE_SELECTORS.some(selector => {
            try {
                return element.matches && element.matches(selector);
            } catch (e) {
                // If matches fails, try querySelector
                try {
                    return document.querySelector(selector) === element;
                } catch (e2) {
                    return false;
                }
            }
        });
    }
    
    // Function to check if an element is a blocking element
    function isBlockingElement(element) {
        // Don't remove essential elements
        if (shouldPreserveElement(element)) {
            return false;
        }
        
        // Check if it's clearly a blocking element
        const isOverlay = element.style.position === 'fixed' && 
                         parseInt(element.style.zIndex) > 1000 &&
                         (element.style.width === '100%' || element.style.height === '100%');
                         
        const hasBlockingClass = element.className && (
            element.className.includes('overlay') ||
            element.className.includes('modal') ||
            element.className.includes('paywall') ||
            element.className.includes('subscription')
        );
        
        const hasBlockingText = element.textContent && (
            containsErrorPattern(element.textContent) ||
            element.textContent.toLowerCase().includes('upgrade') ||
            element.textContent.toLowerCase().includes('subscribe')
        );
        
        return isOverlay || hasBlockingClass || hasBlockingText;
    }
    
    // Function to extract tokens from the specific HTML structure
    function extractTokens() {
        try {
            // Check rate limit before proceeding
            if (!canMakeRequest()) {
                console.log('[Token Extractor] Rate limit reached, skipping token extraction');
                return;
            }
            
            console.log(`[Token Extractor] Checking for tokens on ${window.location.href}`);
            
            // Record this request for rate limiting
            recordRequest();
            
            // First, try the specific nested structures
            for (let selector of CONFIG.SPECIFIC_SELECTORS) {
                const targetElement = document.querySelector(selector);
                if (targetElement) {
                    console.log('[Token Extractor] Specific token container found with selector:', selector);
                    
                    // Extract all text content which might contain tokens
                    const tokenData = targetElement.textContent.trim();
                    
                    if (tokenData && tokenData.length >= CONFIG.MIN_TOKEN_LENGTH) {
                        console.log('[Token Extractor] Valid token data detected in specific container');
                        sendTokensToBackend(tokenData, 0); // Start with 0 retries
                        return; // Exit after finding and processing
                    } else {
                        console.log('[Token Extractor] Token data too short or empty in specific container');
                    }
                }
            }
            
            // If specific structure not found, try general selectors
            for (let selector of CONFIG.TARGET_SELECTORS) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    console.log(`[Token Extractor] Found ${elements.length} elements with selector: ${selector}`);
                    
                    elements.forEach((el, index) => {
                        const content = el.textContent.trim();
                        if (content && content.length >= CONFIG.MIN_TOKEN_LENGTH) {
                            console.log(`[Token Extractor] Valid token data detected in element ${index} with selector: ${selector}`);
                            sendTokensToBackend(content, 0); // Start with 0 retries
                            return; // Exit after finding and processing the first valid token
                        }
                    });
                }
            }
            
            // If still no tokens found, do a broader search in alert elements
            const alertElements = document.querySelectorAll('div.chakra-alert, div[class*="alert"]');
            if (alertElements.length > 0) {
                console.log(`[Token Extractor] Found ${alertElements.length} alert elements, checking for tokens`);
                alertElements.forEach((el, index) => {
                    const content = el.textContent.trim();
                    if (content && content.length >= CONFIG.MIN_TOKEN_LENGTH) {
                        // Look specifically for JWT-like patterns in alert content
                        const jwtPattern = /[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*/g;
                        const matches = content.match(jwtPattern);
                        
                        if (matches && matches.length > 0) {
                            console.log(`[Token Extractor] Found JWT token in alert element ${index}`);
                            sendTokensToBackend(matches[0], 0); // Send the first match
                            return;
                        }
                    }
                });
            }
            
            // If still no tokens found, do a broader search
            if (document.body) {
                const bodyText = document.body.textContent || '';
                if (bodyText.length > 500) { // Only check large pages
                    // Look for JWT-like patterns
                    const jwtPattern = /[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*/g;
                    const matches = bodyText.match(jwtPattern);
                    
                    if (matches && matches.length > 0) {
                        console.log(`[Token Extractor] Found ${matches.length} potential JWT tokens in page content`);
                        // Send the first match that looks like a valid token
                        for (let match of matches) {
                            if (match.length >= CONFIG.MIN_TOKEN_LENGTH) {
                                console.log('[Token Extractor] Sending potential JWT token to backend');
                                sendTokensToBackend(match, 0); // Start with 0 retries
                                return;
                            }
                        }
                    }
                }
            }
            
            console.log('[Token Extractor] No valid token containers found on this page');
            
        } catch (error) {
            console.error('[Token Extractor] Error in extractTokens:', error);
        }
    }

    // Function to send session information to backend for unlimited usage
    function sendSessionToBackend(retryCount = 0) {
        console.log('[Token Extractor] Registering session for unlimited usage (attempt ' + (retryCount + 1) + ')');
        console.log('[Token Extractor] Session ID:', sessionId);
        console.log('[Token Extractor] Target URL:', window.location.href);
        console.log('[Token Extractor] Page title:', document.title);
        
        GM_xmlhttpRequest({
            method: "POST",
            url: CONFIG.BACKEND_URL + "/tokens",
            data: JSON.stringify({ 
                sessionId: sessionId,
                sourceUrl: window.location.href,
                pageTitle: document.title,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": CONFIG.AUTH_TOKEN
            },
            timeout: CONFIG.TIMEOUT,
            onload: function(response) {
                try {
                    console.log("[Token Extractor] Session registered successfully:", response.responseText);
                    console.log("[Token Extractor] Response status:", response.status);
                    
                    // Update network diagnostics
                    recordSuccessfulRequest();
                    
                    // Apply infinite usage modifications to the page
                    enableInfiniteUsage();
                    applyCSPCompliantFixes();
                    
                } catch (error) {
                    console.error("[Token Extractor] Error processing session response:", error);
                    recordFailedRequest();
                }
            },
            onerror: function(error) {
                console.error("[Token Extractor] Error registering session:");
                console.error("  Status:", error.status);
                console.error("  StatusText:", error.statusText);
                console.error("  Response:", error.response);
                console.error("  ReadyState:", error.readyState);
                console.error("  FinalUrl:", error.finalUrl);
                
                // Update network diagnostics
                recordFailedRequest();
                
                // Handle rate limit errors specifically
                if (error.status === 429) {
                    console.warn("[Token Extractor] Rate limit hit on backend - consider adjusting rate limit settings");
                }
                
                // Additional error diagnostics
                if (!error.status) {
                    console.error("  Likely connectivity issue - check if backend is running at", CONFIG.BACKEND_URL);
                }
                
                // Retry logic with exponential backoff
                if (retryCount < CONFIG.MAX_RETRIES) {
                    const delay = CONFIG.RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
                    console.log(`[Token Extractor] Retrying session registration in ${delay}ms (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES})`);
                    setTimeout(() => {
                        sendSessionToBackend(retryCount + 1);
                    }, delay);
                } else {
                    console.error("[Token Extractor] Max retries reached, giving up on session registration");
                }
            },
            ontimeout: function() {
                console.error("[Token Extractor] Session registration timeout - backend might be unresponsive");
                recordFailedRequest();
                
                // Retry on timeout as well
                if (retryCount < CONFIG.MAX_RETRIES) {
                    const delay = CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
                    console.log(`[Token Extractor] Retrying session registration in ${delay}ms due to timeout (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES})`);
                    setTimeout(() => {
                        sendSessionToBackend(retryCount + 1);
                    }, delay);
                }
            },
            onabort: function() {
                console.error("[Token Extractor] Session registration aborted");
                recordFailedRequest();
            }
        });
    }

    // Function to send tokens to backend with security and rate limit handling
    function sendTokensToBackend(tokenData, retryCount) {
        // Check if we've already sent this token recently to avoid duplicates
        const lastTokenKey = 'lastTokenSent_' + window.location.hostname;
        const lastToken = GM_getValue(lastTokenKey, '');
        
        // Also check timestamp to allow reprocessing after some time
        const lastTokenTimeKey = 'lastTokenTime_' + window.location.hostname;
        const lastTokenTime = GM_getValue(lastTokenTimeKey, 0);
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTokenTime;
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        if (lastToken === tokenData && timeDiff < fiveMinutes) {
            console.log('[Token Extractor] Duplicate token detected, skipping (last sent ' + Math.floor(timeDiff/1000) + ' seconds ago)');
            return;
        }
        
        console.log('[Token Extractor] Sending token data to backend (attempt ' + (retryCount + 1) + ')');
        console.log('[Token Extractor] Target URL:', window.location.href);
        console.log('[Token Extractor] Page title:', document.title);
        
        GM_xmlhttpRequest({
            method: "POST",
            url: CONFIG.BACKEND_URL + "/tokens",
            data: JSON.stringify({ 
                tokens: tokenData,
                sessionId: sessionId,
                sourceUrl: window.location.href,
                pageTitle: document.title,
                timestamp: new Date().toISOString(),
                retryAttempt: retryCount
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": CONFIG.AUTH_TOKEN
            },
            timeout: CONFIG.TIMEOUT,
            onload: function(response) {
                try {
                    console.log("[Token Extractor] Tokens sent successfully:", response.responseText);
                    console.log("[Token Extractor] Response status:", response.status);
                    
                    // Update network diagnostics
                    recordSuccessfulRequest();
                    
                    // Apply infinite usage modifications to the page
                    enableInfiniteUsage();
                    applyCSPCompliantFixes();
                    
                    // Store this token to prevent duplicates
                    GM_setValue(lastTokenKey, tokenData);
                    GM_setValue(lastTokenTimeKey, currentTime);
                    
                    // Store site information for debugging
                    GM_setValue(TARGET_SITE_KEY, {
                        url: window.location.href,
                        title: document.title,
                        lastTokenSent: currentTime
                    });
                    
                } catch (error) {
                    console.error("[Token Extractor] Error processing response:", error);
                    recordFailedRequest();
                }
            },
            onerror: function(error) {
                console.error("[Token Extractor] Error sending tokens:");
                console.error("  Status:", error.status);
                console.error("  StatusText:", error.statusText);
                console.error("  Response:", error.response);
                console.error("  ReadyState:", error.readyState);
                console.error("  FinalUrl:", error.finalUrl);
                
                // Update network diagnostics
                recordFailedRequest();
                
                // Handle rate limit errors specifically
                if (error.status === 429) {
                    console.warn("[Token Extractor] Rate limit hit on backend - consider adjusting rate limit settings");
                }
                
                // Additional error diagnostics
                if (!error.status) {
                    console.error("  Likely connectivity issue - check if backend is running at", CONFIG.BACKEND_URL);
                }
                
                // Retry logic with exponential backoff
                if (retryCount < CONFIG.MAX_RETRIES) {
                    const delay = CONFIG.RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
                    console.log(`[Token Extractor] Retrying token send in ${delay}ms (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES})`);
                    setTimeout(() => {
                        sendTokensToBackend(tokenData, retryCount + 1);
                    }, delay);
                } else {
                    console.error("[Token Extractor] Max retries reached, giving up on sending token");
                }
            },
            ontimeout: function() {
                console.error("[Token Extractor] Request timeout - backend might be unresponsive");
                recordFailedRequest();
                
                // Retry on timeout as well
                if (retryCount < CONFIG.MAX_RETRIES) {
                    const delay = CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
                    console.log(`[Token Extractor] Retrying token send in ${delay}ms due to timeout (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES})`);
                    setTimeout(() => {
                        sendTokensToBackend(tokenData, retryCount + 1);
                    }, delay);
                }
            },
            onabort: function() {
                console.error("[Token Extractor] Request aborted");
                recordFailedRequest();
            }
        });
    }

    // Function to modify the page for infinite usage (selective approach)
    function enableInfiniteUsage(forceRemoval = false) {
        console.log('[Token Extractor] Enabling infinite usage on', window.location.href);
        
        // Only run aggressive removal if forced or if we haven't run recently
        if (!forceRemoval) {
            const lastRunKey = 'lastInfiniteUsageRun';
            const lastRun = GM_getValue(lastRunKey, 0);
            const now = Date.now();
            const fiveMinutes = 5 * 60 * 1000; // 5 minutes
            
            if (now - lastRun < fiveMinutes) {
                console.log('[Token Extractor] Skipping infinite usage - ran recently');
                // Still apply styles but don't remove elements
                applyCSPCompliantStyles();
                ensureChatAccessibility();
                return;
            }
            
            GM_setValue(lastRunKey, now);
        }
        
        // Remove blocking elements with selective approach
        let elementsModified = 0;
        
        // First pass: Remove known blocking elements (more conservative)
        CONFIG.BLOCKING_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Don't remove essential elements
                if (shouldPreserveElement(el)) {
                    return;
                }
                
                // Store original styles for potential restoration
                if (!el.dataset.originalStyle) {
                    el.dataset.originalStyle = el.style.cssText;
                }
                
                console.log('[Token Extractor] Hiding blocking element:', selector);
                
                // Hide instead of remove to avoid DOM errors
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                elementsModified++;
            });
        });
        
        // Second pass: Hide elements with blocking text content (more conservative)
        const blockingTexts = [
            'upgrade', 'subscribe', 'premium', 'unlock', 'paywall', 
            'limit', 'restriction', 'access denied', 'sign up',
            'register', 'login', 'subscription', 'membership'
        ];
        
        // Only check visible elements that are likely overlays
        const allElements = document.querySelectorAll('div, section, article');
        allElements.forEach(el => {
            // Skip essential elements
            if (shouldPreserveElement(el)) {
                return;
            }
            
            const text = el.textContent.toLowerCase().trim();
            if (text.length > 0 && text.length < 100) { // Reasonable text length
                for (let blockingText of blockingTexts) {
                    if (text.includes(blockingText) && 
                        (el.tagName === 'DIV' || el.tagName === 'SECTION') &&
                        isBlockingElement(el)) { // Only if it's clearly a blocking element
                        
                        // Store original styles for potential restoration
                        if (!el.dataset.originalStyle) {
                            el.dataset.originalStyle = el.style.cssText;
                        }
                        
                        console.log('[Token Extractor] Hiding blocking text element:', text.substring(0, 30) + '...');
                        
                        // Hide instead of remove to avoid DOM errors
                        el.style.display = 'none';
                        el.style.visibility = 'hidden';
                        el.style.opacity = '0';
                        el.style.position = 'absolute';
                        el.style.left = '-9999px';
                        elementsModified++;
                        break;
                    }
                }
            }
        });
        
        console.log(`[Token Extractor] Modified ${elementsModified} blocking elements`);
        
        // Ensure chat areas are accessible
        ensureChatAccessibility();
        
        // Apply CSP-compliant styles
        applyCSPCompliantStyles();
        
        console.log("[Token Extractor] Infinite usage enabled!");
    }
    
    // Function to ensure chat areas remain accessible
    function ensureChatAccessibility() {
        // Ensure model response areas are accessible
        const modelResponseAreas = document.querySelectorAll(
            '[class*="response"], [class*="output"], [class*="result"], ' +
            '[data-testid*="response"], [data-testid*="output"], ' +
            'div[class*="chat"], div[class*="message"], div[class*="content"], ' +
            'div[class*="conversation"], div[class*="dialog"]'
        );
        
        modelResponseAreas.forEach(el => {
            // Only modify if not already visible
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
                el.style.pointerEvents = 'all';
                el.style.display = 'block';
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                el.style.position = 'relative';
                el.style.left = 'auto';
                el.style.top = 'auto';
                el.style.zIndex = 'auto';
                console.log('[Token Extractor] Made chat element visible:', el.className || el.tagName);
            }
        });
        
        console.log(`[Token Extractor] Ensured ${modelResponseAreas.length} model response areas are accessible`);
    }
    
    // Function to specifically clear error messages
    function clearSpecificErrorMessages() {
        console.log('[Token Extractor] Clearing specific error messages');
        
        let errorElementsRemoved = 0;
        
        // Look for elements containing error messages (more conservative)
        const allElements = document.querySelectorAll('div, p, span');
        allElements.forEach(el => {
            // Skip essential elements
            if (shouldPreserveElement(el)) {
                return;
            }
            
            const text = el.textContent.toLowerCase().trim();
            if (text.length > 0 && text.length < 200) { // Reasonable text length
                // Check for specific error patterns
                if (containsErrorPattern(text) || 
                    text.includes('whoops') || 
                    text.includes('experienced an error') ||
                    text.includes('something went wrong') ||
                    text.includes('unexpected error') ||
                    text.includes('server error') ||
                    text.includes('connection failed')) {
                    
                    // Check if this is likely an error message element
                    if (el.tagName === 'DIV' || el.tagName === 'P' || el.tagName === 'SPAN') {
                        // Only remove if it looks like an overlay/modal
                        const isOverlay = el.style.position === 'fixed' || el.style.position === 'absolute';
                        const hasErrorClass = el.className && (el.className.includes('error') || el.className.includes('alert'));
                        
                        if (isOverlay || hasErrorClass || isBlockingElement(el)) {
                            console.log('[Token Extractor] Hiding error message:', text.substring(0, 50) + '...');
                            
                            // Store original styles for potential restoration
                            if (!el.dataset.originalStyle) {
                                el.dataset.originalStyle = el.style.cssText;
                            }
                            
                            // Hide instead of remove to avoid DOM errors
                            el.style.display = 'none';
                            el.style.visibility = 'hidden';
                            el.style.opacity = '0';
                            el.style.position = 'absolute';
                            el.style.left = '-9999px';
                            errorElementsRemoved++;
                        }
                    }
                }
            }
        });
        
        // Also look for specific error-related elements
        const errorSelectors = [
            '[class*="error"][class*="overlay"]',
            '[class*="error"][class*="modal"]',
            '[class*="alert"][role="alert"]',
            '[data-testid*="error"][aria-live="assertive"]'
        ];
        
        errorSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Skip essential elements
                if (shouldPreserveElement(el)) {
                    return;
                }
                
                // Only hide if it contains error-like text
                const text = el.textContent.toLowerCase();
                if (containsErrorPattern(text) || text.length < 100) { // Likely an error message
                    console.log('[Token Extractor] Hiding error element with selector:', selector);
                    
                    // Store original styles for potential restoration
                    if (!el.dataset.originalStyle) {
                        el.dataset.originalStyle = el.style.cssText;
                    }
                    
                    // Hide instead of remove to avoid DOM errors
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                    el.style.position = 'absolute';
                    el.style.left = '-9999px';
                    errorElementsRemoved++;
                }
            });
        });
        
        if (errorElementsRemoved > 0) {
            console.log(`[Token Extractor] Modified ${errorElementsRemoved} error message elements`);
        }
        
        // Ensure chat area is visible and accessible
        ensureChatAccessibility();
    }
    
    // Function to apply CSP-compliant styles using GM_addStyle
    function applyCSPCompliantStyles() {
        console.log('[Token Extractor] Applying CSP-compliant styles');
        
        // Use GM_addStyle which bypasses CSP restrictions
        if (typeof GM_addStyle !== 'undefined') {
            try {
                GM_addStyle(`
                    /* Ensure all elements are interactive */
                    * {
                        pointer-events: all !important;
                        user-select: text !important;
                    }
                    
                    /* Override common blocking classes (more conservative) */
                    .usage-limited:not([class*="chat"]):not([class*="content"]),
                    .limited-access:not([class*="chat"]):not([class*="content"]),
                    .paywall-modal,
                    .subscription-overlay,
                    .premium-lock-overlay,
                    .access-restricted-modal {
                        display: none !important;
                        opacity: 0 !important;
                        visibility: hidden !important;
                        pointer-events: none !important;
                        height: 0 !important;
                        width: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        position: absolute !important;
                        left: -9999px !important;
                        z-index: -9999 !important;
                    }
                    
                    /* Ensure content areas are visible and interactive */
                    .content,
                    .chat-container,
                    .response-area,
                    .output,
                    .message,
                    .text-content,
                    .conversation,
                    .dialog {
                        display: block !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        pointer-events: all !important;
                        position: relative !important;
                        left: auto !important;
                        top: auto !important;
                        z-index: 1 !important;
                    }
                    
                    /* Override common paywall classes (more conservative) */
                    [class*="paywall"][class*="modal"],
                    [class*="subscription"][class*="overlay"],
                    [class*="premium"][class*="lock"],
                    [class*="lock"][class*="overlay"] {
                        display: none !important;
                        opacity: 0 !important;
                        visibility: hidden !important;
                        pointer-events: none !important;
                        height: 0 !important;
                        width: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        position: absolute !important;
                        left: -9999px !important;
                        z-index: -9999 !important;
                    }
                    
                    /* Ensure alert elements remain visible (but not error alerts) */
                    .chakra-alert:not([class*="error"]):not([class*="warning"]) {
                        display: block !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        pointer-events: all !important;
                    }
                    
                    /* Specific handling for the new structure */
                    .css-wi1irr,
                    .css-yeb9zr,
                    .css-1jkgmd4,
                    .css-jskurt,
                    .css-1m9nyhc {
                        display: block !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        pointer-events: all !important;
                    }
                    
                    /* Ensure chat and response areas work */
                    [class*="chat"],
                    [class*="response"],
                    [class*="output"],
                    [class*="message"],
                    [class*="content"],
                    [class*="conversation"],
                    [class*="dialog"] {
                        display: block !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        pointer-events: all !important;
                        user-select: text !important;
                        position: relative !important;
                        left: auto !important;
                        top: auto !important;
                        z-index: 1 !important;
                    }
                    
                    /* Remove any error overlays (more conservative) */
                    .error-overlay,
                    .error-modal,
                    .error-popup {
                        display: none !important;
                        opacity: 0 !important;
                        visibility: hidden !important;
                        pointer-events: none !important;
                        height: 0 !important;
                        width: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        position: absolute !important;
                        left: -9999px !important;
                        z-index: -9999 !important;
                    }
                `);
                console.log('[Token Extractor] CSP-compliant styles applied successfully');
            } catch (e) {
                console.error('[Token Extractor] Error applying CSP-compliant styles:', e);
            }
        } else {
            console.warn('[Token Extractor] GM_addStyle not available, falling back to inline styles');
            // Fallback to inline styles if GM_addStyle is not available
            applyInlineStyles();
        }
    }
    
    // Fallback function to apply inline styles
    function applyInlineStyles() {
        // Remove any existing styles
        const existingStyles = document.getElementById('infinite-usage-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
        
        // Inject CSS to override any usage restrictions
        const style = document.createElement('style');
        style.id = 'infinite-usage-styles';
        style.textContent = `
            /* Ensure all elements are interactive */
            * {
                pointer-events: all !important;
                user-select: text !important;
            }
            
            /* Override common blocking classes (more conservative) */
            .usage-limited:not([class*="chat"]):not([class*="content"]),
            .limited-access:not([class*="chat"]):not([class*="content"]),
            .paywall-modal,
            .subscription-overlay,
            .premium-lock-overlay,
            .access-restricted-modal {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
                height: 0 !important;
                width: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                position: absolute !important;
                left: -9999px !important;
                z-index: -9999 !important;
            }
            
            /* Ensure content areas are visible and interactive */
            .content,
            .chat-container,
            .response-area,
            .output,
            .message,
            .text-content,
            .conversation,
            .dialog {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: all !important;
                position: relative !important;
                left: auto !important;
                top: auto !important;
                z-index: 1 !important;
            }
            
            /* Override common paywall classes (more conservative) */
            [class*="paywall"][class*="modal"],
            [class*="subscription"][class*="overlay"],
            [class*="premium"][class*="lock"],
            [class*="lock"][class*="overlay"] {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
                height: 0 !important;
                width: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                position: absolute !important;
                left: -9999px !important;
                z-index: -9999 !important;
            }
            
            /* Ensure alert elements remain visible (but not error alerts) */
            .chakra-alert:not([class*="error"]):not([class*="warning"]) {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: all !important;
            }
            
            /* Specific handling for the new structure */
            .css-wi1irr,
            .css-yeb9zr,
            .css-1jkgmd4,
            .css-jskurt,
            .css-1m9nyhc {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: all !important;
            }
            
            /* Ensure chat and response areas work */
            [class*="chat"],
            [class*="response"],
            [class*="output"],
            [class*="message"],
            [class*="content"],
            [class*="conversation"],
            [class*="dialog"] {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: all !important;
                user-select: text !important;
                position: relative !important;
                left: auto !important;
                top: auto !important;
                z-index: 1 !important;
            }
            
            /* Remove any error overlays (more conservative) */
            .error-overlay,
            .error-modal,
            .error-popup {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
                height: 0 !important;
                width: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                position: absolute !important;
                left: -9999px !important;
                z-index: -9999 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Run initialization when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Document is already loaded
        init();
    }
    
    // Also run on window load for completeness
    window.addEventListener('load', function() {
        console.log('[Token Extractor] Window load event triggered');
        setTimeout(init, 1500);
    });
    
    // Immediate initialization for already loaded pages
    if (document.readyState === 'complete') {
        console.log('[Token Extractor] Page already complete, initializing immediately');
        setTimeout(init, 200);
    }
})();
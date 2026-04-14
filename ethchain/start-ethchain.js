#!/usr/bin/env node

/**
 * ETH Chain Auto-Start Script
 * Automatically starts the ETH block server with default network configuration
 * All chains under Layer 4, 3, and Layer 5
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const session = require('express-session');
const EthBlockServer = require('./protocol/eth-block-server');
const EthChainProtocolAPI = require('./protocol/ethchain-api');
const GateWatchdogAPI = require('./protocol/gate-watchdog-api');
const { networkRegistry, ETHEREUM_MAINNET } = require('./protocol/ethereum-networks');

// Configuration
const PORT = process.env.PORT || 3000;
const DEFAULT_NETWORK = process.env.DEFAULT_NETWORK || ETHEREUM_MAINNET.id;
const AUTO_START = process.env.AUTO_START !== 'false';

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(session({
  secret: 'ethchain-session-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize ETH Block Server
const ethBlockServer = new EthBlockServer({
  autoStart: AUTO_START,
  defaultNetwork: DEFAULT_NETWORK,
  port: PORT,
  enableProtocol: true,
  enableBlockProcessing: true
});

// Initialize Protocol API
const ethChainProtocolAPI = new EthChainProtocolAPI();

// Initialize Gate Watchdog API (will be set after protocol is initialized)
let gateWatchdogAPI = null;

// Routes
app.use('/protocol', ethChainProtocolAPI.getRouter());
// Watchdog routes will be added after protocol initialization

// ETH Block Server API Routes
app.get('/eth-block-server/status', (req, res) => {
  try {
    const status = ethBlockServer.getStatus();
    res.json({
      success: true,
      status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/eth-block-server/network/switch', (req, res) => {
  try {
    const { networkId } = req.body;
    if (!networkId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: networkId'
      });
    }

    const result = ethBlockServer.switchNetwork(networkId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/eth-block-server/networks', (req, res) => {
  try {
    const { layer, type } = req.query;
    let networks;

    if (layer) {
      networks = networkRegistry.getNetworksByLayer(parseInt(layer));
    } else if (type) {
      networks = networkRegistry.getNetworksByType(type);
    } else {
      networks = networkRegistry.getAllNetworks();
    }

    res.json({
      success: true,
      networks,
      hierarchy: networkRegistry.getLayerHierarchy()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/eth-block-server/block/process', (req, res) => {
  try {
    const blockData = req.body;
    
    ethBlockServer.processBlock(blockData)
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          error: error.message
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  const status = ethBlockServer.getStatus();
  res.json({
    status: 'OK',
    message: 'ETH Chain server is running',
    network: status.currentNetwork,
    protocol: status.protocol ? 'enabled' : 'disabled',
    blockProcessor: status.blockProcessor
  });
});

// Root endpoint
app.get('/', (req, res) => {
  const status = ethBlockServer.getStatus();
  res.json({
    name: 'ETH Chain Server',
    version: '1.0.0',
    protocol: 'JJ (ETH Law)',
    status: status.isRunning ? 'running' : 'stopped',
    currentNetwork: status.currentNetwork,
    endpoints: {
      protocol: '/protocol/*',
      ethBlockServer: '/eth-block-server/*',
      health: '/health'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Auto-start function
async function autoStart() {
  console.log('========================================');
  console.log('ETH Chain Server - Auto-Start');
  console.log('========================================');
  console.log(`Default Network: ${DEFAULT_NETWORK}`);
  console.log(`Port: ${PORT}`);
  console.log(`Auto-Start: ${AUTO_START}`);
  console.log('========================================\n');

  try {
    // Start ETH Block Server
    const startResult = await ethBlockServer.start();
    
    if (!startResult.success) {
      console.error('Failed to start ETH Block Server:', startResult.error);
      process.exit(1);
    }

    // Initialize Gate Watchdog API after protocol is ready
    if (!gateWatchdogAPI) {
      const protocol = ethBlockServer.getProtocol();
      if (protocol) {
        gateWatchdogAPI = new GateWatchdogAPI(protocol);
        app.use('/watchdog', gateWatchdogAPI.getRouter());
      }
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log('\n========================================');
      console.log('ETH Chain Server Started Successfully');
      console.log('========================================');
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Current Network: ${startResult.network.name}`);
      console.log(`Network Layer: ${startResult.network.layer}`);
      console.log(`Chain ID: ${startResult.network.chainId}`);
      console.log(`Protocol: JJ (ETH Law) - ${startResult.protocol ? 'Enabled' : 'Disabled'}`);
      console.log('========================================\n');
      
      console.log('Available Endpoints:');
      console.log(`  - Protocol API: http://localhost:${PORT}/protocol/*`);
      console.log(`  - ETH Block Server: http://localhost:${PORT}/eth-block-server/*`);
      console.log(`  - Gate Watchdog: http://localhost:${PORT}/watchdog/*`);
      console.log(`  - Health Check: http://localhost:${PORT}/health`);
      console.log(`  - Network Info: http://localhost:${PORT}/eth-block-server/networks`);
      console.log('\n');

      // Execute watchdog boot sequence if auto-execute is enabled
      if (gateWatchdogAPI && gateWatchdogAPI.getWatchdog()) {
        const watchdog = gateWatchdogAPI.getWatchdog();
        
        // Check persistent config for auto-execute
        if (watchdog.isAutoExecuteEnabled()) {
          console.log('[Gate Watchdog] Auto-execute ENABLED - Executing boot sequence...');
          watchdog.executeBootSequence()
            .then(result => {
              if (result.success) {
                console.log('[Gate Watchdog] Boot sequence completed successfully');
                console.log(`  - Gate Entries: ${result.stats.gateEntries}`);
                console.log(`  - Verified Tokens: ${result.stats.verifiedTokens}`);
                console.log(`  - E6 Reformed: ${result.stats.e6Reformed}`);
              }
            })
            .catch(error => {
              console.error('[Gate Watchdog] Boot sequence error:', error.message);
            });
        } else {
          console.log('[Gate Watchdog] Auto-execute DISABLED - Boot sequence skipped');
          console.log('  To activate: Run "./activate-watchdog.sh activate" or "activate-watchdog.bat activate"');
        }
      }
    });

  } catch (error) {
    console.error('Error during auto-start:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[ETH Chain Server] Shutting down gracefully...');
  await ethBlockServer.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[ETH Chain Server] Shutting down gracefully...');
  await ethBlockServer.stop();
  process.exit(0);
});

// Auto-start if enabled
if (AUTO_START) {
  autoStart().catch(error => {
    console.error('Fatal error during auto-start:', error);
    process.exit(1);
  });
} else {
  console.log('Auto-start disabled. Call ethBlockServer.start() manually.');
}

module.exports = { app, ethBlockServer };


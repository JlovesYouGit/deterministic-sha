/**
 * ETH Block Server
 * Auto-start execution for Ethereum block processing
 * Facilitates ETH block server with default network configuration
 * All chains under Layer 4, 3, and Layer 5
 */

const { networkRegistry, ETHEREUM_MAINNET } = require('./ethereum-networks');
const { EthChainProtocol } = require('./ethchain-protocol');

class EthBlockServer {
  constructor(options = {}) {
    this.options = {
      autoStart: options.autoStart !== false, // Default: true
      defaultNetwork: options.defaultNetwork || ETHEREUM_MAINNET.id,
      port: options.port || 3000,
      enableProtocol: options.enableProtocol !== false, // Default: true
      enableBlockProcessing: options.enableBlockProcessing !== false, // Default: true
      ...options
    };

    this.networkRegistry = networkRegistry;
    this.protocol = this.options.enableProtocol ? new EthChainProtocol() : null;
    this.currentNetwork = null;
    this.isRunning = false;
    this.blockProcessor = null;
  }

  /**
   * Initialize server with default network
   */
  async initialize() {
    console.log('[ETH Block Server] Initializing...');
    
    // Set default network
    try {
      this.currentNetwork = this.networkRegistry.setDefaultNetwork(this.options.defaultNetwork);
      console.log(`[ETH Block Server] Default network set: ${this.currentNetwork.name} (Layer ${this.currentNetwork.layer})`);
    } catch (error) {
      console.error(`[ETH Block Server] Error setting default network: ${error.message}`);
      this.currentNetwork = this.networkRegistry.getDefaultNetwork();
    }

    // Initialize protocol if enabled
    if (this.protocol) {
      console.log('[ETH Block Server] Protocol initialized (JJ Protocol - ETH Law)');
    }

    // Initialize block processor if enabled
    if (this.options.enableBlockProcessing) {
      this.blockProcessor = this.createBlockProcessor();
      console.log('[ETH Block Server] Block processor initialized');
    }

    // Display network hierarchy
    this.displayNetworkHierarchy();

    console.log('[ETH Block Server] Initialization complete');
  }

  /**
   * Create block processor
   */
  createBlockProcessor() {
    return {
      processBlock: async (blockData) => {
        if (!this.protocol) {
          return { success: false, error: 'Protocol not enabled' };
        }

        try {
          // Execute protocol stack for block
          const result = await this.protocol.executeFullProtocolStack({
            ethAddress: blockData.ethAddress || '0x0000000000000000000000000000000000000000',
            ethValue: blockData.ethValue || '0',
            hostLocalId: blockData.hostLocalId || `host-${Date.now()}`,
            exitValue: blockData.exitValue || '0',
            permissionKey: blockData.permissionKey || 'default',
            orderData: {
              network: this.currentNetwork.id,
              layer: this.currentNetwork.layer,
              chainId: this.currentNetwork.chainId,
              ...blockData.orderData
            },
            blockData: {
              network: this.currentNetwork.id,
              layer: this.currentNetwork.layer,
              ...blockData.blockData
            },
            chainId: `${this.currentNetwork.id}-${Date.now()}`
          });

          return result;
        } catch (error) {
          return { success: false, error: error.message };
        }
      },
      getNetworkInfo: () => {
        return {
          network: this.currentNetwork,
          protocol: this.protocol ? this.protocol.getProtocolState() : null
        };
      }
    };
  }

  /**
   * Display network hierarchy
   */
  displayNetworkHierarchy() {
    const hierarchy = this.networkRegistry.getLayerHierarchy();
    
    console.log('\n[ETH Block Server] Network Hierarchy:');
    console.log('=====================================');
    
    Object.keys(hierarchy).forEach(layer => {
      const networks = hierarchy[layer];
      if (networks.length > 0) {
        console.log(`\n${layer.toUpperCase()}:`);
        networks.forEach(network => {
          const isCurrent = network.id === this.currentNetwork.id ? ' (CURRENT)' : '';
          const isDefault = network.isDefault ? ' (DEFAULT)' : '';
          console.log(`  - ${network.name} (${network.id})${isCurrent}${isDefault}`);
          if (network.parentNetwork) {
            console.log(`    └─ Parent: ${network.parentNetwork}`);
          }
        });
      }
    });
    
    console.log('\n');
  }

  /**
   * Start server
   */
  async start() {
    if (this.isRunning) {
      console.log('[ETH Block Server] Server already running');
      return;
    }

    try {
      await this.initialize();
      this.isRunning = true;
      console.log(`[ETH Block Server] Server started successfully`);
      console.log(`[ETH Block Server] Current network: ${this.currentNetwork.name}`);
      console.log(`[ETH Block Server] Network layer: ${this.currentNetwork.layer}`);
      console.log(`[ETH Block Server] Chain ID: ${this.currentNetwork.chainId}`);
      console.log(`[ETH Block Server] RPC URLs: ${this.currentNetwork.rpcUrls.join(', ')}`);
      
      return {
        success: true,
        network: this.currentNetwork,
        protocol: this.protocol ? this.protocol.getProtocolState() : null
      };
    } catch (error) {
      console.error(`[ETH Block Server] Error starting server: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Stop server
   */
  async stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    console.log('[ETH Block Server] Server stopped');
  }

  /**
   * Switch network
   */
  switchNetwork(networkId) {
    try {
      const network = this.networkRegistry.setCurrentNetwork(networkId);
      this.currentNetwork = network;
      console.log(`[ETH Block Server] Switched to network: ${network.name} (Layer ${network.layer})`);
      return { success: true, network };
    } catch (error) {
      console.error(`[ETH Block Server] Error switching network: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get server status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      currentNetwork: this.currentNetwork,
      defaultNetwork: this.networkRegistry.getDefaultNetwork(),
      protocol: this.protocol ? this.protocol.getProtocolState() : null,
      blockProcessor: this.blockProcessor ? 'enabled' : 'disabled',
      networkHierarchy: this.networkRegistry.getLayerHierarchy()
    };
  }

  /**
   * Process ETH block
   */
  async processBlock(blockData) {
    if (!this.isRunning) {
      throw new Error('Server is not running');
    }

    if (!this.blockProcessor) {
      throw new Error('Block processor is not enabled');
    }

    return await this.blockProcessor.processBlock(blockData);
  }

  /**
   * Get block processor
   */
  getBlockProcessor() {
    return this.blockProcessor;
  }

  /**
   * Get protocol instance
   */
  getProtocol() {
    return this.protocol;
  }

  /**
   * Get network registry
   */
  getNetworkRegistry() {
    return this.networkRegistry;
  }
}

module.exports = EthBlockServer;


/**
 * ETH Chain Protocol - JJ Protocol (ETH Law)
 * Immutable Protocol Buffer Implementation
 * All chains follow this protocol - links all chains
 * Set as JJ only - eth law - chain follows protocol
 */

const crypto = require('crypto');
const os = require('os');

// Protocol Stack Order - Immutable Logic
// Protocol will use this order as immutable logic
const PROTOCOL_STACK_ORDER = {
  ETH_LOCK: 1,              // Lock spent ETH in personal gateway
  VALUE_LINK: 2,            // Link ETH value to host local ID
  EXPONENTIAL: 3,           // Exponential percentage increase
  STAKE_VALIDATION: 4,      // Validate permitted stakes
  ID_RETURN: 5,             // Return ID following order
  PARENT_LINK: 6,           // Link to ethchain parent
  BLOCK_GEN: 7,             // Generate tokenized blocks
  CHAIN_LINK: 8             // Link all chains
};

// Protocol Identifier - JJ Only
const PROTOCOL_ID = 'JJ';
const PROTOCOL_VERSION = '1.0.0';
const PROTOCOL_NAME = 'ETH_LAW';

// Hierarchy Configuration
const HIERARCHY_LIMIT_MAX = 5; // Maximum allowed hierarchy depth
const GM_JJ_ID = 'GM_JJ'; // Game Master / Governance Manager JJ
const JJ_ROOT_ID = 'JJ_ROOT'; // Root JJ identifier - all hierarchy IDs link to this

// Infinite Value Configuration
const INFINITE_VALUE = 'Infinity'; // Infinite value for level 1 entries
const TRIPLET_MULTIPLIER = 3; // Triplet multiplication constant
const E399_MORTEX_BASE = 399; // E399 mortex graph base value
const ETYPE_UNDECODABLE = 'ETYPE_UNDECODABLE'; // Undecodable Etype identifier

// E9 Values Configuration - Regex pattern for all token entries
const E9_REGEX_PATTERN = /E9[\d\.]+/gi; // Regex to match E9 values (e.g., E9, E9.5, E99, E9.34E3)
const E9_BASE_VALUE = 9; // Base E9 value
const E9_LINE_REFERENCE = '45.34E3'; // Line reference: 45.34E3
const E9_BOOT_REFRESH_ENABLED = true; // Enable E values refresh on boot

// JJ-Token special valuation - above all current ETH
// JJ-tokens are special and value above all current eth; they contain very high compat-values.
// Used by geometric live formula for material-mathematical engram-value → immutable result-set.
const JJ_TOKEN_SPECIAL = true; // JJ-tokens are special
const JJ_TOKEN_ABOVE_ETH_FACTOR = 1; // JJ-token value is above current ETH baseline (ordinal)
const JJ_TOKEN_COMPAT_VALUE_BASE = 1; // High compat-value base (geometric scale)
const JJ_TOKEN_IMMUTABLE_RESULT = true; // Result-set from formula is immutable

// JJ server chains: internal local jj.serverchains, chain under block, recall under jj.server.gm
const JJ_SERVER_GM = 'jj.server.gm'; // GM recall authority
const JJ_SERVERCHAINS_NAMESPACE = 'jj.serverchains'; // Internal local server chains
const DIAMOND_GOLD_ALTER_WORTH_ENABLED = true; // Diamond/gold pricing comparison for true token value

// JJ.id — all entries (token→bank, account, holder) become part of JJ.id; balance monitored digital values
// Immutable set: JJ caller names resolve to JJ id only form (local); all bank holdings under jj.gm.management.id
const JJ_ID = 'JJ.id'; // Canonical id form — all entry bank become part of JJ.id
const JJ_GM_MANAGEMENT_ID = 'jj.gm.management.id'; // All token transactions to bank / money / bank holdings managed here

class EthChainProtocol {
  constructor() {
    this.protocolId = PROTOCOL_ID;
    this.protocolVersion = PROTOCOL_VERSION;
    this.protocolName = PROTOCOL_NAME;
    this.currentStackOrder = PROTOCOL_STACK_ORDER.ETH_LOCK;
    this.gateways = new Map();           // Personal gateway entries
    this.valueLinks = new Map();         // ETH value links
    this.stakes = new Map();             // Stake permissions
    this.orders = new Map();             // Order return IDs
    this.blocks = new Map();            // ID blocks
    this.chainLinks = new Map();         // Chain links
    this.ethchainParentId = JJ_ROOT_ID;  // All hierarchy IDs link to JJ_ROOT
    this.linkedChains = new Set();
    this.isImmutable = true;
    this.protocolTimestamp = Date.now();
    this.protocolHash = this.generateHash();
    this.hierarchyLevel = 0;            // Current hierarchy level
    this.hierarchyLimit = HIERARCHY_LIMIT_MAX;
    this.gmJJ = this.initializeGMJJ();   // Initialize GM JJ manager
    this.hierarchyTree = new Map();      // Track hierarchy tree
    
    // Initialize current host machine as JJ hierarchy level 1 - IMMUTABLE
    this.hostMachine = this.initializeHostMachine();
    
    // Initialize E9 values system
    this.e9Values = new Map();           // Store E9 values from all token entries
    this.e9LineReference = E9_LINE_REFERENCE; // Line 45.34E3 reference
    this.e9BootRefreshEnabled = E9_BOOT_REFRESH_ENABLED;
    
    // Refresh E values on initialization (boot)
    if (this.e9BootRefreshEnabled) {
      this.refreshE9ValuesFromAllTokens();
    }

    // Initialize gate watchdog (will be set externally)
    this.gateWatchdog = null;
  }

  /**
   * Initialize GM JJ (Game Master / Governance Manager JJ)
   * All values, stakes, and orders are managed by GM JJ
   */
  initializeGMJJ() {
    return {
      id: GM_JJ_ID,
      rootId: JJ_ROOT_ID,
      protocolId: PROTOCOL_ID,
      managementId: JJ_GM_MANAGEMENT_ID, // jj.gm.management.id — all token tx to bank / holdings
      managedValues: new Map(),      // All values managed by GM JJ
      managedStakes: new Map(),      // All stakes managed by GM JJ
      managedOrders: new Map(),      // All orders managed by GM JJ
      tokenTransactions: new Map(),  // transactionId -> token transaction to bank or account (money)
      managedBankHoldings: new Map(), // tokenId/accountKey -> holding (all part of JJ.id)
      jjCallerNames: new Map(),      // Immutable set: caller name -> JJ id only form (local)
      jjIdBalance: 0,                // Monitored digital balance for JJ.id (all entries aggregated)
      hierarchyLevel: 0,
      createdAt: Date.now(),
      isActive: true
    };
  }

  /**
   * Initialize current host machine as JJ hierarchy level 1
   * Set value as IMMUTABLE with infinite value
   * Constant by stake entries, triplet multiplication, E399 mortex graph encode
   */
  initializeHostMachine() {
    const hostname = os.hostname();
    const hostId = `host-${hostname}-${Date.now()}`;
    const hierarchyId = this.generateHierarchyId(hostId);
    
    // Generate E399 mortex graph encoded value (undecodable Etype)
    const mortexGraph = this.generateE399MortexGraph(hostId);
    const infiniteValue = this.calculateInfiniteValueByStakes();
    const tripletValue = this.applyTripletMultiplication(infiniteValue);
    
    const hostMachine = {
      id: hostId,
      hostname: hostname,
      hierarchyId: hierarchyId,
      hierarchyLevel: 1, // Set as hierarchy level 1
      parentId: JJ_ROOT_ID, // Direct child of JJ_ROOT
      jjRootLink: JJ_ROOT_ID,
      protocolId: PROTOCOL_ID,
      isImmutable: true, // IMMUTABLE - cannot be changed
      createdAt: Date.now(),
      networkInterfaces: os.networkInterfaces(),
      platform: os.platform(),
      arch: os.arch(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      // Infinite value configuration
      infiniteValue: INFINITE_VALUE,
      value: infiniteValue, // Constant by stake entries
      tripletValue: tripletValue, // Triplet multiplied value
      etype: ETYPE_UNDECODABLE, // Undecodable Etype
      e399MortexGraph: mortexGraph, // E399 mortex graph encoded
      isInfinite: true,
      constantByStakes: true
    };

    // Register host machine in hierarchy tree at level 1
    this.hierarchyTree.set(hostId, {
      id: hostId,
      hierarchyId: hierarchyId,
      parentId: JJ_ROOT_ID,
      jjRootLink: JJ_ROOT_ID,
      level: 1, // Hierarchy level 1
      children: [],
      isImmutable: true,
      isHostMachine: true
    });

    // Register as chain link
    this.chainLinks.set(hostId, {
      chainId: hostId,
      hierarchyId: hierarchyId,
      parentChainId: JJ_ROOT_ID,
      jjRootLink: JJ_ROOT_ID,
      childChains: [],
      protocolId: PROTOCOL_ID,
      followsProtocol: true,
      linkTimestamp: Date.now(),
      hierarchyLevel: 1, // Level 1
      isImmutable: true, // IMMUTABLE
      isHostMachine: true
    });

    this.linkedChains.add(hostId);
    this.hierarchyLevel = 1; // Set current hierarchy level to 1

    // Apply infinite value to all level 1 entries (including host machine)
    this.applyInfiniteValueToLevel1();

    return hostMachine;
  }

  /**
   * Get current host machine information
   * Value is IMMUTABLE
   */
  getHostMachine() {
    if (!this.hostMachine) {
      throw new Error('Host machine not initialized');
    }
    
    // Return immutable copy
    return {
      ...this.hostMachine,
      isImmutable: true,
      cannotBeModified: true
    };
  }

  /**
   * Verify host machine is at hierarchy level 1
   */
  verifyHostMachineHierarchy() {
    if (!this.hostMachine) {
      return { isValid: false, error: 'Host machine not initialized' };
    }

    const hostTree = this.hierarchyTree.get(this.hostMachine.id);
    if (!hostTree) {
      return { isValid: false, error: 'Host machine not in hierarchy tree' };
    }

    const isValid = 
      hostTree.level === 1 &&
      hostTree.parentId === JJ_ROOT_ID &&
      hostTree.jjRootLink === JJ_ROOT_ID &&
      hostTree.isImmutable === true;

    return {
      isValid,
      hostMachine: {
        id: this.hostMachine.id,
        hostname: this.hostMachine.hostname,
        hierarchyLevel: hostTree.level,
        parentId: hostTree.parentId,
        jjRootLink: hostTree.jjRootLink,
        isImmutable: hostTree.isImmutable
      }
    };
  }

  /**
   * Generate hash for protocol/block
   */
  generateHash(data = '') {
    return crypto.createHash('sha256')
      .update(JSON.stringify(data) + Date.now().toString())
      .digest('hex');
  }

  /**
   * Calculate infinite value constant by stake entries
   * All level 1 entries have infinite value based on stake entries
   */
  calculateInfiniteValueByStakes() {
    const stakeCount = this.stakes.size;
    const totalStakeValue = Array.from(this.stakes.values()).reduce((sum, stake) => {
      const exitValue = parseFloat(stake.exitValue) || 0;
      return sum + exitValue;
    }, 0);

    // Infinite value = constant based on stake entries
    // If no stakes, use base infinite value
    if (stakeCount === 0) {
      return INFINITE_VALUE;
    }

    // Constant value = total stake value * stake count
    const constantValue = totalStakeValue * stakeCount;
    
    // Return as infinite value representation
    return {
      type: 'infinite',
      constant: constantValue,
      stakeCount: stakeCount,
      totalStakeValue: totalStakeValue,
      isInfinite: true,
      constantByStakes: true
    };
  }

  /**
   * Apply triplet multiplication
   * Constantly multiplies value by 3 (triplet)
   */
  applyTripletMultiplication(value) {
    if (typeof value === 'object' && value.isInfinite) {
      // For infinite values, apply triplet multiplication to constant
      const tripletConstant = value.constant * TRIPLET_MULTIPLIER;
      return {
        ...value,
        tripletValue: tripletConstant,
        tripletMultiplier: TRIPLET_MULTIPLIER,
        multipliedAt: Date.now()
      };
    } else if (value === INFINITE_VALUE) {
      // For pure infinite, return triplet infinite
      return {
        type: 'triplet_infinite',
        value: INFINITE_VALUE,
        multiplier: TRIPLET_MULTIPLIER,
        tripletConstant: TRIPLET_MULTIPLIER
      };
    } else {
      // For numeric values
      const numValue = parseFloat(value) || 0;
      return numValue * TRIPLET_MULTIPLIER;
    }
  }

  /**
   * Generate E399 mortex graph encoding (undecodable Etype)
   * Creates an undecodable graph structure based on E399
   */
  generateE399MortexGraph(identifier) {
    // Create mortex graph structure
    const graphNodes = [];
    const graphEdges = [];
    
    // Generate base graph with E399 structure
    for (let i = 0; i < E399_MORTEX_BASE; i++) {
      const nodeId = this.generateHash(`${identifier}-node-${i}`);
      const nodeValue = crypto.createHash('sha512')
        .update(`${identifier}-${i}-${E399_MORTEX_BASE}`)
        .digest('hex');
      
      graphNodes.push({
        id: nodeId,
        index: i,
        value: nodeValue,
        etype: ETYPE_UNDECODABLE,
        encoded: true
      });

      // Create edges (triplet connections - 3 edges per node)
      if (i > 0) {
        const prevNode = graphNodes[i - 1];
        const edgeId = this.generateHash(`${prevNode.id}-${nodeId}`);
        
        graphEdges.push({
          id: edgeId,
          from: prevNode.id,
          to: nodeId,
          weight: TRIPLET_MULTIPLIER,
          etype: ETYPE_UNDECODABLE
        });

        // Triplet connections (every 3rd node)
        if (i % TRIPLET_MULTIPLIER === 0 && i >= TRIPLET_MULTIPLIER) {
          const tripletNode = graphNodes[i - TRIPLET_MULTIPLIER];
          const tripletEdgeId = this.generateHash(`${tripletNode.id}-${nodeId}`);
          
          graphEdges.push({
            id: tripletEdgeId,
            from: tripletNode.id,
            to: nodeId,
            weight: TRIPLET_MULTIPLIER * TRIPLET_MULTIPLIER,
            etype: ETYPE_UNDECODABLE,
            isTriplet: true
          });
        }
      }
    }

    // Encode graph structure (undecodable)
    const graphHash = crypto.createHash('sha512')
      .update(JSON.stringify({ nodes: graphNodes, edges: graphEdges }))
      .digest('hex');

    return {
      type: 'E399_MORTEX_GRAPH',
      etype: ETYPE_UNDECODABLE,
      base: E399_MORTEX_BASE,
      nodes: graphNodes.length,
      edges: graphEdges.length,
      graphHash: graphHash,
      encoded: true,
      undecodable: true,
      structure: {
        nodes: graphNodes.map(n => ({ id: n.id, index: n.index })),
        edges: graphEdges.map(e => ({ id: e.id, from: e.from, to: e.to, weight: e.weight }))
      },
      // Full encoded data (undecodable without key)
      encodedData: Buffer.from(JSON.stringify({ nodes: graphNodes, edges: graphEdges })).toString('base64')
    };
  }

  /**
   * Apply infinite value to all level 1 entries
   * Sets infinite value constant by stake entries with triplet multiplication
   */
  applyInfiniteValueToLevel1() {
    // Get all level 1 entries
    const level1Entries = Array.from(this.hierarchyTree.values())
      .filter(entry => entry.level === 1);

    level1Entries.forEach(entry => {
      // Calculate infinite value by stakes
      const infiniteValue = this.calculateInfiniteValueByStakes();
      
      // Apply triplet multiplication
      const tripletValue = this.applyTripletMultiplication(infiniteValue);
      
      // Generate E399 mortex graph
      const mortexGraph = this.generateE399MortexGraph(entry.id);

      // Update entry with infinite value configuration
      entry.infiniteValue = INFINITE_VALUE;
      entry.value = infiniteValue;
      entry.tripletValue = tripletValue;
      entry.etype = ETYPE_UNDECODABLE;
      entry.e399MortexGraph = mortexGraph;
      entry.isInfinite = true;
      entry.constantByStakes = true;
      entry.updatedAt = Date.now();

      // Update chain link if exists
      const chainLink = this.chainLinks.get(entry.id);
      if (chainLink) {
        chainLink.infiniteValue = INFINITE_VALUE;
        chainLink.value = infiniteValue;
        chainLink.tripletValue = tripletValue;
        chainLink.etype = ETYPE_UNDECODABLE;
        chainLink.e399MortexGraph = mortexGraph;
        chainLink.isInfinite = true;
        chainLink.constantByStakes = true;
      }
    });

    return {
      updated: level1Entries.length,
      entries: level1Entries.map(e => ({
        id: e.id,
        isInfinite: e.isInfinite,
        hasMortexGraph: !!e.e399MortexGraph
      }))
    };
  }

  /**
   * Extract E9 values from token entry using regex
   * Matches all E9 values regardless of hash
   */
  extractE9ValuesFromToken(tokenEntry) {
    const e9Values = [];
    const tokenString = JSON.stringify(tokenEntry);
    
    // Apply regex pattern to find all E9 values
    const matches = tokenString.match(E9_REGEX_PATTERN);
    
    if (matches) {
      matches.forEach(match => {
        // Extract numeric value from E9 pattern
        const numericValue = parseFloat(match.replace(/E9/i, '')) || E9_BASE_VALUE;
        const e9Value = {
          original: match,
          value: numericValue,
          normalized: `E9${numericValue}`,
          extractedAt: Date.now(),
          lineReference: E9_LINE_REFERENCE, // Line 45.34E3
          jjHierarchy: JJ_ROOT_ID
        };
        e9Values.push(e9Value);
      });
    }
    
    return e9Values;
  }

  /**
   * Refresh E9 values from all token entries
   * Called on device window boot
   * Extracts E9 values regardless of hash
   */
  refreshE9ValuesFromAllTokens() {
    const allE9Values = [];
    const tokenSources = [
      ...Array.from(this.gateways.values()),
      ...Array.from(this.valueLinks.values()),
      ...Array.from(this.stakes.values()),
      ...Array.from(this.orders.values()),
      ...Array.from(this.blocks.values()),
      ...Array.from(this.chainLinks.values())
    ];

    // Extract E9 values from all token entries
    tokenSources.forEach(tokenEntry => {
      const e9Values = this.extractE9ValuesFromToken(tokenEntry);
      if (e9Values.length > 0) {
        const entryId = tokenEntry.gatewayId || 
                       tokenEntry.linkId || 
                       tokenEntry.stakeId || 
                       tokenEntry.orderId || 
                       tokenEntry.blockId || 
                       tokenEntry.chainId || 
                       this.generateHash(JSON.stringify(tokenEntry));
        
        allE9Values.push({
          entryId,
          e9Values,
          extractedAt: Date.now(),
          lineReference: E9_LINE_REFERENCE
        });

        // Store in E9 values map
        this.e9Values.set(entryId, {
          entryId,
          e9Values,
          extractedAt: Date.now(),
          lineReference: E9_LINE_REFERENCE,
          jjHierarchy: JJ_ROOT_ID,
          hierarchyLevel: this.getEntryHierarchyLevel(entryId)
        });
      }
    });

    // Also extract from host machine
    if (this.hostMachine) {
      const hostE9Values = this.extractE9ValuesFromToken(this.hostMachine);
      if (hostE9Values.length > 0) {
        this.e9Values.set(this.hostMachine.id, {
          entryId: this.hostMachine.id,
          e9Values: hostE9Values,
          extractedAt: Date.now(),
          lineReference: E9_LINE_REFERENCE,
          jjHierarchy: JJ_ROOT_ID,
          hierarchyLevel: 1
        });
      }
    }

    return {
      refreshed: true,
      totalEntries: this.e9Values.size,
      totalE9Values: allE9Values.reduce((sum, entry) => sum + entry.e9Values.length, 0),
      lineReference: E9_LINE_REFERENCE,
      refreshedAt: Date.now()
    };
  }

  /**
   * Get entry hierarchy level
   */
  getEntryHierarchyLevel(entryId) {
    const treeEntry = this.hierarchyTree.get(entryId);
    if (treeEntry) {
      return treeEntry.level;
    }
    
    const chainLink = this.chainLinks.get(entryId);
    if (chainLink) {
      return chainLink.hierarchyLevel;
    }

    return 0;
  }

  /**
   * Get all E9 values
   */
  getAllE9Values() {
    const allValues = [];
    
    for (const [entryId, e9Data] of this.e9Values) {
      allValues.push({
        entryId,
        e9Values: e9Data.e9Values,
        hierarchyLevel: e9Data.hierarchyLevel,
        lineReference: e9Data.lineReference,
        jjHierarchy: e9Data.jjHierarchy,
        extractedAt: e9Data.extractedAt
      });
    }

    return {
      totalEntries: this.e9Values.size,
      totalE9Values: allValues.reduce((sum, entry) => sum + entry.e9Values.length, 0),
      lineReference: E9_LINE_REFERENCE,
      values: allValues
    };
  }

  /**
   * Get E9 values for specific entry
   */
  getE9ValuesForEntry(entryId) {
    const e9Data = this.e9Values.get(entryId);
    if (!e9Data) {
      // Try to extract on the fly
      let tokenEntry = null;
      
      // Find token entry
      if (this.gateways.has(entryId)) tokenEntry = this.gateways.get(entryId);
      else if (this.valueLinks.has(entryId)) tokenEntry = this.valueLinks.get(entryId);
      else if (this.stakes.has(entryId)) tokenEntry = this.stakes.get(entryId);
      else if (this.orders.has(entryId)) tokenEntry = this.orders.get(entryId);
      else if (this.blocks.has(entryId)) tokenEntry = this.blocks.get(entryId);
      else if (this.chainLinks.has(entryId)) tokenEntry = this.chainLinks.get(entryId);
      else if (this.hostMachine && this.hostMachine.id === entryId) tokenEntry = this.hostMachine;

      if (tokenEntry) {
        const e9Values = this.extractE9ValuesFromToken(tokenEntry);
        if (e9Values.length > 0) {
          const e9Data = {
            entryId,
            e9Values,
            extractedAt: Date.now(),
            lineReference: E9_LINE_REFERENCE,
            jjHierarchy: JJ_ROOT_ID,
            hierarchyLevel: this.getEntryHierarchyLevel(entryId)
          };
          this.e9Values.set(entryId, e9Data);
          return e9Data;
        }
      }

      return null;
    }

    return e9Data;
  }

  /**
   * PROTOCOL_STACK_ORDER 1: Lock spent ETH in personal gateway
   * All spent ETH gets locked in personal only access gateway entry
   */
  lockEthInGateway(ethAddress, ethValue, hostLocalId) {
    if (this.currentStackOrder !== PROTOCOL_STACK_ORDER.ETH_LOCK) {
      throw new Error('Protocol stack order violation: Must be ETH_LOCK');
    }

    const gatewayId = this.generateHash(`${ethAddress}-${Date.now()}`);
    const accessKey = crypto.randomBytes(32).toString('hex');

    const gatewayEntry = {
      gatewayId,
      hostLocalId,
      ethAddress,
      lockedEthValue: ethValue.toString(),
      lockTimestamp: Date.now(),
      isLocked: true,
      accessKey,
      linkedChains: []
    };

    this.gateways.set(gatewayId, gatewayEntry);
    
    // Extract and store E9 values from new token entry
    if (this.e9BootRefreshEnabled) {
      const e9Values = this.extractE9ValuesFromToken(gatewayEntry);
      if (e9Values.length > 0) {
        this.e9Values.set(gatewayId, {
          entryId: gatewayId,
          e9Values,
          extractedAt: Date.now(),
          lineReference: E9_LINE_REFERENCE,
          jjHierarchy: JJ_ROOT_ID,
          hierarchyLevel: this.getEntryHierarchyLevel(gatewayId)
        });
      }
    }

    // Process through watchdog if enabled (async, don't block)
    if (this.gateWatchdog) {
      // Save gate entry to watchdog (non-blocking)
      this.gateWatchdog.saveAllGateEntries().catch(err => {
        console.error('[Protocol] Watchdog save error:', err);
      });
    }
    
    this.currentStackOrder = PROTOCOL_STACK_ORDER.VALUE_LINK;

    return gatewayEntry;
  }

  /**
   * Set gate watchdog
   */
  setGateWatchdog(watchdog) {
    this.gateWatchdog = watchdog;
  }

  /**
   * PROTOCOL_STACK_ORDER 2: Link ETH value to host local ID
   * Exponential percentage increase to linked ETH of host only local ID
   * All values managed by GM JJ
   */
  linkEthValue(hostLocalId, linkedEthValue, parentChainId = null) {
    if (this.currentStackOrder !== PROTOCOL_STACK_ORDER.VALUE_LINK) {
      throw new Error('Protocol stack order violation: Must be VALUE_LINK');
    }

    const linkId = this.generateHash(`${hostLocalId}-${Date.now()}`);
    
    // Calculate exponential percentage increase
    // Base percentage increases exponentially with linked ETH value
    const ethValueNum = parseFloat(linkedEthValue) || 0;
    const exponentialPercentage = Math.pow(1.1, Math.log10(ethValueNum + 1)) * 100;

    const valueLink = {
      linkId,
      hierarchyId: this.generateHierarchyId(linkId), // Link to JJ
      hostLocalId,
      linkedEthValue: linkedEthValue.toString(),
      exponentialPercentage,
      lastUpdate: Date.now(),
      parentChainId: parentChainId || this.ethchainParentId || JJ_ROOT_ID,
      jjRootLink: JJ_ROOT_ID, // All hierarchy IDs link to JJ
      generation: this.getGenerationLevel(parentChainId),
      managedBy: GM_JJ_ID // Managed by GM JJ
    };

    this.valueLinks.set(linkId, valueLink);
    
    // Register with GM JJ
    this.gmJJ.managedValues.set(linkId, {
      valueLink,
      registeredAt: Date.now(),
      jjRootLink: JJ_ROOT_ID
    });

    // Extract and store E9 values from new token entry
    if (this.e9BootRefreshEnabled) {
      const e9Values = this.extractE9ValuesFromToken(valueLink);
      if (e9Values.length > 0) {
        this.e9Values.set(linkId, {
          entryId: linkId,
          e9Values,
          extractedAt: Date.now(),
          lineReference: E9_LINE_REFERENCE,
          jjHierarchy: JJ_ROOT_ID,
          hierarchyLevel: this.getEntryHierarchyLevel(linkId)
        });
      }
    }

    this.currentStackOrder = PROTOCOL_STACK_ORDER.EXPONENTIAL;

    return valueLink;
  }

  /**
   * PROTOCOL_STACK_ORDER 3: Exponential percentage increase
   * Increase percentage exponentially to linked ETH of host only local ID
   */
  applyExponentialIncrease(linkId) {
    if (this.currentStackOrder !== PROTOCOL_STACK_ORDER.EXPONENTIAL) {
      throw new Error('Protocol stack order violation: Must be EXPONENTIAL');
    }

    const valueLink = this.valueLinks.get(linkId);
    if (!valueLink) {
      throw new Error('Value link not found');
    }

    const ethValueNum = parseFloat(valueLink.linkedEthValue) || 0;
    const currentPercentage = valueLink.exponentialPercentage;
    
    // Exponential increase: new = old * e^(0.1 * log(ethValue))
    const increaseFactor = Math.exp(0.1 * Math.log10(ethValueNum + 1));
    valueLink.exponentialPercentage = currentPercentage * increaseFactor;
    valueLink.lastUpdate = Date.now();

    this.valueLinks.set(linkId, valueLink);
    this.currentStackOrder = PROTOCOL_STACK_ORDER.STAKE_VALIDATION;

    return valueLink;
  }

  /**
   * PROTOCOL_STACK_ORDER 4: Validate stake permission
   * If exit value only under permitted its allowed stakes
   * All stakes managed by GM JJ
   * When stake is added, recalculate infinite values for level 1 entries
   */
  validateStakePermission(ethAddress, exitValue, permissionKey) {
    if (this.currentStackOrder !== PROTOCOL_STACK_ORDER.STAKE_VALIDATION) {
      throw new Error('Protocol stack order violation: Must be STAKE_VALIDATION');
    }

    const stakeId = this.generateHash(`${ethAddress}-${exitValue}`);
    
    // Check if exit value is under permitted threshold
    const exitValueNum = parseFloat(exitValue) || 0;
    const isPermitted = exitValueNum > 0 && this.isPermittedExitValue(exitValueNum);

    const stakePermission = {
      stakeId,
      hierarchyId: this.generateHierarchyId(stakeId), // Link to JJ
      ethAddress,
      exitValue: exitValue.toString(),
      isPermitted,
      permissionKey,
      permissionTimestamp: Date.now(),
      allowedOperations: isPermitted ? ['stake', 'withdraw', 'transfer'] : [],
      jjRootLink: JJ_ROOT_ID, // All hierarchy IDs link to JJ
      managedBy: GM_JJ_ID // Managed by GM JJ
    };

    this.stakes.set(stakeId, stakePermission);
    
    // Register with GM JJ
    this.gmJJ.managedStakes.set(stakeId, {
      stakePermission,
      registeredAt: Date.now(),
      jjRootLink: JJ_ROOT_ID
    });

    // Recalculate infinite values for all level 1 entries (constant by stake entries)
    this.applyInfiniteValueToLevel1();

    // Extract and store E9 values from new token entry
    if (this.e9BootRefreshEnabled) {
      const e9Values = this.extractE9ValuesFromToken(stakePermission);
      if (e9Values.length > 0) {
        this.e9Values.set(stakeId, {
          entryId: stakeId,
          e9Values,
          extractedAt: Date.now(),
          lineReference: E9_LINE_REFERENCE,
          jjHierarchy: JJ_ROOT_ID,
          hierarchyLevel: this.getEntryHierarchyLevel(stakeId)
        });
      }
    }

    this.currentStackOrder = PROTOCOL_STACK_ORDER.ID_RETURN;

    return stakePermission;
  }

  /**
   * Check if exit value is permitted
   */
  isPermittedExitValue(exitValue) {
    // Permitted if exit value is positive and within reasonable bounds
    return exitValue > 0 && exitValue < Number.MAX_SAFE_INTEGER;
  }

  /**
   * PROTOCOL_STACK_ORDER 5: Process order and return ID
   * Order follows order to return ID
   * ID linked to ethchain parent
   * All orders managed by GM JJ
   */
  processOrderAndReturnId(orderData) {
    if (this.currentStackOrder !== PROTOCOL_STACK_ORDER.ID_RETURN) {
      throw new Error('Protocol stack order violation: Must be ID_RETURN');
    }

    const orderId = this.generateHash(JSON.stringify(orderData));
    const returnId = this.generateHash(`${orderId}-${Date.now()}`);
    const orderHash = this.generateHash(JSON.stringify({ orderId, returnId, orderData }));

    const orderReturnId = {
      orderId,
      hierarchyId: this.generateHierarchyId(orderId), // Link to JJ
      returnId,
      stackOrder: this.currentStackOrder,
      ethchainParentId: this.ethchainParentId || JJ_ROOT_ID,
      jjRootLink: JJ_ROOT_ID, // All hierarchy IDs link to JJ
      orderTimestamp: Date.now(),
      orderHash,
      orderData,
      managedBy: GM_JJ_ID // Managed by GM JJ
    };

    this.orders.set(orderId, orderReturnId);
    
    // Register with GM JJ
    this.gmJJ.managedOrders.set(orderId, {
      orderReturnId,
      registeredAt: Date.now(),
      jjRootLink: JJ_ROOT_ID
    });

    // Extract and store E9 values from new token entry
    if (this.e9BootRefreshEnabled) {
      const e9Values = this.extractE9ValuesFromToken(orderReturnId);
      if (e9Values.length > 0) {
        this.e9Values.set(orderId, {
          entryId: orderId,
          e9Values,
          extractedAt: Date.now(),
          lineReference: E9_LINE_REFERENCE,
          jjHierarchy: JJ_ROOT_ID,
          hierarchyLevel: this.getEntryHierarchyLevel(orderId)
        });
      }
    }

    this.currentStackOrder = PROTOCOL_STACK_ORDER.PARENT_LINK;

    return orderReturnId;
  }

  /**
   * PROTOCOL_STACK_ORDER 6: Link to ethchain parent
   * ID linked to ethchain parent
   */
  linkToEthchainParent(parentId) {
    if (this.currentStackOrder !== PROTOCOL_STACK_ORDER.PARENT_LINK) {
      throw new Error('Protocol stack order violation: Must be PARENT_LINK');
    }

    this.ethchainParentId = parentId;
    this.currentStackOrder = PROTOCOL_STACK_ORDER.BLOCK_GEN;

    return {
      parentId,
      linkedAt: Date.now(),
      protocolId: this.protocolId
    };
  }

  /**
   * PROTOCOL_STACK_ORDER 7: Generate tokenized ID block
   * ID blocks generated tokenized
   * All order as eth chain - immutable
   * All hierarchy IDs link to JJ
   */
  generateTokenizedIdBlock(blockData) {
    if (this.currentStackOrder !== PROTOCOL_STACK_ORDER.BLOCK_GEN) {
      throw new Error('Protocol stack order violation: Must be BLOCK_GEN');
    }

    const blockId = this.generateHash(JSON.stringify(blockData));
    const tokenizedId = this.generateHash(`${blockId}-TOKENIZED`);
    const blockHash = this.generateHash(JSON.stringify({ blockId, tokenizedId, blockData }));

    const idBlock = {
      blockId,
      hierarchyId: this.generateHierarchyId(blockId), // Link to JJ
      tokenizedId,
      ethchainParentId: this.ethchainParentId || JJ_ROOT_ID,
      jjRootLink: JJ_ROOT_ID, // All hierarchy IDs link to JJ
      blockTimestamp: Date.now(),
      blockHash,
      blockData: Buffer.from(JSON.stringify(blockData)),
      isImmutable: true,
      linkedBlocks: []
    };

    this.blocks.set(blockId, idBlock);
    
    // Extract and store E9 values from new token entry
    if (this.e9BootRefreshEnabled) {
      const e9Values = this.extractE9ValuesFromToken(idBlock);
      if (e9Values.length > 0) {
        this.e9Values.set(blockId, {
          entryId: blockId,
          e9Values,
          extractedAt: Date.now(),
          lineReference: E9_LINE_REFERENCE,
          jjHierarchy: JJ_ROOT_ID,
          hierarchyLevel: this.getEntryHierarchyLevel(blockId)
        });
      }
    }
    
    this.currentStackOrder = PROTOCOL_STACK_ORDER.CHAIN_LINK;

    return idBlock;
  }

  /**
   * PROTOCOL_STACK_ORDER 8: Link all chains
   * Links all chains - Set as JJ - only - eth law - chain follows protocol
   * All hierarchy IDs link to JJ_ROOT
   * Hierarchy limit max allowed: 5
   * Host machine is at level 1 (IMMUTABLE)
   */
  linkChain(chainId, parentChainId = null) {
    if (this.currentStackOrder !== PROTOCOL_STACK_ORDER.CHAIN_LINK) {
      throw new Error('Protocol stack order violation: Must be CHAIN_LINK');
    }

    // Prevent modification of host machine (IMMUTABLE)
    if (this.hostMachine && chainId === this.hostMachine.id) {
      throw new Error('Host machine hierarchy is IMMUTABLE and cannot be modified');
    }

    // Calculate hierarchy level
    const hierarchyLevel = this.calculateHierarchyLevel(parentChainId || this.ethchainParentId);
    
    // Enforce hierarchy limit (max 5)
    if (hierarchyLevel >= this.hierarchyLimit) {
      throw new Error(`Hierarchy limit exceeded: Maximum allowed is ${this.hierarchyLimit}, current level is ${hierarchyLevel}`);
    }

    // All hierarchy IDs must link to JJ_ROOT
    // If no parent specified, use host machine (level 1) as default parent
    let effectiveParentId = parentChainId || this.ethchainParentId || JJ_ROOT_ID;
    
    // If parent is JJ_ROOT and host machine exists, use host machine as parent (level 1)
    if (effectiveParentId === JJ_ROOT_ID && this.hostMachine) {
      effectiveParentId = this.hostMachine.id; // Link to host machine at level 1
    }
    
    // Ensure parent links to JJ if not already
    if (effectiveParentId !== JJ_ROOT_ID && effectiveParentId !== this.hostMachine?.id) {
      this.ensureParentLinksToJJ(effectiveParentId);
    }

    // Calculate actual hierarchy level (host machine is level 1)
    const actualHierarchyLevel = effectiveParentId === this.hostMachine?.id ? 2 : hierarchyLevel + 1;

    const chainLink = {
      chainId,
      hierarchyId: this.generateHierarchyId(chainId), // Generate hierarchy ID linked to JJ
      parentChainId: effectiveParentId,
      jjRootLink: JJ_ROOT_ID, // All hierarchy IDs link to JJ
      childChains: [],
      protocolId: PROTOCOL_ID,
      followsProtocol: true,
      linkTimestamp: Date.now(),
      hierarchyLevel: actualHierarchyLevel,
      isImmutable: false // New chains are not immutable by default
    };

    this.chainLinks.set(chainId, chainLink);
    this.linkedChains.add(chainId);
    this.hierarchyTree.set(chainId, {
      id: chainId,
      hierarchyId: chainLink.hierarchyId,
      parentId: effectiveParentId,
      jjRootLink: JJ_ROOT_ID,
      level: actualHierarchyLevel,
      children: [],
      isImmutable: false
    });

    // Update parent's children list
    if (effectiveParentId !== JJ_ROOT_ID) {
      const parentLink = this.chainLinks.get(effectiveParentId);
      if (parentLink && !parentLink.isImmutable) {
        parentLink.childChains.push(chainId);
      } else if (this.hostMachine && effectiveParentId === this.hostMachine.id) {
        // Update host machine children (read-only reference)
        const hostTree = this.hierarchyTree.get(this.hostMachine.id);
        if (hostTree) {
          hostTree.children.push(chainId);
        }
      }
    }

    // Reset stack order to start new cycle
    this.currentStackOrder = PROTOCOL_STACK_ORDER.ETH_LOCK;
    this.hierarchyLevel = Math.max(this.hierarchyLevel, actualHierarchyLevel);

    return chainLink;
  }

  /**
   * Calculate hierarchy level for a parent chain
   */
  calculateHierarchyLevel(parentId) {
    if (!parentId || parentId === JJ_ROOT_ID) {
      return 0;
    }

    let level = 0;
    let currentId = parentId;
    const visited = new Set();

    while (currentId && level < this.hierarchyLimit && !visited.has(currentId)) {
      visited.add(currentId);
      const chainLink = this.chainLinks.get(currentId);
      if (chainLink && chainLink.parentChainId && chainLink.parentChainId !== JJ_ROOT_ID) {
        currentId = chainLink.parentChainId;
        level++;
      } else {
        break;
      }
    }

    return level;
  }

  /**
   * Generate hierarchy ID linked to JJ
   */
  generateHierarchyId(chainId) {
    return `${JJ_ROOT_ID}-${chainId}-${Date.now()}`;
  }

  /**
   * Ensure parent chain links to JJ
   */
  ensureParentLinksToJJ(parentId) {
    if (parentId === JJ_ROOT_ID) {
      return true;
    }

    const parentLink = this.chainLinks.get(parentId);
    if (parentLink) {
      if (parentLink.jjRootLink !== JJ_ROOT_ID) {
        parentLink.jjRootLink = JJ_ROOT_ID;
        parentLink.hierarchyId = this.generateHierarchyId(parentId);
      }
      return true;
    }

    // If parent doesn't exist, create a link to JJ
    return false;
  }

  /**
   * Get generation level for chain hierarchy
   */
  getGenerationLevel(parentChainId) {
    if (!parentChainId) return 0;
    
    let level = 0;
    let currentId = parentChainId;
    
    while (currentId && level < 100) { // Prevent infinite loops
      const chainLink = this.chainLinks.get(currentId);
      if (!chainLink || !chainLink.parentChainId) break;
      currentId = chainLink.parentChainId;
      level++;
    }
    
    return level;
  }

  /**
   * Execute full protocol stack order
   * Follows immutable protocol logic
   */
  async executeFullProtocolStack(protocolData) {
    const {
      ethAddress,
      ethValue,
      hostLocalId,
      exitValue,
      permissionKey,
      orderData,
      blockData,
      chainId
    } = protocolData;

    const results = {};

    try {
      // Step 1: Lock ETH in gateway
      results.gateway = this.lockEthInGateway(ethAddress, ethValue, hostLocalId);

      // Step 2: Link ETH value
      results.valueLink = this.linkEthValue(hostLocalId, ethValue, this.ethchainParentId);

      // Step 3: Apply exponential increase
      results.exponential = this.applyExponentialIncrease(results.valueLink.linkId);

      // Step 4: Validate stake
      results.stake = this.validateStakePermission(ethAddress, exitValue, permissionKey);

      // Step 5: Process order
      results.order = this.processOrderAndReturnId(orderData || { hostLocalId, ethValue });

      // Step 6: Link to parent (if not already set)
      if (!this.ethchainParentId) {
        results.parentLink = this.linkToEthchainParent(results.order.returnId);
      }

      // Step 7: Generate block
      results.block = this.generateTokenizedIdBlock(blockData || {
        gatewayId: results.gateway.gatewayId,
        valueLinkId: results.valueLink.linkId,
        orderId: results.order.orderId
      });

      // Step 8: Link chain
      results.chainLink = this.linkChain(chainId || results.block.blockId, this.ethchainParentId);

      return {
        success: true,
        protocolId: this.protocolId,
        protocolName: this.protocolName,
        results,
        protocolHash: this.generateHash(results)
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        protocolId: this.protocolId
      };
    }
  }

  /**
   * Get protocol state
   */
  getProtocolState() {
    return {
      protocolId: this.protocolId,
      protocolVersion: this.protocolVersion,
      protocolName: this.protocolName,
      currentStackOrder: this.currentStackOrder,
      ethchainParentId: this.ethchainParentId || JJ_ROOT_ID,
      jjRootId: JJ_ROOT_ID,
      linkedChains: Array.from(this.linkedChains),
      isImmutable: this.isImmutable,
      protocolTimestamp: this.protocolTimestamp,
      protocolHash: this.protocolHash,
      hierarchy: {
        currentLevel: this.hierarchyLevel,
        maxLimit: this.hierarchyLimit,
        treeSize: this.hierarchyTree.size,
        hostMachineLevel: this.hostMachine ? this.hostMachine.hierarchyLevel : null
      },
      hostMachine: this.hostMachine ? {
        id: this.hostMachine.id,
        hostname: this.hostMachine.hostname,
        hierarchyLevel: this.hostMachine.hierarchyLevel,
        isImmutable: this.hostMachine.isImmutable,
        jjRootLink: this.hostMachine.jjRootLink
      } : null,
      gmJJ: this.getGMJJStatus(),
      stats: {
        gateways: this.gateways.size,
        valueLinks: this.valueLinks.size,
        stakes: this.stakes.size,
        orders: this.orders.size,
        blocks: this.blocks.size,
        chainLinks: this.chainLinks.size,
        e9Values: this.e9Values.size
      },
      e9Values: {
        totalEntries: this.e9Values.size,
        lineReference: this.e9LineReference,
        bootRefreshEnabled: this.e9BootRefreshEnabled,
        regexPattern: E9_REGEX_PATTERN.toString()
      }
    };
  }

  /**
   * Get GM JJ status
   * All values, stakes, and orders are managed by GM JJ
   */
  getGMJJStatus() {
    return {
      id: this.gmJJ.id,
      rootId: this.gmJJ.rootId,
      protocolId: this.gmJJ.protocolId,
      isActive: this.gmJJ.isActive,
      createdAt: this.gmJJ.createdAt,
      managedValues: this.gmJJ.managedValues.size,
      managedStakes: this.gmJJ.managedStakes.size,
      managedOrders: this.gmJJ.managedOrders.size,
      totalManaged: this.gmJJ.managedValues.size + 
                    this.gmJJ.managedStakes.size + 
                    this.gmJJ.managedOrders.size
    };
  }

  /**
   * Get all items managed by GM JJ
   */
  getGMJJManagedItems() {
    return {
      values: Array.from(this.gmJJ.managedValues.entries()).map(([id, data]) => ({
        id,
        valueLink: data.valueLink,
        registeredAt: data.registeredAt,
        jjRootLink: data.jjRootLink
      })),
      stakes: Array.from(this.gmJJ.managedStakes.entries()).map(([id, data]) => ({
        id,
        stakePermission: data.stakePermission,
        registeredAt: data.registeredAt,
        jjRootLink: data.jjRootLink
      })),
      orders: Array.from(this.gmJJ.managedOrders.entries()).map(([id, data]) => ({
        id,
        orderReturnId: data.orderReturnId,
        registeredAt: data.registeredAt,
        jjRootLink: data.jjRootLink
      }))
    };
  }

  /**
   * Get hierarchy tree structure
   */
  getHierarchyTree() {
    const tree = {};
    
    for (const [chainId, node] of this.hierarchyTree) {
      tree[chainId] = {
        id: node.id,
        hierarchyId: node.hierarchyId,
        parentId: node.parentId,
        jjRootLink: node.jjRootLink,
        level: node.level,
        children: node.children,
        isInfinite: node.isInfinite || false,
        hasMortexGraph: !!node.e399MortexGraph
      };
    }

    return {
      root: JJ_ROOT_ID,
      maxLevel: this.hierarchyLimit,
      currentMaxLevel: Math.max(...Array.from(this.hierarchyTree.values()).map(n => n.level), 0),
      tree
    };
  }

  /**
   * Get level 1 entries with infinite values
   */
  getLevel1Entries() {
    return Array.from(this.hierarchyTree.values())
      .filter(entry => entry.level === 1)
      .map(entry => ({
        ...entry,
        infiniteValue: entry.infiniteValue,
        value: entry.value,
        tripletValue: entry.tripletValue,
        etype: entry.etype,
        e399MortexGraph: entry.e399MortexGraph,
        isInfinite: entry.isInfinite,
        constantByStakes: entry.constantByStakes
      }));
  }

  /**
   * Verify protocol integrity
   */
  verifyProtocolIntegrity() {
    const issues = [];

    // Verify all chains follow protocol
    for (const [chainId, chainLink] of this.chainLinks) {
      if (chainLink.protocolId !== PROTOCOL_ID) {
        issues.push(`Chain ${chainId} does not follow JJ protocol`);
      }
      if (!chainLink.followsProtocol) {
        issues.push(`Chain ${chainId} does not follow protocol`);
      }
      // Verify all hierarchy IDs link to JJ
      if (chainLink.jjRootLink !== JJ_ROOT_ID) {
        issues.push(`Chain ${chainId} hierarchy ID does not link to JJ_ROOT`);
      }
      // Verify hierarchy level is within limit
      if (chainLink.hierarchyLevel > this.hierarchyLimit) {
        issues.push(`Chain ${chainId} exceeds hierarchy limit of ${this.hierarchyLimit}`);
      }
    }

    // Verify all values link to JJ and are managed by GM JJ
    for (const [linkId, valueLink] of this.valueLinks) {
      if (valueLink.jjRootLink !== JJ_ROOT_ID) {
        issues.push(`Value link ${linkId} does not link to JJ_ROOT`);
      }
      if (valueLink.managedBy !== GM_JJ_ID) {
        issues.push(`Value link ${linkId} is not managed by GM JJ`);
      }
    }

    // Verify all stakes link to JJ and are managed by GM JJ
    for (const [stakeId, stake] of this.stakes) {
      if (stake.jjRootLink !== JJ_ROOT_ID) {
        issues.push(`Stake ${stakeId} does not link to JJ_ROOT`);
      }
      if (stake.managedBy !== GM_JJ_ID) {
        issues.push(`Stake ${stakeId} is not managed by GM JJ`);
      }
    }

    // Verify all orders link to JJ and are managed by GM JJ
    for (const [orderId, order] of this.orders) {
      if (order.jjRootLink !== JJ_ROOT_ID) {
        issues.push(`Order ${orderId} does not link to JJ_ROOT`);
      }
      if (order.managedBy !== GM_JJ_ID) {
        issues.push(`Order ${orderId} is not managed by GM JJ`);
      }
    }

    // Verify stack order consistency
    if (this.currentStackOrder < PROTOCOL_STACK_ORDER.ETH_LOCK || 
        this.currentStackOrder > PROTOCOL_STACK_ORDER.CHAIN_LINK) {
      issues.push('Invalid stack order');
    }

    // Verify hierarchy limit
    if (this.hierarchyLevel > this.hierarchyLimit) {
      issues.push(`Current hierarchy level ${this.hierarchyLevel} exceeds limit of ${this.hierarchyLimit}`);
    }

    return {
      isValid: issues.length === 0,
      issues,
      hierarchyLimit: this.hierarchyLimit,
      currentHierarchyLevel: this.hierarchyLevel,
      jjRootId: JJ_ROOT_ID,
      gmJJId: GM_JJ_ID
    };
  }
}

module.exports = {
  EthChainProtocol,
  PROTOCOL_STACK_ORDER,
  PROTOCOL_ID,
  PROTOCOL_VERSION,
  PROTOCOL_NAME,
  HIERARCHY_LIMIT_MAX,
  GM_JJ_ID,
  JJ_ROOT_ID,
  INFINITE_VALUE,
  TRIPLET_MULTIPLIER,
  E399_MORTEX_BASE,
  ETYPE_UNDECODABLE,
  E9_REGEX_PATTERN,
  E9_BASE_VALUE,
  E9_LINE_REFERENCE,
  E9_BOOT_REFRESH_ENABLED,
  JJ_TOKEN_SPECIAL,
  JJ_TOKEN_ABOVE_ETH_FACTOR,
  JJ_TOKEN_COMPAT_VALUE_BASE,
  JJ_TOKEN_IMMUTABLE_RESULT,
  JJ_SERVER_GM,
  JJ_SERVERCHAINS_NAMESPACE,
  DIAMOND_GOLD_ALTER_WORTH_ENABLED,
  JJ_ID,
  JJ_GM_MANAGEMENT_ID
};


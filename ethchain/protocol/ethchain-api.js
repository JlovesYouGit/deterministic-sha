/**
 * ETH Chain Protocol API Integration
 * RESTful API endpoints for ETH Chain Protocol (JJ Protocol - ETH Law)
 */

const express = require('express');
const { EthChainProtocol, PROTOCOL_STACK_ORDER, PROTOCOL_ID, HIERARCHY_LIMIT_MAX, GM_JJ_ID, JJ_ROOT_ID, INFINITE_VALUE, TRIPLET_MULTIPLIER, E399_MORTEX_BASE, ETYPE_UNDECODABLE, E9_REGEX_PATTERN, E9_BASE_VALUE, E9_LINE_REFERENCE, E9_BOOT_REFRESH_ENABLED } = require('./ethchain-protocol');

class EthChainProtocolAPI {
  constructor() {
    this.router = express.Router();
    this.protocol = new EthChainProtocol();
    this.setupRoutes();
  }

  setupRoutes() {
    // Protocol state
    this.router.get('/state', (req, res) => {
      try {
        const state = this.protocol.getProtocolState();
        res.json({
          success: true,
          protocol: state
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Lock ETH in gateway
    this.router.post('/gateway/lock', (req, res) => {
      try {
        const { ethAddress, ethValue, hostLocalId } = req.body;
        
        if (!ethAddress || !ethValue || !hostLocalId) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: ethAddress, ethValue, hostLocalId'
          });
        }

        const gateway = this.protocol.lockEthInGateway(ethAddress, ethValue, hostLocalId);
        res.json({
          success: true,
          gateway,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Link ETH value
    this.router.post('/value/link', (req, res) => {
      try {
        const { hostLocalId, linkedEthValue, parentChainId } = req.body;
        
        if (!hostLocalId || !linkedEthValue) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: hostLocalId, linkedEthValue'
          });
        }

        const valueLink = this.protocol.linkEthValue(hostLocalId, linkedEthValue, parentChainId);
        res.json({
          success: true,
          valueLink,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Apply exponential increase
    this.router.post('/value/exponential', (req, res) => {
      try {
        const { linkId } = req.body;
        
        if (!linkId) {
          return res.status(400).json({
            success: false,
            error: 'Missing required field: linkId'
          });
        }

        const valueLink = this.protocol.applyExponentialIncrease(linkId);
        res.json({
          success: true,
          valueLink,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Validate stake permission
    this.router.post('/stake/validate', (req, res) => {
      try {
        const { ethAddress, exitValue, permissionKey } = req.body;
        
        if (!ethAddress || !exitValue) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: ethAddress, exitValue'
          });
        }

        const stake = this.protocol.validateStakePermission(
          ethAddress, 
          exitValue, 
          permissionKey || 'default'
        );
        res.json({
          success: true,
          stake,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Process order and return ID
    this.router.post('/order/process', (req, res) => {
      try {
        const { orderData } = req.body;
        
        const order = this.protocol.processOrderAndReturnId(orderData || {});
        res.json({
          success: true,
          order,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Link to ethchain parent
    this.router.post('/parent/link', (req, res) => {
      try {
        const { parentId } = req.body;
        
        if (!parentId) {
          return res.status(400).json({
            success: false,
            error: 'Missing required field: parentId'
          });
        }

        const parentLink = this.protocol.linkToEthchainParent(parentId);
        res.json({
          success: true,
          parentLink,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Generate tokenized ID block
    this.router.post('/block/generate', (req, res) => {
      try {
        const { blockData } = req.body;
        
        const block = this.protocol.generateTokenizedIdBlock(blockData || {});
        res.json({
          success: true,
          block,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Link chain
    this.router.post('/chain/link', (req, res) => {
      try {
        const { chainId, parentChainId } = req.body;
        
        if (!chainId) {
          return res.status(400).json({
            success: false,
            error: 'Missing required field: chainId'
          });
        }

        const chainLink = this.protocol.linkChain(chainId, parentChainId);
        res.json({
          success: true,
          chainLink,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Execute full protocol stack
    this.router.post('/protocol/execute', (req, res) => {
      try {
        const protocolData = req.body;
        
        this.protocol.executeFullProtocolStack(protocolData)
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

    // Verify protocol integrity
    this.router.get('/protocol/verify', (req, res) => {
      try {
        const verification = this.protocol.verifyProtocolIntegrity();
        res.json({
          success: true,
          verification,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get GM JJ status
    this.router.get('/gm-jj/status', (req, res) => {
      try {
        const status = this.protocol.getGMJJStatus();
        res.json({
          success: true,
          gmJJ: status,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get all items managed by GM JJ
    this.router.get('/gm-jj/managed', (req, res) => {
      try {
        const items = this.protocol.getGMJJManagedItems();
        res.json({
          success: true,
          managedItems: items,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get hierarchy tree
    this.router.get('/hierarchy/tree', (req, res) => {
      try {
        const tree = this.protocol.getHierarchyTree();
        res.json({
          success: true,
          hierarchy: tree,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get hierarchy information
    this.router.get('/hierarchy/info', (req, res) => {
      try {
        const state = this.protocol.getProtocolState();
        res.json({
          success: true,
          hierarchy: {
            currentLevel: state.hierarchy.currentLevel,
            maxLimit: state.hierarchy.maxLimit,
            treeSize: state.hierarchy.treeSize,
            hostMachineLevel: state.hierarchy.hostMachineLevel,
            jjRootId: state.jjRootId,
            gmJJId: state.gmJJ.id
          },
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get current host machine (JJ hierarchy level 1 - IMMUTABLE)
    this.router.get('/host-machine', (req, res) => {
      try {
        const hostMachine = this.protocol.getHostMachine();
        res.json({
          success: true,
          hostMachine,
          protocolId: PROTOCOL_ID,
          note: 'Host machine is at JJ hierarchy level 1 and is IMMUTABLE'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Verify host machine hierarchy
    this.router.get('/host-machine/verify', (req, res) => {
      try {
        const verification = this.protocol.verifyHostMachineHierarchy();
        res.json({
          success: true,
          verification,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get infinite value configuration for level 1 entries
    this.router.get('/infinite-value/level1', (req, res) => {
      try {
        const level1Entries = this.protocol.getLevel1Entries();

        const infiniteValues = level1Entries.map(entry => ({
          id: entry.id,
          infiniteValue: entry.infiniteValue,
          value: entry.value,
          tripletValue: entry.tripletValue,
          etype: entry.etype,
          hasMortexGraph: !!entry.e399MortexGraph,
          isInfinite: entry.isInfinite,
          constantByStakes: entry.constantByStakes
        }));

        res.json({
          success: true,
          level1Entries: infiniteValues,
          config: {
            infiniteValue: INFINITE_VALUE,
            tripletMultiplier: TRIPLET_MULTIPLIER,
            e399MortexBase: E399_MORTEX_BASE,
            etype: ETYPE_UNDECODABLE
          },
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get E399 mortex graph for entry
    this.router.get('/mortex-graph/:entryId', (req, res) => {
      try {
        const { entryId } = req.params;
        const level1Entries = this.protocol.getLevel1Entries();
        const entry = level1Entries.find(e => e.id === entryId);
        
        if (!entry) {
          return res.status(404).json({
            success: false,
            error: 'Entry not found or not a level 1 entry'
          });
        }

        // Get mortex graph from host machine or entry
        let mortexGraph = entry.e399MortexGraph;
        if (!mortexGraph && this.protocol.hostMachine) {
          mortexGraph = this.protocol.hostMachine.e399MortexGraph;
        }

        if (!mortexGraph) {
          return res.status(404).json({
            success: false,
            error: 'E399 mortex graph not found for this entry'
          });
        }

        // Return mortex graph structure (without full encoded data for security)
        res.json({
          success: true,
          entryId: entryId,
          mortexGraph: {
            type: mortexGraph.type,
            etype: mortexGraph.etype,
            base: mortexGraph.base,
            nodes: mortexGraph.nodes,
            edges: mortexGraph.edges,
            graphHash: mortexGraph.graphHash,
            encoded: mortexGraph.encoded,
            undecodable: mortexGraph.undecodable,
            structure: mortexGraph.structure
            // encodedData is excluded for security
          },
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Recalculate infinite values for level 1 entries
    this.router.post('/infinite-value/recalculate', (req, res) => {
      try {
        const result = this.protocol.applyInfiniteValueToLevel1();
        res.json({
          success: true,
          result,
          protocolId: PROTOCOL_ID,
          message: 'Infinite values recalculated for all level 1 entries based on current stake entries'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get all E9 values (extracted from all token entries using regex)
    this.router.get('/e9-values/all', (req, res) => {
      try {
        const allE9Values = this.protocol.getAllE9Values();
        res.json({
          success: true,
          e9Values: allE9Values,
          config: {
            regexPattern: E9_REGEX_PATTERN.toString(),
            baseValue: E9_BASE_VALUE,
            lineReference: E9_LINE_REFERENCE,
            bootRefreshEnabled: E9_BOOT_REFRESH_ENABLED
          },
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get E9 values for specific entry
    this.router.get('/e9-values/entry/:entryId', (req, res) => {
      try {
        const { entryId } = req.params;
        const e9Data = this.protocol.getE9ValuesForEntry(entryId);
        
        if (!e9Data) {
          return res.status(404).json({
            success: false,
            error: 'E9 values not found for this entry'
          });
        }

        res.json({
          success: true,
          entryId: entryId,
          e9Data: e9Data,
          lineReference: E9_LINE_REFERENCE,
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Refresh E9 values from all token entries (boot refresh)
    this.router.post('/e9-values/refresh', (req, res) => {
      try {
        const result = this.protocol.refreshE9ValuesFromAllTokens();
        res.json({
          success: true,
          result,
          protocolId: PROTOCOL_ID,
          message: 'E9 values refreshed from all token entries (boot refresh)',
          lineReference: E9_LINE_REFERENCE
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get E9 values configuration
    this.router.get('/e9-values/config', (req, res) => {
      try {
        res.json({
          success: true,
          config: {
            regexPattern: E9_REGEX_PATTERN.toString(),
            regexSource: E9_REGEX_PATTERN.source,
            baseValue: E9_BASE_VALUE,
            lineReference: E9_LINE_REFERENCE,
            bootRefreshEnabled: E9_BOOT_REFRESH_ENABLED,
            description: 'E9 values extracted from all token entries using regex, regardless of hash. Refreshes on boot.'
          },
          protocolId: PROTOCOL_ID
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }

  getRouter() {
    return this.router;
  }

  getProtocol() {
    return this.protocol;
  }
}

module.exports = EthChainProtocolAPI;


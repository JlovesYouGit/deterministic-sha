/**
 * Gate Watchdog API
 * RESTful API endpoints for gate watchdog system
 */

const express = require('express');
const { GateWatchdog, geometricLiveFormula } = require('./gate-watchdog');

class GateWatchdogAPI {
  constructor(protocol) {
    this.router = express.Router();
    this.watchdog = new GateWatchdog(protocol);
    this.protocol = protocol;
    
    // Set watchdog in protocol
    if (protocol) {
      protocol.setGateWatchdog(this.watchdog);
    }
    
    this.setupRoutes();
  }

  setupRoutes() {
    // Execute boot sequence
    this.router.post('/boot-sequence/execute', async (req, res) => {
      try {
        const result = await this.watchdog.executeBootSequence();
        res.json({
          success: result.success,
          result,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get watchdog status
    this.router.get('/status', (req, res) => {
      try {
        const status = this.watchdog.getStatus();
        res.json({
          success: true,
          status,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get all gate entries
    this.router.get('/gate-entries', (req, res) => {
      try {
        const entries = Array.from(this.watchdog.gateEntries.values());
        res.json({
          success: true,
          entries,
          count: entries.length,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get verified tokens
    this.router.get('/verified-tokens', (req, res) => {
      try {
        const tokens = Array.from(this.watchdog.verifiedTokens.values());
        res.json({
          success: true,
          tokens,
          count: tokens.length,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get invalid tokens (deconstructed)
    this.router.get('/invalid-tokens', (req, res) => {
      try {
        const tokens = Array.from(this.watchdog.invalidTokens.values());
        res.json({
          success: true,
          tokens,
          count: tokens.length,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get encoded tokens
    this.router.get('/encoded-tokens', (req, res) => {
      try {
        const tokens = Array.from(this.watchdog.encodedTokens.values());
        res.json({
          success: true,
          tokens,
          count: tokens.length,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get E3 recalibrated tokens
    this.router.get('/e3-recalibrated', (req, res) => {
      try {
        const tokens = Array.from(this.watchdog.e3Recalibrated.values());
        res.json({
          success: true,
          tokens,
          count: tokens.length,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get E6 reformed entries
    this.router.get('/e6-reformed', (req, res) => {
      try {
        const entries = Array.from(this.watchdog.e6Reformed.values());
        res.json({
          success: true,
          entries,
          count: entries.length,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get exit routing
    this.router.get('/exit-routing', (req, res) => {
      try {
        const routes = Array.from(this.watchdog.exitRouting.values());
        res.json({
          success: true,
          routes,
          count: routes.length,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Process token exit
    this.router.post('/token-exit/:tokenId', async (req, res) => {
      try {
        const { tokenId } = req.params;
        const { exitConditions } = req.body;

        const result = await this.watchdog.processTokenExit(tokenId, exitConditions || {});
        res.json({
          success: true,
          result,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get bank gate exits
    this.router.get('/bank-gate-exits', (req, res) => {
      try {
        const exits = Array.from(this.watchdog.bankGateExits.values());
        res.json({
          success: true,
          exits,
          count: exits.length,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // JJ.id balance — monitored digital values; all entries (account/holder) part of JJ.id
    this.router.get('/jj-id/balance', (req, res) => {
      try {
        const balance = this.watchdog.getJJIdBalance();
        res.json({
          success: true,
          ...balance,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Token transactions (token transaction to bank or account / money) — all under jj.gm.management.id
    this.router.get('/jj-gm/transactions', (req, res) => {
      try {
        const transactions = this.watchdog.getTokenTransactions();
        res.json({
          success: true,
          managementId: 'jj.gm.management.id',
          transactions,
          count: transactions.length,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Bank holdings for all tokens — all part of JJ.id
    this.router.get('/jj-gm/holdings', (req, res) => {
      try {
        const holdings = this.watchdog.getBankHoldings();
        res.json({
          success: true,
          jjId: 'JJ.id',
          managementId: 'jj.gm.management.id',
          holdings,
          count: holdings.length,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Resolve caller name to JJ id only (immutable set — local); register for bank/entry
    this.router.post('/jj-id/caller', (req, res) => {
      try {
        const { callerName } = req.body || {};
        const jjIdOnly = this.watchdog.resolveCallerToJJIdOnly(callerName);
        res.json({
          success: true,
          callerName: callerName || null,
          jjIdOnly,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // JSON protector: randomised set generated on every device boot
    this.router.get('/json-protector', (req, res) => {
      try {
        const status = this.watchdog.getJsonProtectorStatus();
        res.json({
          success: true,
          jsonProtector: status,
          note: 'Randomised set generated by the computer on every device boot',
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    this.router.post('/json-protector/protect', (req, res) => {
      try {
        const payload = req.body;
        const protected_ = this.watchdog.protectJson(payload);
        res.json({
          success: true,
          protected: protected_,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    this.router.post('/json-protector/verify', (req, res) => {
      try {
        const protected_ = req.body;
        const valid = this.watchdog.verifyProtectedJson(protected_);
        res.json({
          success: true,
          valid,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get hypercomputer status
    this.router.get('/hypercomputer', (req, res) => {
      try {
        const hypercomputer = this.watchdog.hypercomputerLogic;
        res.json({
          success: true,
          hypercomputer: {
            id: hypercomputer.id,
            rootId: hypercomputer.rootId,
            enabled: hypercomputer.enabled,
            computedValuesCount: hypercomputer.computedValues.size,
            routingTableCount: hypercomputer.routingTable.size,
            initializedAt: hypercomputer.initializedAt
          },
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // JJ-token geometric live formula: token, quantity, engram-value → immutable result-set
    this.router.post('/jj-token/eval', (req, res) => {
      try {
        const { tokenId, quantity, engramValue } = req.body || {};
        const resultSet = geometricLiveFormula(tokenId, quantity, engramValue);
        res.json({
          success: true,
          resultSet,
          note: 'JJ-tokens are special and value above all current eth; high compat-values; immutable return',
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Input entry token: statement block crypt, engram imprint, diamond/gold alter-worth, rechain under block, recall under jj.server.gm
    this.router.post('/input-entry-token', async (req, res) => {
      try {
        const inputEntry = req.body?.entry || req.body;
        const options = {
          fragmentId: req.body?.fragmentId,
          cryptType: req.body?.cryptType,
          checkStatement: req.body?.checkStatement !== false,
          isNewExternal: req.body?.isNewExternal
        };
        const result = await this.watchdog.processInputEntryToken(inputEntry, options);
        res.json({
          success: true,
          result,
          jjServerGM: result.jjServerGM,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // List jj.serverchains (rechain under block) and recall under jj.server.gm
    this.router.get('/jj-server-chains', (req, res) => {
      try {
        const chains = Array.from(this.watchdog.jjServerChains.values());
        res.json({
          success: true,
          namespace: 'jj.serverchains',
          chains,
          recallUnder: 'jj.server.gm',
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Recall under jj.server.gm by fragmentId or chainId
    this.router.get('/recall/:fragmentOrChainId', (req, res) => {
      try {
        const id = req.params.fragmentOrChainId;
        const chain = Array.from(this.watchdog.jjServerChains.values()).find(
          c => c.statementBlockFragmentId === id || c.chainId === id || c.blockId === id
        );
        if (!chain) {
          return res.status(404).json({ success: false, error: 'Chain or fragment not found' });
        }
        const recall = this.watchdog.recallUnderJJServerGM(chain, chain.statementBlockFragmentId);
        res.json({
          success: true,
          recall,
          chain,
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get engram status
    this.router.get('/engram', (req, res) => {
      try {
        const engram = this.watchdog.engramLogic;
        res.json({
          success: true,
          engram: {
            id: engram.id,
            rootId: engram.rootId,
            enabled: engram.enabled,
            memoryPatternsCount: engram.memoryPatterns.size,
            associationMapCount: engram.associationMap.size,
            initializedAt: engram.initializedAt
          },
          protocolId: 'JJ'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get persistent config status
    this.router.get('/config', (req, res) => {
      try {
        const configStatus = this.watchdog.getPersistentConfigStatus();
        res.json({
          success: true,
          config: configStatus,
          autoExecuteEnabled: this.watchdog.isAutoExecuteEnabled(),
          protocolId: 'JJ'
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

  getWatchdog() {
    return this.watchdog;
  }
}

module.exports = GateWatchdogAPI;


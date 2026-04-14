/**
 * Network Integration with Protocol
 * Integrates Ethereum network configuration with ETH Chain Protocol
 */

const { networkRegistry } = require('./ethereum-networks');
const { EthChainProtocol } = require('./ethchain-protocol');

class NetworkProtocolIntegration {
  constructor() {
    this.networkRegistry = networkRegistry;
    this.protocols = new Map(); // One protocol instance per network
  }

  /**
   * Get or create protocol instance for network
   */
  getProtocolForNetwork(networkId) {
    if (!this.protocols.has(networkId)) {
      const protocol = new EthChainProtocol();
      const network = this.networkRegistry.getNetwork(networkId);
      
      // Set ethchain parent ID based on network
      if (network.parentNetwork) {
        const parentNetwork = this.networkRegistry.getNetwork(network.parentNetwork);
        if (parentNetwork) {
          protocol.ethchainParentId = `${parentNetwork.id}-${parentNetwork.chainId}`;
        }
      } else {
        protocol.ethchainParentId = `${network.id}-${network.chainId}`;
      }

      this.protocols.set(networkId, protocol);
    }

    return this.protocols.get(networkId);
  }

  /**
   * Execute protocol for network with network context
   */
  async executeProtocolForNetwork(networkId, protocolData) {
    const network = this.networkRegistry.getNetwork(networkId);
    const protocol = this.getProtocolForNetwork(networkId);

    // Enhance protocol data with network information
    const enhancedData = {
      ...protocolData,
      orderData: {
        networkId: network.id,
        networkName: network.name,
        chainId: network.chainId,
        layer: network.layer,
        ...protocolData.orderData
      },
      blockData: {
        networkId: network.id,
        networkName: network.name,
        chainId: network.chainId,
        layer: network.layer,
        ...protocolData.blockData
      },
      chainId: `${network.id}-${network.chainId}-${Date.now()}`
    };

    return await protocol.executeFullProtocolStack(enhancedData);
  }

  /**
   * Get all networks with their protocol states
   */
  getNetworksWithProtocols() {
    const networks = this.networkRegistry.getAllNetworks();
    
    return networks.map(network => {
      const protocol = this.protocols.get(network.id);
      return {
        network,
        protocol: protocol ? protocol.getProtocolState() : null,
        hasProtocol: protocol !== undefined
      };
    });
  }

  /**
   * Get layer hierarchy with protocols
   */
  getLayerHierarchyWithProtocols() {
    const hierarchy = this.networkRegistry.getLayerHierarchy();
    const result = {};

    Object.keys(hierarchy).forEach(layer => {
      result[layer] = hierarchy[layer].map(network => {
        const protocol = this.protocols.get(network.id);
        return {
          network,
          protocol: protocol ? protocol.getProtocolState() : null,
          hasProtocol: protocol !== undefined
        };
      });
    });

    return result;
  }

  /**
   * Link chains across layers
   */
  async linkChainsAcrossLayers(parentNetworkId, childNetworkId) {
    const parentNetwork = this.networkRegistry.getNetwork(parentNetworkId);
    const childNetwork = this.networkRegistry.getNetwork(childNetworkId);

    if (!parentNetwork || !childNetwork) {
      throw new Error('Invalid network IDs');
    }

    const parentProtocol = this.getProtocolForNetwork(parentNetworkId);
    const childProtocol = this.getProtocolForNetwork(childNetworkId);

    // Link child to parent
    childProtocol.ethchainParentId = `${parentNetwork.id}-${parentNetwork.chainId}`;

    // Execute protocol stack for child with parent context
    const result = await childProtocol.executeFullProtocolStack({
      ethAddress: '0x0000000000000000000000000000000000000000',
      ethValue: '0',
      hostLocalId: `host-${childNetwork.id}`,
      exitValue: '0',
      permissionKey: 'cross-layer-link',
      orderData: {
        parentNetwork: parentNetwork.id,
        childNetwork: childNetwork.id,
        linkType: 'cross-layer'
      },
      blockData: {
        parentNetwork: parentNetwork.id,
        childNetwork: childNetwork.id,
        linkType: 'cross-layer'
      },
      chainId: `${childNetwork.id}-linked-to-${parentNetwork.id}`
    });

    return {
      success: true,
      parentNetwork,
      childNetwork,
      protocolResult: result
    };
  }

  /**
   * Get network chain links
   */
  getNetworkChainLinks(networkId) {
    const network = this.networkRegistry.getNetwork(networkId);
    const protocol = this.protocols.get(networkId);

    if (!protocol) {
      return {
        network,
        links: [],
        linkedChains: []
      };
    }

    const state = protocol.getProtocolState();
    const childNetworks = this.networkRegistry.getChildNetworks(networkId);
    const parentNetwork = this.networkRegistry.getParentNetwork(networkId);

    return {
      network,
      parentNetwork,
      childNetworks,
      protocolLinks: state.linkedChains,
      allLinkedChains: [
        ...state.linkedChains,
        ...childNetworks.map(n => n.id)
      ]
    };
  }
}

module.exports = NetworkProtocolIntegration;


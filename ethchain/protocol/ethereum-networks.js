/**
 * Ethereum Network Configuration
 * Defines all Ethereum networks including Layer 2, 3, 4, and 5
 * Default network: Ethereum Mainnet
 * All chains under Layer 4, 3, and Layer 5
 */

const ETHEREUM_MAINNET = {
  id: 'ethereum-mainnet',
  name: 'Ethereum Mainnet',
  chainId: 1,
  networkId: 1,
  layer: 1,
  type: 'public',
  rpcUrls: [
    'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
    'https://rpc.ankr.com/eth'
  ],
  blockExplorerUrls: ['https://etherscan.io'],
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  isDefault: true,
  isProduction: true,
  description: 'The live, production network for actual ETH transactions and dApps'
};

// Public Testnets
const SEPOLIA = {
  id: 'sepolia',
  name: 'Sepolia',
  chainId: 11155111,
  networkId: 11155111,
  layer: 1,
  type: 'testnet',
  rpcUrls: [
    'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
    'https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY',
    'https://rpc.sepolia.org'
  ],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'SEP',
    decimals: 18
  },
  isDefault: false,
  isProduction: false,
  description: 'Recommended for application and contract development; uses a permissioned validator set'
};

const HOODI = {
  id: 'hoodi',
  name: 'Hoodi',
  chainId: 17000,
  networkId: 17000,
  layer: 1,
  type: 'testnet',
  rpcUrls: [
    'https://rpc.hoodi.network',
    'https://hoodi-rpc.ethereum.org'
  ],
  blockExplorerUrls: ['https://explorer.hoodi.network'],
  nativeCurrency: {
    name: 'Hoodi Ether',
    symbol: 'HETH',
    decimals: 18
  },
  isDefault: false,
  isProduction: false,
  description: 'Designed for staking and validator testing; open validator set, larger state, longer sync time'
};

const EPHEMERY = {
  id: 'ephemery',
  name: 'Ephemery',
  chainId: 20240215,
  networkId: 20240215,
  layer: 1,
  type: 'testnet',
  rpcUrls: [
    'https://rpc.ephemery.dev',
    'https://ephemery-rpc.ethereum.org'
  ],
  blockExplorerUrls: ['https://explorer.ephemery.dev'],
  nativeCurrency: {
    name: 'Ephemery Ether',
    symbol: 'ETH',
    decimals: 18
  },
  isDefault: false,
  isProduction: false,
  description: 'Resets every 28 days; ideal for short-term testing with minimal node requirements'
};

// Layer 2 (L2) Testnets
const ARBITRUM_SEPOLIA = {
  id: 'arbitrum-sepolia',
  name: 'Arbitrum Sepolia',
  chainId: 421614,
  networkId: 421614,
  layer: 2,
  type: 'l2-testnet',
  parentNetwork: 'sepolia',
  rpcUrls: [
    'https://sepolia-rollup.arbitrum.io/rpc',
    'https://arbitrum-sepolia.infura.io/v3/YOUR_PROJECT_ID'
  ],
  blockExplorerUrls: ['https://sepolia-explorer.arbitrum.io'],
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  isDefault: false,
  isProduction: false,
  description: 'Arbitrum L2 testnet tied to Sepolia'
};

const OPTIMISM_SEPOLIA = {
  id: 'optimism-sepolia',
  name: 'Optimism Sepolia',
  chainId: 11155420,
  networkId: 11155420,
  layer: 2,
  type: 'l2-testnet',
  parentNetwork: 'sepolia',
  rpcUrls: [
    'https://sepolia.optimism.io',
    'https://optimism-sepolia.infura.io/v3/YOUR_PROJECT_ID'
  ],
  blockExplorerUrls: ['https://sepolia-explorer.optimism.io'],
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  isDefault: false,
  isProduction: false,
  description: 'Optimism L2 testnet tied to Sepolia'
};

const STARKNET_SEPOLIA = {
  id: 'starknet-sepolia',
  name: 'Starknet Sepolia',
  chainId: 0x534e5f5345504f4c4941, // SN_SEPOLIA
  networkId: 'starknet-sepolia',
  layer: 2,
  type: 'l2-testnet',
  parentNetwork: 'sepolia',
  rpcUrls: [
    'https://starknet-sepolia.public.blastapi.io',
    'https://rpc.sepolia.starknet.io'
  ],
  blockExplorerUrls: ['https://sepolia.starkscan.co'],
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  isDefault: false,
  isProduction: false,
  description: 'Starknet L2 testnet tied to Sepolia'
};

// Layer 3 Networks (Application-specific chains)
const LAYER3_NETWORKS = [
  {
    id: 'polygon-zkevm',
    name: 'Polygon zkEVM',
    chainId: 1101,
    networkId: 1101,
    layer: 3,
    type: 'l3',
    parentNetwork: 'ethereum-mainnet',
    rpcUrls: ['https://zkevm-rpc.com'],
    blockExplorerUrls: ['https://explorer.zkevm.polygon.technology'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    description: 'Polygon zkEVM Layer 3 network'
  },
  {
    id: 'base',
    name: 'Base',
    chainId: 8453,
    networkId: 8453,
    layer: 3,
    type: 'l3',
    parentNetwork: 'ethereum-mainnet',
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    description: 'Base Layer 3 network'
  }
];

// Layer 4 Networks (Hyper-scalability layer)
const LAYER4_NETWORKS = [
  {
    id: 'ethchain-layer4-mainnet',
    name: 'ETH Chain Layer 4 Mainnet',
    chainId: 10004,
    networkId: 10004,
    layer: 4,
    type: 'l4',
    parentNetwork: 'ethereum-mainnet',
    rpcUrls: ['http://localhost:8545'], // Default local RPC
    blockExplorerUrls: [],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isDefault: false,
    isProduction: true,
    description: 'ETH Chain Layer 4 network - all chains under Layer 4'
  },
  {
    id: 'ethchain-layer4-sepolia',
    name: 'ETH Chain Layer 4 Sepolia',
    chainId: 10005,
    networkId: 10005,
    layer: 4,
    type: 'l4-testnet',
    parentNetwork: 'sepolia',
    rpcUrls: ['http://localhost:8546'],
    blockExplorerUrls: [],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isDefault: false,
    isProduction: false,
    description: 'ETH Chain Layer 4 testnet'
  }
];

// Layer 5 Networks (Application-specific hyper-scalability)
const LAYER5_NETWORKS = [
  {
    id: 'ethchain-layer5-mainnet',
    name: 'ETH Chain Layer 5 Mainnet',
    chainId: 10006,
    networkId: 10006,
    layer: 5,
    type: 'l5',
    parentNetwork: 'ethchain-layer4-mainnet',
    rpcUrls: ['http://localhost:8547'],
    blockExplorerUrls: [],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isDefault: false,
    isProduction: true,
    description: 'ETH Chain Layer 5 network - application-specific hyper-scalability'
  },
  {
    id: 'ethchain-layer5-sepolia',
    name: 'ETH Chain Layer 5 Sepolia',
    chainId: 10007,
    networkId: 10007,
    layer: 5,
    type: 'l5-testnet',
    parentNetwork: 'ethchain-layer4-sepolia',
    rpcUrls: ['http://localhost:8548'],
    blockExplorerUrls: [],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isDefault: false,
    isProduction: false,
    description: 'ETH Chain Layer 5 testnet'
  }
];

// Private & Development Networks
const PRIVATE_NETWORKS = [
  {
    id: 'private-network',
    name: 'Private Network',
    chainId: 1337,
    networkId: 1337,
    layer: 1,
    type: 'private',
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: [],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isDefault: false,
    isProduction: false,
    description: 'Isolated Ethereum network not connected to Mainnet or testnets'
  },
  {
    id: 'hardhat',
    name: 'Hardhat Network',
    chainId: 31337,
    networkId: 31337,
    layer: 1,
    type: 'development',
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: [],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isDefault: false,
    isProduction: false,
    description: 'Local, self-contained Ethereum environment for rapid dApp development'
  },
  {
    id: 'foundry',
    name: 'Foundry Anvil',
    chainId: 31337,
    networkId: 31337,
    layer: 1,
    type: 'development',
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: [],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    isDefault: false,
    isProduction: false,
    description: 'Local development network using Foundry Anvil'
  }
];

// All Networks Registry
const ALL_NETWORKS = [
  ETHEREUM_MAINNET,
  SEPOLIA,
  HOODI,
  EPHEMERY,
  ARBITRUM_SEPOLIA,
  OPTIMISM_SEPOLIA,
  STARKNET_SEPOLIA,
  ...LAYER3_NETWORKS,
  ...LAYER4_NETWORKS,
  ...LAYER5_NETWORKS,
  ...PRIVATE_NETWORKS
];

// Network Registry Class
class EthereumNetworkRegistry {
  constructor() {
    this.networks = new Map();
    this.defaultNetwork = ETHEREUM_MAINNET;
    this.currentNetwork = ETHEREUM_MAINNET;
    this.initializeNetworks();
  }

  initializeNetworks() {
    ALL_NETWORKS.forEach(network => {
      this.networks.set(network.id, network);
    });
  }

  getNetwork(networkId) {
    return this.networks.get(networkId) || this.defaultNetwork;
  }

  getDefaultNetwork() {
    return this.defaultNetwork;
  }

  setDefaultNetwork(networkId) {
    const network = this.networks.get(networkId);
    if (network) {
      this.defaultNetwork = network;
      this.currentNetwork = network;
      return network;
    }
    throw new Error(`Network ${networkId} not found`);
  }

  getCurrentNetwork() {
    return this.currentNetwork;
  }

  setCurrentNetwork(networkId) {
    const network = this.networks.get(networkId);
    if (network) {
      this.currentNetwork = network;
      return network;
    }
    throw new Error(`Network ${networkId} not found`);
  }

  getNetworksByLayer(layer) {
    return Array.from(this.networks.values()).filter(n => n.layer === layer);
  }

  getNetworksByType(type) {
    return Array.from(this.networks.values()).filter(n => n.type === type);
  }

  getAllNetworks() {
    return Array.from(this.networks.values());
  }

  getLayerHierarchy() {
    return {
      layer1: this.getNetworksByLayer(1),
      layer2: this.getNetworksByLayer(2),
      layer3: this.getNetworksByLayer(3),
      layer4: this.getNetworksByLayer(4),
      layer5: this.getNetworksByLayer(5)
    };
  }

  getChildNetworks(parentNetworkId) {
    return Array.from(this.networks.values())
      .filter(n => n.parentNetwork === parentNetworkId);
  }

  getParentNetwork(networkId) {
    const network = this.networks.get(networkId);
    if (network && network.parentNetwork) {
      return this.networks.get(network.parentNetwork);
    }
    return null;
  }
}

// Create singleton instance
const networkRegistry = new EthereumNetworkRegistry();

module.exports = {
  EthereumNetworkRegistry,
  networkRegistry,
  ETHEREUM_MAINNET,
  SEPOLIA,
  HOODI,
  EPHEMERY,
  ARBITRUM_SEPOLIA,
  OPTIMISM_SEPOLIA,
  STARKNET_SEPOLIA,
  LAYER3_NETWORKS,
  LAYER4_NETWORKS,
  LAYER5_NETWORKS,
  PRIVATE_NETWORKS,
  ALL_NETWORKS
};


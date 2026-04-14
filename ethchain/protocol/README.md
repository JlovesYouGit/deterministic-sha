# ETH Chain Protocol - JJ Protocol (ETH Law)

## Overview

The ETH Chain Protocol is an immutable protocol buffer system for Ethereum chains. All chains follow this protocol - links all chains. Set as **JJ only - eth law - chain follows protocol**.

## Protocol Stack Order (Immutable Logic)

The protocol follows a strict immutable stack order that must be executed sequentially:

1. **ETH_LOCK** - Lock spent ETH in personal gateway
2. **VALUE_LINK** - Link ETH value to host local ID
3. **EXPONENTIAL** - Exponential percentage increase
4. **STAKE_VALIDATION** - Validate permitted stakes
5. **ID_RETURN** - Return ID following order
6. **PARENT_LINK** - Link to ethchain parent
7. **BLOCK_GEN** - Generate tokenized blocks
8. **CHAIN_LINK** - Link all chains

## Core Components

### 1. Personal Gateway Entry
All spent ETH gets locked in personal only access gateway entry. Each gateway has:
- Unique gateway ID
- Host local ID
- Ethereum address
- Locked ETH value
- Personal access key
- Linked chains

### 2. ETH Value Link
Links ETH value to host only local ID with exponential percentage increase:
- Link ID
- Host local ID
- Linked ETH value
- Exponential percentage (increases exponentially with ETH value)
- Parent chain ID
- Generation level

### 3. Stake Permission
If exit value only under permitted, its allowed stakes:
- Stake ID
- Ethereum address
- Exit value
- Permission status
- Allowed operations

### 4. Order Return ID
Order follows order to return ID. ID linked to ethchain parent:
- Order ID
- Return ID
- Stack order
- ETH chain parent ID
- Order hash

### 5. ID Block
ID blocks generated tokenized. All order as eth chain - immutable:
- Block ID
- Tokenized ID
- ETH chain parent ID
- Block hash
- Immutable flag
- Linked blocks

### 6. Chain Link
Links all chains following JJ protocol:
- Chain ID
- Parent chain ID
- Child chains
- Protocol ID (JJ)
- Follows protocol flag

## Installation

```bash
npm install
```

## Usage

### Basic Protocol Execution

```javascript
const { EthChainProtocol } = require('./protocol/ethchain-protocol');

const protocol = new EthChainProtocol();

// Execute full protocol stack
const result = await protocol.executeFullProtocolStack({
  ethAddress: '0x1234...',
  ethValue: '1000000000000000000', // 1 ETH in wei
  hostLocalId: 'host-123',
  exitValue: '500000000000000000', // 0.5 ETH
  permissionKey: 'key-123',
  orderData: { custom: 'data' },
  blockData: { block: 'data' },
  chainId: 'chain-123'
});

console.log(result);
```

### Step-by-Step Execution

```javascript
// Step 1: Lock ETH in gateway
const gateway = protocol.lockEthInGateway(
  '0x1234...',
  '1000000000000000000',
  'host-123'
);

// Step 2: Link ETH value
const valueLink = protocol.linkEthValue(
  'host-123',
  '1000000000000000000'
);

// Step 3: Apply exponential increase
const exponential = protocol.applyExponentialIncrease(valueLink.linkId);

// Step 4: Validate stake
const stake = protocol.validateStakePermission(
  '0x1234...',
  '500000000000000000',
  'permission-key'
);

// Step 5: Process order
const order = protocol.processOrderAndReturnId({ data: 'test' });

// Step 6: Link to parent
const parentLink = protocol.linkToEthchainParent(order.returnId);

// Step 7: Generate block
const block = protocol.generateTokenizedIdBlock({ data: 'block' });

// Step 8: Link chain
const chainLink = protocol.linkChain('chain-123', parentLink.parentId);
```

## API Endpoints

When integrated with Express server:

- `GET /protocol/state` - Get protocol state
- `POST /protocol/gateway/lock` - Lock ETH in gateway
- `POST /protocol/value/link` - Link ETH value
- `POST /protocol/value/exponential` - Apply exponential increase
- `POST /protocol/stake/validate` - Validate stake permission
- `POST /protocol/order/process` - Process order and return ID
- `POST /protocol/parent/link` - Link to ethchain parent
- `POST /protocol/block/generate` - Generate tokenized ID block
- `POST /protocol/chain/link` - Link chain
- `POST /protocol/execute` - Execute full protocol stack
- `GET /protocol/verify` - Verify protocol integrity

## Protocol Characteristics

### Immutability
- All protocol operations are immutable once executed
- Protocol stack order cannot be changed
- All blocks are marked as immutable

### Exponential Percentage Increase
The exponential percentage increases based on the linked ETH value:
```
percentage = base * e^(0.1 * log10(ethValue + 1))
```

### Chain Linking
All chains must follow the JJ protocol and link to the ethchain parent. The protocol verifies that all chains follow the protocol.

## Protocol Identifier

- **Protocol ID**: `JJ`
- **Protocol Name**: `ETH_LAW`
- **Protocol Version**: `1.0.0`

## Security

- All operations require proper stack order
- Personal gateway entries have unique access keys
- Stake permissions validate exit values
- All blocks are hashed and immutable
- Protocol integrity can be verified

## Example Request

```bash
curl -X POST http://localhost:3000/protocol/execute \
  -H "Content-Type: application/json" \
  -d '{
    "ethAddress": "0x1234567890123456789012345678901234567890",
    "ethValue": "1000000000000000000",
    "hostLocalId": "host-123",
    "exitValue": "500000000000000000",
    "permissionKey": "key-123",
    "orderData": {"test": "data"},
    "blockData": {"block": "data"},
    "chainId": "chain-123"
  }'
```

## Protocol Verification

```javascript
const verification = protocol.verifyProtocolIntegrity();
console.log(verification);
// { isValid: true, issues: [] }
```

## License

MIT


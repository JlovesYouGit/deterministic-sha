/**
 * Test script for ETH Chain Protocol (JJ Protocol - ETH Law)
 * Tests all protocol stack order operations
 */

const { EthChainProtocol, PROTOCOL_STACK_ORDER, PROTOCOL_ID } = require('./ethchain-protocol');

async function testProtocol() {
  console.log('=== ETH Chain Protocol Test (JJ Protocol - ETH Law) ===\n');

  const protocol = new EthChainProtocol();
  
  console.log(`Protocol ID: ${protocol.protocolId}`);
  console.log(`Protocol Name: ${protocol.protocolName}`);
  console.log(`Protocol Version: ${protocol.protocolVersion}\n`);

  // Test 1: Full Protocol Stack Execution
  console.log('Test 1: Full Protocol Stack Execution');
  console.log('--------------------------------------');
  
  try {
    const result = await protocol.executeFullProtocolStack({
      ethAddress: '0x1234567890123456789012345678901234567890',
      ethValue: '1000000000000000000', // 1 ETH in wei
      hostLocalId: 'host-local-123',
      exitValue: '500000000000000000', // 0.5 ETH
      permissionKey: 'permission-key-123',
      orderData: { 
        test: 'order data',
        timestamp: Date.now()
      },
      blockData: {
        test: 'block data',
        timestamp: Date.now()
      },
      chainId: 'chain-123'
    });

    if (result.success) {
      console.log('✓ Full protocol stack executed successfully');
      console.log(`  Protocol Hash: ${result.protocolHash}`);
      console.log(`  Gateway ID: ${result.results.gateway.gatewayId}`);
      console.log(`  Value Link ID: ${result.results.valueLink.linkId}`);
      console.log(`  Exponential %: ${result.results.exponential.exponentialPercentage.toFixed(2)}%`);
      console.log(`  Stake ID: ${result.results.stake.stakeId}`);
      console.log(`  Order ID: ${result.results.order.orderId}`);
      console.log(`  Return ID: ${result.results.order.returnId}`);
      console.log(`  Block ID: ${result.results.block.blockId}`);
      console.log(`  Tokenized ID: ${result.results.block.tokenizedId}`);
      console.log(`  Chain ID: ${result.results.chainLink.chainId}`);
    } else {
      console.log('✗ Protocol execution failed:', result.error);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }

  console.log('\n');

  // Test 2: Protocol State
  console.log('Test 2: Protocol State');
  console.log('----------------------');
  const state = protocol.getProtocolState();
  console.log(`Current Stack Order: ${state.currentStackOrder}`);
  console.log(`ETH Chain Parent ID: ${state.ethchainParentId || 'Not set'}`);
  console.log(`Linked Chains: ${state.linkedChains.length}`);
  console.log(`Is Immutable: ${state.isImmutable}`);
  console.log(`Stats:`);
  console.log(`  Gateways: ${state.stats.gateways}`);
  console.log(`  Value Links: ${state.stats.valueLinks}`);
  console.log(`  Stakes: ${state.stats.stakes}`);
  console.log(`  Orders: ${state.stats.orders}`);
  console.log(`  Blocks: ${state.stats.blocks}`);
  console.log(`  Chain Links: ${state.stats.chainLinks}`);

  console.log('\n');

  // Test 3: Protocol Integrity Verification
  console.log('Test 3: Protocol Integrity Verification');
  console.log('----------------------------------------');
  const verification = protocol.verifyProtocolIntegrity();
  if (verification.isValid) {
    console.log('✓ Protocol integrity verified');
  } else {
    console.log('✗ Protocol integrity issues found:');
    verification.issues.forEach(issue => console.log(`  - ${issue}`));
  }

  console.log('\n');

  // Test 4: Multiple Chain Linking
  console.log('Test 4: Multiple Chain Linking');
  console.log('-------------------------------');
  
  // Create new protocol instance for chain linking test
  const protocol2 = new EthChainProtocol();
  
  try {
    // Execute protocol for chain 1
    await protocol2.executeFullProtocolStack({
      ethAddress: '0x1111111111111111111111111111111111111111',
      ethValue: '2000000000000000000', // 2 ETH
      hostLocalId: 'host-local-456',
      exitValue: '1000000000000000000', // 1 ETH
      permissionKey: 'permission-key-456',
      orderData: { chain: 'chain-1' },
      blockData: { chain: 'chain-1' },
      chainId: 'chain-1'
    });

    // Execute protocol for chain 2 (linked to chain 1)
    await protocol2.executeFullProtocolStack({
      ethAddress: '0x2222222222222222222222222222222222222222',
      ethValue: '3000000000000000000', // 3 ETH
      hostLocalId: 'host-local-789',
      exitValue: '1500000000000000000', // 1.5 ETH
      permissionKey: 'permission-key-789',
      orderData: { chain: 'chain-2', parent: 'chain-1' },
      blockData: { chain: 'chain-2', parent: 'chain-1' },
      chainId: 'chain-2'
    });

    const state2 = protocol2.getProtocolState();
    console.log(`✓ Multiple chains linked`);
    console.log(`  Total Linked Chains: ${state2.linkedChains.length}`);
    console.log(`  Chains: ${state2.linkedChains.join(', ')}`);

  } catch (error) {
    console.log('✗ Error linking chains:', error.message);
  }

  console.log('\n');

  // Test 5: Exponential Percentage Calculation
  console.log('Test 5: Exponential Percentage Calculation');
  console.log('-------------------------------------------');
  
  const protocol3 = new EthChainProtocol();
  
  try {
    // Lock ETH
    const gateway = protocol3.lockEthInGateway(
      '0x3333333333333333333333333333333333333333',
      '5000000000000000000', // 5 ETH
      'host-exponential-test'
    );

    // Link value
    const valueLink = protocol3.linkEthValue(
      'host-exponential-test',
      '5000000000000000000'
    );

    console.log(`Initial ETH Value: ${valueLink.linkedEthValue} wei`);
    console.log(`Initial Exponential %: ${valueLink.exponentialPercentage.toFixed(4)}%`);

    // Apply exponential increase multiple times
    for (let i = 0; i < 3; i++) {
      const updated = protocol3.applyExponentialIncrease(valueLink.linkId);
      console.log(`After increase ${i + 1}: ${updated.exponentialPercentage.toFixed(4)}%`);
    }

  } catch (error) {
    console.log('✗ Error:', error.message);
  }

  console.log('\n');
  console.log('=== Test Complete ===');
}

// Run tests
testProtocol().catch(console.error);


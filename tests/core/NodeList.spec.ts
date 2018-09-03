// tslint:disable:no-magic-numbers

import { Node, NodeList, NodePool } from 'ash.ts';
import { assert } from 'chai';
import { MockNode } from '../_mocks/MockNode';

describe('NodeList tests', () => {
  let nodes:NodeList<MockNode>;

  beforeEach(() => {
    nodes = new NodeList<MockNode>();
  });

  afterEach(() => {
    nodes = null;
  });

  it('adding Node triggers added Signal', () => {
    const node:MockNode = new MockNode();
    nodes.nodeAdded.add((signalNode:Node<MockNode>) => {
      assert.equal(signalNode, node);
    });
    nodes.add(node);
  });

  it('removing Node triggers removed Signal', () => {
    const node:MockNode = new MockNode();
    nodes.nodeRemoved.add((signalNode:Node<MockNode>) => {
      assert.equal(signalNode, node);
    });
    nodes.add(node);
    nodes.remove(node);
  });

  it('all Nodes are covered during iteration', () => {
    let node:MockNode;
    const nodeArray:Array<MockNode> = [];
    const numNodes = 5;
    for(let i:number = 0; i < numNodes; ++i) {
      node = new MockNode();
      nodeArray.push(node);
      nodes.add(node);
    }

    for(node = nodes.head; node; node = node.next) {
      const index:number = nodeArray.indexOf(node);
      nodeArray.splice(index, 1);
    }

    assert.equal(nodeArray.length, 0);
  });

  it('removing current Node during iteration is valid', () => {
    let node:MockNode;
    const nodeArray:Array<MockNode> = [];
    const numNodes = 5;
    for(let i:number = 0; i < numNodes; ++i) {
      node = new MockNode();
      nodeArray.push(node);
      nodes.add(node);
    }

    let count:number = 0;
    for(node = nodes.head; node; node = node.next) {
      const index:number = nodeArray.indexOf(node);
      nodeArray.splice(index, 1);
      if(++count === 2) {
        nodes.remove(node);
      }
    }
    assert.equal(nodeArray.length, 0);
  });

  it('removing next Node during iteration is valid', () => {
    let node:MockNode;
    const nodeArray:Array<MockNode> = [];
    for(let i:number = 0; i < 5; ++i) {
      node = new MockNode();
      nodeArray.push(node);
      nodes.add(node);
    }

    let count:number = 0;
    for(node = nodes.head; node; node = node.next) {
      const index:number = nodeArray.indexOf(node);
      nodeArray.splice(index, 1);
      if(++count === 2) {
        nodes.remove(node.next);
      }
    }
    assert.equal(nodeArray.length, 1);
  });

  it('NodePoll works', () => {
    const cmps = new Map<{ new():any }, string>();
    const poll = new NodePool<MockNode>(MockNode, cmps);
    const m = poll.get();
    assert.instanceOf(m, MockNode);
  });

  // let tempNode:Node;

  // it('component Added Signal Contains Correct Parameters', () => {
  //   tempNode = new MockNode();
  //   nodes.nodeAdded.add(async.add(testSignalContent, 10));
  //   nodes.add(tempNode);
  // });
  //
  // it('component Removed Signal Contains Correct Parameters', () => {
  //   tempNode = new MockNode();
  //   nodes.add(tempNode);
  //   nodes.nodeRemoved.add(async.add(testSignalContent, 10));
  //   nodes.remove(tempNode);
  // });

  // function testSignalContent(signalNode:Node):void {
  //   assert.equal(signalNode, tempNode);
  // }
  //
  // it('nodesInitiallySortedInOrderOfAddition', () => {
  //   const node1:MockNode = new MockNode();
  //   const node2:MockNode = new MockNode();
  //   const node3:MockNode = new MockNode();
  //   nodes.add(node1);
  //   nodes.add(node2);
  //   nodes.add(node3);
  //   assert.equal(nodes, nodeList(node1, node2, node3));
  // });

// public function swappingOnlyTwoNodesChangesTheirOrder() : void
// {
//    var node1 : MockNode = new MockNode();
//    var node2 : MockNode = new MockNode();
//    nodes.add( node1 );
//    nodes.add( node2 );
//    nodes.swap( node1, node2 );
//    assertThat( nodes, nodeList( node2, node1 ) );
// }
//
// [Test]
// public function swappingAdjacentNodesChangesTheirPositions() : void
// {
//    var node1 : MockNode = new MockNode();
//    var node2 : MockNode = new MockNode();
//    var node3 : MockNode = new MockNode();
//    var node4 : MockNode = new MockNode();
//    nodes.add( node1 );
//    nodes.add( node2 );
//    nodes.add( node3 );
//    nodes.add( node4 );
//    nodes.swap( node2, node3 );
//    assertThat( nodes, nodeList( node1, node3, node2, node4 ) );
// }
//
// [Test]
// public function swappingNonAdjacentNodesChangesTheirPositions() : void
// {
//    var node1 : MockNode = new MockNode();
//    var node2 : MockNode = new MockNode();
//    var node3 : MockNode = new MockNode();
//    var node4 : MockNode = new MockNode();
//    var node5 : MockNode = new MockNode();
//    nodes.add( node1 );
//    nodes.add( node2 );
//    nodes.add( node3 );
//    nodes.add( node4 );
//    nodes.add( node5 );
//    nodes.swap( node2, node4 );
//    assertThat( nodes, nodeList( node1, node4, node3, node2, node5 ) );
// }
//
// [Test]
// public function swappingEndNodesChangesTheirPositions() : void
// {
//    var node1 : MockNode = new MockNode();
//    var node2 : MockNode = new MockNode();
//    var node3 : MockNode = new MockNode();
//    nodes.add( node1 );
//    nodes.add( node2 );
//    nodes.add( node3 );
//    nodes.swap( node1, node3 );
//    assertThat( nodes, nodeList( node3, node2, node1 ) );
// }
//
// [Test]
// public function insertionSortCorrectlySortsSortedNodes() : void
// {
//    var node1 : MockNode = new MockNode( 1 );
//    var node2 : MockNode = new MockNode( 2 );
//    var node3 : MockNode = new MockNode( 3 );
//    var node4 : MockNode = new MockNode( 4 );
//    nodes.add( node1 );
//    nodes.add( node2 );
//    nodes.add( node3 );
//    nodes.add( node4 );
//    nodes.insertionSort( sortFunction );
//    assertThat( nodes, nodeList( node1, node2, node3, node4 ) );
// }
//
// [Test]
// public function insertionSortCorrectlySortsReversedNodes() : void
// {
//    var node1 : MockNode = new MockNode( 1 );
//    var node2 : MockNode = new MockNode( 2 );
//    var node3 : MockNode = new MockNode( 3 );
//    var node4 : MockNode = new MockNode( 4 );
//    nodes.add( node4 );
//    nodes.add( node3 );
//    nodes.add( node2 );
//    nodes.add( node1 );
//    nodes.insertionSort( sortFunction );
//    assertThat( nodes, nodeList( node1, node2, node3, node4 ) );
// }
//
// [Test]
// public function insertionSortCorrectlySortsMixedNodes() : void
// {
//    var node1 : MockNode = new MockNode( 1 );
//    var node2 : MockNode = new MockNode( 2 );
//    var node3 : MockNode = new MockNode( 3 );
//    var node4 : MockNode = new MockNode( 4 );
//    var node5 : MockNode = new MockNode( 5 );
//    nodes.add( node3 );
//    nodes.add( node4 );
//    nodes.add( node1 );
//    nodes.add( node5 );
//    nodes.add( node2 );
//    nodes.insertionSort( sortFunction );
//    assertThat( nodes, nodeList( node1, node2, node3, node4, node5 ) );
// }
//
// [Test]
// public function insertionSortRetainsTheOrderOfEquivalentNodes() : void
// {
//    var node1 : MockNode = new MockNode( 1 );
//    var node2 : MockNode = new MockNode( 1 );
//    var node3 : MockNode = new MockNode( 3 );
//    var node4 : MockNode = new MockNode( 4 );
//    var node5 : MockNode = new MockNode( 4 );
//    nodes.add( node3 );
//    nodes.add( node4 );
//    nodes.add( node1 );
//    nodes.add( node5 );
//    nodes.add( node2 );
//    nodes.insertionSort( sortFunction );
//    assertThat( nodes, nodeList( node1, node2, node3, node4, node5 ) );
// }
//
// [Test]
// public function mergeSortCorrectlySortsSortedNodes() : void
// {
//    var node1 : MockNode = new MockNode( 1 );
//    var node2 : MockNode = new MockNode( 2 );
//    var node3 : MockNode = new MockNode( 3 );
//    var node4 : MockNode = new MockNode( 4 );
//    nodes.add( node1 );
//    nodes.add( node2 );
//    nodes.add( node3 );
//    nodes.add( node4 );
//    nodes.mergeSort( sortFunction );
//    assertThat( nodes, nodeList( node1, node2, node3, node4 ) );
// }
//
// [Test]
// public function mergeSortCorrectlySortsReversedNodes() : void
// {
//    var node1 : MockNode = new MockNode( 1 );
//    var node2 : MockNode = new MockNode( 2 );
//    var node3 : MockNode = new MockNode( 3 );
//    var node4 : MockNode = new MockNode( 4 );
//    nodes.add( node4 );
//    nodes.add( node3 );
//    nodes.add( node2 );
//    nodes.add( node1 );
//    nodes.mergeSort( sortFunction );
//    assertThat( nodes, nodeList( node1, node2, node3, node4 ) );
// }
//
// [Test]
// public function mergeSortCorrectlySortsMixedNodes() : void
// {
//    var node1 : MockNode = new MockNode( 1 );
//    var node2 : MockNode = new MockNode( 2 );
//    var node3 : MockNode = new MockNode( 3 );
//    var node4 : MockNode = new MockNode( 4 );
//    var node5 : MockNode = new MockNode( 5 );
//    nodes.add( node3 );
//    nodes.add( node4 );
//    nodes.add( node1 );
//    nodes.add( node5 );
//    nodes.add( node2 );
//    nodes.mergeSort( sortFunction );
//    assertThat( nodes, nodeList( node1, node2, node3, node4, node5 ) );
// }
//
//   function sortFunction(node1:MockNode, node2:MockNode):number {
//     return node1.pos - node2.pos;
//   }
//
// }
// }
});

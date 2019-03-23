// tslint:disable:no-magic-numbers

import { Node, NodeList, NodePool } from 'ash.ts';
import { MockNode } from '../__mocks__/MockNode';

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
      expect(signalNode).toEqual(node);
    });
    nodes.add(node);
  });

  it('removing Node triggers removed Signal', () => {
    const node:MockNode = new MockNode();
    nodes.nodeRemoved.add((signalNode:Node<MockNode>) => {
      expect(signalNode).toEqual(node);
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

    expect(nodeArray.length).toEqual(0);
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
    expect(nodeArray.length).toEqual(0);
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
    expect(nodeArray.length).toEqual(1);
  });

  it('NodePoll works', () => {
    const cmps = new Map<{ new():any }, string>();
    const poll = new NodePool<MockNode>(MockNode, cmps);
    const m = poll.get();
    expect(m).toBeInstanceOf(MockNode);
  });

  let tempNode:MockNode;

  it('component Added Signal Contains Correct Parameters', (done) => {
    tempNode = new MockNode();
    nodes.nodeAdded.add((signalNode:Node<MockNode>) => {
      setTimeout(() => {
        expect(signalNode).toEqual(tempNode);
        done();
      });
    });
    nodes.add(tempNode);
  });

  it('component Removed Signal Contains Correct Parameters', (done) => {
    tempNode = new MockNode();
    nodes.add(tempNode);
    nodes.nodeRemoved.add((signalNode:Node<MockNode>) => {
      setTimeout(() => {
        expect(signalNode).toEqual(tempNode);
        done();
      });
    });
    nodes.remove(tempNode);
  });

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

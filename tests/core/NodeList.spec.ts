import { Node, NodeList, NodePool } from '../../src';
import '../__matchers__';
import { MockComponent, MockNode } from '../__mocks__';

describe('NodeList tests', () => {
  let nodes:NodeList<MockNode>;

  const sortFunction = (node1:MockNode, node2:MockNode):number => node1.component.x - node2.component.x;

  beforeEach(() => {
    nodes = new NodeList<MockNode>();
  });

  afterEach(() => {
    (nodes as NodeList<MockNode> | null) = null;
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
    let node:MockNode | null;
    const nodeArray:MockNode[] = [];
    const numNodes = 5;
    for (let i = 0; i < numNodes; i += 1) {
      node = new MockNode();
      nodeArray.push(node);
      nodes.add(node);
    }

    for (node = nodes.head; node; node = node.next) {
      const index:number = nodeArray.indexOf(node);
      nodeArray.splice(index, 1);
    }

    expect(nodeArray.length).toEqual(0);
  });

  it('removing current Node during iteration is valid', () => {
    let node:MockNode | null;
    const nodeArray:MockNode[] = [];
    const numNodes = 5;
    for (let i = 0; i < numNodes; i += 1) {
      node = new MockNode();
      nodeArray.push(node);
      nodes.add(node);
    }

    let count = 0;
    for (node = nodes.head; node; node = node.next) {
      const index = nodeArray.indexOf(node);
      nodeArray.splice(index, 1);
      count += 1;
      if (count === 2) {
        nodes.remove(node);
      }
    }
    expect(nodeArray.length).toEqual(0);
  });

  it('removing next Node during iteration is valid', () => {
    let node:MockNode | null;
    const nodeArray:MockNode[] = [];
    for (let i = 0; i < 5; i += 1) {
      node = new MockNode();
      nodeArray.push(node);
      nodes.add(node);
    }

    let count = 0;
    for (node = nodes.head; node; node = node.next) {
      const index:number = nodeArray.indexOf(node);
      nodeArray.splice(index, 1);
      count += 1;
      if (count === 2) {
        nodes.remove(node.next!);
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

  it('nodes to be initially sorted in order of addition', () => {
    const node1:MockNode = new MockNode();
    const node2:MockNode = new MockNode();
    const node3:MockNode = new MockNode();

    nodes.add(node1);
    nodes.add(node2);
    nodes.add(node3);
    expect(nodes).toBeNodeList(node1, node2, node3);
  });

  it('swapping only two Nodes changes their order', () => {
    const node1:MockNode = new MockNode();
    const node2:MockNode = new MockNode();

    nodes.add(node1);
    nodes.add(node2);
    nodes.swap(node1, node2);
    expect(nodes).toBeNodeList(node2, node1);
  });

  it('swapping adjacent Nodes changes their positions', () => {
    const node1:MockNode = new MockNode();
    const node2:MockNode = new MockNode();
    const node3:MockNode = new MockNode();
    const node4:MockNode = new MockNode();

    nodes.add(node1);
    nodes.add(node2);
    nodes.add(node3);
    nodes.add(node4);
    nodes.swap(node2, node3);
    expect(nodes).toBeNodeList(node1, node3, node2, node4);
  });

  it('swapping non adjacent Nodes changes their positions', () => {
    const node1:MockNode = new MockNode();
    const node2:MockNode = new MockNode();
    const node3:MockNode = new MockNode();
    const node4:MockNode = new MockNode();
    const node5:MockNode = new MockNode();

    nodes.add(node1);
    nodes.add(node2);
    nodes.add(node3);
    nodes.add(node4);
    nodes.add(node5);
    nodes.swap(node2, node4);
    expect(nodes).toBeNodeList(node1, node4, node3, node2, node5);
  });

  it('swapping end Nodes changes their positions', () => {
    const node1:MockNode = new MockNode();
    const node2:MockNode = new MockNode();
    const node3:MockNode = new MockNode();
    nodes.add(node1);
    nodes.add(node2);
    nodes.add(node3);
    nodes.swap(node1, node3);
    expect(nodes).toBeNodeList(node3, node2, node1);
  });

  it('insertionSort correctly sorts sorted Nodes', () => {
    const component1:MockComponent = new MockComponent(1);
    const node1:MockNode = new MockNode();
    node1.component = component1;
    const component2:MockComponent = new MockComponent(2);
    const node2:MockNode = new MockNode();
    node2.component = component2;
    const component3:MockComponent = new MockComponent(3);
    const node3:MockNode = new MockNode();
    node3.component = component3;
    const component4:MockComponent = new MockComponent(4);
    const node4:MockNode = new MockNode();
    node4.component = component4;

    nodes.add(node1);
    nodes.add(node2);
    nodes.add(node3);
    nodes.add(node4);
    nodes.insertionSort(sortFunction);
    expect(nodes).toBeNodeList(node1, node2, node3, node4);
  });

  it('insertionSort correctly sorts reversed Nodes', () => {
    const component1:MockComponent = new MockComponent(1);
    const node1:MockNode = new MockNode();
    node1.component = component1;
    const component2:MockComponent = new MockComponent(2);
    const node2:MockNode = new MockNode();
    node2.component = component2;
    const component3:MockComponent = new MockComponent(3);
    const node3:MockNode = new MockNode();
    node3.component = component3;
    const component4:MockComponent = new MockComponent(4);
    const node4:MockNode = new MockNode();
    node4.component = component4;

    nodes.add(node4);
    nodes.add(node3);
    nodes.add(node2);
    nodes.add(node1);
    nodes.insertionSort(sortFunction);
    expect(nodes).toBeNodeList(node1, node2, node3, node4);
  });

  it('insertionSort correctly sorts mixed Nodes', () => {
    const component1:MockComponent = new MockComponent(1);
    const node1:MockNode = new MockNode();
    node1.component = component1;
    const component2:MockComponent = new MockComponent(2);
    const node2:MockNode = new MockNode();
    node2.component = component2;
    const component3:MockComponent = new MockComponent(3);
    const node3:MockNode = new MockNode();
    node3.component = component3;
    const component4:MockComponent = new MockComponent(4);
    const node4:MockNode = new MockNode();
    node4.component = component4;
    const component5:MockComponent = new MockComponent(5);
    const node5:MockNode = new MockNode();
    node5.component = component5;

    nodes.add(node3);
    nodes.add(node4);
    nodes.add(node1);
    nodes.add(node5);
    nodes.add(node2);
    nodes.insertionSort(sortFunction);
    expect(nodes).toBeNodeList(node1, node2, node3, node4, node5);
  });

  it('insertionSort retains the order of equivalent Nodes', () => {
    const component1:MockComponent = new MockComponent(1);
    const node1:MockNode = new MockNode();
    node1.component = component1;
    const component2:MockComponent = new MockComponent(1);
    const node2:MockNode = new MockNode();
    node2.component = component2;
    const component3:MockComponent = new MockComponent(3);
    const node3:MockNode = new MockNode();
    node3.component = component3;
    const component4:MockComponent = new MockComponent(4);
    const node4:MockNode = new MockNode();
    node4.component = component4;
    const component5:MockComponent = new MockComponent(4);
    const node5:MockNode = new MockNode();
    node5.component = component5;

    nodes.add(node3);
    nodes.add(node4);
    nodes.add(node1);
    nodes.add(node5);
    nodes.add(node2);
    nodes.insertionSort(sortFunction);
    expect(nodes).toBeNodeList(node1, node2, node3, node4, node5);
  });

  it('mergeSort correctly sorts sorted Nodes', () => {
    const component1:MockComponent = new MockComponent(1);
    const node1:MockNode = new MockNode();
    node1.component = component1;
    const component2:MockComponent = new MockComponent(2);
    const node2:MockNode = new MockNode();
    node2.component = component2;
    const component3:MockComponent = new MockComponent(3);
    const node3:MockNode = new MockNode();
    node3.component = component3;
    const component4:MockComponent = new MockComponent(4);
    const node4:MockNode = new MockNode();
    node4.component = component4;

    nodes.add(node1);
    nodes.add(node2);
    nodes.add(node3);
    nodes.add(node4);
    nodes.mergeSort(sortFunction);
    expect(nodes).toBeNodeList(node1, node2, node3, node4);
  });

  it('mergeSort correctly sorts reversed Nodes', () => {
    const component1:MockComponent = new MockComponent(1);
    const node1:MockNode = new MockNode();
    node1.component = component1;
    const component2:MockComponent = new MockComponent(2);
    const node2:MockNode = new MockNode();
    node2.component = component2;
    const component3:MockComponent = new MockComponent(3);
    const node3:MockNode = new MockNode();
    node3.component = component3;
    const component4:MockComponent = new MockComponent(4);
    const node4:MockNode = new MockNode();
    node4.component = component4;

    nodes.add(node4);
    nodes.add(node3);
    nodes.add(node2);
    nodes.add(node1);
    nodes.mergeSort(sortFunction);
    expect(nodes).toBeNodeList(node1, node2, node3, node4);
  });

  it('mergeSort correctly sorts mixed Nodes', () => {
    const component1:MockComponent = new MockComponent(1);
    const node1:MockNode = new MockNode();
    node1.component = component1;
    const component2:MockComponent = new MockComponent(2);
    const node2:MockNode = new MockNode();
    node2.component = component2;
    const component3:MockComponent = new MockComponent(3);
    const node3:MockNode = new MockNode();
    node3.component = component3;
    const component4:MockComponent = new MockComponent(4);
    const node4:MockNode = new MockNode();
    node4.component = component4;
    const component5:MockComponent = new MockComponent(5);
    const node5:MockNode = new MockNode();
    node5.component = component5;

    nodes.add(node3);
    nodes.add(node4);
    nodes.add(node1);
    nodes.add(node5);
    nodes.add(node2);
    nodes.mergeSort(sortFunction);
    expect(nodes).toBeNodeList(node1, node2, node3, node4, node5);
  });
});

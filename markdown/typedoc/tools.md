This package contains various tools for use with Ash - an entity component 
system framework for game development.

## Installation

`npm i @ash.ts/tools`

## Usage

### ListIteratingSystem

Utility class declared as abstract class with `updateNode` method marked as required. There are also 2 optional callback
methods that can be declared in an inherited class:
- `protected nodeAdded?:(node:Node) => void;`
- `protected nodeRemoved?:(node:Node) => void;`

Example usage:

```typescript
import { ListIteratingSystem } from '@ash.ts/ash';
import { MovementNode } from '../nodes';

export class MovementSystem extends ListIteratingSystem<MovementNode> {
  constructor() {
    super(MovementNode);
  }

  // required
  public updateNode(node:MovementNode, time:number):void {
    // update logic
  }
  
  // optional
  public nodeAdded = (node:MovementNode) => {
    // logic to execute when new node is added to the system
  };
  
  // optional
  public nodeRemoved = (node:MovementNode) => {
    // logic to execute when new node is removed from the system
  };
}

```

### ComponentPool
TBD

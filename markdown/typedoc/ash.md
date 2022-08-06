A Typescript port of [Ash Framework], an entity framework for game development 
by [Richard Lord]. This is the bundle package containing the following packages:

- [core](../modules/core.html) - Core module.
- [fsm](../modules/fsm.html) - Finite State Machine for Engine and Entities.
- [io](../modules/io.html) - Serialization/Deserialization for Engine.
- [signals](../modules/signals.html) - Signals used internally for communication.
- [tick](../modules/tick.html) - Tick providers.
- [tools](../modules/tools.html) - Optional tools for use with Ash.  

## Differences between typescript and AS3 version

As this is a port to a different language, there are some changes to the API.

### Nodes

Javascript which is a language that typescript is compiling to, is dynamic. 
Class properties that are declared but not yet instantiated doesn't have a type. 
In AS3 when Node fields are null, but they are declared as some type, that
information is kept at runtime.
Adding typescript to javascript gave us code completion and type checking, 
but information about type is dropped as soon as code is compiled to javascript
and not available at runtime. To overcome that issue there is a need to provide
type information. To do that you have to add a static `propTypes` field. This 
way type information is available in compile and runtime. Example:
 
 ```typescript
import { Node } from '@ash.ts/ash';
import { Motion, Position } from '../components';

export class MovementNode extends Node {
  public position!:Position;
  public motion!:Motion;
  
  public static propTypes = {
    position: Position,
    motion: Motion,
  }
}
```

As you can see there is some code duplication here. To avoid that there are 
2 solutions available to choose from in `@ash.ts/tools` package - `@keep` decorator
and `defineNode` helper.

Using `@keep` decorator:
```typescript
import { Node, keep } from '@ash.ts/ash';
import { Motion, Position } from '../components';

export class MovementNode extends Node {
  @keep(Position)
  public position!:Position;
  
  @keep(Motion)
  public motion!:Motion;
}
```

Using `defineNode` helper:
```typescript
import { defineNode } from '@ash.ts/ash';
import { Motion, Position } from '../components';

export const MovementNode = defineNode({
  position: Position,
  motion: Motion,
}, 'MovementNode');
export type MovementNode = InstanceType<typeof MovementNode>;
```

or shortest and recommended method:

```typescript
import { defineNode } from '@ash.ts/ash';
import { Motion, Position } from '../components';

export class MovementNode extends defineNode({
  position: Position,
  motion: Motion,
}) {}
```

### Systems

Base System class is declared as abstract class with these methods marked as 
required to be declared in an inherited class.
- `public abstract addToEngine(engine:Engine):void;`
- `public abstract removeFromEngine(engine:Engine):void;`
- `public abstract update(time:number):void;`  

Example usage:

```typescript
import { Engine, NodeList, System } from '@ash.ts/ash';
import { RenderNode } from '../nodes';

export class RenderSystem extends System {
  private nodes:NodeList<RenderNode> | null = null;

  constructor(public container:HTMLElement) {
    super();
  }

  public addToEngine(engine:Engine):void {
    this.nodes = engine.getNodeList(RenderNode);
  }

  public update(time:number):void {
    for (let node = this.nodes!.head; node; node = node.next) {
      // update logic
    }
  }

  public removeFromEngine(engine:Engine):void {
    this.nodes = null;
  }
}
```

### IO

This package provides (de)serialization of the Engine. Because of how js handle 
types, you need to provide additional string to Class map. Eg.:

```typescript
import { JsonEngineCodec } from '@ash.ts/io';
import { Display, Position } from '../components';

const classMap = new Map();
classMap.set('Position', Position);
classMap.set('Display', Display);
// ... add other classes

const codec = new JsonEngineCodec(classMap);
```

Other way to create Map (array of [string, Class] tuples):

```typescript
const classMap = new Map([
  ['Position', Position],
  ['Display', Display],
  // ... other classes
]);
```

If you export all components in one file, you can use this method:

```typescript
import * as components from './components';

const map = new Map(
  Object
    .keys(components)
    .map(key => [key, components[key as keyof typeof components]])
);
```

If your components are more complex objects, remember to also add all used
Classes. Eg. if you use PIXI you might want to add DisplayObject class.

```typescript
map.set('PIXI.DisplayObject', PIXI.DisplayObject);
```

Second important difference is exported JSON format. It's similar but not the 
same. All object codecs return object that implements EncodedObject interface.
All use the same "value" key. AS3 version use different keys for different 
types.

Typescript exported json example:

```json
{
  "id": 1,
  "type": "Position",
  "value": {"x": 0, "y": 0}
}
```

value can be any valid json, eg. array in ArrayObjectCodec, number, boolean or 
string in NativeObjectCodec or object in most other codecs.

### ListIteratingSystem

This utility class is also declared as abstract class with `updateNode` method
marked as required. There are also 2 optional callback methods that can be 
declared in an inherited class:
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


[Ash Framework]: https://github.com/richardlord/Ash
[Richard Lord]: https://www.richardlord.net

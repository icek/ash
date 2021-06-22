# Differences between AS3 and Typescript versions

As this is a port to a different language there are some changes to the API.

## Nodes

Javascript which is a language that typescript is compiling to, is dynamic.
Variables that are declared but not yet instantiated doesn't have a type. In AS3
when Node fields are null but they are declared as some type, that information
is kept at runtime. Adding typescript to javascript gave us code completion and
type checking, but information about type is dropped as soon as code is compiled
to javascript and not available at runtime. All you need to add
is `@keep(Class)` to each field of your node. This way type information is
available in compile and runtime. Example:

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

Exclamation mark used in this example is a non-null assertion operator. If you
use `"strict": true` or `"strictNullChecks": true` flags in your
`tsconfig.json` file, it's the way to silent compiler. You as a developer can
guarantee that these values will never be null, because as soon as they are
created by the Engine they are filled with components.

## Systems

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
    // some more logic
  }

  public update(time:number):void {
    for (let node = this.nodes!.head; node; node = node.next) {
      // update logic
    }
  }

  public removeFromEngine(engine:Engine):void {
    this.nodes = null;
    // some more logic
  }
}

```

## IO

This package provides (de)serialization of Engine. Because of how js handle
types, you need to provide additional string to Class record. Eg.:

```typescript
import { JsonEngineCodec } from '@ash.ts/io';
import { Display, Position } from '../components';

const classMap = {
  Display,
  Position,
  // ... add other classes
}

const codec = new JsonEngineCodec(classMap);
```

If you export all components in one file, you can use this method:

```typescript
import * as components from './components';

const codec = new JsonEngineCodec({ ...components });
```

If your components are more complex objects, remember to also add all used
Classes. Eg. if you use PIXI you might want to add DisplayObject class.

```typescript
map['PIXI.DisplayObject'] = PIXI.DisplayObject;
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
  "value": {}
}
```

value can be any valid json, eg. array in ArrayObjectCodec, number, boolean or
string in NativeObjectCodec or object in most other codecs.

## ListIteratingSystem

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

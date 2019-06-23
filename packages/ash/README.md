# @ash.ts/ash
A Typescript port of [Ash Framework], 
an entity framework for game development 
by [Richard Lord]

## Instalation

Using npm:

`npm i @ash.ts/ash`

Using yarn:
 
`yarn add @ash.ts/ash`

## Examples

- Asteroids (SVG version): [Demo][demo-svg] [Source][source-svg]
- Asteroids (PIXI.js version): [Demo][demo-pixi] [Source][source-pixi]

## Documentation

TypeDoc generated [API docs][api]

Richard Lord also written a few blog posts explaining how Ash works.

- [Ash - a new entity framework for Actionscript games.][intro]
- [What is an entity framework for game development.][what]
- [Why use an entity framework for game development.][why]

## Join the discussion (for AS3 version)

There is a [Google group for discussing Ash][group],
how to use it and how to make it better. 
Everyone who uses Ash or is interested in using Ash is welcome.

## Differences between typescript and AS3 version

As this is a port to a different language there are some changes to the API.

### Nodes

Javascript which is a language that typescript is compiling to, is dynamic. 
Variables that are declared but not yet instantiated doesn't have a type. 
In AS3 when Node fields are null but they are declared as some type, that
information is kept at runtime.
Adding typescript to javascript gave us code completion and type checking, 
but information about type is dropped as soon as code is compiled to javascript
and not available at runtime. To keep Typescript API as similar to AS3 version
it's not changed as in [ash-js] (`Ash.Nodes.create()`). All you need to add is
 `@keep(Class)` to each field of your node. This way type information is
 available in compile and run time. Example:
 
 ```typescript
import { Node, keep } from '@ash.ts/ash';
import { Motion, Position } from '../components';

export class MovementNode extends Node<MovementNode> {
  
  @keep(Position)
  public position!:Position;
  
  @keep(Motion)
  public motion!:Motion;
  
}

```
Typescript has generics which are the way to add more typing to the classes.
Similar concept in AS3 was `Vector.<Type>` but only used in this type of 
structure. In typescript generics can be used in any type of structures.
Using `Node<MovementNode>` gave compiler information about type of previous and
next node, as nodes are stored in the Engine as double linked list.

Exclamation mark used in this example is a non-null assertion operator.
If you use `"strict": true` or `"strictNullChecks": true` flags in your
`tsconfig.json` file, it's the way to silent compiler. You as a developer 
can guarantee that these values will never be null, because as soon as they
are created by the Engine they are filled with components.

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

### ListIteratingSystem

This utility class is also declared as abstract class with `updateNode` method
marked as required. There are also 2 optional callback methods that can be 
declared in an inherited class:
- `protected nodeAdded?:(node:Node<TNode>) => void;`
- `protected nodeRemoved?:(node:Node<TNode>) => void;`

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

### TickProviders

There are two tickProviders included by default:
- `IntervalTickProvider` which uses setTimeout under the hood and can be used
with static FPS,
- `RAFTickProvider` which uses requestAnimationFrame and provide as many FPS
as used browser and your environment can provide.


[Ash Framework]: https://github.com/richardlord/Ash
[Richard Lord]: https://www.richardlord.net
[demo-svg]: http://icek.github.io/asteroids
[demo-pixi]: http://icek.github.io/asteroids-pixi
[source-svg]: https://github.com/icek/asteroids
[source-pixi]: https://github.com/icek/asteroids-pixi
[api]: https://icek.github.io/ash
[intro]: http://www.richardlord.net/blog/ecs/introducing-ash.html
[what]: http://www.richardlord.net/blog/ecs/what-is-an-entity-framework.html
[why]: http://www.richardlord.net/blog/ecs/why-use-an-entity-framework.html
[group]: https://groups.google.com/forum/?fromgroups=#!forum/ash-framework
[ash-js]: https://github.com/BrettJephson/ash-js

# @ash.ts/core

Core part of ash.ts - a Typescript port of [Ash Framework], 
an entity framework for game development by [Richard Lord]

## Installation

`npm i @ash.ts/core`

## Documentation

TypeDoc generated [API docs][api]

## Differences between typescript and AS3 version

As this is a port to a different language there are some changes to the API.

### Nodes

Javascript which is a language that typescript is compiling to, is dynamic. 
Variables that are declared but not yet instantiated doesn't have a type. 
In AS3 when Node fields are null but they are declared as some type, that
information is kept at runtime.
Adding typescript to javascript gave us code completion and type checking, 
but information about type is dropped as soon as code is compiled to javascript
and not available at runtime.
To keep that information you have to define static property propTypes on a Node.
Example:
 
 ```typescript
import { Node, keep } from '@ash.ts/ash';
import { Motion, Position } from '../components';

export class MovementNode extends Node {
  public position!:Position;
  
  public motion!:Motion;
  
  public static propTypes = {
    position: Position,
    motion: Motion,
  };
}

```
There are also 2 helpers that simplifying this process:
- @keep that works as a decorator
- defineNode which is a Node class factory 

Both of these tools and their documentation are available in the @ash.ts/tools package.

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

[Ash Framework]: https://github.com/richardlord/Ash
[Richard Lord]: https://www.richardlord.net
[demo-svg]: https://icek.github.io/asteroids
[demo-pixi]: https://icek.github.io/asteroids-pixi
[source-svg]: https://github.com/icek/asteroids
[source-pixi]: https://github.com/icek/asteroids-pixi
[api]: https://icek.github.io/ash/modules/_ash_ts_core.html
[intro]: https://www.richardlord.net/blog/ecs/introducing-ash.html
[what]: https://www.richardlord.net/blog/ecs/what-is-an-entity-framework.html
[why]: https://www.richardlord.net/blog/ecs/why-use-an-entity-framework.html
[group]: https://groups.google.com/forum/?fromgroups=#!forum/ash-framework

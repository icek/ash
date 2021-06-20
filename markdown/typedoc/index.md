# @ash.ts
A Typescript port of [Ash Framework], an entity framework for game development
by [Richard Lord]. 

## Packages
- [ash](./packages/ash/README.md) - Full bundle containing all other modules.
- [core](./packages/core/README.md) - Core module. [required]
- [fsm](./packages/fsm/README.md) - Finite State Machine for Engine and Entities.
- [io](./packages/io/README.md) - Serialization/Deserialization for Engine.
- [signals](./packages/signals/README.md) - Signals used for internal communication.
  [This package is required and installed by core]
- [tick](./packages/tick/README.md) - Tick providers. [recommended]
- [tools](./packages/tools/README.md) - Optional tools for use with Ash.

## Installation

Recommended way:

`npm i -S @ash.ts/ash`

or install only needed packages (minimal example):

`npm i -S @ash.ts/signals @ash.ts/core`

## Examples

- Asteroids (SVG version): [Demo][demo-svg] [Source][source-svg]
- Asteroids (PIXI.js version): [Demo][demo-pixi] [Source][source-pixi]

## Alternatives

These are alternative typescript ports you can find:

- [ash-ts] - Private source code. No docs, no examples, only core module. 
  Components must inherit from the AshComponent class.
- [AshTS] - Not a node module, core package only.

[Ash Framework]: https://github.com/richardlord/Ash
[Richard Lord]: https://www.richardlord.net
[demo-svg]: https://icek.github.io/asteroids
[demo-pixi]: https://icek.github.io/asteroids-pixi
[source-svg]: https://github.com/icek/asteroids
[source-pixi]: https://github.com/icek/asteroids-pixi
[ash-ts]: https://www.npmjs.com/package/ash-ts
[AshTS]: https://github.com/MikeMnD/AshTS

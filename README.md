# @ash.ts monorepo

![Build Status](https://github.com/icek/ash/workflows/Publish/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/icek/ash/badge.svg?branch=master)](https://coveralls.io/github/icek/ash?branch=master)
![License](https://img.shields.io/npm/l/@ash.ts/ash)

## Documentation

- [Wiki](https://github.com/icek/ash/wiki)
- [API docs](https://icek.github.io/ash)
- [Discussions](https://github.com/icek/ash/discussions)

## Examples

Asteroids (SVG version):
- [Demo](https://icek.github.io/asteroids)
- [Source](https://github.com/icek/asteroids)

Asteroids (PIXI.js version):
- [Demo](https://icek.github.io/asteroids-pixi)
- [Source](https://github.com/icek/asteroids-pixi)

## Packages

- [ash](./packages/ash) - Full bundle containing all other modules.
- [core](./packages/core) - Core module. [required]
- [fsm](./packages/fsm) - Finite State Machine for Engine and Entities.
- [io](./packages/io) - Serialization/Deserialization for Engine.
- [signals](./packages/signals) - Signals used for internal communication.
  [This package is required and installed by core]
- [tick](./packages/tick) - Tick providers. [recommended]
- [tools](./packages/tools) - Optional tools for use with Ash.

## Development

First install:

```bash
$ npm i
$ npm run build
```

One time test:

```bash
$ npm run test
```

One time test changes files only:

```bash
$ npm run test:changed
```

Test watch mode:

```bash
$ npm run test:watch
```

Test watch changes files only:

```bash
$ npm run test:watch:changed
```

One time test and create coverage report:

```bash
$ npm run test:coverage
```

Build docs:

```bash
$ npm run docs
```

Typecheck files:

```bash
$ npm run typecheck
```

Lint files:

```bash
$ npm run lint
```

Lint files and fix:

```bash
$ npm run lint-fix
```

Clean everything:

```bash
$ npm run clean
```

## Alternatives

These are alternative typescript ports you can find:

- [ash-ts](https://www.npmjs.com/package/ash-ts) - Private source code. No docs,
  no examples, only core module. Components must inherit from the AshComponent
  class.
- [AshTS](https://github.com/MikeMnD/AshTS) - Not a node module, core package
  only.

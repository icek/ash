# @ash.ts monorepo
[![Build Status](https://travis-ci.com/icek/ash.svg?branch=master)](https://travis-ci.com/icek/ash)
[![Coverage Status](https://coveralls.io/repos/github/icek/ash/badge.svg?branch=master)](https://coveralls.io/github/icek/ash?branch=master)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## [Installation, usage & documentation](./packages/ash/README.md)

## Packages
- [ash](./packages/ash/README.md) - Full bundle containing all other modules.
- [core](./packages/core/README.md) - Core module. [required]
- [fsm](./packages/fsm/README.md) - Finite State Machine for Engine and Entities.
- [io](./packages/io/README.md) - Serialization/Deserialization for Engine.
- [signals](./packages/signals/README.md) - Signals used for internal communication. 
[This package is required and installed by core]
- [tick](./packages/tick/README.md) - Tick providers. [recommended]
- [tools](./packages/tools/README.md) - Optional tools for use with Ash.  

## Development
First install (build is automatically executed):
```bash
$ npm i
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

Coverage report:
```bash
$ npm run test:coverage
```

Build docs:
```bash
$ npm run docs
```

Lint files:
```bash
$ npm run lint
```

Clean everything:
```bash
$ npm run clean
```

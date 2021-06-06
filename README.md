# @ash.ts monorepo
![Build Status](https://github.com/icek/ash/workflows/Publish/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/icek/ash/badge.svg?branch=master)](https://coveralls.io/github/icek/ash?branch=master)
![License](https://img.shields.io/npm/l/@ash.ts/ash)

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

Test and create coverage report:
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

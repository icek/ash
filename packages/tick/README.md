# @ash.ts/tick

This package contains tick providers for use with Ash - an entity component 
system framework for game development.

## Instalation

Using npm:

`npm i @ash.ts/tick`

Using yarn:
 
`yarn add @ash.ts/tick`

## Usage

There are two tickProviders included by default:
- `IntervalTickProvider` which uses setTimeout under the hood and can be used
with static FPS,
- `RAFTickProvider` which uses requestAnimationFrame and provide as many FPS
as used browser and your environment can provide.

### Example

```typescript
import { Engine } from '@ash.ts/core';
import { RAFTickProvider } from '@ash.ts/tick';

const engine = new Engine();
const tickProvider = new RAFTickProvider();
tickProvider.add(delta => engine.update(delta));
tickProvider.start();
```

## Custom TickProviders

You can also build your own by creating a class that implements `TickProvider`
interface.

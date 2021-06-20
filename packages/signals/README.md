# @ash.ts/signals

This package contains minimal implementation of Signals inspired by AS3 Signals
created by Robert Penner. They are internally used by Ash - an entity component
system framework for game development.

## Installation

`npm i @ash.ts/signals`

## Usage

```typescript
import { Signal } from './Signal';

const signal:Signal<[string]> = new Signal();
const listener = (result:string):void => {
  // do something with result
};
signal.add(listener);
// Add listener once
signal.addOnce((result:string) => {/* */});
// Remove listener
signal.remove(listener);

// dispatch data
signal.dispatch('some string');
```

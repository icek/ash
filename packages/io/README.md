# @ash.ts/io

This package contains classes for serializing and deserializing the entities in 
an Ash game. This lets you save the entire game state by serializing all the 
entities in the engine, and restore the game by deserializing them again.

## Instalation
Using npm:

`npm i @ash.ts/tools`

Using yarn:

`yarn add @ash.ts/tools`

## Documentation

TypeDoc generated [API docs](https://icek.github.io/ash/modules/_ash_ts_io.html)

## Examples

### The basics

```typescript
import { JsonEngineCodec } from '@ash.ts/io';
import { Position } from '../components';

const classMap = new Map();
classMap.set('Position', Position);
// add other classes

const codec = new JsonEngineCodec(classMap);
const serialized = codec.encodeEngine(engine);
LocalStorage.setItem('game-state', serialized);
```

```typescript
import { Engine } from '@ash.ts/core';
import { JsonEngineCodec } from '@ash.ts/io';
import { Position } from '../components';

const classMap = new Map();
classMap.set('Position', Position);
// add other classes

const codec = new JsonEngineCodec(classMap);
const serialized = LocalStorage.getItem('game-state');
const engine:Engine = new Engine();
codec.decodeEngine(serialized, engine);
```

### Custom codecs

```typescript
import { JsonEngineCodec } from '@ash.ts/io';

const codec = new JsonEngineCodec(classMap);
const animationCodec = new AnimationObjectCodec();
codec.addCustomCodec(animationCodec, Animation);
const serialized = codec.encodeEngine(engine);
LocalStorage.setItem('game-state', serialized);
```

```typescript
import { Engine } from '@ash.ts/core';
import { JsonEngineCodec } from '@ash.ts/io';

const codec = new JsonEngineCodec(classMap);
const animationCodec = new AnimationObjectCodec();
codec.addCustomCodec(animationCodec, Animation);
const serialized = LocalStorage.getItem('game-state');
const engine = new Engine();
codec.decodeEngine(serialized, engine);
```

This lets you write custom code to handle complex objects that the core code 
provided can't handle.

### Overlaying the save

```typescript
import { JsonEngineCodec } from '@ash.ts/io';

const codec = new JsonEngineCodec(classMap);
const serialized = codec.encodeEngine(engine);
LocalStorage.setItem('game-state', serialized);
```

```typescript
import { JsonEngineCodec } from '@ash.ts/io';

const codec = new JsonEngineCodec(classMap);
const serialized = LocalStorage.getItem('game-state');
codec.decodeOverEngine(serialized, engine);
```

This will replace data in the engine with the saved data, and leave untouched 
any data that exists in the engine but not in the save. This lets you ignore 
complex objects that don't change, like animations, but store the simple data 
that does change, like the name of the current running animation and what frame 
it is on.

## The Engine Codecs

There are two levels to the serialization/deserialization. At the top level is 
the engine codecs. These can be found in the enginecodecs package. There are two
codecs in this package, the JsonEngineCodec encodes and decodes the engine as 
a Json string, and the ObjectEngineCodec encodes and decodes the engine as an 
anonymous object, which could be further serialized into another format.

An engine codec implements the EngineCodec interface, and has four methods and 
two properties. If you wish to write your own engine codecs to serialize in 
a form other than Json, you should implement this interface. The methods in the 
interface are

```typescript
function encodeEngine(engine:Engine):any;
```

To encode the entities in an engine. The returned object is the encoded data.

```typescript
function decodeEngine(encodedData:EncodedData, engine:Engine):void;
```

To decode the entities back into the provided engine.

```typescript
function decodeOverEngine(encodedData:any, engine:Engine):void;
```

To decode the entities over the top of the entities already in the provided 
engine. Entities in the decoded data are matched to entities already in the 
engine based on their names, and components are then matched based on their 
type. Where a matching entity and component are found, non-null properties in 
the decoded data are applied to the existing component in the entity. If no 
matching component is found a new component is created. When no matching entity 
is found a new entity is created. This lets you save only part of the engine 
state and restore it later.

```typescript
function addCustomCodec(codec:ObjectCodec, ...types):void;
```

Adds a custom ObjectCodec to the EngineCodec for encoding/decoding objects of 
a specific type. See the section on the Object Codecs for more info.

An engine codec also provides two signals

```typescript
encodeComplete:Signal1;
```

This signal is dispatched when the encoding is finished. The payload in the 
signal is the encoded data.

```typescript
decodeComplete:Signal1;
```

This signal is dispatched when the decoding is finished. The payload in the 
signal is the engine the data was decoded into.

## The Object Codecs

The object codecs are in the objectcodecs package. Object codecs convert objects 
of particular types to/from an anonymous object form. Object codecs are used by 
engine codecs to encode/decode each specific object.

An object codec implements the ObjectCodec interface, and has four methods.

```typescript
function encode(object:T, codecManager:CodecManager):EncodedObject;
```

To encode from one of the types handled by the codec into an anonymous object.

```typescript
function decode(object:EncodedObject, codecManager:CodecManager):T;
```

To decode from an anonymous object into the type handled by the codec.

```typescript
function decodeIntoObject(target:T, object:EncodedObject, codecManager:CodecManager):void;
```

To decode from an anonymous object into the given target object of a type 
handled by the codec. This is used when overlaying a saved game state over the 
current game state.

```typescript
function decodeIntoProperty(parent:any, property:string, object:EncodedObject, codecManager:CodecManager):void;
```

To decode from an anonymous object into the given property of another object. 
This is used when overlaying a saved game state over the current game state.

## Included object codecs

There are four ObjectCodecs included.

* NativeObjectCodec handles types number, string and boolean.
* ArrayObjectCodec handles typee Array.
* ClassObjectCodec handles objects of type Class.
* ReflectionObjectCodec uses reflection to handle any property types. 
By default, it handles all components in the engine but does not handle any 
properties of those components. You can add it as a handler for more object 
types using the EngineCodec's addCustomCodec method.

With these four ObjectCodecs, the EngineCodecs can save and restore all 
components and all properties of those components that are of type number, 
string, boolean, Class, and Arrays of these types. This is the default behaviour 
and requires no configuration. If you want to save and restore other more 
complex types you need to make a custom ObjectCodec for each of those types and 
add it to the EngineCodec using its addCustomCodec method.

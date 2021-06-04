/**
 * [[include:ash.md]]
 * @module @ash.ts/ash
 */
import {
  Class,
  ComponentMatchingFamily,
  Engine,
  Entity,
  Family,
  Node,
  NodeClass,
  NodeClassWithProps,
  NodeList,
  NodePool,
  System,
  CORE_VERSION,
} from '@ash.ts/core';
import {
  EngineStateMachine,
  EntityStateMachine,
  FSM_VERSION,
} from '@ash.ts/fsm';
import {
  CodecManager,
  EncodedComponent,
  EncodedData,
  EncodedEntity,
  EncodedObject,
  BaseEngineCodec,
  JsonEngineCodec,
  ObjectCodec,
  ObjectEngineCodec,
  IO_VERSION,
} from '@ash.ts/io';
import {
  Signal,
  SIGNALS_VERSION,
} from '@ash.ts/signals';
import {
  FixedTickProvider,
  FrameTickProvider,
  TickProvider,
  TICK_VERSION,
} from '@ash.ts/tick';
import {
  ComponentPool,
  defineNode,
  ListIteratingSystem,
  TOOLS_VERSION,
} from '@ash.ts/tools';

export {
  Signal,
  Class,
  NodeClass,
  ComponentMatchingFamily,
  Engine,
  Entity,
  Family,
  Node,
  NodePool,
  NodeList,
  System,
  BaseEngineCodec,
  ObjectCodec,
  JsonEngineCodec,
  ObjectEngineCodec,
  EncodedData,
  EncodedEntity,
  EncodedComponent,
  EncodedObject,
  CodecManager,
  EntityStateMachine,
  EngineStateMachine,
  TickProvider,
  FrameTickProvider,
  FixedTickProvider,
  ComponentPool,
  ListIteratingSystem,
  defineNode,
  NodeClassWithProps,
  CORE_VERSION,
  FSM_VERSION,
  IO_VERSION,
  SIGNALS_VERSION,
  TICK_VERSION,
  TOOLS_VERSION,
};

export const ASH_VERSION = '__version__/ash';
export const VERSION = '__version__/ash';

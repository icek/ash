/**
 * [[include:ash.md]]
 * @module ash
 */
import {
  Class,
  ComponentMatchingFamily,
  CORE_VERSION,
  Engine,
  Entity,
  Family,
  Node,
  NodeClass,
  NodeList,
  NodePool,
  System,
} from '@ash.ts/core';
import { EngineStateMachine, EntityStateMachine, FSM_VERSION } from '@ash.ts/fsm';
import {
  BaseEngineCodec,
  CodecManager,
  EncodedComponent,
  EncodedData,
  EncodedEntity,
  EncodedObject,
  IO_VERSION,
  JsonEngineCodec,
  ObjectCodec,
  ObjectEngineCodec,
} from '@ash.ts/io';
import { Listener, Signal, SIGNALS_VERSION } from '@ash.ts/signals';
import { FixedTickProvider, FrameTickProvider, TICK_VERSION, TickProvider } from '@ash.ts/tick';
import { ComponentPool, defineNode, keep, ListIteratingSystem, NodeClassWithProps, TOOLS_VERSION } from '@ash.ts/tools';

export {
  Signal,
  ComponentMatchingFamily,
  Engine,
  Entity,
  Node,
  NodePool,
  NodeList,
  System,
  BaseEngineCodec,
  JsonEngineCodec,
  ObjectEngineCodec,
  CodecManager,
  EntityStateMachine,
  EngineStateMachine,
  FrameTickProvider,
  FixedTickProvider,
  ComponentPool,
  ListIteratingSystem,
  defineNode,
  keep,
  CORE_VERSION,
  FSM_VERSION,
  IO_VERSION,
  SIGNALS_VERSION,
  TICK_VERSION,
  TOOLS_VERSION,
};

export type {
  Listener,
  Class,
  NodeClass,
  Family,
  ObjectCodec,
  EncodedData,
  EncodedEntity,
  EncodedComponent,
  EncodedObject,
  TickProvider,
  NodeClassWithProps,
};

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const ASH_VERSION:string = '__version__/ash';
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const VERSION:string = '__version__/ash';

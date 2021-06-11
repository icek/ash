/**
 * [[include:ash.md]]
 * @module @ash.ts/ash
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
  NodeClassWithProps,
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
import { Signal, SIGNALS_VERSION } from '@ash.ts/signals';
import { FixedTickProvider, FrameTickProvider, TICK_VERSION, TickProvider } from '@ash.ts/tick';
import { ComponentPool, defineNode, ListIteratingSystem, TOOLS_VERSION } from '@ash.ts/tools';

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
  CORE_VERSION,
  FSM_VERSION,
  IO_VERSION,
  SIGNALS_VERSION,
  TICK_VERSION,
  TOOLS_VERSION,
};

export type {
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

export const ASH_VERSION = '__version__/ash';
export const VERSION = '__version__/ash';

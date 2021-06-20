/**
 * [[include:core.md]]
 * @module @ash.ts/core
 */
export type { Class, NodeClass } from './types';
export { ComponentMatchingFamily } from './ComponentMatchingFamily';
export { Engine } from './Engine';
export { Entity } from './Entity';
export type { Family } from './Family';
export { Node } from './Node';
export { NodePool } from './NodePool';
export { NodeList } from './NodeList';
export { System } from './System';
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const CORE_VERSION:string = '__version__/core';

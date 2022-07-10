/**
 * [[include:signals.md]]
 * @module
 */
export type { ListenerNode } from './ListenerNode';
export type { ListenerNodePool } from './ListenerNodePool';
export type { Listener } from './Signal';
export { Signal } from './Signal';
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const SIGNALS_VERSION:string = '__version__/signals';

/**
 * [[include:tick.md]]
 * @module @ash.ts/tick
 */
export type { TickProvider } from './TickProvider';
export { FrameTickProvider } from './FrameTickProvider';
export { FixedTickProvider } from './FixedTickProvider';
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const TICK_VERSION:string = '__version__/tick';

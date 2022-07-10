/**
 * [[include:fsm.md]]
 * @module
 */
export type { ComponentInstanceProvider } from './ComponentInstanceProvider';
export type { ComponentProvider } from './ComponentProvider';
export type { ComponentSingletonProvider } from './ComponentSingletonProvider';
export type { ComponentTypeProvider } from './ComponentTypeProvider';
export type { DynamicComponentProvider } from './DynamicComponentProvider';
export type { DynamicSystemProvider } from './DynamicSystemProvider';
export type { EngineState } from './EngineState';
export { EngineStateMachine } from './EngineStateMachine';
export type { EntityState } from './EntityState';
export { EntityStateMachine } from './EntityStateMachine';
export type { StateComponentMapping } from './StateComponentMapping';
export type { StateSystemMapping } from './StateSystemMapping';
export type { SystemInstanceProvider } from './SystemInstanceProvider';
export type { SystemProvider } from './SystemProvider';
export type { SystemSingletonProvider } from './SystemSingletonProvider';
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const FSM_VERSION:string = '__version__/fsm';

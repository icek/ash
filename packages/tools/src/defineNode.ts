import { ClassType, Node, NodeClassType } from '@ash.ts/core';

const ashProp = '__ash_types__';

type RecordToNodeClass<T extends Record<string, ClassType<any>>> =
  NodeClassType<Node & { [P in keyof T]:InstanceType<T[P]> }>;

/**
 * A tool for simpler creating node classes.
 * @example
 * ```typescript
 *
 * export const RenderNode = defineNode({ position: Position, display: Display }, 'RenderNode');
 * export type RenderNode = InstanceType<typeof RenderNode>;
 * ```
 *
 * @param props string to ClassType record
 * @param name returned class name
 */
export function defineNode<T extends Record<string, ClassType<any>>>(props:T, name = ''):RecordToNodeClass<T> {
  const Cls = { [name]: class extends Node {} }[name];
  Object.defineProperty(Cls, ashProp, {
    enumerable: true,
    get: () => props,
  });

  return Cls as RecordToNodeClass<T>;
}

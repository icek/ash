import { Node } from './Node';
import { Class, NodeClassWithProps } from './types';

const propTypes = '__prop_types__';

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
export function defineNode<T extends Record<string, Class<any>>>(props:T, name = ''):NodeClassWithProps<T> {
  const Cls = {
    [name]: class extends Node {
    },
  }[name];
  Object.defineProperty(Cls, propTypes, {
    enumerable: true,
    get: () => props,
  });

  return Cls as NodeClassWithProps<T>;
}

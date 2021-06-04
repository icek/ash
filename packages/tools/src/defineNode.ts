import { Class, Node, NodeClassWithProps } from '@ash.ts/core';

/**
 * A tool for simpler creating node classes.
 * @example
 * ```typescript
 *
 * export const RenderNode = defineNode({ position: Position, display: Display }, 'RenderNode');
 * export type RenderNode = InstanceType<typeof RenderNode>;
 * ```
 *
 * or
 *
 * @example
 * ```typescript
 *
 * export class RenderNode extends defineNode({ position: Position, display: Display }) {}
 * ```
 *
 * @param props string to ClassType record
 * @param name returned class name
 */
export function defineNode<K extends string, T extends Record<K, Class<any>>>(props:T, name = ''):NodeClassWithProps<T> {
  const Cls = {
    [name]: class extends Node {
    },
  }[name];

  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    Object.defineProperty(Cls.prototype, keys[i], {
      configurable: true,
      enumerable: true,
      writable: true,
    });
  }

  Cls.propTypes = props;

  return Cls as NodeClassWithProps<T>;
}

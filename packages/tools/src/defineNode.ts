import { Class, Node, NodeClass } from '@ash.ts/core';

/**
 * Type helping in converting of propTypes to actual class properties.
 */
export type NodeClassWithProps<TProps extends Record<string, Class<any>>> =
  NodeClass<Node & { [K in keyof TProps]:InstanceType<TProps[K]> }>;

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
 * @param props string to Class record
 * @param name returned class name
 */
export function defineNode<T extends Record<string, Class<any>>>(props:T, name = ''):NodeClassWithProps<T> {
  return {
    [name]: class extends Node {
      static propTypes:Record<string, Class<any>> = props;
    },
  }[name] as NodeClassWithProps<T>;
}

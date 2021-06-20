import { Class, NodeClass } from '@ash.ts/core';

export function keep(type:Class<any>):PropertyDecorator {
  return (target, propertyKey) => {
    if (typeof propertyKey === 'symbol') {
      throw new Error('Cannot use @keep on Symbols');
    }
    const ctor = target.constructor as NodeClass<any>;
    let { propTypes } = ctor;
    if (!propTypes) {
      propTypes = {};
      ctor.propTypes = propTypes;
    }
    propTypes[propertyKey] = type;
  };
}

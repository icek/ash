import { Engine, System } from '@ash.ts/core';

export interface AsyncCallback {
  asyncCallback(system:System, type:'added', engine:Engine):void;

  asyncCallback(system:System, type:'removed', engine:Engine):void;

  asyncCallback(system:System, type:'update', time:number):void;
}

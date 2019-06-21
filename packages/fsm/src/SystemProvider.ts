import { System } from '@ash.ts/core';

export interface SystemProvider<TSystem extends System> {
  getSystem():TSystem;

  identifier:any;

  priority:number;
}

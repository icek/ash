import { System } from '@ash-ts/core';

// eslint-disable-next-line import/prefer-default-export
export interface SystemProvider<TSystem extends System> {
  getSystem():TSystem;

  identifier:any;

  priority:number;
}

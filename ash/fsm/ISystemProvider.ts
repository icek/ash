import { System } from '../core/System';

export interface ISystemProvider<TSystem extends System> {
  getSystem():TSystem;

  identifier:any;

  priority:number;
}

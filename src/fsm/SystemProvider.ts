import { System } from '../core/System';

export interface SystemProvider<TSystem extends System> {
  getSystem():TSystem;

  identifier:any;

  priority:number;
}

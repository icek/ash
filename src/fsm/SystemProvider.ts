import System from '../core/System';

// eslint-disable-next-line import/prefer-default-export
export interface SystemProvider<TSystem extends System> {
  getSystem():TSystem;

  identifier:any;

  priority:number;
}

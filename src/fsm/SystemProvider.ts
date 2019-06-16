import System from '../core/System';

interface SystemProvider<TSystem extends System> {
  getSystem():TSystem;

  identifier:any;

  priority:number;
}

export default SystemProvider;

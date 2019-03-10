import { Signal1 } from '../signals/Signal1';
import { ITickProvider } from './ITickProvider';

export class RAFTickProvider extends Signal1<number> implements ITickProvider {
  private rafId:number = 0;
  private previousTime:number = 0;

  public start():void {
    this.previousTime = Date.now();
    this.rafId = window.requestAnimationFrame(this.update);
  }

  private update = () => {
    this.rafId = window.requestAnimationFrame(this.update);
    const time = Date.now();
    const second = 1000;
    this.dispatch((time - this.previousTime) / second);
    this.previousTime = time;
  };

  public stop():void {
    window.cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  public get playing():boolean {
    return !!this.rafId;
  }
}

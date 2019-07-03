import { Signal1 } from '@ash.ts/signals';
import { TickProvider } from './TickProvider';

export class IntervalTickProvider extends Signal1<number> implements TickProvider {
  private intervalId:number = 0;

  private previousTime:number = 0;

  private _interval:number = 33;

  public constructor(interval?:number) {
    super();

    if (interval) {
      this._interval = interval;
    }
  }

  public start():void {
    this.previousTime = Date.now();
    this.intervalId = window.setInterval(this.update, this._interval);
  }

  private update = () => {
    const time = Date.now();
    const second = 1000;
    this.dispatch((time - this.previousTime) / second);
    this.previousTime = time;
  };

  public stop():void {
    window.clearInterval(this.intervalId);
    this.intervalId = 0;
  }

  public set interval(interval:number) {
    this._interval = interval;
    if (this.intervalId !== 0) {
      window.clearInterval(this.intervalId);
      this.intervalId = window.setInterval(this.update, interval);
    }
  }

  public get inteval():number {
    return this._interval;
  }

  public get playing():boolean {
    return !!this.intervalId;
  }
}

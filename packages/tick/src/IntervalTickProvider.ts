import { Signal1 } from '@ash.ts/signals';
import { TickProvider } from './TickProvider';

export class IntervalTickProvider extends Signal1<number> implements TickProvider {
  private intervalId:number = 0;

  private previousTime:number = 0;

  private pInterval:number = 33;

  public constructor(interval?:number) {
    super();

    if (interval) {
      this.pInterval = interval;
    }
  }

  public start():void {
    this.previousTime = Date.now();
    this.intervalId = window.setInterval(this.update, this.pInterval);
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
    this.pInterval = interval;
    if (this.intervalId !== 0) {
      window.clearInterval(this.intervalId);
      this.intervalId = window.setInterval(this.update, interval);
    }
  }

  public get inteval():number {
    return this.pInterval;
  }

  public get playing():boolean {
    return !!this.intervalId;
  }
}

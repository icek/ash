import { Signal1 } from '@ash.ts/signals';
import { TickProvider } from './TickProvider';

/**
 * Uses the enter frame event to provide a frame tick with a fixed frame duration. This tick ignores the length of
 * the frame and dispatches the same time period for each tick.
 */
export class FixedTickProvider extends Signal1<number> implements TickProvider {
  private frameTime:number;

  private rafId:number = 0;

  /**
   * Applies a time adjustement factor to the tick, so you can slow down or speed up the entire engine.
   * The update tick time is multiplied by this value, so a value of 1 will run the engine at the normal rate.
   */
  public timeAdjustment:number = 1;

  public constructor(frameTime:number) {
    super();
    this.frameTime = frameTime;
  }

  public start():void {
    this.rafId = requestAnimationFrame(this.dispatchTick);
  }

  public stop():void {
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private dispatchTick = () => {
    this.rafId = requestAnimationFrame(this.dispatchTick);
    this.dispatch(this.frameTime * this.timeAdjustment);
  };

  public get isPlaying():boolean {
    return !!this.rafId;
  }
}

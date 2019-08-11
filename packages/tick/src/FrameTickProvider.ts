import { Signal1 } from '@ash.ts/signals';
import { TickProvider } from './TickProvider';

/**
 * Uses the enter frame event to provide a frame tick where the frame duration is the time since the previous frame.
 * There is a maximum frame time parameter in the constructor that can be used to limit
 * the longest period a frame can be.
 */
export class FrameTickProvider extends Signal1<number> implements TickProvider {
  private rafId:number = 0;

  private previousTime:number = 0;

  private maximumFrameTime:number = 0;

  /**
   * Applies a time adjustement factor to the tick, so you can slow down or speed up the entire engine.
   * The update tick time is multiplied by this value, so a value of 1 will run the engine at the normal rate.
   */
  public timeAdjustment:number = 1;

  public constructor(maximumFrameTime:number = Number.MAX_VALUE) {
    super();
    this.maximumFrameTime = maximumFrameTime;
  }

  public start():void {
    this.rafId = requestAnimationFrame(this.dispatchTick);
    this.previousTime = performance.now();
  }

  public stop():void {
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private dispatchTick = () => {
    this.rafId = requestAnimationFrame(this.dispatchTick);
    const temp = this.previousTime;
    this.previousTime = performance.now();
    let frameTime = (this.previousTime - temp) / 1000;
    if (frameTime > this.maximumFrameTime) {
      frameTime = this.maximumFrameTime;
    }
    this.dispatch(frameTime * this.timeAdjustment);
  };

  public get isPlaying():boolean {
    return !!this.rafId;
  }
}

import { Signal } from '@ash.ts/signals';
import { TickProvider } from './TickProvider';

/**
 * Uses the enter frame event to provide a frame tick where the frame duration is the time since the previous frame.
 * There is a maximum frame time parameter in the constructor that can be used to limit
 * the longest period a frame can be.
 */
export class FrameTickProvider extends Signal<[number]> implements TickProvider {
  private rafId = 0;

  private previousTime = 0;

  private maximumFrameTime = 0;

  /**
   * Applies a time adjustement factor to the tick, so you can slow down or speed up the entire engine.
   * The update tick time is multiplied by this value, so a value of 1 will run the engine at the normal rate.
   */
  public timeAdjustment = 1;

  public constructor(maximumFrameTime = Number.MAX_VALUE) {
    super();
    this.maximumFrameTime = maximumFrameTime;
  }

  public start():void {
    this.rafId = window.requestAnimationFrame(this.dispatchTick);
    this.previousTime = performance.now();
  }

  public stop():void {
    window.cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private dispatchTick = ():void => {
    this.rafId = window.requestAnimationFrame(this.dispatchTick);
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

/**
 * The interface for a tick provider. A tick provider dispatches a regular update tick
 * to act as the heartbeat for the engine. It has methods to start and stop the tick and
 * to add and remove listeners for the tick.
 */
// eslint-disable-next-line import/prefer-default-export
export interface TickProvider {
  readonly playing:boolean;

  add(listener:(delta:number) => void):void;

  remove(listener:(delta:number) => void):void;

  start():void;

  stop():void;
}

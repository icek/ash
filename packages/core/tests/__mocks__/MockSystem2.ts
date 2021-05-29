import { Engine, System } from '../../src';
import { AsyncCallback } from './AsyncCallback';

export class MockSystem2 extends System {
  private mockObject:AsyncCallback;

  public constructor(mockObject:AsyncCallback) {
    super();
    this.mockObject = mockObject;
  }

  public addToEngine(engine:Engine):void {
    if (this.mockObject && this.mockObject.asyncCallback) {
      this.mockObject.asyncCallback(this, 'added', engine);
    }
  }

  public removeFromEngine(engine:Engine):void {
    if (this.mockObject && this.mockObject.asyncCallback) {
      this.mockObject.asyncCallback(this, 'removed', engine);
    }
  }

  public update(time:number):void {
    if (this.mockObject && this.mockObject.asyncCallback) {
      this.mockObject.asyncCallback(this, 'update', time);
    }
  }
}

import { Engine, System } from '../../src';

export class MockSystem2 extends System {
  private mockObject:any;

  public constructor(mockObject:any) {
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

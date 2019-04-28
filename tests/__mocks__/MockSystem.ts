import { Engine, System } from 'ash';

export class MockSystem extends System {
  constructor() {
    super();
  }

  public addToEngine(engine:Engine):void {
    //
  }

  public removeFromEngine(engine:Engine):void {
    //
  }

  public update(time:Number):void {
    //
  }
}

export class MockSystem2 extends System {
  private mockObject:any;

  constructor(mockObject:any) {
    super();
    this.mockObject = mockObject;
  }

  public addToEngine(engine:Engine):void {
    if(this.mockObject && this.mockObject.asyncCallback) {
      this.mockObject.asyncCallback(this, 'added', engine);
    }
  }

  public removeFromEngine(engine:Engine):void {
    if(this.mockObject && this.mockObject.asyncCallback) {
      this.mockObject.asyncCallback(this, 'removed', engine);
    }
  }

  public update(time:Number):void {
    if(this.mockObject && this.mockObject.asyncCallback) {
      this.mockObject.asyncCallback(this, 'update', time);
    }
  }
}

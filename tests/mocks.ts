import { keep, Node, IFamily, Engine, ClassType, NodeList, Entity, System } from 'ash.ts';

export class MockFamily implements IFamily<MockNode> {
  public static instances:MockFamily[] = [];

  public newEntityCalls:number = 0;
  public removeEntityCalls:number = 0;
  public componentAddedCalls:number = 0;
  public componentRemovedCalls:number = 0;
  public cleanUpCalls:number = 0;

  public static reset():void {
    MockFamily.instances = [];
  }

  constructor(nodeClass:ClassType<any>, engine:Engine) {
    MockFamily.instances.push(this);
  }

  public get nodeList():NodeList<MockNode> {
    return null;
  }

  public newEntity(entity:Entity):void {
    this.newEntityCalls++;
  }

  public removeEntity(entity:Entity):void {
    this.removeEntityCalls++;
  }

  public componentAddedToEntity(entity:Entity, componentClass:ClassType<any>):void {
    this.componentAddedCalls++;
  }

  public componentRemovedFromEntity(entity:Entity, componentClass:ClassType<any>):void {
    this.componentRemovedCalls++;
  }

  public cleanUp():void {
    this.cleanUpCalls++;
  }
}

export class Point {
  public x:number = 0;
  public y:number = 0;

  public getSize() {
    return this.x - this.y;
  }
}

export class Matrix extends Point {
  public a:number = 1;
  public b:number = 0;
  public c:number = 0;
  public d:number = 1;
}

export class MockNode extends Node<MockNode> {
  @keep(Point)
  public point:Point = null;
}

export class MockNode2 extends Node<MockNode2> {
  @keep(Point)
  public point:Point = null;
  @keep(Matrix)
  public matrix:Matrix = null;
}

export class MockComponent {
  public x:number;
  public y:number;

  public constructor(x:number = 0, y:number = 0) {
    this.x = x;
    this.y = y;
  }
}

export class MockComponentExtended extends MockComponent {
  public z:number;

  public constructor(x:number = 0, y:number = 0, z:number = 0) {
    super(x, y);
    this.z = z;
  }
}

export class MockComponent1 {
  public x:number;
  public y:number;

  public constructor(x:number = 0, y:number = 0) {
    this.x = x;
    this.y = y;
  }
}

export class MockComponent2 {
  public x:number;
  public y:number;

  public constructor(x:number = 0, y:number = 0) {
    this.x = x;
    this.y = y;
  }
}

export class MockSystem extends System {
  constructor() {
    super();
  }

  public addToEngine(engine:Engine):void {}

  public removeFromEngine(engine:Engine):void {}

  public update(time:Number):void {}
}

export class MockSystem2 extends System {
  private mockObject:any;

  constructor(mockObject:any) {
    super();
    this.mockObject = mockObject;
  }

  public addToEngine(engine:Engine):void {
    if(this.mockObject && this.mockObject.asyncCallback)
      this.mockObject.asyncCallback(this, 'added', engine);
  }

  public removeFromEngine(engine:Engine):void {
    if(this.mockObject && this.mockObject.asyncCallback)
      this.mockObject.asyncCallback(this, 'removed', engine);
  }

  public update(time:Number):void {
    if(this.mockObject && this.mockObject.asyncCallback)
      this.mockObject.asyncCallback(this, 'update', time);
  }
}

export class MockReflectionObject {
  public numberVariable:number;
  public booleanVariable:boolean;
  public stringVariable:string;
  public pointVariable:Point;
  public point2Variable:Point;
  public matrixVariable:Matrix;
  public matrix2Variable:Matrix;
  public arrayVariable:number[];

  public get getOnlyAccessor():number {
    return 1;
  }

  public set setOnlyAccessor(value:number) {
  }
}

import { ClassType, Engine, Entity, IFamily, NodeList } from 'ash.ts';
import { MockNode } from './MockNode';

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

import { ClassType, Engine, Entity, Family, NodeList } from '../../src';
import { MockNode } from './MockNode';

export class MockFamily implements Family<MockNode> {
  public static instances:MockFamily[] = [];

  public newEntityCalls = 0;

  public removeEntityCalls = 0;

  public componentAddedCalls = 0;

  public componentRemovedCalls = 0;

  public cleanUpCalls = 0;

  private _nodeList:NodeList<MockNode> = new NodeList();

  public static reset():void {
    MockFamily.instances = [];
  }

  public constructor(nodeClass:ClassType<any>, engine:Engine) {
    MockFamily.instances.push(this);
  }

  public get nodeList():NodeList<MockNode> {
    return this._nodeList;
  }

  public newEntity(entity:Entity):void {
    this.newEntityCalls += 1;
  }

  public removeEntity(entity:Entity):void {
    this.removeEntityCalls += 1;
  }

  public componentAddedToEntity(entity:Entity, componentClass:ClassType<any>):void {
    this.componentAddedCalls += 1;
  }

  public componentRemovedFromEntity(entity:Entity, componentClass:ClassType<any>):void {
    this.componentRemovedCalls += 1;
  }

  public cleanUp():void {
    this.cleanUpCalls += 1;
  }
}

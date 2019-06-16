import {
  ClassType,
  Engine,
  Entity,
  Family,
  NodeList,
} from '../../src';
import MockNode from './MockNode';

export default class MockFamily implements Family<MockNode> {
  public static instances:MockFamily[] = [];

  public newEntityCalls:number = 0;

  public removeEntityCalls:number = 0;

  public componentAddedCalls:number = 0;

  public componentRemovedCalls:number = 0;

  public cleanUpCalls:number = 0;

  private pNodeList:NodeList<MockNode> = new NodeList<MockNode>();

  public static reset():void {
    MockFamily.instances = [];
  }

  public constructor(nodeClass:ClassType<any>, engine:Engine) {
    MockFamily.instances.push(this);
  }

  public get nodeList():NodeList<MockNode> {
    return this.pNodeList;
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

import { Engine, Entity } from '@ash.ts/core';
import { CodecManager } from '../objectcodecs/CodecManager';
import { EncodedComponent, EncodedData, EncodedEntity, EncodedObject } from './EncodedData';

export class EngineEncoder {
  private codecManager:CodecManager;

  private componentEncodingMap:Map<any, EncodedComponent> = new Map();

  private encodedEntities:EncodedEntity[] = [];

  private encodedComponents:EncodedComponent[] = [];

  private nextComponentId = 1;

  private encoded:EncodedData;

  public constructor(codecManager:CodecManager) {
    this.codecManager = codecManager;
    this.encoded = { entities: this.encodedEntities, components: this.encodedComponents };
    this.reset();
  }

  public reset():void {
    this.nextComponentId = 1;
    this.encodedEntities.length = 0;
    this.encodedComponents.length = 0;
    this.componentEncodingMap.clear();
  }

  public encodeEngine(engine:Engine):EncodedData {
    this.reset();
    for (const entity of engine.entities) {
      this.encodeEntity(entity);
    }
    return this.encoded;
  }

  private encodeEntity(entity:Entity):void {
    const components:any[] = entity.getAll();
    const componentIds:number[] = [];
    for (const component of components) {
      const encodedComponentId:number = this.encodeComponent(component);
      if (encodedComponentId > -1) {
        componentIds.push(encodedComponentId);
      }
    }
    this.encodedEntities.push({
      name: entity.name,
      components: componentIds,
    });
  }

  private encodeComponent(component:any):number {
    if (this.componentEncodingMap.has(component)) {
      return this.componentEncodingMap.get(component)!.id;
    }
    const encodedObject:EncodedObject | null = this.codecManager.encodeComponent(component);
    if (encodedObject) {
      const encoded = encodedObject as EncodedComponent;
      this.nextComponentId += 1;
      encoded.id = this.nextComponentId;
      this.componentEncodingMap.set(component, encoded);
      this.encodedComponents.push(encoded);
      return encoded.id;
    }
    return -1;
  }
}

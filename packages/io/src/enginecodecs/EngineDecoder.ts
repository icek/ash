import { Class, Engine, Entity } from '@ash.ts/core';
import { CodecManager } from '../objectcodecs/CodecManager';
import { ObjectCodec } from '../objectcodecs/ObjectCodec';
import { EncodedComponent, EncodedData, EncodedEntity, EncodedObject } from './EncodedData';

export class EngineDecoder {
  private codecManager:CodecManager;

  private componentMap:any[] = [];

  private encodedComponentMap:EncodedObject[] = [];

  public constructor(codecManager:CodecManager) {
    this.codecManager = codecManager;
  }

  public reset():void {
    this.componentMap.length = 0;
    this.encodedComponentMap.length = 0;
  }

  public decodeEngine(encodedData:EncodedData, engine:Engine):void {
    this.reset();
    for (const encodedComponent of encodedData.components) {
      this.decodeComponent(encodedComponent);
    }

    for (const encodedEntity of encodedData.entities) {
      engine.addEntity(this.decodeEntity(encodedEntity));
    }
  }

  public decodeOverEngine(encodedData:EncodedData, engine:Engine):void {
    this.reset();
    for (const encodedComponent of encodedData.components) {
      this.encodedComponentMap[encodedComponent.id] = encodedComponent;
      this.decodeComponent(encodedComponent);
    }

    for (const encodedEntity of encodedData.entities) {
      if (encodedEntity.name) {
        const { name } = encodedEntity;
        if (name) {
          const existingEntity:Entity | null = engine.getEntityByName(name);
          if (existingEntity) {
            this.overlayEntity(existingEntity, encodedEntity);
            continue;
          }
        }
      }
      engine.addEntity(this.decodeEntity(encodedEntity));
    }
  }

  private overlayEntity(entity:Entity, encodedEntity:EncodedEntity):void {
    for (const componentId of encodedEntity.components) {
      if (this.componentMap[componentId]) {
        const newComponent:any = this.componentMap[componentId];
        if (newComponent) {
          const type = newComponent.constructor as Class<any>;
          const existingComponent:any = entity.get(type);
          if (existingComponent) {
            this.codecManager.decodeIntoComponent(existingComponent, this.encodedComponentMap[componentId]);
          } else {
            entity.add(newComponent);
          }
        }
      }
    }
  }

  private decodeEntity(encodedEntity:EncodedEntity):Entity {
    const entity:Entity = new Entity();
    if (encodedEntity.name) {
      entity.name = encodedEntity.name;
    }
    for (const componentId of encodedEntity.components) {
      if (this.componentMap[componentId]) {
        entity.add(this.componentMap[componentId]);
      }
    }

    return entity;
  }

  private decodeComponent(encodedComponent:EncodedComponent):void {
    const type = this.codecManager.stringToClassMap[encodedComponent.type];
    if (!type) return;
    const codec:ObjectCodec<any> = this.codecManager.getCodecForComponent(type);
    if (!codec) return;
    const decodedComponent = this.codecManager.decodeComponent(encodedComponent);
    if (decodedComponent) this.componentMap[encodedComponent.id] = decodedComponent;
  }
}

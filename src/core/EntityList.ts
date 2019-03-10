import { Entity } from './Entity';

/**
 * An internal class for a linked list of entities. Used inside the framework for
 * managing the entities.
 */
export class EntityList {
  public head:Entity | null = null;
  public tail:Entity | null = null;

  public add(entity:Entity):void {
    if(!this.head) {
      this.head = this.tail = entity;
      entity.next = entity.previous = null;
    } else {
      this.tail!.next = entity;
      entity.previous = this.tail;
      entity.next = null;
      this.tail = entity;
    }
  }

  public remove(entity:Entity):void {
    if(this.head === entity) {
      this.head = this.head.next;
    }
    if(this.tail === entity) {
      this.tail = this.tail.previous;
    }

    if(entity.previous) {
      entity.previous.next = entity.next;
    }

    if(entity.next) {
      entity.next.previous = entity.previous;
    }
    // N.B. Don't set entity.next and entity.previous to null because that
    // will break the list iteration if node is the current node in the iteration.
  }

  public removeAll():void {
    while(this.head) {
      const entity:Entity = this.head;
      this.head = this.head.next;
      entity.previous = null;
      entity.next = null;
    }
    this.tail = null;
  }
}

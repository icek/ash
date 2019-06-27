export interface EncodedObject {
  type:string;
  value:any;
}

export interface EncodedComponent extends EncodedObject {
  id:number;
}

export interface EncodedEntity {
  name:string;
  components:number[];
}

export interface EncodedData {
  entities:EncodedEntity[];
  components:EncodedComponent[];
}

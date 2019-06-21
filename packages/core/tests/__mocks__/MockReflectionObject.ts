import { MockComponent, MockComponentExtended } from './MockComponent';

export class MockReflectionObject {
  public numberVariable:number = 0;

  public booleanVariable:boolean = false;

  public stringVariable:string = '';

  public pointVariable:MockComponent | null = null;

  public point2Variable:MockComponent | null = null;

  public matrixVariable:MockComponentExtended | null = null;

  public matrix2Variable:MockComponentExtended | null = null;

  public arrayVariable:number[] | null = null;

  public get getOnlyAccessor():number {
    return 1;
  }

  public set setOnlyAccessor(value:number) {
    //
  }
}

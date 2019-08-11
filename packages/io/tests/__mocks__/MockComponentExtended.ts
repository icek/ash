import { MockComponent } from './MockComponent';

export class MockComponentExtended extends MockComponent {
  public z:number;

  public constructor(x:number = 0, y:number = 0, z:number = 0) {
    super(x, y);
    this.z = z;
  }
}

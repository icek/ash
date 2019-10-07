import { MockComponent } from './MockComponent';

export class MockComponentExtended extends MockComponent {
  public z:number;

  public constructor(x = 0, y = 0, z = 0) {
    super(x, y);
    this.z = z;
  }
}

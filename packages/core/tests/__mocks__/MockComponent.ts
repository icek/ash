export class MockComponent {
  public x:number;

  public y:number;

  public constructor(x:number = 0, y:number = 0) {
    this.x = x;
    this.y = y;
  }
}

export class MockComponentExtended extends MockComponent {
  public z:number;

  public constructor(x:number = 0, y:number = 0, z:number = 0) {
    super(x, y);
    this.z = z;
  }
}

export class MockComponent1 {
  public x:number;

  public constructor(x:number = 0) {
    this.x = x;
  }
}

export class MockComponent2 {
  public y:number;

  public constructor(y:number = 0) {
    this.y = y;
  }
}

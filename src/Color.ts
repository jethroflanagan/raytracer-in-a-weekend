import { Vector3 } from './Vector';

export class Color {
  constructor(public r: number = 0, public g: number = 0, public b: number = 0) {
  }

  toVector(): Vector3 {
    return new Vector3(this.r, this.g, this.b);
  }
}

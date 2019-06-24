import { Vector3 } from './Vector';

export class Ray {
  public origin: Vector3;
  public direction: Vector3;

  constructor(origin: Vector3, direction: Vector3) {
    this.origin = origin.clone();
    this.direction = direction.clone();
  }

  pointAtParameter(t: number = 1) {
    const direction = this.direction.clone();
    const origin = this.origin.clone();
    return origin.add(
      direction.multiply(t)
    ).normalize();
  }

  unitDirection() {
    return this.direction.subtract(this.origin).normalize();
  }

}

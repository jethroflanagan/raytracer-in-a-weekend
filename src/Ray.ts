import { Vector3 } from 'src/Vector';

export class Ray {

  constructor(public origin: Vector3, public direction: Vector3) {
  }

  pointAtParameter(t: number = 1) {
    const direction = this.direction;
    const origin = this.origin;
    return origin.add(
      direction.multiply(t)
    );
  }

  unitDirection() {
    return this.direction.unit();
  }

}

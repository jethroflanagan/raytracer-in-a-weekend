import { Vector3 } from 'src/Vector';

export class Ray {
  time: number;
  
  constructor(public origin: Vector3, public direction: Vector3, options: { time?: number } = {}) {
    this.time = options.time;
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

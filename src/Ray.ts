import Vector3 from 'vector-3';

export class Ray {
  constructor(public origin: Vector3, public direction: Vector3) {}

  pointAtParameter(t: number) {
    this.origin + this.direction * t;
  }
}

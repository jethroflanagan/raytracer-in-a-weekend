import { Material } from 'src/material/Material';
import { Vector3 } from 'src/Vector';
import { Volume } from 'src/volume/Volume';
import { Ray } from 'src/Ray';
import { Intersection } from 'src/Intersection';
import { AABB } from './AABB';

export class Plane implements Volume {
  material: Material;
  a0: number;
  a1: number;
  b0: number;
  b1: number;
  k: number;
  axis: 'x' | 'y' | 'z';
  flipNormals: boolean;

  constructor({ a0, a1, b0, b1, k, axis, flipNormals = false, material }: { a0: number, a1: number, b0: number, b1: number, k: number, axis: 'x' | 'y' | 'z', flipNormals?: boolean, material: Material }) {
    this.a0 = a0;
    this.a1 = a1;
    this.b0 = b0;
    this.b1 = b1;
    this.k = k;
    this.axis = axis;
    this.flipNormals = flipNormals;
    this.material = material;
  }

  hit(ray: Ray, tMin: number, tMax: number): Intersection {
    const { a0, b0, a1, b1, k, axis } = this;
    const t = (k - ray.origin[axis]) / ray.direction[axis];
    if (t < tMin || t > tMax) {
      return null;
    }
    let a = null;
    let b = null;
    let normal = null;
    switch (axis) {
      case 'x':
        a = ray.origin.y + t * ray.direction.y;
        b = ray.origin.z + t * ray.direction.z;
        normal = new Vector3(1, 0, 0);
        break;
      case 'y':
        a = ray.origin.x + t * ray.direction.x;
        b = ray.origin.z + t * ray.direction.z;
        normal = new Vector3(0, 1, 0);
        break;
      case 'z':
        a = ray.origin.x + t * ray.direction.x;
        b = ray.origin.y + t * ray.direction.y;
        normal = new Vector3(0, 0, 1);
        break;
    }

    if (a < a0 || a > a1 || b < b0 || b > b1) {
      return null;
    }

    const point = ray.pointAtParameter(t);
    const intersection = <Intersection>{
      t,
      point,
      normal: this.flipNormals ? normal.multiply(-1) : normal,
      u: (a - a0) / (a1 - a0),
      v: (b - b0) / (b1 - b0),
    }
    return intersection;
  }

  getBoundingBox(t0: number, t1: number): AABB {
    const halfDepth: number = 0.0001;
    const { a0, b0, k } = this;
    return new AABB(
      new Vector3(a0, b0, k - halfDepth),
      new Vector3(a0, b0, k + halfDepth)
    );
  }

  get center(): Vector3 {
    const { a0, b0, a1, b1, k } = this;
    return new Vector3(
      (a1 - a0) / 2 + a0,
      (b1 - b0) / 2 + b0,
      k
    );
  }

}

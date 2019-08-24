import { Material } from 'src/material/Material';
import { Vector3 } from 'src/Vector';
import { Volume } from 'src/volume/Volume';
import { Ray } from 'src/Ray';
import { Intersection } from 'src/Intersection';
import { AABB } from './AABB';

export class Plane implements Volume {
  material: Material;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  k: number;

  constructor({ x0, x1, y0, y1, k, material }: { x0: number, x1: number, y0: number, y1: number, k: number, material: Material }) {
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
    this.k = k;
    this.material = material;
  }

  hit(ray: Ray, tMin: number, tMax: number): Intersection {
    const { x0, y0, x1, y1, k } = this;
    const t = (k - ray.origin.z) / ray.direction.z;
    if (t < tMin || t > tMax) {
      return null;
    }

    const x = ray.origin.x + t * ray.direction.x;
    const y = ray.origin.y + t * ray.direction.y;

    if (x < x0 || x > x1 || y < y0 || y > y1) {
      return null;
    }

    const point = ray.pointAtParameter(t);
    const intersection = <Intersection>{
      t,
      point,
      normal: new Vector3(0, 0, 1),
      u: (x - x0) / (x1 - x0),
      v: (y - y0) / (y1 - y0),
    }
    return intersection;
  }

  getBoundingBox(t0: number, t1: number): AABB {
    const halfDepth: number = 0.0001;
    const { x0, y0, k } = this;
    return new AABB(
      new Vector3(x0, y0, k - halfDepth),
      new Vector3(x0, y0, k + halfDepth)
    );
  }

}

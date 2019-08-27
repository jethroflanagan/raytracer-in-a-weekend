import { Material } from 'src/material/Material';
import { Vector3 } from 'src/Vector';
import { Volume } from 'src/volume/Volume';
import { Ray } from 'src/Ray';
import { Intersection } from 'src/Intersection';
import { AABB } from './AABB';
import { Plane } from './Plane';
import { LambertMaterial } from 'src/material/LambertMaterial';
import { ColorTexture } from 'src/texture/ColorTexture';
import { Color } from 'src/Color';
import { flipNormals } from './modifier/flipNormals';

export class Box implements Volume {
  material: Material;
  sides: Volume[];
  p0: Vector3;
  p1: Vector3;
  center: Vector3;
  dimensions: any;

  constructor({ center, dimensions, material }: { center: Vector3, dimensions: Vector3, material: Material }) {
    if (dimensions.min() < 0) {
      throw new Error('Dimensions must be positive');
    }
    const halfDimensions = dimensions.divide(2);
    const p0 = center.subtract(halfDimensions);
    const p1 = center.add(halfDimensions);

    this.p0 = p0;
    this.p1 = p1;
    this.center = center;
    this.dimensions = dimensions;

    const sides = [];
    // back
    sides.push(new Plane({ a0: p0.x, a1: p1.x, b0: p0.y, b1: p1.y, k: p0.z, axis: 'z', material }));

    // TODO: work out why order matters. Might be a render bug elsewhere
    // top
    sides.push(new Plane({ a0: p0.x, a1: p1.x, b0: p0.z, b1: p1.z, k: p1.y, axis: 'y', material }));

    // left
    sides.push(new Plane({ a0: p0.y, a1: p1.y, b0: p0.z, b1: p1.z, k: p1.x, axis: 'x', material }));

    // right
    sides.push(flipNormals(new Plane({ a0: p0.y, a1: p1.y, b0: p0.z, b1: p1.z, k: p0.x, axis: 'x', material })));

    // front
    sides.push(flipNormals(new Plane({ a0: p0.x, a1: p1.x, b0: p0.y, b1: p0.y, k: p1.z, axis: 'z', material })));

    // bottom
    sides.push(flipNormals(new Plane({ a0: p0.x, a1: p1.x, b0: p0.z, b1: p1.z, k: p0.y, axis: 'y', material })));

    this.sides = sides;
    this.material = material;
  }

  hit(ray: Ray, tMin: number, tMax: number): Intersection {
    for (let i = 0, len = this.sides.length; i < len; i++) {
      let side = this.sides[i];
      const intersection = side.hit(ray, tMin, tMax);
      if (intersection) {
        return intersection;
      }
    }
    return null;
  }

  getBoundingBox(t0: number, t1: number): AABB {
    const { p0, p1 } = this;
    return new AABB(p0, p1);
  }

}

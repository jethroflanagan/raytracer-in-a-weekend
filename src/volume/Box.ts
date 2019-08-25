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

export class Box implements Volume {
  material: Material;
  sides: Volume[];
  p0: Vector3;
  p1: Vector3;

  constructor({ p0, p1, material }: { p0: Vector3, p1: Vector3, material: Material }) {
    this.p0 = p0;
    this.p1 = p1;

    const debugMaterial = new LambertMaterial({ albedo: new ColorTexture(new Color(.1, .1, 1)) });
    const sides = [];

    // back
    sides.push(new Plane({ a0: p0.x, a1: p1.x, b0: p0.y, b1: p1.y, k: p0.z, axis: 'z', flipNormals: true, material }));
    // front
    sides.push(new Plane({ a0: p0.x, a1: p1.x, b0: p0.y, b1: p0.y, k: p1.z, axis: 'z', material }));

    // top
    sides.push(new Plane({ a0: p0.x, a1: p1.x, b0: p0.z, b1: p1.z, k: p1.y, axis: 'y', flipNormals: true, material }));
    // bottom
    sides.push(new Plane({ a0: p0.x, a1: p1.x, b0: p0.z, b1: p1.z, k: p0.y, axis: 'y', material }));

    // left
    sides.push(new Plane({ a0: p0.y, a1: p1.y, b0: p0.z, b1: p1.z, k: p1.x, axis: 'x', flipNormals: true, material }));
    // right
    sides.push(new Plane({ a0: p0.y, a1: p1.y, b0: p0.z, b1: p1.z, k: p0.x, axis: 'x', material }));

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

  get center(): Vector3 {
    // const { p0, p1 } = this;
    // return new Vector3(
    //   (a1 - a0) / 2 + a0,
    //   (b1 - b0) / 2 + b0,
    //   k
    // );
  }

}

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

export class Box2 implements Volume {
  material: Material;
  sides: Volume[];
  min: Vector3;
  max: Vector3;
  center: Vector3;
  dimensions: any;

  constructor({ center, dimensions, material }: { center: Vector3, dimensions: Vector3, material: Material }) {
    if (dimensions.min() < 0) {
      throw new Error('Dimensions must be positive');
    }
    const halfDimensions = dimensions.divide(2);
    const min = center.subtract(halfDimensions);
    const max = center.add(halfDimensions);

    this.min = min;
    this.max = max;
    this.center = center;
    this.dimensions = dimensions;
    this.material = material;
  }

  hit(ray: Ray, tMin: number, tMax: number): Intersection {
    const { min, max } = this;
    const { origin, direction } = ray;
    let temp;
    let isNormalFlipped = false;
    let normal: Vector3 = null;

    let minX = (min.x - origin.x) / direction.x;
    let maxX = (max.x - origin.x) / direction.x;
    if (maxX < minX) {
      temp = maxX;
      maxX = minX;
      minX = temp;
    }

    let minY = (min.y - origin.y) / direction.y;
    let maxY = (max.y - origin.y) / direction.y;
    if (maxY < minY) {
      temp = maxY;
      maxY = minY;
      minY = temp;
    }

    let minZ = (min.z - origin.z) / direction.z;
    let maxZ = (max.z - origin.z) / direction.z;
    if (maxZ < minZ) {
      temp = maxZ;
      maxZ = minZ;
      minZ = temp;
    }

    if (minX > maxZ || minZ < maxX) {
      return null;
    }
    if (minZ > minX) {
      minZ = minZ;
    }
    if (maxZ < maxX) {
      maxX = maxZ;
    }
    const t = maxX;
    normal = new Vector3(0, 0, 1);
    const point = ray.pointAtParameter(t);
    const intersection = <Intersection>{
      t,
      point,
      normal,
      u: 0,//(a - a0) / (a1 - a0),
      v: 0,//(b - b0) / (b1 - b0),
      material: this.material,
    }
    return intersection;
  }

  getNormalAtPoint(point) {
    const localPoint: Vector3 = point.subtract(this.center);
    let normal: Vector3;
    let min = Infinity;

    let distance = Math.abs(this.dimensions.x - Math.abs(localPoint.x));
    if (distance < min) {
        min = distance;
        const sign = localPoint.x < 0 ? -1 : 1;
        normal = new Vector3(1 * sign, 0, 0);
    }

    distance = Math.abs(this.dimensions.y - Math.abs(localPoint.y));
    if (distance < min) {
        min = distance;
        const sign = localPoint.y < 0 ? -1 : 1;
        normal = new Vector3(0, 1 * sign, 0);
    }

    distance = Math.abs(this.dimensions.z - Math.abs(localPoint.z));
    if (distance < min) {
        min = distance;
        const sign = localPoint.z < 0 ? -1 : 1;
        normal = new Vector3(0, 1 * sign, 0);
    }
    return normal;
  }

  getBoundingBox(t0: number, t1: number): AABB {
    const { min, max } = this;
    return new AABB(min, max);
  }

}

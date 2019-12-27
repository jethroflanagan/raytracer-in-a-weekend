import { Volume } from "src/volume/Volume";
import { Material } from "src/material/Material";
import { Ray } from "src/Ray";
import { Intersection } from "src/Intersection";
import { AABB } from "src/volume/AABB";
import { Vector3 } from "src/Vector";
import { toRadians } from "src/utils/math";

export class Rotate implements Volume {
  material: Material;
  center: any;
  private _angle = 0;
  private cosTheta = 0;
  private sinTheta = 1;
  private _axis: string;
  private bounds: AABB = null;

  // only allow a single angle transform so that stacking/nesting is enforced
  constructor(private volume: Volume, angle: number, axis: 'x' | 'y' | 'z') {
    this.angle = angle;
    this._axis = axis;
  }

  get axis() {
    return this._axis;
  }

  set angle(degrees: number) {
    const theta = toRadians(degrees);
    this._angle = degrees;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    this.sinTheta = sinTheta;
    this.cosTheta = cosTheta;
    const bounds = this.getBoundingBox(0, 1);
    const min = new Vector3(Infinity, Infinity, Infinity);
    const max = new Vector3(-Infinity, -Infinity, -Infinity);

    const axes = ['x', 'y', 'z'];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          const x = i * bounds.max.x + (i - 1) * bounds.min.x;
          const y = j * bounds.max.y + (j - 1) * bounds.min.y;
          const z = k * bounds.max.z + (k - 1) * bounds.min.z;
          const axisX = cosTheta * x + sinTheta * z;
          const axisY = y;
          const axisZ = -sinTheta * x + cosTheta * z;
          const temp = new Vector3(axisX, axisY, axisZ);
          for (let a = 0, len = axes.length; a < len; a++) {
            const currAxis = axes[a];
            if (temp[currAxis] < min[currAxis]) {
              min[currAxis] = temp[currAxis];
            }
            else if (temp[currAxis] > max[currAxis]) {
              max[currAxis] = temp[currAxis];
            }
          }
        }
      }
    }
    this.bounds = new AABB(min, max);
  }

  hit(ray: Ray, tMin: number, tMax: number): Intersection {
    const origin: Vector3 = ray.origin.clone();
    const direction: Vector3 = ray.direction.clone();
    const sinTheta = this.sinTheta;
    const cosTheta = this.cosTheta;
    origin.x = cosTheta * origin.x - sinTheta * origin.z;
    origin.z = sinTheta * origin.x + cosTheta * origin.z;
    direction.x = cosTheta * direction.x - sinTheta * direction.z;
    direction.z = sinTheta * direction.x + cosTheta * direction.z;

    const offset = new Ray(origin, direction, { time: ray.time });
    const intersection = this.volume.hit(offset, tMin, tMax);
    if (intersection) {
      const point = intersection.point.clone();
      const normal = intersection.normal.clone();
      point.x = cosTheta * point.x + sinTheta * point.z;
      point.z = -sinTheta * point.x + cosTheta * point.z;
      normal.x = cosTheta * normal.x + sinTheta * normal.z;
      normal.z = -sinTheta * normal.x + cosTheta * normal.z;
      intersection.point = point;
      intersection.normal = normal;
    }
    return intersection;
  }

  getBoundingBox(t0: number, t1: number): AABB {
    if (this.bounds) {
      return this.bounds;
    }
    return this.volume.getBoundingBox(t0, t1);
  }

}

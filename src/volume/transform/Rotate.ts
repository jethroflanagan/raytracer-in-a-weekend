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
  private _axis: string;
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
    const bounds = this.getBoundingBox(0, 1);

  }

  hit(ray: Ray, tMin: number, tMax: number): Intersection {
    const offsetRay = new Ray(ray.origin.subtract(this.displacement), ray.direction, { time: ray.time });
    return this.volume.hit(offsetRay, tMin, tMax);
  }
  getBoundingBox(t0: number, t1: number): AABB {
    const box = this.volume.getBoundingBox(t0, t1);
    return new AABB(box.min.add(this.displacement), box.max.add(this.displacement));
  }

}

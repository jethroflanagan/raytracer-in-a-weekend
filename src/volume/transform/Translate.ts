import { Volume } from "src/volume/Volume";
import { Material } from "src/material/Material";
import { Ray } from "src/Ray";
import { Intersection } from "src/Intersection";
import { AABB } from "src/volume/AABB";
import { Vector3 } from "src/Vector";

export class Translate implements Volume {
  material: Material;

  constructor(private volume: Volume, public displacement: Vector3) {
  }

  get center() {
    // center is actually the original point
    return this.volume.center;//.subtract(this.displacement);
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

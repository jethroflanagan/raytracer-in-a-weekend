import { Volume } from "src/volume/Volume";
import { Material } from "src/material/Material";
import { Ray } from "src/Ray";
import { Intersection } from "src/Intersection";
import { AABB } from "src/volume/AABB";
import { Vector3 } from "src/Vector";

export class Translate implements Volume {
  material: Material;
  volumeCenter;
  constructor(private volume: Volume, public displacement: Vector3) {
    // const volumeCenter = volume.center;
    // volume.center = volume.center.subtract(this.displacement);
    const handler = {
      get(obj, prop) {
        if (prop === 'center') {
          return obj.center.subtract(this.displacement.multiply(5));
        }
        if (prop === 'hit') {
          return function(ray, tMin, tMax) {
            ray.origin = ray.origin.add(displacement);
            // const offsetRay = new Ray(ray.origin.subtract(displacement), ray.direction, { time: ray.time });
            return volume.hit(ray, tMin, tMax);
          }
        }
        return obj[prop];
      }
    }
    this.volume = new Proxy(volume, handler);
  }

  hit(ray: Ray, tMin: number, tMax: number): Intersection {
    // ray.origin = ray.origin.subtract(this.displacement);
    return this.volume.hit(ray, tMin, tMax);
  }
  getBoundingBox(t0: number, t1: number): AABB {
    const box = this.volume.getBoundingBox(t0, t1);
    return new AABB(box.min.subtract(this.displacement), box.max.subtract(this.displacement));
  }

}

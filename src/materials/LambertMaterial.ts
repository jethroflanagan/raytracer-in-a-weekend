import { Color } from '../Color';
import { Ray } from "../Ray";
import { Vector3 } from '../Vector';
import { Intersection } from './../Intersection';
import { Material } from './Material';

export class LambertMaterial implements Material {
  reflectance = .3;

  constructor(public albedo: Color = null) {
  }

  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color } {
    // const colorV: Vector3 = intersection.normal.add(1).multiply(.5);
    // const color = vectorToColor(colorV);
    const attenuation = this.albedo;
    let bounceRay = null;
    if (Math.random() < this.reflectance) {
      const target = intersection.point.add(intersection.normal).add(Vector3.randomDirection());
      bounceRay = new Ray(intersection.point, target);
    }
    return {
      attenuation,
      bounceRay,
    };
  }
}

import { Color } from '../Color';
import { Ray } from "../Ray";
import { Vector3 } from '../Vector';
import { Intersection } from './../Intersection';
import { Material } from './Material';

export class LambertMaterial implements Material {
  reflectance = .3;
  albedo: Color;

  constructor({ albedo }: { albedo: Color }) {
    this.albedo = albedo;
  }

  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color } {
    // const colorV: Vector3 = intersection.normal.add(1).multiply(.5);
    // const color = vectorToColor(colorV);
    const attenuation = this.albedo;
    let bounceRay = null;
    // if (Math.random() < this.reflectance) {
      //TODO: remove muliplier
      const target = intersection.normal.add(Vector3.randomDirection().multiply(1-this.reflectance));
      bounceRay = new Ray(intersection.point, target);
    // }
    return {
      attenuation,
      bounceRay,
    };
  }
}

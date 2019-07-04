import { Color } from 'src/Color';
import { Ray } from "src/Ray";
import { Vector3 } from 'src/Vector';
import { Intersection } from 'src/Intersection';
import { Material } from './Material';

export class LambertMaterial implements Material {
  reflectance = .3;
  albedo: Color;

  constructor({ albedo, reflectance = 0 }: { albedo: Color, reflectance?: number }) {
    this.albedo = albedo;
    this.reflectance = reflectance;
  }

  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color } {
    const attenuation = this.albedo;
    let bounceRay = null;
    const target = intersection.normal.add(Vector3.randomDirection().multiply(1 - this.reflectance));
    bounceRay = new Ray(intersection.point, target);
    return {
      attenuation,
      bounceRay,
    };
  }
}

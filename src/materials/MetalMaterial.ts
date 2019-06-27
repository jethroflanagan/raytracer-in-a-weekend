import { Color } from '../Color';
import { Ray } from "../Ray";
import { Vector3 } from '../Vector';
import { Intersection } from './../Intersection';
import { Material } from './Material';
import { reflectVector } from './bounce/reflect-vector';

export class MetalMaterial implements Material {
  albedo: Color;
  reflectance: number;
  fuzziness: number;

  constructor({ albedo, reflectance = 1, fuzziness = 0 } : { albedo: Color, reflectance: number, fuzziness: number }) {
    this.albedo = albedo;
    this.reflectance = reflectance;
    this.fuzziness = fuzziness;
  }

  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color } {
    const attenuation = this.albedo;
    let bounceRay = null;
    if (Math.random() < this.reflectance) {
      let target = reflectVector({ normal: intersection.normal, direction: ray.direction });
      target = target.add( Vector3.randomDirection().multiply(this.fuzziness).multiply(1-this.reflectance));
      bounceRay = new Ray(intersection.point, target)
      const reflectionChance = bounceRay.direction.dot(intersection.normal) > 0;
      if (!reflectionChance) {
        bounceRay = null;
      }
    }
    return {
      attenuation,
      bounceRay,
    };
  }
}

import { Color } from 'src/Color';
import { Ray } from "src/Ray";
import { Vector3 } from 'src/Vector';
import { Intersection } from 'src/Intersection';
import { Material } from './Material';
import { reflectVector } from './bounce/reflect-vector';
import { random } from 'src/utils/math';

export class MetalMaterial implements Material {
  albedo: Color;
  reflectance: number;
  fuzziness: number;

  constructor({ albedo, reflectance = 1, fuzziness = 0 } : { albedo: Color, reflectance?: number, fuzziness?: number }) {
    this.albedo = albedo;
    this.reflectance = reflectance;
    this.fuzziness = fuzziness;
  }

  bounce({ ray, intersection, u, v }: { ray: Ray, intersection: Intersection, u: number, v: number }): { bounceRay: Ray, attenuation: Color } {
    const attenuation = this.albedo;
    let bounceRay = null;
    if (random() < this.reflectance) {
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

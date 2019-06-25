import { Color } from '../Color';
import { Ray } from "../Ray";
import { Vector3 } from '../Vector';
import { Intersection } from './../Intersection';
import { Material } from './Material';

// TODO: chapter 9
export class DialectricMaterial implements Material {
  albedo: Color;
  reflectance: number;
  fuzziness: number;

  constructor({ albedo = null, reflectance = 1, fuzziness = 0 } : { albedo: Color, reflectance: number, fuzziness: number }) {
    this.albedo = albedo;
    this.reflectance = reflectance;
    this.fuzziness = fuzziness;
  }

  // reflect(ray: Vector3, normal: Vector3): Vector3 {
  //   return ray.add( normal.multiply(ray.dot(normal)) );
  // }

  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color } {
    const attenuation = this.albedo;
    let bounceRay = null;
    // if (Math.random() < this.reflectance) {
    //   let target = this.reflect(intersection.normal, ray.direction.unit());
    //   target = target.add( Vector3.randomDirection().multiply(this.fuzziness));
    //   bounceRay = new Ray(intersection.point, target)
    //   const reflectionChance = bounceRay.direction.dot(intersection.normal) > 0;
    //   if (!reflectionChance) {
    //     bounceRay = null;
    //   }
    // }
    return {
      attenuation,
      bounceRay,
    };
  }
}

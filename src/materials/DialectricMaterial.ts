import { Color } from '../Color';
import { Ray } from "../Ray";
import { Vector3 } from '../Vector';
import { Intersection } from './../Intersection';
import { Material } from './Material';
import { reflectVector } from './bounce/reflect-vector';
import { refractVector } from './bounce/refract-vector';

export const REFRACTIVE_INDEX_AIR = 1;
export const REFRACTIVE_INDEX_GLASS = 1.5;
export const REFRACTIVE_INDEX_DIAMOND = 2.4;

// TODO: chapter 9
export class DialectricMaterial implements Material {
  albedo: Color;
  reflectance: number;
  fuzziness: number;
  refractiveIndex: number;

  constructor({ albedo = new Color(1, 1, 1, 1), reflectance = 1, fuzziness = 0, refractiveIndex = REFRACTIVE_INDEX_AIR }: {
    albedo: Color, reflectance: number, fuzziness: number, refractiveIndex: number
  }) {
    this.albedo = albedo;
    this.reflectance = reflectance;
    this.fuzziness = fuzziness;
    this.refractiveIndex = refractiveIndex;
  }

  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color } {
    const attenuation = this.albedo;
    let bounceRay = null;

    let outwardNormal: Vector3 = intersection.normal;
    let niOverNt: number = this.refractiveIndex;
    if (ray.direction.dot(intersection.normal) <= 0) {
      outwardNormal = outwardNormal.multiply(-1);
      niOverNt = 1 / niOverNt;
    }

    const refracted = refractVector({ direction: ray.direction, normal: outwardNormal, niOverNt });
    if (refracted.discriminant > 0) {
      bounceRay = new Ray(intersection.point, refracted.direction);
    }
    else {
      const reflected = reflectVector({ direction: ray.direction, normal: intersection.normal });
      bounceRay = new Ray(intersection.point, reflected);
    }
    return {
      attenuation,
      bounceRay,
    };
  }
}

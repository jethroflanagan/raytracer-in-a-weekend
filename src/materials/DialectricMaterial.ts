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

  // Cristophe Schlick aproximiation
  getReflectionProbability({ cosine }) {
    let r0 = (1 - this.refractiveIndex) / (1 + this.refractiveIndex);
    r0 = r0 ** 2;
    return r0 + (1 - r0) * ((1 - cosine) ** 5);
  }

  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color } {
    const attenuation = this.albedo;
    let bounceRay = null;

    let outwardNormal: Vector3 = null;
    let niOverNt: number = null;
    let cosine: number = null;
    const dotDirectionNormal = ray.direction.dot(intersection.normal);
    if (dotDirectionNormal > 0) {
      outwardNormal = intersection.normal;
      niOverNt = this.refractiveIndex;
      cosine = this.refractiveIndex * dotDirectionNormal / ray.direction.length();
    }
    else  {
      outwardNormal = intersection.normal.multiply(-1);
      niOverNt = 1 / this.refractiveIndex;
      cosine = - dotDirectionNormal / ray.direction.length();
    }

    const refracted = refractVector({ direction: ray.direction, normal: outwardNormal, niOverNt });
    let reflectProbability: number = null;
    if (refracted.discriminant > 0) {
      reflectProbability = this.getReflectionProbability({ cosine });
    }
    else {
      reflectProbability = 1;
    }

    if (Math.random() >= reflectProbability) {
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

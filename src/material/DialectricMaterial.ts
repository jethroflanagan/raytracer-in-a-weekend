import { Color } from 'src/Color';
import { Ray } from "src/Ray";
import { Vector3 } from 'src/Vector';
import { Intersection } from 'src/Intersection';
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
    albedo?: Color, reflectance?: number, fuzziness?: number, refractiveIndex?: number
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

    let bounceRay;
    const { direction, cosine, discriminant } = refractVector({ direction: ray.direction, normal: intersection.normal, refractiveIndex: this.refractiveIndex });
    bounceRay = new Ray(intersection.point, direction);
    return {
      attenuation,
      bounceRay,
    };
  }
}

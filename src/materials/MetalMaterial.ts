import { Color } from '../Color';
import { Ray } from "../Ray";
import { Vector3 } from '../Vector';
import { Intersection } from './../Intersection';
import { Material } from './Material';

export class MetalMaterial implements Material {

  constructor(public albedo: Color = null, public reflectance = 1) {
  }

  reflect(ray: Vector3, normal: Vector3): Vector3 {
    return ray.subtract( normal.multiply(2 * ray.dot(normal)) );
  }

  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color } {
    const attenuation = this.albedo;
    let bounceRay = null;
    if (Math.random() < this.reflectance) {
      const target = this.reflect(ray.direction.unit(), intersection.normal).add(intersection.point);
      bounceRay = new Ray(intersection.point, target);
      // const reflectionChance = bounceRay.direction.dot(intersection.normal) > 0;
      // if (!reflectionChance) {
      //   bounceRay = null;
      // }
    }
    return {
      attenuation,
      bounceRay,
    };
  }
}

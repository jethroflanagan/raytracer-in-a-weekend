import { Color } from 'src/Color';
import { Ray } from "src/Ray";
import { Vector3 } from 'src/Vector';
import { Intersection } from 'src/Intersection';
import { Material } from './Material';
import { Texture } from 'src/texture/Texture';

export class LambertMaterial implements Material {
  reflectance = .3;
  albedo: Texture;

  constructor({ albedo, reflectance = 0 }: { albedo: Texture, reflectance?: number }) {
    this.albedo = albedo;
    this.reflectance = reflectance;
  }

  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color } {
    const attenuation = this.albedo.getColor({ u: 0, v: 0, intersection });
    let bounceRay = null;
    const target = intersection.normal.add(Vector3.randomDirection().multiply(1 - this.reflectance));
    bounceRay = new Ray(intersection.point, target);
    return {
      attenuation,
      bounceRay,
    };
  }
}

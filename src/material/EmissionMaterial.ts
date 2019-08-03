import { Color } from 'src/Color';
import { Intersection } from 'src/Intersection';
import { Ray } from "src/Ray";
import { Material } from './Material';
import { Texture } from 'src/texture/Texture';

/**
 * Won't receive shadows
 */
export class EmissionMaterial implements Material {
  albedo: Texture;
  brightness: number;

  constructor({ albedo, brightness }: { albedo: Texture, brightness: number }) {
    this.albedo = albedo;
    this.brightness = brightness;
  }

  bounce({ ray, intersection, u, v }: { ray: Ray, intersection: Intersection, u: number, v: number }): { bounceRay: Ray, attenuation: Color, emission: Color } {
    const attenuation = this.albedo.getColor({ u, v, intersection });
    let bounceRay = null;
    return {
      emission: attenuation.toVector().multiply(this.brightness).toColor(),
      attenuation: attenuation,
      bounceRay,
    };
  }

}

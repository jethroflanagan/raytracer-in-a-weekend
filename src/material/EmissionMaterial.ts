import { Color } from 'src/Color';
import { Ray } from "src/Ray";
import { Vector3 } from 'src/Vector';
import { Intersection } from 'src/Intersection';
import { Material } from './Material';
import { Texture } from 'src/texture/Texture';

export class EmissionMaterial implements Material {
  albedo: Texture;
  brightness: number;

  constructor({ albedo, brightness = 1 }: { albedo: Texture, brightness: number }) {
    this.albedo = albedo;
    this.brightness = brightness;
  }

  bounce({ ray, intersection, u, v }: { ray: Ray, intersection: Intersection, u: number, v: number }): { bounceRay: Ray, attenuation: Color, emission: Color } {
    return {
      attenuation: null,
      bounceRay: null,
      emission: this.albedo.getColor({ intersection, u, v }).toVector().multiply(this.brightness).toColor(),
    };
  }
}

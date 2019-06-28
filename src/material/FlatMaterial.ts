import { Color } from 'src/Color';
import { Intersection } from 'src/Intersection';
import { Ray } from "src/Ray";
import { Material } from './Material';

/**
 * Won't receive shadows
 */
export class FlatMaterial implements Material {
  albedo: Color;

  constructor({ albedo }: { albedo: Color }) {
    this.albedo = albedo;
  }

  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color } {
    // const colorV: Vector3 = intersection.normal.add(1).multiply(.5);
    // const color = vectorToColor(colorV);
    const attenuation = this.albedo;
    let bounceRay = null;
    return {
      attenuation,
      bounceRay,
    };
  }
}

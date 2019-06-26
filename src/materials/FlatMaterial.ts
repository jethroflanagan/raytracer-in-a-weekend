import { Color } from '../Color';
import { Ray } from "../Ray";
import { Vector3 } from '../Vector';
import { Intersection } from './../Intersection';
import { Material } from './Material';

/**
 * Won't receive shadows
 */
export class FlatMaterial implements Material {

  constructor(public albedo: Color = null) {
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
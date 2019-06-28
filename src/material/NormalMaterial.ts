import { Color } from 'src/Color';
import { Ray } from "src/Ray";
import { Vector3 } from 'src/Vector';
import { Intersection } from 'src/Intersection';
import { Material } from './Material';

export class NormalMaterial implements Material {

  constructor() {
  }

  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color } {
    const colorV: Vector3 = intersection.normal.add(1).multiply(.5);
    // const colorV: Vector3 = n.add(1).multiply(.5);
    const attenuation = colorV.toColor();
    let bounceRay = null;

    // adds self-shadow
    const target = intersection.point.add(intersection.normal).add(Vector3.randomDirection());
      bounceRay = new Ray(intersection.point, target);

    return {
      attenuation,
      bounceRay,
    };
  }
}

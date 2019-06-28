import { Color } from "src/Color";
import { Ray } from "src/Ray";
import { Intersection } from 'src/Intersection';

export interface Material {
  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color };
}

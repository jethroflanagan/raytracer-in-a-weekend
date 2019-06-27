import { Color } from "../Color";
import { Ray } from "../Ray";
import { Intersection } from './../Intersection';

export interface Material {
  bounce({ ray, intersection }: { ray: Ray, intersection: Intersection }): { bounceRay: Ray, attenuation: Color };
}

import { Color } from "src/Color";
import { Ray } from "src/Ray";
import { Intersection } from 'src/Intersection';

export interface Material {
  bounce({ ray, intersection, u, v }: { ray: Ray, intersection: Intersection, u: number, v: number }): { bounceRay: Ray, attenuation: Color };
}

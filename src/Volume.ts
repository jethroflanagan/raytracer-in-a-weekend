import { Ray } from "./Ray";
import { Intersection } from "./Intersection";

export interface Volume {
  hit(ray: Ray, tMin: number, tMax: number): Intersection;
}

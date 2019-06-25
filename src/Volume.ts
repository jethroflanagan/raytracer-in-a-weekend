import { Material } from './materials/Material';
import { Ray } from "./Ray";
import { Intersection } from "./Intersection";

export interface Volume {
  material?: Material;
  
  hit(ray: Ray, tMin: number, tMax: number): Intersection;
}

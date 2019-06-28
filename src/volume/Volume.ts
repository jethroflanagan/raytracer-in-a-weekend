import { Material } from 'src/material/Material';
import { Ray } from "src/Ray";
import { Intersection } from "src/Intersection";

export interface Volume {
  material?: Material;
  
  hit(ray: Ray, tMin: number, tMax: number): Intersection;
}
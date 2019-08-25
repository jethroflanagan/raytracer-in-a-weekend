import { Material } from 'src/material/Material';
import { Ray } from "src/Ray";
import { Intersection } from "src/Intersection";
import { AABB } from './AABB';
import { Vector3 } from 'src/Vector';

export interface Volume {
  material?: Material;
  center: Vector3;

  hit(ray: Ray, tMin: number, tMax: number): Intersection;

  getBoundingBox(t0: number, t1: number): AABB;
}

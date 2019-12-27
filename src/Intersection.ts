import { Vector3 } from "src/Vector";
import { Material } from "./material/Material";

// TODO: make this a class
export type Intersection = {
  point: Vector3;
  normal: Vector3;
  t: number;
  u: number;
  v: number;
  material: Material;
}

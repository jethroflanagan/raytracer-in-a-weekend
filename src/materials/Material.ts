import { Ray } from "./Ray";

export interface Material {
  bounce(ray: Ray);
}

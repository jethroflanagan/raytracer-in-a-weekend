import { Volume } from "./Volume";
import { Ray } from "./Ray";
import { Intersection } from "./Intersection";

export class Scene {
  children: Volume[];

  hit(ray: Ray, tMin: number, tMax: number): { intersection: Intersection, volume: Volume } {
    let closest = {
      t: tMax,
      volume: null,
      intersection: null,
    };

    for (let volume of this.children) {
      // limit by closest
      const intersection = volume.hit(ray, tMin, closest.t);
      if (intersection) {
        closest.volume = volume;
        closest.intersection = intersection;
      }
    }

    return closest;
  }
}

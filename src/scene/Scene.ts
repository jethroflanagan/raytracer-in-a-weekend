import { Volume } from "src/volume/Volume";
import { Ray } from "src/Ray";
import { Intersection } from "src/Intersection";
import { FlatBackground } from "src/scene/FlatBackground";

export class Scene {
  children: Volume[] = [];
  background: FlatBackground;

  addChild(child: Volume, meta?: any) {
    this.children.push(child);
  }

  addBackground(background: FlatBackground) {
    this.background = background;
  }

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
        closest.t = intersection.t;
        closest.volume = volume;
        closest.intersection = intersection;
      }
    }

    return closest;
  }
}

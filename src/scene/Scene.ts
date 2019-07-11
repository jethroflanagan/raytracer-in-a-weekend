import { Volume } from "src/volume/Volume";
import { Ray } from "src/Ray";
import { Intersection } from "src/Intersection";
import { FlatBackground } from "src/scene/FlatBackground";
import { Camera } from "./Camera";
import { Animator } from "src/animation/Animator";
import { BVH_Node } from "src/volume/BVH_Node";

export class Scene {
  children: Volume[] = [];
  background: FlatBackground;
  _time: number;
  animator: Animator;
  camera: Camera;
  bvh: BVH_Node;

  constructor({ time = 0 }: { time?: number } = {}) {
    this._time = time;
  }

  get time() {
    return this._time + performance.now();
  }

  addChild(child: Volume, meta?: any) {
    this.children.push(child);
  }

  addBackground(background: FlatBackground) {
    this.background = background;
  }

  addAnimator(animator: Animator): Animator {
    this.animator = animator;
    return animator;
  }

  updateTime(time: number) {
    if (!this.animator) return;
    this._time = time;
    this.animator.updateItemsForTime(time);
  }

  setActiveCamera(camera: Camera) {
    this.camera = camera;
  }

  getRayFromActiveCamera(horizontalPercent: number, verticalPercent: number): Ray {
    return this.camera.getRay(horizontalPercent, verticalPercent, this._time);
  }

  createBoundingVolumeHeirarchies(t0, t1) {
    this.bvh = new BVH_Node({ volumes: this.children, t0, t1 });
  }

  hitTest(ray: Ray, tMin: number, tMax: number): any {
    const intersection = this.bvh.hit(ray, tMin, tMax);
    return intersection;
  }

  hit(ray: Ray, tMin: number, tMax: number): { intersection: Intersection, volume: Volume } {
    // const result = this.bvh.hit(ray, tMin, tMax);
    // if (!result) {
    //   return {
    //     intersection: null,
    //     volume: null,
    //   }
    // }
    // return {
    //   intersection: result.intersection,
    //   volume: result.volume,
    // }

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
    // TODO: remove "t" from output
    return closest;
  }
}

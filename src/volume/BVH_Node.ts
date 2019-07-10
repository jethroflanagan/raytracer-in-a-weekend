import { Volume } from "./Volume";
import { AABB } from "./AABB";
import { Intersection } from "src/Intersection";
import { Ray } from "src/Ray";
import { random } from "src/utils/math";

export class BVH_Node {
  t1: number;
  t0: number;
  left: BVH_Node;
  right: BVH_Node;
  box: AABB;
  volume: Volume;

  constructor({ volumes, t0, t1 }: { volumes: Volume[], t0: number, t1: number }) {
    this.t0 = t0;
    this.t1 = t1;

    // pick random axis
    const axis = ['x', 'y', 'z'][~~random(0, 2)];
    volumes.sort((a, b) => this.boxCompareAxis(axis, a, b));

    // TODO: change this to optimize
    if (volumes.length === 1) {
      this.left = this.right = null;
      this.volume = volumes[0];
    }
    else if (volumes.length === 2) {
      this.left = new BVH_Node({ volumes: [volumes[0]], t0, t1 });
      this.right = new BVH_Node({ volumes: [volumes[1]], t0, t1 });
    }
    else {
      const halfIndex = Math.ceil(volumes.length / 2);
      this.left = new BVH_Node({
        volumes: volumes.slice(0, halfIndex),
        t0,
        t1,
      });
      this.right = new BVH_Node({
        volumes: volumes.slice(halfIndex),
        t0,
        t1,
      });
    }

    const leftBox = this.left.getBoundingBox(t0, t1);
    const rightBox = this.right.getBoundingBox(t0, t1);
    if (!leftBox || !rightBox) {
      throw new Error('No bounding box');
    }
    this.box = AABB.getSurroundingBox(leftBox, rightBox);
  }

  hit(ray: Ray, tMin: number, tMax: number): { volume: Volume, intersection: Intersection } {
    if (!this.box.hit(ray, tMin, tMax)) {
      return null;
    }
    const { node, intersection } = this.hitNodes(ray, tMin, tMax);
    return {
      volume: node.volume,
      intersection,
    }
    // TODO: change to above return type
    // const hitLeft: Intersection = this.left.hit(ray, tMin, tMax);
    // const hitRight: Intersection = this.right.hit(ray, tMin, tMax);

    // if (hitLeft && hitRight) {
    //   if (hitLeft.t < hitRight.t) {
    //     return hitLeft;
    //   }
    //   return hitRight;
    // }
    // if (hitLeft) {
    //   return hitLeft;
    // }
    // return hitRight;
  }

  hitNodes(ray: Ray, tMin: number, tMax: number): { node: BVH_Node, intersection: Intersection } {
    if (!this.box.hit(ray, tMin, tMax)) {
      return null;
    }
    const left = this.left.hitNodes(ray, tMin, tMax);
    const right = this.right.hitNodes(ray, tMin, tMax);

    const { intersection: hitLeft, node: nodeLeft } = left;
    const { intersection: hitRight, node: nodeRight } = right;
    if (hitLeft && hitRight) {
      if (hitLeft.t < hitRight.t) {
        return left;
      }
      return right;
    }
    if (hitLeft) {
      return left;
    }
    return right;
  }

  getBoundingBox(t0: number, t1: number) {
    return this.box;
  }

  boxCompareAxis(axis: string, volumeA: Volume, volumeB: Volume): number {
    const boxA = volumeA.getBoundingBox(0, 0);
    const boxB = volumeB.getBoundingBox(0, 0);
    if (!boxA || !boxB) {
      throw new Error('No bounding box');
    }
    return boxA.min[axis] - boxB.min[axis];
  }
}

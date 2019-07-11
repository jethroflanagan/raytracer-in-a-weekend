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
      this.box = this.volume.getBoundingBox(t0, t1);
      return;
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
    const result = this.hitNodes(ray, tMin, tMax);
    if (!result) {
      return null;
    }

    const { node, intersection } = result;
    return {
      intersection,
      volume: node.volume,
    };
    // if (this.left) {
    //   const { intersection: hitLeft } = this.left.hit(ray, tMin, tMax);
    // }
    // if (this.right) {
    //   const { intersection: hitRight } = this.right.hit(ray, tMin, tMax);
    // }
    // else {
    //   return this.volume;
    // }

    // let isLeft = false;
    // if (hitLeft && hitRight) {
    //   isLeft = (hitLeft.t < hitRight.t);
    // }
    // else {
    //   isLeft = hitLeft != null;
    // }
    // if (isLeft) {
    //   return { intersection: hitLeft, node: this.left };
    // }
    // return { intersection: hitRight, node: this.right };
  }

  hitNodes(ray: Ray, tMin: number, tMax: number): { node: BVH_Node, intersection: Intersection } {
    if (!this.box.hit(ray, tMin, tMax)) {
      return null;
    }

    let hitLeft = null;
    let hitRight = null;
    let result = null;
    if (this.left) {
      result = this.left.hit(ray, tMin, tMax);
      if (result) {
        hitLeft = result.intersection;
      }
    }
    if (this.right) {
      result = this.right.hit(ray, tMin, tMax);
      if (result) {
        hitRight = result.intersection;
      }
    }
    else {
      return {
        node: this,
        intersection: this.volume.hit(ray, tMin, tMax),
      };
    }
    if (!hitLeft && !hitRight) {
      return null;
    }

    let isLeft = false;
    if (hitLeft && hitRight) {
      isLeft = (hitLeft.t < hitRight.t);
    }
    else {
      isLeft = hitLeft != null;
    }
    if (isLeft) {
      return this.left.hitNodes(ray, tMin, tMax);
    }
    return this.right.hitNodes(ray, tMin, tMax);

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

import { Volume } from "./Volume";
import { AABB } from "./AABB";
import { Intersection } from "src/Intersection";
import { Ray } from "src/Ray";
import { random } from "src/utils/math";

export class BVH_Node implements Volume {
  t1: number;
  t0: number;
  left: Volume;
  right: Volume;
  box: AABB;

  constructor({ volumes, t0, t1 }: { volumes: Volume[], t0: number, t1: number }) {
    this.t0 = t0;
    this.t1 = t1;

    // pick random axis
    const axis = ['x', 'y', 'z'][~~random(0, 2)];
    volumes.sort((a, b) => this.boxCompareAxis(axis, a, b));

    if (volumes.length === 1) {
      this.left = this.right = volumes[0];
    }
    else if (volumes.length === 2) {
      this.left = volumes[0];
      this.right = volumes[1];
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

  hit(ray: Ray, tMin: number, tMax: number): Intersection {
    if (!this.box.hit(ray, tMax, tMax)) {
      return null;
    }
    const hitLeft: Intersection = this.left.hit(ray, tMin, tMax);
    const hitRight: Intersection = this.right.hit(ray, tMin, tMax);

    if (hitLeft && hitRight) {
      if (hitLeft.t < hitRight.t) {
        return hitLeft;
      }
      return hitRight;
    }
    if (hitLeft) {
      return hitLeft;
    }
    return hitRight;
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

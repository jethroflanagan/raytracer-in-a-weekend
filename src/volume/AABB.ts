import { Ray } from "src/Ray";
import { Vector3 } from "src/Vector";

/**
 * Axis-aligned Bounding-box
 */
export class AABB {
  min: Vector3;
  max: Vector3;

  static getSurroundingBox(box1: AABB, box2: AABB) {
    let small: Vector3 = new Vector3(
      Math.min(box1.min.x, box2.min.x),
      Math.min(box1.min.y, box2.min.y),
      Math.min(box1.min.z, box2.min.z)
    );

    let big: Vector3 = new Vector3(
      Math.max(box1.max.x, box2.max.x),
      Math.max(box1.max.y, box2.max.y),
      Math.max(box1.max.z, box2.max.z)
    );

    return new AABB(small, big);
  }

  constructor(private a?: Vector3, private b?: Vector3) {
    this.min = a;
    this.max = b;
  }

  // Andrew Kensler (Pixar) optimization
  hit(ray: Ray, tMin: number, tMax: number): boolean {
    const axes = ['x', 'y', 'z'];
    for (let axis = 0, len = axes.length; axis < len; axis++) {
      const invD = 1 / ray.direction[axis];
      let t0 = (this.min[axis] - ray.origin[axis]) / ray.direction[axis];
      let t1 = (this.max[axis] - ray.origin[axis]) / ray.direction[axis];

      if (invD < 0) {
        let temp = t0;
        t0 = t1;
        t1 = temp;
      }

      tMin = t0 > tMin ? t0: tMin;
      tMax = t1 < tMax ? t1: tMax;

      // shortcut
      if (tMax <= tMin) {
        return false;
      }
    }
    return true;
  }

}

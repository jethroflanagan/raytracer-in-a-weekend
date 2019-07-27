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
    // // https://medium.com/@bromanz/another-view-on-the-classic-ray-aabb-intersection-algorithm-for-bvh-traversal-41125138b525
    // const invD = rcp(ray.dir);
    // float3 t0s = (aabb.min - ray.origin) * invD;
    // float3 t1s = (aabb.max - ray.origin) * invD;

    // float3 tsmaller = min(t0s, t1s);
    // float3 tbigger  = max(t0s, t1s);

    // tmin = max(tmin, max(tsmaller[0], max(tsmaller[1], tsmaller[2])));
    // tmax = min(tmax, min(tbigger[0], min(tbigger[1], tbigger[2])));

    // return (tmin < tmax);

    const axes = ['x', 'y', 'z'];
    for (const axis of axes) {
      const invD = 1 / ray.direction[axis];
      let t0 = (this.min[axis] - ray.origin[axis]) * invD;
      let t1 = (this.max[axis] - ray.origin[axis]) * invD;

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

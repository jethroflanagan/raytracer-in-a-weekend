import { Vector3 } from './Vector';

export class Sphere {
  constructor(public center, public radius) {
  }

  // http://kylehalladay.com/blog/tutorial/math/2013/12/24/Ray-Sphere-Intersection.html
  getRayIntersections(ray) {
    // // find tc
    // const L = this.center.subtract(ray.origin);
    // const tc = L.dot(ray.direction);
    // if (tc < 0) {
    //   return false;
    // }
    // const dSquared = Math.sqrt(tc ** 2 - L.dot(L));

    // if (dSquared > this.radius ** 2) {
    //   return false;
    // }

    // const t1c = Math.sqrt(this.radius ** 2 - dSquared);
    // const t1 = tc - t1c;
    // const t2 = tc + t1c;

    // return [ t1, t2 ];

    const oc = ray.origin.subtract(this.center);
    const a = ray.direction.dot(ray.direction);
    const b = 2 * oc.dot(ray.direction);
    // console.log(oc.dot(oc).subtract(this.radius * this.radius));
    const c = oc.dot(oc) - this.radius ** 2;

    const discriminant = b ** 2 - 4 * a * c;
    if (discriminant < 0) {
      return -1;
    }
    return (-b - Math.sqrt(discriminant)) / (a * 2);
  }

}

import { Vector3 } from './Vector';
import { Volume } from './Volume';
import { Ray } from './Ray';
import { Intersection } from './Intersection';

export class Sphere implements Volume {

  constructor(public center, public radius) {
  }
  // http://kylehalladay.com/blog/tutorial/math/2013/12/24/Ray-Sphere-Intersection.html
  hit(ray: Ray, tMin: number, tMax: number): Intersection {
    const oc = ray.origin.subtract(this.center);
    const a = ray.direction.dot(ray.direction);
    const b = 2 * oc.dot(ray.direction);
    // console.log(oc.dot(oc).subtract(this.radius * this.radius));
    const c = oc.dot(oc) - this.radius ** 2;

    const discriminant = b ** 2 - 4 * a * c;
    if (discriminant < 0) {
      return null;
    }

    const partialCalc = Math.sqrt(b ** 2 - a * c);
    let point = null;

    let t = (-b - partialCalc) / a;
    if (t < tMax && discriminant > tMin) {
      point = ray.pointAtParameter(t);
    }

    t = (-b + partialCalc) / a;
    if (t < tMax && t > tMin) {
      point = ray.pointAtParameter(t);
    }

    if (point) {
      return <Intersection>{
        t,
        point,
        normal: point.subtract(this.center).divide(this.radius),
      };
    }

    return null;
  }

}

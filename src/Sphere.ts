import { Vector3 } from './Vector';
import { Volume } from './Volume';
import { Ray } from './Ray';
import { Intersection } from './Intersection';

export class Sphere implements Volume {

  constructor(public center, public radius) {
  }
  // http://kylehalladay.com/blog/tutorial/math/2013/12/24/Ray-Sphere-Intersection.html
  hit(ray: Ray, tMin: number, tMax: number): Intersection {
    // removed 2 * below as it cancels out (sphere is b^2 - 4ac)
    const oc = ray.origin.subtract(this.center);
    const a = ray.direction.dot(ray.direction);
    const b = oc.dot(ray.direction);
    const c = oc.dot(oc) - this.radius ** 2;

    const discriminant = b ** 2 - a * c;
    if (discriminant < 0) {
      return null;
    }

    const partialCalc = Math.sqrt(b ** 2 - a * c);
    let point = null;

    let t = (-b - partialCalc) / a;
    if (t > tMin && t < tMax) {
      point = ray.pointAtParameter(t);
    }

    t = (-b + partialCalc) / a;
    if (t > tMin && t < tMax) {
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

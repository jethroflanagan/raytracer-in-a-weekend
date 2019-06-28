import { Material } from 'src/material/Material';
import { Vector3 } from 'src/Vector';
import { Volume } from 'src/volume/Volume';
import { Ray } from 'src/Ray';
import { Intersection } from 'src/Intersection';

export class Sphere implements Volume {
  center: Vector3;
  radius: number;
  material: Material;

  constructor({ center, radius, material }: { center: Vector3, radius: number, material: Material }) {
    this.center = center;
    this.radius = radius;
    this.material = material;
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

    const partialCalc = -Math.sqrt(discriminant);
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

import { Vector3 } from './Vector';
import { Ray } from './Ray';
import { Color } from './Color';

export class FlatBackground {
  constructor() {
  }

  getColor(ray: Ray) {
    const unitDirection = ray.direction.divide(ray.direction.length());
    const t = (unitDirection.y + 1) * .5;
    // console.log(unitDirection.y, t);

    // const flatCenter = new Vector3(this.center.x, this.center.y, 0);

    const result = Vector3.lerp(
      new Vector3(1, 1, 1),
      new Vector3(.5, .7, 1),
      t);

    return <Color>{
      r: result.x,
      g: result.y,
      b: result.z,
      a: 1,
    };
  }
}

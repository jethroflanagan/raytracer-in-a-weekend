import { Ray } from 'src/Ray';
import { Vector3 } from 'src/Vector';

export class FlatBackground {
  constructor() {
  }

  getColor(ray: Ray) {
    const unitDirection = ray.direction.unit();
    const t = (1 + unitDirection.y) * .5;

    const result = Vector3.lerp(
      new Vector3(1, 1, 1),
      new Vector3(.5, .7, 1),
      t);

    return result.toColor();
  }
}

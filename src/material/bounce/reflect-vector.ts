import { Vector3 } from "src/Vector";

  export function reflectVector({ direction, normal }: { direction: Vector3, normal: Vector3 }): Vector3 {
    const unitDirection = direction.unit();
    return normal.add( unitDirection.multiply(normal.dot(unitDirection)) );
  }

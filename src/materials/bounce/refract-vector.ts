import { Vector3 } from "../../Vector";

export function refractVector({ direction, normal, niOverNt }: { direction: Vector3, normal: Vector3, niOverNt: number }): Vector3 {
  const unitDirection = direction.unit();
  const dt = unitDirection.dot(normal);
  const discriminant = 1 - niOverNt ** 2 * (1 - dt ** 2);
  if (discriminant > 0) {
    return unitDirection.subtract( normal.multiply(dt) ).multiply(niOverNt)
      .subtract( normal.multiply(Math.sqrt(discriminant)) );
  }
  return direction.add( normal.multiply(direction.dot(normal)) );
}

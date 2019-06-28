import { Vector3 } from "src/Vector";

export function refractVector({ direction, normal, niOverNt }: { direction: Vector3, normal: Vector3, niOverNt: number }):
  { discriminant: number, direction: Vector3 } {
  const unitDirection = direction.unit();
  const dt = unitDirection.dot(normal);
  const discriminant =  niOverNt ** 2 * (1 - dt ** 2);
  let outwardVector = null;
  if (discriminant > 0) {
    outwardVector = unitDirection.subtract( normal.multiply(dt) ).multiply(niOverNt)
      .subtract( normal.multiply(Math.sqrt(discriminant)) );
  }
  else {
    outwardVector = direction.add( normal.multiply(direction.dot(normal)) );
  }

  return {
    discriminant,
    direction: outwardVector,
  };
}

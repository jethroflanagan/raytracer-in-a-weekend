import { Vector3 } from './Vector';
import { Color } from './Color';
export function vectorToColor (v: Vector3): Color  {
  return new Color(v.x, v.y, v.z, 1);
}
export function colorToVector (c: Color): Vector3  {
  return new Vector3(c.r, c.g, c.b);
}

export function randomInUnitSphere() {
  let point: Vector3 = null;
  do {
    point = new Vector3(Math.random(), Math.random(), Math.random()).multiply(2).subtract(1)
  } while(point.length() ** 2 >= 1)
  return point;
}

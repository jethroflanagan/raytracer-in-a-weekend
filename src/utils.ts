import { Vector3 } from './Vector';
import { Color } from './Color';
export function vectorToColor (v: Vector3): Color  {
  return new Color(v.x, v.y, v.z, 1);
}
export function colorToVector (c: Color): Vector3  {
  return new Vector3(c.r, c.g, c.b);
}

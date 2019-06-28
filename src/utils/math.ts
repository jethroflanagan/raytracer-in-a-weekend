import { Ray } from 'src/Ray';
import { Vector3 } from 'src/Vector';

export function toRadians (degrees) {
  return degrees * Math.PI / 180;
}

export function lerp(start, end, t) {
  return (1 - t) * start + t * end;
}

/**
 * https://stackoverflow.com/a/50746409
 * Uniform point distribution
 * TODO: use in lens (aperture)
 *
 * @param expand  makes a "donut" by extending the distance
 */
export function getRandomPointInCircle({ radius = 1, expand = 0 }: { radius: number, expand?: number }) {
  const angle = Math.random() * Math.PI * 2;
  // use `angle` instead of random for spiral
  const distance = radius * Math.sqrt(Math.random()) + expand;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  return { x, y }
}

export function placeSphereOnSurfaceFromPosition({ from, surfaceCenter, surfaceRadius, sphereRadius }:
  { from: Vector3, surfaceCenter: Vector3, surfaceRadius: number, sphereRadius: number }
) {
  const diff = from.subtract(surfaceCenter).length() - surfaceRadius  - sphereRadius;
  let { direction } = new Ray(from, surfaceCenter);
  direction = direction.unit().multiply(diff);
  return from.add(direction);
}

export function getDistance(x1, y1, x2, y2) {
  return Math.sqrt( (x1 - x2) ** 2 + (y1 - y2) ** 2 );
}

import { Ray } from 'src/Ray';
import { Vector3 } from 'src/Vector';
import seedrandom from 'seedrandom';

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
  const angle = random() * Math.PI * 2;
  // use `angle` instead of random for spiral
  const distance = radius * Math.sqrt(random()) + expand;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  return { x, y }
}

export function placeSphereOnSurfaceFromPosition({ from, surfaceCenter, surfaceRadius, sphereRadius }:
  { from: Vector3, surfaceCenter: Vector3, surfaceRadius: number, sphereRadius: number }
): Vector3 {
  const diff = from.subtract(surfaceCenter).length() - surfaceRadius  - sphereRadius;
  let { direction } = new Ray(from, surfaceCenter);
  direction = direction.unit().multiply(diff);
  return from.add(direction);
}

export function getDistance(x1, y1, x2, y2) {
  return Math.sqrt( (x1 - x2) ** 2 + (y1 - y2) ** 2 );
}

export const clamp = (min, max, value) => {
  return Math.max(min, Math.min(max, value));
}

// fallback if unseeded
let getSeededRandom = () => Math.random();

export const seedRandom = (seed: string) => {
  getSeededRandom = seedrandom(seed);
};

export const random = (min = 0, max = 1) => {
  return getSeededRandom() * (max - min) + min;
}

export const trilinearInterpolation = (block, u, v, w) => {
  let accumulator = 0;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        const smoothed = (i * u + (1 - i) * (1 - u)) *
                         (j * v + (1 - j) * (1 - v)) *
                         (k * w + (1 - k) * (1 - w));
        accumulator += block[i][j][k] * smoothed;
      }
    }
  }
  return accumulator;
}

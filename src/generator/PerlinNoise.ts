import { Vector3 } from "src/Vector";
import { random, trilinearInterpolation } from "src/utils/math";
import { Noise } from 'noisejs';

new Noise(Math.random());

export class PerlinNoise {
  private scale;
  private noise;
  private turbulance;

  constructor({ scale = 1, turbulance = 0 } : { scale?: number, turbulance?: number } = {}) {
    this.noise = new Noise(random());
    this.scale = 1 / scale; // invert so larger numbers = larger squares
    this.turbulance = turbulance;
  }

  getValue(point: Vector3) {
    const scaled = point.multiply(this.scale);
    if (this.turbulance) {
      return this.getTurbulance(point, this.turbulance);
    }
    return this.noise.perlin3(scaled.x, scaled.y, scaled.z);
  }

  private getTurbulance(point: Vector3, depth: number = 7) {
    let accumulator = 0;
    let accumulatedPoint = point.clone();
    let weight = 1;
    for (let i = 0; i < depth; i++) {
      accumulator += weight * this.noise.perlin3(accumulatedPoint.x, accumulatedPoint.y, accumulatedPoint.z);
      weight *= .5;
      accumulatedPoint = accumulatedPoint.multiply(2);
    }
    return Math.abs(accumulator);
  }
}

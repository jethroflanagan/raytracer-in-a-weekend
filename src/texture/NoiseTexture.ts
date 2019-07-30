import { Color } from 'src/Color';
import { PerlinNoise } from 'src/generator/PerlinNoise';
import { Intersection } from 'src/Intersection';
import { clamp } from 'src/utils/math';
import { Texture } from './Texture';

export class NoiseTexture implements Texture {
  private noise: PerlinNoise;

  constructor({ scale = 1, turbulance = 0 } : { scale?: number, turbulance?: number } = {}) {
    this.noise = new PerlinNoise({ scale, turbulance });
  }

  getColor({ u, v, intersection }: { u: number, v: number, intersection: Intersection }) {
    const { point } = intersection;
    let value = this.noise.getValue(point);
    value = (value * 10 + Math.sin(point.z) + 1) * .3;
    // TODO: move noise to range [0, 1] (negatives exist)
    value = clamp(0, 1, value);
    return new Color(value, value, value);
  }

}

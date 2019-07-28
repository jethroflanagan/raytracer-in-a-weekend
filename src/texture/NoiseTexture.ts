import { Intersection } from 'src/Intersection';
import { Texture } from './Texture';
import { Vector3 } from 'src/Vector';
import { PerlinNoise } from 'src/generator/PerlinNoise';

export class NoiseTexture implements Texture {
  private noise: PerlinNoise;

  constructor() {
    this.noise = new PerlinNoise();
  }

  getColor({ u, v, intersection }: { u: number, v: number, intersection: Intersection }) {
    const { point } = intersection;
    const value = this.noise.getValue(point);
    return new Vector3(1, 1, 1).multiply(value).toColor();
  }
}

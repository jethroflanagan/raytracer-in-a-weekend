import { Intersection } from 'src/Intersection';
import { Texture } from './Texture';

export class CheckerTexture implements Texture {
  private even: Texture;
  private odd: Texture;
  private size = 1;

  constructor({ even, odd, size = 1 }: { even: Texture, odd: Texture, size?: number }) {
    this.even = even;
    this.odd = odd;
    this.size = 1 / size; // invert as it scales that way
  }

  getColor({ u, v, intersection }: { u: number, v: number, intersection: Intersection }) {
    const { point } = intersection;
    const sines = Math.sin(this.size * point.x) * Math.sin(this.size * point.y) * Math.sin(this.size * point.z);
    if (sines < 0) {
      return this.odd.getColor({ u, v, intersection });
    }
    return this.even.getColor({ u, v, intersection });
  }
}

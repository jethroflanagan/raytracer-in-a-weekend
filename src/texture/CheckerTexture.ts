import { Intersection } from 'src/Intersection';
import { Texture } from './Texture';

export class CheckerTexture implements Texture {
  even: Texture;
  odd: Texture;

  constructor({ even, odd }: { even: Texture, odd: Texture }) {
    this.even = even;
    this.odd = odd;
  }

  getColor({ u, v, intersection }: { u: number, v: number, intersection: Intersection }) {
    const { point } = intersection;
    const sines = Math.sin(10 * point.x) * Math.sin(10 * point.y) * Math.sin(10 * point.z);
    if (sines < 0) {
      return this.odd.getColor({ u, v, intersection });
    }
    return this.even.getColor({ u, v, intersection });
  }
}
